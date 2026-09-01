import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Task,
  DepositRequest,
  WithdrawalRequest,
  PaymentMethodConfig,
  SystemSettings,
  TransactionRecord,
  TaskSubmission,
  Language,
  UserRole,
  AccountStatus,
  ZoneType,
  UserTier,
  TierAnnouncement,
  AppNotification,
  NotificationPreferences
} from '../types';
import {
  initialUsers,
  initialTasks,
  initialPaymentMethods,
  initialSettings,
  initialDeposits,
  initialWithdrawals,
  initialTransactions,
  initialSubmissions,
  initialAnnouncements,
  initialNotifications
} from '../utils/mockData';
import { translations } from '../utils/translations';
import { calculateTierFromFixedBalance } from '../components/common/UserTierBadge';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface RegisterResult {
  success: boolean;
  message?: string;
  isMymensingh: boolean;
}

interface AppContextType {
  currentUser: User;
  isCustomerLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  users: User[];
  tasks: Task[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  transactions: TransactionRecord[];
  submissions: TaskSubmission[];
  announcements: TierAnnouncement[];
  paymentMethods: PaymentMethodConfig[];
  settings: SystemSettings;
  adminPassword: string;
  lang: Language;
  t: typeof translations.bn;
  toasts: Toast[];
  currentRoleView: UserRole;
  
  // Notifications
  notifications: AppNotification[];
  notificationPreferences: NotificationPreferences;
  customerUnreadCount: number;
  adminUnreadCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (target?: 'admin' | 'customer') => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: (target?: 'admin' | 'customer') => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  playNotificationSound: () => void;

  // Auth & User Actions
  setLanguage: (lang: Language) => void;
  setCurrentRoleView: (role: UserRole) => void;
  registerCustomer: (name: string, phone: string, pass: string, zone: ZoneType | string, referralCode?: string) => RegisterResult;
  loginCustomer: (phone: string, pass: string) => boolean;
  loginAdmin: (userOrPhone: string, pass: string) => boolean;
  logoutCustomer: () => void;
  logoutAdmin: () => void;
  quickSwitchUser: (userId: string) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  changeUserPassword: (userId: string, oldPass: string, newPass: string) => boolean;
  changeAdminPassword: (oldPass: string, newPass: string) => boolean;
  
  // Deposit Operations
  submitDeposit: (method: PaymentMethodConfig['code'], amount: number, senderNumber: string, trxId: string, packageTier?: UserTier, packageName?: string, slipUrl?: string) => boolean;
  approveDeposit: (depositId: string, adminNotes?: string) => void;
  rejectDeposit: (depositId: string, reason: string) => void;

  // Withdrawal Operations
  submitWithdrawal: (method: PaymentMethodConfig['code'], amount: number, recipientNumber: string, source?: 'taskBalance' | 'depositBalance' | 'any') => { success: boolean; message?: string };
  approveWithdrawal: (withdrawalId: string, transactionRef?: string) => void;
  rejectWithdrawal: (withdrawalId: string, reason: string) => void;

  // Task Operations
  completeTask: (taskId: string, proofData?: string) => { success: boolean; message: string; rewardEarned?: number };
  createTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, task: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  approveSubmission: (submissionId: string) => void;
  rejectSubmission: (submissionId: string, reason: string) => void;

  // Announcements Operations
  createAnnouncement: (announcement: Omit<TierAnnouncement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<TierAnnouncement>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncement: (id: string) => void;

  // Admin Controls
  addUserByAdmin: (userData: {
    name: string;
    phone: string;
    password?: string;
    email?: string;
    username?: string;
    zone?: ZoneType | string;
    userType?: UserTier;
    status?: AccountStatus;
    depositBalance?: number;
    taskBalance?: number;
    referredBy?: string;
    referralCode?: string;
    notes?: string;
  }) => { success: boolean; message: string; user?: User };
  toggleUserStatus: (userId: string) => void;
  blockUser: (userId: string, reason?: string) => void;
  unblockUser: (userId: string) => void;
  setUserStatus: (userId: string, status: AccountStatus, reason?: string) => void;
  adjustUserBalance: (userId: string, amount: number, type: 'add' | 'deduct', balanceType: 'task' | 'deposit' | 'total', reason: string) => void;
  updateUserByAdmin: (userId: string, updates: Partial<User>) => void;
  changeUserTier: (userId: string, tier: UserTier) => void;
  deleteUser: (userId: string) => boolean;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethodConfig>) => void;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // Helpers
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Admin password state (default: 'admin1')
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('taskpay_admin_password') || 'admin1';
  });

  // Users state - ensuring separate balances
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('taskpay_users_clean_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: User) => ({
            ...u,
            depositBalance: u.depositBalance ?? (u.totalDeposited || 0),
            taskBalance: u.taskBalance ?? (u.totalEarned || 0),
            balance: (u.depositBalance ?? (u.totalDeposited || 0)) + (u.taskBalance ?? (u.totalEarned || 0))
          }));
        }
      } catch {
        // Fallback
      }
    }
    return initialUsers;
  });

  // Current logged in customer ID
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(() => {
    return localStorage.getItem('taskpay_customer_id_v4') || null;
  });

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('taskpay_admin_auth_v4') === 'true';
  });

  const [currentRoleView, setCurrentRoleView] = useState<UserRole>(() => {
    const saved = localStorage.getItem('taskpay_role_view');
    return (saved as UserRole) || 'customer';
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskpay_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [announcements, setAnnouncements] = useState<TierAnnouncement[]>(() => {
    const saved = localStorage.getItem('taskpay_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [deposits, setDeposits] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem('taskpay_deposits_clean_v4');
    return saved ? JSON.parse(saved) : initialDeposits;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('taskpay_withdrawals_clean_v4');
    return saved ? JSON.parse(saved) : initialWithdrawals;
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('taskpay_transactions_clean_v4');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => {
    const saved = localStorage.getItem('taskpay_submissions_clean_v4');
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(() => {
    const saved = localStorage.getItem('taskpay_payment_methods');
    return saved ? JSON.parse(saved) : initialPaymentMethods;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('taskpay_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('taskpay_lang');
    return (saved as Language) || 'bn';
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('taskpay_notifications_v1');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('taskpay_notif_prefs');
    return saved ? JSON.parse(saved) : {
      soundEnabled: true,
      depositAlerts: true,
      withdrawalAlerts: true,
      taskRewardAlerts: true,
      systemAlerts: true
    };
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('taskpay_admin_password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    localStorage.setItem('taskpay_users_clean_v4', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('taskpay_notifications_v1', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('taskpay_notif_prefs', JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  useEffect(() => {
    if (currentCustomerId) {
      localStorage.setItem('taskpay_customer_id_v4', currentCustomerId);
    } else {
      localStorage.removeItem('taskpay_customer_id_v4');
    }
  }, [currentCustomerId]);

  useEffect(() => {
    localStorage.setItem('taskpay_admin_auth_v4', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem('taskpay_role_view', currentRoleView);
  }, [currentRoleView]);

  useEffect(() => {
    localStorage.setItem('taskpay_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskpay_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('taskpay_deposits_clean_v4', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('taskpay_withdrawals_clean_v4', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('taskpay_transactions_clean_v4', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('taskpay_submissions_clean_v4', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('taskpay_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('taskpay_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('taskpay_lang', lang);
  }, [lang]);

  const isCustomerLoggedIn = !!(currentCustomerId && users.some(u => u.id === currentCustomerId && u.role === 'customer'));

  // Active current user derivation
  const defaultFields: Partial<User> = {
    balance: 0,
    depositBalance: 0,
    taskBalance: 0,
    totalEarned: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    tasksCompletedCount: 0,
    status: 'inactive',
    userType: 'General',
    zone: 'Dhaka',
    name: 'Customer',
    phone: '',
    role: 'customer',
    joinedDate: new Date().toISOString().split('T')[0]
  };

  const rawAdmin = users.find(u => u.role === 'admin') || initialUsers[0];
  const adminUser: User = { ...defaultFields, ...rawAdmin, role: 'admin', status: 'active', userType: (rawAdmin.userType || 'VIP') as UserTier } as User;
  const rawCustomer = currentCustomerId ? users.find(u => u.id === currentCustomerId) : null;
  const loggedCustomer: User | null = rawCustomer ? ({ ...defaultFields, ...rawCustomer } as User) : null;

  const currentUser: User = currentRoleView === 'admin'
    ? adminUser
    : (loggedCustomer || {
        id: 'guest',
        name: 'Guest User',
        phone: '',
        role: 'customer',
        zone: 'Dhaka',
        status: 'inactive',
        userType: 'General',
        balance: 0,
        depositBalance: 0,
        taskBalance: 0,
        totalEarned: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        tasksCompletedCount: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      });

  const t = translations[lang];

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback
    }
  };

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    showToast(newLang === 'bn' ? 'ভাষা বাংলায় পরিবর্তিত হয়েছে' : 'Language set to English', 'info');
  };

  // ==========================================
  // Notification Engine & Audio Synthesizer
  // ==========================================

  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio playback ignore if blocked
    }
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    if (notif.category === 'deposit' && !notificationPreferences.depositAlerts) return;
    if (notif.category === 'withdrawal' && !notificationPreferences.withdrawalAlerts) return;
    if (notif.category === 'task' && !notificationPreferences.taskRewardAlerts) return;
    if (notif.category === 'system' && !notificationPreferences.systemAlerts) return;

    const newNotif: AppNotification = {
      ...notif,
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (notificationPreferences.soundEnabled) {
      playNotificationSound();
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = (target?: 'admin' | 'customer') => {
    setNotifications(prev => prev.map(n => {
      if (!target) return { ...n, read: true };
      if (target === 'admin' && (n.target === 'admin' || n.target === 'all')) {
        return { ...n, read: true };
      }
      if (target === 'customer' && (n.target === 'customer' || n.target === 'all' || n.userId === currentUser.id)) {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = (target?: 'admin' | 'customer') => {
    setNotifications(prev => prev.filter(n => {
      if (target === 'admin') {
        return n.target !== 'admin' && n.target !== 'all';
      }
      if (target === 'customer') {
        return n.target === 'admin';
      }
      return false;
    }));
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => ({ ...prev, ...prefs }));
    showToast(lang === 'bn' ? 'নোটিফিকেশন সেটিংস আপডেট হয়েছে' : 'Notification settings updated', 'info');
  };

  const customerUnreadCount = notifications.filter(n => 
    !n.read && (n.target === 'customer' || n.target === 'all' || (currentUser.id && n.userId === currentUser.id))
  ).length;

  const adminUnreadCount = notifications.filter(n => 
    !n.read && (n.target === 'admin' || n.target === 'all')
  ).length;

  // ==========================================
  // Auth Operations
  // ==========================================

  const registerCustomer = (name: string, phone: string, pass: string, zone: ZoneType | string, referralCode?: string): RegisterResult => {
    const cleanPhone = phone.trim();
    const existing = users.find(u => u.phone === cleanPhone);
    if (existing) {
      const msg = lang === 'bn' ? 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একাউন্ট রয়েছে' : 'An account already exists with this phone number';
      showToast(msg, 'error');
      return { success: false, message: msg, isMymensingh: true };
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      phone: cleanPhone,
      password: pass,
      zone: zone || 'Dhaka',
      role: 'customer',
      status: 'inactive', // Inactive until first 500 deposit
      userType: 'General', // Default user type General
      balance: 0,
      depositBalance: 0,
      taskBalance: 0,
      totalEarned: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      tasksCompletedCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      referralCode: (name.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'USER') + Math.floor(100 + Math.random() * 900),
      referredBy: referralCode?.trim() || undefined,
      notes: `Registered in ${zone} active working zone.`
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentCustomerId(newUser.id);
    setCurrentRoleView('customer');

    // Notification for Admin
    addNotification({
      target: 'admin',
      category: 'account',
      type: 'info',
      title: 'New Member Registration',
      titleBn: 'নতুন সদস্যের রেজিস্ট্রেশন',
      message: `${name.trim()} (${cleanPhone}) registered in ${zone} working zone.`,
      messageBn: `${name.trim()} (${cleanPhone}) ${zone} জোনে নতুন একাউন্ট খুলেছেন।`,
      actionTab: 'admin_users'
    });

    // Welcome Notification for Customer
    addNotification({
      target: 'customer',
      userId: newUser.id,
      category: 'system',
      type: 'success',
      title: 'Welcome to TaskPay!',
      titleBn: 'TaskPay-তে স্বাগতম!',
      message: `Hello ${name.trim()}! Recharge ৳500 to activate your account and start claiming daily high-rate tasks.`,
      messageBn: `স্বাগতম ${name.trim()}! একাউন্ট সক্রিয় করতে রিচার্জ করুন এবং আকর্ষণীয় রিওয়ার্ড অর্জন করুন।`,
      actionTab: 'deposit'
    });

    showToast(lang === 'bn' ? 'রেজিস্ট্রেশন সফল হয়েছে! একাউন্ট সক্রিয় করতে রিচার্জ সম্পন্ন করুন।' : 'Registration successful! Recharge to activate your account.', 'success');
    triggerConfetti();

    return { success: true, isMymensingh: true };
  };

  const loginCustomer = (phoneOrUser: string, pass: string): boolean => {
    const rawInput = (phoneOrUser || '').trim();
    const cleanInput = rawInput.toLowerCase();
    const cleanDigitsOnly = cleanInput.replace(/[^0-9]/g, '');
    const cleanPass = (pass || '').trim();
    
    // Check if admin credentials entered in unified login (e.g., username 'admin' or admin phone)
    if (
      (cleanInput === 'admin' || cleanInput === 'superadmin' || cleanDigitsOnly === '01700000000') &&
      (cleanPass === adminPassword || cleanPass === 'admin1')
    ) {
      setIsAdminLoggedIn(true);
      setCurrentRoleView('admin');
      showToast(lang === 'bn' ? 'অ্যাডমিন প্যানেলে স্বাগতম!' : 'Welcome to Admin Panel!', 'success');
      return true;
    }

    // Match customer by exact phone, digits-only phone, username, or name
    const found = users.find(u => {
      const userPhoneClean = (u.phone || '').replace(/[^0-9]/g, '');
      const userMatchesPhone = userPhoneClean && cleanDigitsOnly && userPhoneClean === cleanDigitsOnly;
      const userMatchesRawPhone = u.phone && u.phone.trim() === rawInput;
      const userMatchesName = u.name && u.name.toLowerCase() === cleanInput;
      const userMatchesUsername = u.username && u.username.toLowerCase() === cleanInput;
      return userMatchesPhone || userMatchesRawPhone || userMatchesName || userMatchesUsername;
    });

    if (found) {
      if (found.role === 'admin' && (cleanPass === adminPassword || cleanPass === found.password)) {
        setIsAdminLoggedIn(true);
        setCurrentRoleView('admin');
        showToast(lang === 'bn' ? 'অ্যাডমিন প্যানেলে স্বাগতম!' : 'Welcome to Admin Panel!', 'success');
        return true;
      }

      if (found.status === 'blocked' && found.role !== 'admin') {
        showToast(
          lang === 'bn' 
            ? 'আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক সাময়িকভাবে ব্লক (Blocked) করা হয়েছে। সহায়তার জন্য সাপোর্টে যোগাযোগ করুন।' 
            : 'Your account is currently blocked by administrator. Please contact support.', 
          'error'
        );
        return false;
      }

      if (found.password && found.password !== cleanPass && found.password !== pass) {
        showToast(lang === 'bn' ? 'পাসওয়ার্ড সঠিক নয়' : 'Incorrect password', 'error');
        return false;
      }

      setCurrentCustomerId(found.id);
      setCurrentRoleView('customer');
      showToast(lang === 'bn' ? `স্বাগতম, ${found.name}!` : `Welcome back, ${found.name}!`, 'success');
      return true;
    }

    showToast(t.invalidCredentials, 'error');
    return false;
  };

  const loginAdmin = (userOrPhone: string, pass: string): boolean => {
    const rawInput = (userOrPhone || '').trim();
    const cleanUser = rawInput.toLowerCase();
    const cleanDigitsOnly = cleanUser.replace(/[^0-9]/g, '');
    const cleanPass = (pass || '').trim();

    if (
      (cleanUser === 'admin' || cleanUser === 'superadmin' || cleanDigitsOnly === '01700000000') &&
      (cleanPass === adminPassword || cleanPass === 'admin1')
    ) {
      setIsAdminLoggedIn(true);
      setCurrentRoleView('admin');
      showToast(lang === 'bn' ? 'অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে' : 'Admin logged in successfully', 'success');
      return true;
    }

    showToast(lang === 'bn' ? `ভুল অ্যাডমিন তথ্য (User: admin, Pass: ${adminPassword})` : 'Invalid admin credentials (User: admin, Pass: admin1)', 'error');
    return false;
  };

  const logoutCustomer = () => {
    setCurrentCustomerId(null);
    showToast(lang === 'bn' ? 'কাস্টমার একাউন্ট থেকে লগআউট হয়েছে' : 'Logged out from customer account', 'info');
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setCurrentRoleView('customer');
    showToast(lang === 'bn' ? 'অ্যাডমিন প্যানেল থেকে লগআউট হয়েছে' : 'Logged out from admin panel', 'info');
  };

  const quickSwitchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      if (found.role === 'customer') {
        setCurrentCustomerId(found.id);
        setCurrentRoleView('customer');
      } else {
        setIsAdminLoggedIn(true);
        setCurrentRoleView('admin');
      }
      showToast(lang === 'bn' ? `সুইচ করা হয়েছে: ${found.name}` : `Switched to: ${found.name}`, 'info');
    }
  };

  const updateUserProfile = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    showToast(lang === 'bn' ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile updated successfully', 'success');
  };

  const changeUserPassword = (userId: string, _oldPass: string, newPass: string): boolean => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u));
    showToast(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে' : 'Password changed successfully', 'success');
    return true;
  };

  const changeAdminPassword = (oldPass: string, newPass: string): boolean => {
    if (oldPass !== adminPassword) {
      showToast(lang === 'bn' ? 'বর্তমান অ্যাডমিন পাসওয়ার্ড সঠিক নয়' : 'Current admin password is incorrect', 'error');
      return false;
    }
    if (!newPass || newPass.trim().length < 4) {
      showToast(lang === 'bn' ? 'নতুন পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের হতে হবে' : 'New password must be at least 4 characters', 'error');
      return false;
    }
    setAdminPassword(newPass.trim());
    setUsers(prev => prev.map(u => u.role === 'admin' ? { ...u, password: newPass.trim() } : u));
    showToast(lang === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে' : 'Admin password successfully updated!', 'success');
    return true;
  };

  // ==========================================
  // Deposit Operations
  // ==========================================

  const submitDeposit = (
    methodCode: PaymentMethodConfig['code'],
    amount: number,
    senderNumber: string,
    trxId: string,
    packageTier?: UserTier,
    packageName?: string,
    slipUrl?: string
  ): boolean => {
    if (!amount || amount <= 0 || !senderNumber || !trxId) {
      showToast(t.fillAllFields, 'error');
      return false;
    }

    const pm = paymentMethods.find(p => p.code === methodCode);
    const newDeposit: DepositRequest = {
      id: 'dep_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      amount,
      packageTier,
      packageName,
      method: methodCode,
      methodTitle: pm ? (lang === 'bn' ? pm.nameBn : pm.name) : methodCode.toUpperCase(),
      senderNumber,
      transactionId: trxId.trim().toUpperCase(),
      screenshotSlipUrl: slipUrl,
      status: 'pending',
      createdAt: new Date().toLocaleString(),
    };

    const newTrx: TransactionRecord = {
      id: 'trx_' + Date.now(),
      userId: currentUser.id,
      type: packageTier ? 'tier_upgrade' : 'deposit',
      amount,
      title: packageTier ? `${packageTier} Tier Package Deposit (${methodCode.toUpperCase()})` : `${methodCode.toUpperCase()} Deposit Request`,
      titleBn: packageTier ? `${packageTier} টিয়ার প্যাকেজ রিচার্জ (${pm?.nameBn || methodCode.toUpperCase()})` : `${pm?.nameBn || methodCode.toUpperCase()} রিচার্জ আবেদন`,
      status: 'pending',
      date: new Date().toLocaleString(),
      referenceId: trxId.trim().toUpperCase(),
      method: methodCode,
    };

    setDeposits(prev => [newDeposit, ...prev]);
    setTransactions(prev => [newTrx, ...prev]);

    // Notification for Admin
    addNotification({
      target: 'admin',
      category: 'deposit',
      type: 'warning',
      title: 'New Deposit Request',
      titleBn: 'নতুন ডিপোজিট রিকোয়েস্ট এসেছে',
      message: `৳${amount} via ${methodCode.toUpperCase()} by ${currentUser.name} (${currentUser.phone}). TrxID: ${trxId.trim().toUpperCase()}`,
      messageBn: `${currentUser.name} (${currentUser.phone}) ৳${amount} ডিপোজিট আবেদন করেছেন। মেথড: ${pm ? (lang === 'bn' ? pm.nameBn : pm.name) : methodCode.toUpperCase()}, TrxID: ${trxId.trim().toUpperCase()}`,
      actionTab: 'admin_deposits',
      amount,
      referenceId: trxId.trim().toUpperCase()
    });

    // Notification for Customer
    addNotification({
      target: 'customer',
      userId: currentUser.id,
      category: 'deposit',
      type: 'info',
      title: 'Deposit Request Submitted',
      titleBn: 'ডিপোজিট আবেদন পর্যালোচনাধীন',
      message: `Your deposit request of ৳${amount} via ${methodCode.toUpperCase()} (TrxID: ${trxId.trim().toUpperCase()}) is being verified by admin.`,
      messageBn: `আপনার ৳${amount} ডিপোজিট আবেদনটি (মেথড: ${pm ? (lang === 'bn' ? pm.nameBn : pm.name) : methodCode.toUpperCase()}, TrxID: ${trxId.trim().toUpperCase()}) ভেরিফিকেশনে রয়েছে।`,
      actionTab: 'history',
      amount,
      referenceId: trxId.trim().toUpperCase()
    });

    showToast(t.depositSuccessMsg, 'success');
    return true;
  };

  const approveDeposit = (depositId: string, adminNotes?: string) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit || deposit.status !== 'pending') return;

    const targetUser = users.find(u => u.id === deposit.userId);
    const isFirstDeposit = !targetUser?.firstDepositApproved && (targetUser?.totalDeposited || 0) === 0;

    // 1. Update deposit status
    setDeposits(prev => prev.map(d => d.id === depositId ? {
      ...d,
      status: 'approved',
      reviewedAt: new Date().toLocaleString(),
      reviewedBy: 'Admin',
      notes: adminNotes
    } : d));

    // 2. Identify referrer for 5% commission on first deposit (credited as Fixed Balance)
    let referrerBonusAmount = 0;
    let referrerUserId = '';
    let referrerName = '';

    if (isFirstDeposit && targetUser?.referredBy) {
      const refQuery = targetUser.referredBy.trim().toLowerCase();
      const cleanRefPhone = refQuery.replace(/[^0-9]/g, '');
      const refUser = users.find(u => 
        u.id.toLowerCase() === refQuery ||
        (u.referralCode && u.referralCode.toLowerCase() === refQuery) ||
        (cleanRefPhone.length >= 8 && u.phone.replace(/[^0-9]/g, '').includes(cleanRefPhone)) ||
        (u.name && u.name.toLowerCase() === refQuery)
      );

      if (refUser && refUser.id !== targetUser.id) {
        referrerBonusAmount = Math.round(deposit.amount * (settings.referralBonusPercent || 5) / 100);
        referrerUserId = refUser.id;
        referrerName = refUser.name;
      }
    }

    // 3. Update user balances and levels
    setUsers(prev => prev.map(u => {
      // For Depositing User:
      if (u.id === deposit.userId) {
        const newDeposited = (u.totalDeposited || 0) + deposit.amount;
        const currentDepositBalance = (u.depositBalance ?? 0) + deposit.amount;
        const currentTaskBalance = u.taskBalance ?? 0;
        const newTotalBalance = currentDepositBalance + currentTaskBalance;
        
        // Cumulative Milestone Level calculation
        const upgradedTier = calculateTierFromFixedBalance(currentDepositBalance);
        const shouldActivate = u.status === 'inactive' && currentDepositBalance >= (settings.minActivationAmount || 500);

        return {
          ...u,
          depositBalance: currentDepositBalance,
          taskBalance: currentTaskBalance,
          balance: newTotalBalance,
          totalDeposited: newDeposited,
          userType: upgradedTier,
          firstDepositApproved: true,
          status: shouldActivate ? 'active' : u.status
        };
      }

      // For Referrer:
      if (referrerUserId && u.id === referrerUserId && referrerBonusAmount > 0) {
        const newDepBal = (u.depositBalance || 0) + referrerBonusAmount;
        const newTotalDep = (u.totalDeposited || 0) + referrerBonusAmount;
        const currentTaskBal = u.taskBalance || 0;
        const newTotBal = newDepBal + currentTaskBal;
        const upgradedTier = calculateTierFromFixedBalance(newDepBal);

        return {
          ...u,
          depositBalance: newDepBal,
          totalDeposited: newTotalDep,
          balance: newTotBal,
          referralCount: (u.referralCount || 0) + 1,
          referralBonusEarned: (u.referralBonusEarned || 0) + referrerBonusAmount,
          userType: upgradedTier
        };
      }

      return u;
    }));

    // 4. Update transaction records for the deposit & referral
    setTransactions(prev => {
      let updated = prev.map(t => {
        if (t.referenceId === deposit.transactionId) {
          return { ...t, status: 'completed' as const };
        }
        return t;
      });

      if (referrerUserId && referrerBonusAmount > 0) {
        const refTrx: TransactionRecord = {
          id: 'trx_ref_' + Date.now(),
          userId: referrerUserId,
          type: 'referral_bonus',
          amount: referrerBonusAmount,
          title: `5% Referral Bonus (${deposit.userName})`,
          titleBn: `৫% রেফারেল বোনাস (${deposit.userName}-এর ১ম ডিপোজিট)`,
          description: `5% referral bonus from ${deposit.userName}'s first deposit of ৳${deposit.amount}, added directly to Fixed Deposit.`,
          status: 'completed',
          date: new Date().toLocaleString(),
          referenceId: deposit.transactionId
        };
        updated = [refTrx, ...updated];
      }

      return updated;
    });

    // 5. Send Deposit Approved Notification to Depositing User
    const newFixedBal = ((targetUser?.depositBalance || 0) + deposit.amount);
    const newTier = calculateTierFromFixedBalance(newFixedBal);

    addNotification({
      target: 'customer',
      userId: deposit.userId,
      category: 'deposit',
      type: 'success',
      title: 'Deposit Approved & Added to Fixed Balance!',
      titleBn: 'ডিপোজিট সফলভাবে অনুমোদিত ও ফিক্সড ব্যালেন্সে জমা হয়েছে!',
      message: `৳${deposit.amount} has been approved and added to your Reserved Fixed Deposit Balance. Current Level: ${newTier}.`,
      messageBn: `৳${deposit.amount} অনুমোদিত হয়ে আপনার সংরক্ষিত ফিক্সড ডিপোজিট ব্যালেন্সে যোগ হয়েছে! বর্তমান লেভেল: ${newTier}।`,
      actionTab: 'deposit',
      amount: deposit.amount,
      referenceId: deposit.transactionId
    });

    if (targetUser && targetUser.userType !== newTier) {
      addNotification({
        target: 'customer',
        userId: deposit.userId,
        category: 'level_up',
        type: 'success',
        title: `🏆 Level Up: ${newTier}!`,
        titleBn: `🏆 মেম্বারশিপ লেভেল আপগ্রেড: ${newTier}!`,
        message: `Congratulations! Your Fixed Balance reached ৳${newFixedBal}. You are now promoted to Level (${newTier}) with higher multipliers & daily task limits!`,
        messageBn: `অভিনন্দন! আপনার ফিক্সড ডিপোজিট ব্যালেন্স ৳${newFixedBal} পূর্ণ হওয়ায় আপনি ${newTier} লেভেলে উন্নীত হয়েছেন। বাড়তি রিওয়ার্ড বুস্টার সক্রিয় হয়েছে!`,
        actionTab: 'deposit'
      });
    }

    // 6. Send Referral Bonus Notification to Referrer
    if (referrerUserId && referrerBonusAmount > 0) {
      addNotification({
        target: 'customer',
        userId: referrerUserId,
        category: 'referral',
        type: 'success',
        title: '🎉 5% Referral Bonus Credited!',
        titleBn: '🎉 ৫% রেফারেল বোনাস ফিক্সড ব্যালেন্সে জমা হয়েছে!',
        message: `You earned ৳${referrerBonusAmount} (5%) from ${deposit.userName}'s first deposit of ৳${deposit.amount}. Added directly to your Fixed Balance!`,
        messageBn: `আপনার রেফারেল ${deposit.userName}-এর প্রথম ডিপোজিট ৳${deposit.amount} থেকে ৫% বোনাস (৳${referrerBonusAmount}) সরাসরি আপনার ফিক্সড ডিপোজিট ব্যালেন্সে যোগ হয়েছে!`,
        actionTab: 'referrals',
        amount: referrerBonusAmount
      });
    }

    // 7. Send Admin Notification
    addNotification({
      target: 'admin',
      category: 'deposit',
      type: 'success',
      title: 'Deposit Approved',
      titleBn: 'ডিপোজিট অনুমোদন সম্পন্ন',
      message: `Approved ৳${deposit.amount} for ${deposit.userName} (${deposit.userPhone}). TrxID: ${deposit.transactionId}${referrerBonusAmount > 0 ? ` (৳${referrerBonusAmount} 5% bonus awarded to ${referrerName})` : ''}`,
      messageBn: `${deposit.userName} (${deposit.userPhone})-এর ৳${deposit.amount} ডিপোজিট সফলভাবে অনুমোদিত হয়েছে।`,
      actionTab: 'admin_deposits',
      amount: deposit.amount,
      referenceId: deposit.transactionId
    });

    showToast(
      lang === 'bn' 
        ? `৳${deposit.amount} ডিপোজিট অনুমোদিত হয়ে ফিক্সড ব্যালেন্সে যোগ হয়েছে!` 
        : `Deposit of ৳${deposit.amount} approved and credited to Fixed Balance!`, 
      'success'
    );
    triggerConfetti();
  };

  const rejectDeposit = (depositId: string, reason: string) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit || deposit.status !== 'pending') return;

    setDeposits(prev => prev.map(d => d.id === depositId ? {
      ...d,
      status: 'rejected',
      reviewedAt: new Date().toLocaleString(),
      rejectReason: reason
    } : d));

    setTransactions(prev => prev.map(t => {
      if (t.referenceId === deposit.transactionId) {
        return { ...t, status: 'rejected' };
      }
      return t;
    }));

    // Customer Notification (Reject)
    addNotification({
      target: 'customer',
      userId: deposit.userId,
      category: 'deposit',
      type: 'error',
      title: 'Deposit Request Rejected',
      titleBn: 'ডিপোজিট আবেদন বাতিল করা হয়েছে',
      message: `Your deposit request of ৳${deposit.amount} was rejected. Reason: ${reason}`,
      messageBn: `আপনার ৳${deposit.amount} ডিপোজিট আবেদনটি বাতিল করা হয়েছে। কারণ: ${reason}`,
      actionTab: 'history',
      amount: deposit.amount,
      referenceId: deposit.transactionId
    });

    // Admin Notification
    addNotification({
      target: 'admin',
      category: 'deposit',
      type: 'error',
      title: 'Deposit Request Rejected',
      titleBn: 'ডিপোজিট বাতিল সম্পন্ন',
      message: `Rejected deposit of ৳${deposit.amount} for ${deposit.userName}. Reason: ${reason}`,
      messageBn: `${deposit.userName}-এর ৳${deposit.amount} ডিপোজিট বাতিল করা হয়েছে। কারণ: ${reason}`,
      actionTab: 'admin_deposits',
      amount: deposit.amount
    });

    showToast(lang === 'bn' ? 'ডিপোজিট রিকোয়েস্ট বাতিল করা হয়েছে' : 'Deposit request rejected', 'warning');
  };

  // ==========================================
  // Withdrawal Operations
  // ==========================================

  const submitWithdrawal = (
    methodCode: PaymentMethodConfig['code'],
    amount: number,
    recipientNumber: string
  ) => {
    const taskBal = currentUser.taskBalance || 0;

    if (amount <= 0 || isNaN(amount)) {
      const msg = lang === 'bn' ? 'সঠিক উত্তোলনের পরিমাণ লিখুন' : 'Please enter a valid withdrawal amount';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (taskBal < amount) {
      const msg = lang === 'bn' 
        ? `উত্তোলনের জন্য পর্যাপ্ত টাস্ক আর্নিং ব্যালেন্স নেই (উপলব্ধ আর্নিং: ৳${taskBal.toLocaleString()})। আপনার ফিক্সড ডিপোজিট ব্যালেন্স (৳${(currentUser.depositBalance || 0).toLocaleString()}) সংরক্ষিত এবং উত্তোলনযোগ্য নয়।`
        : `Insufficient task earning balance (Available Earning: ৳${taskBal.toLocaleString()}). Your fixed deposit balance (৳${(currentUser.depositBalance || 0).toLocaleString()}) is reserved and cannot be withdrawn.`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (amount < settings.minWithdrawAmount) {
      const msg = lang === 'bn' ? `সর্বনিম্ন উত্তোলন লিমিট ৳${settings.minWithdrawAmount}` : `Minimum withdrawal limit is ৳${settings.minWithdrawAmount}`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (settings.maxWithdrawAmount && amount > settings.maxWithdrawAmount) {
      const msg = lang === 'bn' ? `সর্বোচ্চ একক উত্তোলন লিমিট ৳${settings.maxWithdrawAmount}` : `Maximum single withdrawal limit is ৳${settings.maxWithdrawAmount}`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (currentUser.status === 'inactive') {
      showToast(t.inactiveWithdrawWarning, 'warning');
      return { success: false, message: t.inactiveWithdrawWarning };
    }

    // Deduct user balance strictly from taskBalance (Earning Balance)
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const newTaskBal = (u.taskBalance || 0) - amount;
        const depBal = u.depositBalance || 0;
        return {
          ...u,
          taskBalance: newTaskBal,
          balance: depBal + newTaskBal
        };
      }
      return u;
    }));

    const newWithdraw: WithdrawalRequest = {
      id: 'wth_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      amount,
      method: methodCode,
      recipientNumber,
      status: 'pending',
      createdAt: new Date().toLocaleString()
    };

    const newTrx: TransactionRecord = {
      id: 'trx_' + Date.now(),
      userId: currentUser.id,
      type: 'withdrawal',
      amount,
      title: `${methodCode.toUpperCase()} Cashout Request (Earning Balance)`,
      titleBn: `${methodCode.toUpperCase()} ক্যাশআউট আবেদন (আর্নিং ব্যালেন্স)`,
      status: 'pending',
      date: new Date().toLocaleString(),
      referenceId: newWithdraw.id,
      method: methodCode
    };

    setWithdrawals(prev => [newWithdraw, ...prev]);
    setTransactions(prev => [newTrx, ...prev]);

    // Admin Notification for Withdrawal Request
    addNotification({
      target: 'admin',
      category: 'withdrawal',
      type: 'warning',
      title: 'New Withdrawal Request',
      titleBn: 'নতুন ক্যাশআউট/উইথড্রল রিকোয়েস্ট',
      message: `৳${amount} from Earning Balance to ${recipientNumber} via ${methodCode.toUpperCase()} by ${currentUser.name} (${currentUser.phone}).`,
      messageBn: `${currentUser.name} (${currentUser.phone}) আর্নিং ব্যালেন্স থেকে ৳${amount} উত্তোলন আবেদন করেছেন। মেথড: ${methodCode.toUpperCase()}, নম্বর: ${recipientNumber}`,
      actionTab: 'admin_withdrawals',
      amount,
      referenceId: newWithdraw.id
    });

    // Customer Notification for Withdrawal Submitted
    addNotification({
      target: 'customer',
      userId: currentUser.id,
      category: 'withdrawal',
      type: 'info',
      title: 'Withdrawal Submitted',
      titleBn: 'উইথড্র আবেদন পর্যালোচনাধীন',
      message: `Your withdrawal request of ৳${amount} from Earning Balance to ${recipientNumber} (${methodCode.toUpperCase()}) is being processed.`,
      messageBn: `আপনার আর্নিং ব্যালেন্স থেকে ${recipientNumber} নম্বরে ৳${amount} উত্তোলন আবেদনটি (${methodCode.toUpperCase()}) পর্যালোচনায় রয়েছে।`,
      actionTab: 'history',
      amount,
      referenceId: newWithdraw.id
    });

    showToast(t.withdrawSuccessMsg, 'success');
    return { success: true };
  };

  const approveWithdrawal = (withdrawalId: string, transactionRef?: string) => {
    const w = withdrawals.find(item => item.id === withdrawalId);
    if (!w || w.status !== 'pending') return;

    const finalTxnRef = transactionRef || 'TXN_OUT_' + Math.floor(100000 + Math.random() * 900000);

    setWithdrawals(prev => prev.map(item => item.id === withdrawalId ? {
      ...item,
      status: 'approved',
      reviewedAt: new Date().toLocaleString(),
      transactionRef: finalTxnRef
    } : item));

    setUsers(prev => prev.map(u => u.id === w.userId ? {
      ...u,
      totalWithdrawn: (u.totalWithdrawn || 0) + w.amount
    } : u));

    setTransactions(prev => prev.map(t => t.referenceId === withdrawalId ? { ...t, status: 'completed' } : t));

    // Customer Notification (Success)
    addNotification({
      target: 'customer',
      userId: w.userId,
      category: 'withdrawal',
      type: 'success',
      title: 'Withdrawal Successful & Sent!',
      titleBn: 'উইথড্রল সফলভাবে পাঠানো হয়েছে!',
      message: `৳${w.amount} has been sent to your ${w.method.toUpperCase()} account (${w.recipientNumber}). TrxRef: ${finalTxnRef}`,
      messageBn: `৳${w.amount} সফলভাবে আপনার ${w.method.toUpperCase()} নম্বরে (${w.recipientNumber}) পাঠানো হয়েছে। TrxRef: ${finalTxnRef}`,
      actionTab: 'history',
      amount: w.amount,
      referenceId: finalTxnRef
    });

    // Admin Notification
    addNotification({
      target: 'admin',
      category: 'withdrawal',
      type: 'success',
      title: 'Withdrawal Dispatched',
      titleBn: 'উইথড্রল সফলভাবে পরিশোধিত',
      message: `Dispatched ৳${w.amount} to ${w.userName} (${w.recipientNumber} - ${w.method.toUpperCase()}). TrxRef: ${finalTxnRef}`,
      messageBn: `${w.userName} (${w.recipientNumber})-এর ৳${w.amount} উইথড্রল সফলভাবে পাঠানো হয়েছে।`,
      actionTab: 'admin_withdrawals',
      amount: w.amount,
      referenceId: finalTxnRef
    });

    showToast(lang === 'bn' ? `৳${w.amount} উইথড্র সফলভাবে অনুমোদিত হয়েছে` : `Withdrawal ৳${w.amount} approved and sent`, 'success');
  };

  const rejectWithdrawal = (withdrawalId: string, reason: string) => {
    const w = withdrawals.find(item => item.id === withdrawalId);
    if (!w || w.status !== 'pending') return;

    // Refund user balance to task balance
    setUsers(prev => prev.map(u => {
      if (u.id === w.userId) {
        const newTaskBal = (u.taskBalance || 0) + w.amount;
        const depBal = u.depositBalance || 0;
        return {
          ...u,
          taskBalance: newTaskBal,
          balance: depBal + newTaskBal
        };
      }
      return u;
    }));

    setWithdrawals(prev => prev.map(item => item.id === withdrawalId ? {
      ...item,
      status: 'rejected',
      reviewedAt: new Date().toLocaleString(),
      rejectReason: reason
    } : item));

    setTransactions(prev => prev.map(t => t.referenceId === withdrawalId ? { ...t, status: 'rejected' } : t));

    // Customer Notification (Rejected & Refunded)
    addNotification({
      target: 'customer',
      userId: w.userId,
      category: 'withdrawal',
      type: 'error',
      title: 'Withdrawal Rejected & Refunded',
      titleBn: 'উইথড্রল বাতিল ও ব্যালেন্সে রিফান্ড',
      message: `Your withdrawal of ৳${w.amount} was rejected and fully refunded to your Task Balance. Reason: ${reason}`,
      messageBn: `আপনার ৳${w.amount} উইথড্রল আবেদনটি বাতিল হয়েছে এবং টাকা টাস্ক ব্যালেন্সে ফেরত দেওয়া হয়েছে। কারণ: ${reason}`,
      actionTab: 'history',
      amount: w.amount,
      referenceId: w.id
    });

    // Admin Notification
    addNotification({
      target: 'admin',
      category: 'withdrawal',
      type: 'error',
      title: 'Withdrawal Rejected',
      titleBn: 'উইথড্রল বাতিল সম্পন্ন',
      message: `Rejected withdrawal of ৳${w.amount} for ${w.userName}. Balance refunded. Reason: ${reason}`,
      messageBn: `${w.userName}-এর ৳${w.amount} উইথড্রল বাতিল ও ব্যালেন্সে রিফান্ড করা হয়েছে। কারণ: ${reason}`,
      actionTab: 'admin_withdrawals',
      amount: w.amount
    });

    showToast(lang === 'bn' ? `উইথড্র বাতিল এবং ৳${w.amount} ব্যালেন্সে রিফান্ড করা হয়েছে` : `Withdrawal rejected and ৳${w.amount} refunded to balance`, 'info');
  };

  // ==========================================
  // Task Operations
  // ==========================================

  const completeTask = (taskId: string, proofData?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found' };

    if (!settings.allowInactiveUserTasks && currentUser.status === 'inactive') {
      showToast(t.accountActivationRequiredForTasks, 'warning');
      return { success: false, message: t.accountActivationRequiredForTasks };
    }

    const today = new Date().toISOString().split('T')[0];
    const userTodaySubmissions = submissions.filter(s => s.userId === currentUser.id && s.taskId === taskId && s.completedAt.includes(today));
    if (userTodaySubmissions.length >= task.dailyLimit) {
      showToast(t.taskLimitReached, 'warning');
      return { success: false, message: t.taskLimitReached };
    }

    // Multipliers
    const tierMultiplier = currentUser.userType === 'VIP' 
      ? 3.0 
      : currentUser.userType === 'Platinum' 
      ? 2.25 
      : currentUser.userType === 'Gold' 
      ? 1.75 
      : currentUser.userType === 'Silver' 
      ? 1.25 
      : 1.0;

    const finalReward = Math.round(task.reward * tierMultiplier * 10) / 10;

    const newSubmission: TaskSubmission = {
      id: 'sub_' + Date.now(),
      taskId: task.id,
      taskTitle: task.title,
      taskTitleBn: task.titleBn,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      reward: finalReward,
      completedAt: new Date().toLocaleString(),
      status: 'approved',
      proofData: proofData || 'Completed correctly'
    };

    // Credit user's Task Balance and Total Balance
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const newTaskBal = (u.taskBalance || 0) + finalReward;
        const depBal = u.depositBalance || 0;
        return {
          ...u,
          taskBalance: newTaskBal,
          balance: depBal + newTaskBal,
          totalEarned: (u.totalEarned || 0) + finalReward,
          tasksCompletedCount: (u.tasksCompletedCount || 0) + 1
        };
      }
      return u;
    }));

    const newTrx: TransactionRecord = {
      id: 'trx_' + Date.now(),
      userId: currentUser.id,
      type: 'task_reward',
      amount: finalReward,
      title: `${task.title} Reward (${currentUser.userType || 'General'} Tier - ${tierMultiplier}x)`,
      titleBn: `${task.titleBn} রিওয়ার্ড (${currentUser.userType || 'General'} টিয়ার - ${tierMultiplier}x)`,
      status: 'completed',
      date: new Date().toLocaleString(),
      referenceId: newSubmission.id,
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setTransactions(prev => [newTrx, ...prev]);

    // Customer Notification
    addNotification({
      target: 'customer',
      userId: currentUser.id,
      category: 'task',
      type: 'success',
      title: 'Task Reward Credited!',
      titleBn: 'টাস্ক রিওয়ার্ড অর্জিত হয়েছে!',
      message: `৳${finalReward} earned from "${task.title}" (${tierMultiplier}x tier bonus rate applied).`,
      messageBn: `"${task.titleBn}" থেকে ৳${finalReward} আপনার টাস্ক ব্যালেন্সে যুক্ত হয়েছে (${tierMultiplier}x বোনাস রেট সহ)।`,
      actionTab: 'tasks',
      amount: finalReward
    });

    // Admin Notification
    addNotification({
      target: 'admin',
      category: 'task',
      type: 'info',
      title: 'Task Completed by Member',
      titleBn: 'সদস্য টাস্ক সম্পন্ন করেছেন',
      message: `${currentUser.name} (${currentUser.phone}) completed "${task.title}" and earned ৳${finalReward}.`,
      messageBn: `${currentUser.name} (${currentUser.phone}) "${task.titleBn}" সম্পন্ন করে ৳${finalReward} অর্জন করেছেন।`,
      actionTab: 'admin_submissions',
      amount: finalReward
    });

    showToast(
      lang === 'bn' 
        ? `টাস্ক সম্পন্ন! ৳${finalReward} আপনার টাস্ক আর্নিং ব্যালেন্সে যোগ হয়েছে (${tierMultiplier}x বোনাস রেট)` 
        : `Task completed! ৳${finalReward} added to your Task Balance (${tierMultiplier}x rate)`, 
      'success'
    );
    triggerConfetti();

    return { success: true, message: 'Reward credited successfully', rewardEarned: finalReward };
  };

  const createTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: 'task_' + Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(lang === 'bn' ? 'নতুন টাস্ক সফলভাবে তৈরি হয়েছে' : 'New task created successfully', 'success');
  };

  const updateTask = (taskId: string, taskUpdates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...taskUpdates } : t));
    showToast(lang === 'bn' ? 'টাস্ক সফলভাবে আপডেট হয়েছে' : 'Task updated successfully', 'success');
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast(lang === 'bn' ? 'টাস্ক মুছে ফেলা হয়েছে' : 'Task deleted successfully', 'info');
  };

  const approveSubmission = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'approved' } : s));
    
    if (sub) {
      addNotification({
        target: 'customer',
        userId: sub.userId,
        category: 'task',
        type: 'success',
        title: 'Task Submission Approved',
        titleBn: 'টাস্ক সাবমিশন অনুমোদিত হয়েছে',
        message: `Your proof for "${sub.taskTitle}" has been verified and approved by admin.`,
        messageBn: `"${sub.taskTitleBn || sub.taskTitle}" টাস্কের প্রমাণপত্র অ্যাডমিন কর্তৃক যাচাই ও অনুমোদন করা হয়েছে।`,
        actionTab: 'tasks'
      });
    }

    showToast(lang === 'bn' ? 'টাস্ক সাবমিশন অনুমোদিত হয়েছে' : 'Submission approved', 'success');
  };

  const rejectSubmission = (submissionId: string, reason: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'rejected', rejectReason: reason } : s));

    if (sub) {
      addNotification({
        target: 'customer',
        userId: sub.userId,
        category: 'task',
        type: 'error',
        title: 'Task Submission Rejected',
        titleBn: 'টাস্ক সাবমিশন বাতিল করা হয়েছে',
        message: `Your proof for "${sub.taskTitle}" was rejected. Reason: ${reason}`,
        messageBn: `"${sub.taskTitleBn || sub.taskTitle}" টাস্কের সাবমিশন বাতিল হয়েছে। কারণ: ${reason}`,
        actionTab: 'tasks'
      });
    }

    showToast(lang === 'bn' ? 'টাস্ক সাবমিশন বাতিল করা হয়েছে' : 'Submission rejected', 'warning');
  };

  // ==========================================
  // Announcements Operations
  // ==========================================

  const createAnnouncement = (ann: Omit<TierAnnouncement, 'id' | 'createdAt'>) => {
    const newAnn: TierAnnouncement = {
      ...ann,
      id: 'ann_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    // Send Broadcast Announcement Notification to Target Users
    addNotification({
      target: ann.target === 'all' ? 'all' : 'customer',
      category: 'tier',
      type: 'info',
      title: ann.title,
      titleBn: ann.titleBn,
      message: ann.message,
      messageBn: ann.messageBn,
      actionTab: 'dashboard'
    });

    showToast(lang === 'bn' ? 'নতুন ঘোষণা যুক্ত হয়েছে' : 'Announcement created successfully', 'success');
  };

  const updateAnnouncement = (id: string, updates: Partial<TierAnnouncement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    showToast(lang === 'bn' ? 'ঘোষণা আপডেট হয়েছে' : 'Announcement updated successfully', 'success');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast(lang === 'bn' ? 'ঘোষণা মুছে ফেলা হয়েছে' : 'Announcement removed', 'info');
  };

  const toggleAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  // ==========================================
  // Admin Operations
  // ==========================================

  const addUserByAdmin = (userData: {
    name: string;
    phone: string;
    password?: string;
    email?: string;
    username?: string;
    zone?: ZoneType | string;
    userType?: UserTier;
    status?: AccountStatus;
    depositBalance?: number;
    taskBalance?: number;
    referredBy?: string;
    referralCode?: string;
    notes?: string;
  }) => {
    const cleanPhone = (userData.phone || '').trim();
    if (!cleanPhone || !userData.name?.trim()) {
      showToast(lang === 'bn' ? 'নাম ও মোবাইল নম্বর আবশ্যক' : 'Name and phone are required', 'error');
      return { success: false, message: 'Name and phone are required' };
    }

    // Check if phone already registered
    const existing = users.find(u => u.phone?.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, ''));
    if (existing) {
      showToast(lang === 'bn' ? 'এই নম্বরে ইতিমধ্যে একটি একাউন্ট রয়েছে' : 'Phone number is already registered', 'error');
      return { success: false, message: 'Phone already exists' };
    }

    const depBal = Number(userData.depositBalance) || 0;
    const taskBal = Number(userData.taskBalance) || 0;
    const totalBal = depBal + taskBal;
    const calculatedTier = userData.userType || calculateTierFromFixedBalance(depBal);

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: userData.name.trim(),
      phone: cleanPhone,
      password: userData.password?.trim() || '123456',
      email: userData.email?.trim() || `${cleanPhone}@taskpay.com`,
      username: userData.username?.trim() || `user_${cleanPhone.slice(-4)}`,
      zone: userData.zone || 'Dhaka',
      role: 'customer',
      status: userData.status || 'active',
      userType: calculatedTier,
      depositBalance: depBal,
      taskBalance: taskBal,
      balance: totalBal,
      totalEarned: taskBal,
      totalDeposited: depBal,
      totalWithdrawn: 0,
      tasksCompletedCount: 0,
      joinedDate: new Date().toLocaleDateString('en-GB'),
      referralCode: userData.referralCode?.trim() || ('TP' + Math.random().toString(36).substring(2, 7).toUpperCase()),
      referredBy: userData.referredBy?.trim() || undefined,
      notes: userData.notes?.trim() || 'Created by Admin',
      firstDepositApproved: depBal > 0
    };

    setUsers(prev => [newUser, ...prev]);

    // If initial balances are granted, create ledger transaction
    if (depBal > 0 || taskBal > 0) {
      const initTrx: TransactionRecord = {
        id: 'trx_' + Date.now(),
        userId: newUser.id,
        type: 'admin_adjustment',
        amount: totalBal,
        title: `Account Creation Initial Balance (Fixed: ৳${depBal}, Earning: ৳${taskBal})`,
        titleBn: `অ্যাকাউন্ট খোলার প্রারম্ভিক ব্যালেন্স (ফিক্সড: ৳${depBal}, আর্নিং: ৳${taskBal})`,
        status: 'completed',
        date: new Date().toLocaleString()
      };
      setTransactions(prev => [initTrx, ...prev]);
    }

    showToast(lang === 'bn' ? `নতুন ব্যবহারকারী "${newUser.name}" সফলভাবে যুক্ত হয়েছে` : `User "${newUser.name}" added successfully`, 'success');
    return { success: true, message: 'User added successfully', user: newUser };
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        let nextStatus: AccountStatus = 'active';
        if (u.status === 'active') nextStatus = 'inactive';
        else if (u.status === 'inactive') nextStatus = 'active';
        else if (u.status === 'blocked') nextStatus = 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    showToast(lang === 'bn' ? 'ব্যবহারকারীর স্ট্যাটাস পরিবর্তিত হয়েছে' : 'User status updated', 'info');
  };

  const blockUser = (userId: string, reason?: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.role === 'admin' || target.id === 'usr_admin') {
      showToast(lang === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট ব্লক করা সম্ভব নয়' : 'Cannot block administrator account', 'error');
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedNotes = reason ? `${u.notes ? u.notes + '\n' : ''}[Blocked]: ${reason}` : u.notes;
        return { ...u, status: 'blocked', notes: updatedNotes };
      }
      return u;
    }));

    if (currentCustomerId === userId) {
      setCurrentCustomerId(null);
      localStorage.removeItem('taskpay_customer_id_v4');
    }

    showToast(lang === 'bn' ? `ব্যবহারকারী "${target.name}" কে ব্লক করা হয়েছে` : `User "${target.name}" has been blocked`, 'error');
  };

  const unblockUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'active' };
      }
      return u;
    }));
    showToast(lang === 'bn' ? 'ব্যবহারকারীকে আনব্লক (সক্রিয়) করা হয়েছে' : 'User unblocked and activated', 'success');
  };

  const setUserStatus = (userId: string, status: AccountStatus, reason?: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (status === 'blocked' && (target.role === 'admin' || target.id === 'usr_admin')) {
      showToast(lang === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট ব্লক করা সম্ভব নয়' : 'Cannot block administrator account', 'error');
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedNotes = reason ? `${u.notes ? u.notes + '\n' : ''}[Status ${status}]: ${reason}` : u.notes;
        return { ...u, status, notes: updatedNotes };
      }
      return u;
    }));

    if (status === 'blocked' && currentCustomerId === userId) {
      setCurrentCustomerId(null);
      localStorage.removeItem('taskpay_customer_id_v4');
    }

    showToast(lang === 'bn' ? `স্ট্যাটাস পরিবর্তিত হয়েছে: ${status}` : `User status set to ${status}`, 'info');
  };

  const adjustUserBalance = (
    userId: string,
    amount: number,
    type: 'add' | 'deduct',
    balanceType: 'task' | 'deposit' | 'total',
    reason: string
  ) => {
    let oldTier: UserTier = 'General';
    let newTier: UserTier = 'General';
    let isTierChanged = false;
    let finalDepBal = 0;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        let newDepBal = u.depositBalance || 0;
        let newTaskBal = u.taskBalance || 0;
        oldTier = u.userType || 'General';

        if (balanceType === 'deposit') {
          newDepBal = type === 'add' ? newDepBal + amount : Math.max(0, newDepBal - amount);
        } else if (balanceType === 'task') {
          newTaskBal = type === 'add' ? newTaskBal + amount : Math.max(0, newTaskBal - amount);
        } else {
          if (type === 'add') {
            newDepBal += amount;
          } else {
            if (newTaskBal >= amount) {
              newTaskBal -= amount;
            } else {
              const diff = amount - newTaskBal;
              newTaskBal = 0;
              newDepBal = Math.max(0, newDepBal - diff);
            }
          }
        }

        finalDepBal = newDepBal;
        // Recalculate tier (supports both upgrades and downgrades when balance is cut)
        const recalculatedTier = calculateTierFromFixedBalance(newDepBal);
        newTier = recalculatedTier;
        isTierChanged = oldTier !== newTier;

        return {
          ...u,
          depositBalance: newDepBal,
          taskBalance: newTaskBal,
          balance: newDepBal + newTaskBal,
          userType: recalculatedTier
        };
      }
      return u;
    }));

    const newTrx: TransactionRecord = {
      id: 'trx_' + Date.now(),
      userId,
      type: 'admin_adjustment',
      amount: type === 'add' ? amount : -amount,
      title: `Admin Balance Adjustment (${balanceType.toUpperCase()} - ${type.toUpperCase()})`,
      titleBn: `অ্যাডমিন ব্যালেন্স সমন্বয় (${balanceType.toUpperCase()})`,
      description: reason,
      status: 'completed',
      date: new Date().toLocaleString(),
    };

    setTransactions(prev => [newTrx, ...prev]);

    // Customer Notification for Balance Adjustment
    addNotification({
      target: 'customer',
      userId,
      category: 'account',
      type: type === 'add' ? 'success' : 'warning',
      title: `Balance Adjustment: ৳${amount} ${type === 'add' ? 'Credited' : 'Deducted'}`,
      titleBn: `ব্যালেন্স সমন্বয়: ৳${amount} ${type === 'add' ? 'যোগ' : 'কর্তন'} হয়েছে`,
      message: `Admin adjusted your ${balanceType} balance by ৳${amount} (${type === 'add' ? 'Add' : 'Deduct'}). Reason: ${reason || 'System update'}`,
      messageBn: `অ্যাডমিন আপনার ${balanceType} ব্যালেন্স ৳${amount} ${type === 'add' ? 'যোগ' : 'কর্তন'} করেছেন। কারণ: ${reason || 'সিস্টেম আপডেট'}`,
      actionTab: 'profile',
      amount
    });

    // Customer Notification if Tier Level was upgraded or downgraded
    if (isTierChanged) {
      const isDowngrade = type === 'deduct' || balanceType === 'deposit';
      addNotification({
        target: 'customer',
        userId,
        category: 'tier',
        type: isDowngrade ? 'warning' : 'success',
        title: isDowngrade ? `Tier Level Downgraded to ${newTier}` : `Tier Level Upgraded to ${newTier}`,
        titleBn: isDowngrade ? `মেম্বারশিপ লেভেল পরিবর্তন: ${newTier}` : `মেম্বারশিপ লেভেল আপগ্রেড: ${newTier}`,
        message: `Your fixed deposit balance is now ৳${finalDepBal.toLocaleString()}. Your membership tier has been recalculated to ${newTier}.`,
        messageBn: `আপনার বর্তমান ফিক্সড ব্যালেন্স ৳${finalDepBal.toLocaleString()} অনুযায়ী আপনার মেম্বারশিপ লেভেল ${newTier} এ নির্ধারিত হয়েছে।`,
        actionTab: 'deposit'
      });
    }

    showToast(lang === 'bn' ? `ব্যালেন্স সমন্বয় সম্পন্ন হয়েছে (৳${amount})` : `Balance adjustment completed (৳${amount})`, 'success');
  };

  const updateUserByAdmin = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextUser = { ...u, ...updates };
        // Recalculate total balance if sub-balances are adjusted
        const depBal = typeof updates.depositBalance === 'number' ? updates.depositBalance : (nextUser.depositBalance ?? 0);
        const taskBal = typeof updates.taskBalance === 'number' ? updates.taskBalance : (nextUser.taskBalance ?? 0);
        nextUser.depositBalance = depBal;
        nextUser.taskBalance = taskBal;
        nextUser.balance = depBal + taskBal;

        // If deposit balance is updated and userType not explicitly fixed, recalculate tier (supports downgrade)
        if (updates.userType) {
          nextUser.userType = updates.userType;
        } else if (typeof updates.depositBalance === 'number') {
          nextUser.userType = calculateTierFromFixedBalance(depBal);
        }

        return nextUser;
      }
      return u;
    }));
    showToast(lang === 'bn' ? 'ব্যবহারকারীর তথ্য সফলভাবে আপডেট হয়েছে' : 'User profile updated successfully by admin', 'success');
  };

  const changeUserTier = (userId: string, tier: UserTier) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, userType: tier };
      }
      return u;
    }));

    addNotification({
      target: 'customer',
      userId,
      category: 'tier',
      type: 'success',
      title: `Tier Updated: ${tier}`,
      titleBn: `অ্যাকাউন্ট টিয়ার পরিবর্তিত: ${tier}`,
      message: `Admin has updated your account membership tier to ${tier}. Enjoy your new daily task limits and benefits!`,
      messageBn: `অ্যাডমিন আপনার অ্যাকাউন্ট মেম্বারশিপ টিয়ার ${tier} এ আপডেট করেছেন। নতুন সুবিধা ও লিমিট উপভোগ করুন!`,
      actionTab: 'profile'
    });

    showToast(lang === 'bn' ? `টিয়ার পরিবর্তিত হয়েছে: ${tier}` : `User tier changed to ${tier}`, 'success');
  };

  const deleteUser = (userId: string): boolean => {
    const target = users.find(u => u.id === userId);
    if (!target) return false;

    if (target.role === 'admin' || target.id === 'usr_admin') {
      showToast(lang === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট ডিলিট করা সম্ভব নয়' : 'Cannot delete the system administrator account', 'error');
      return false;
    }

    // If deleting the currently logged-in customer, clear their session
    if (currentCustomerId === userId) {
      setCurrentCustomerId(null);
      localStorage.removeItem('taskpay_customer_id_v4');
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast(lang === 'bn' ? `ব্যবহারকারী "${target.name}" মুছে ফেলা হয়েছে` : `User "${target.name}" deleted successfully`, 'info');
    return true;
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethodConfig>) => {
    setPaymentMethods(prev => prev.map(pm => pm.id === id ? { ...pm, ...updates } : pm));
    showToast(lang === 'bn' ? 'পেমেন্ট মেথড আপডেট হয়েছে' : 'Payment method updated successfully', 'success');
  };

  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast(t.settingsSaved, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isCustomerLoggedIn,
        isAdminLoggedIn,
        users,
        tasks,
        deposits,
        withdrawals,
        transactions,
        submissions,
        announcements,
        paymentMethods,
        settings,
        adminPassword,
        lang,
        t,
        toasts,
        currentRoleView,
        notifications,
        notificationPreferences,
        customerUnreadCount,
        adminUnreadCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        updateNotificationPreferences,
        playNotificationSound,
        setLanguage,
        setCurrentRoleView,
        registerCustomer,
        loginCustomer,
        loginAdmin,
        logoutCustomer,
        logoutAdmin,
        quickSwitchUser,
        updateUserProfile,
        changeUserPassword,
        changeAdminPassword,
        submitDeposit,
        approveDeposit,
        rejectDeposit,
        submitWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        completeTask,
        createTask,
        updateTask,
        deleteTask,
        approveSubmission,
        rejectSubmission,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        toggleAnnouncement,
        addUserByAdmin,
        toggleUserStatus,
        blockUser,
        unblockUser,
        setUserStatus,
        adjustUserBalance,
        updateUserByAdmin,
        changeUserTier,
        deleteUser,
        updatePaymentMethod,
        updateSystemSettings,
        showToast,
        removeToast,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
