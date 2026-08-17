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
  ZoneType,
  UserTier
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
  AVAILABLE_ZONES
} from '../utils/mockData';
import { translations } from '../utils/translations';

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
  paymentMethods: PaymentMethodConfig[];
  settings: SystemSettings;
  lang: Language;
  t: typeof translations.bn;
  toasts: Toast[];
  currentRoleView: UserRole;
  
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
  
  // Deposit Operations
  submitDeposit: (method: PaymentMethodConfig['code'], amount: number, senderNumber: string, trxId: string, packageTier?: UserTier, packageName?: string, slipUrl?: string) => boolean;
  approveDeposit: (depositId: string, adminNotes?: string) => void;
  rejectDeposit: (depositId: string, reason: string) => void;

  // Withdrawal Operations
  submitWithdrawal: (method: PaymentMethodConfig['code'], amount: number, recipientNumber: string) => { success: boolean; message?: string };
  approveWithdrawal: (withdrawalId: string, transactionRef?: string) => void;
  rejectWithdrawal: (withdrawalId: string, reason: string) => void;

  // Task Operations
  completeTask: (taskId: string, proofData?: string) => { success: boolean; message: string; rewardEarned?: number };
  createTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, task: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  approveSubmission: (submissionId: string) => void;
  rejectSubmission: (submissionId: string, reason: string) => void;

  // Admin Controls
  toggleUserStatus: (userId: string) => void;
  adjustUserBalance: (userId: string, amount: number, type: 'add' | 'deduct', reason: string) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethodConfig>) => void;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // Helpers
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state - filter out any old default mock users like user_1, user_2, user_3
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('taskpay_users_clean_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return initialUsers;
  });

  // Current logged in customer ID
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(() => {
    return localStorage.getItem('taskpay_customer_id_v3') || null;
  });

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('taskpay_admin_auth_v3') === 'true';
  });

  const [currentRoleView, setCurrentRoleView] = useState<UserRole>(() => {
    const saved = localStorage.getItem('taskpay_role_view');
    return (saved as UserRole) || 'customer';
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskpay_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [deposits, setDeposits] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem('taskpay_deposits_clean_v3');
    return saved ? JSON.parse(saved) : initialDeposits;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('taskpay_withdrawals_clean_v3');
    return saved ? JSON.parse(saved) : initialWithdrawals;
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('taskpay_transactions_clean_v3');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => {
    const saved = localStorage.getItem('taskpay_submissions_clean_v3');
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

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('taskpay_users_clean_v3', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentCustomerId) {
      localStorage.setItem('taskpay_customer_id_v3', currentCustomerId);
    } else {
      localStorage.removeItem('taskpay_customer_id_v3');
    }
  }, [currentCustomerId]);

  useEffect(() => {
    localStorage.setItem('taskpay_admin_auth_v3', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem('taskpay_role_view', currentRoleView);
  }, [currentRoleView]);

  useEffect(() => {
    localStorage.setItem('taskpay_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskpay_deposits_clean_v3', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('taskpay_withdrawals_clean_v3', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('taskpay_transactions_clean_v3', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('taskpay_submissions_clean_v3', JSON.stringify(submissions));
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
  const adminUser = users.find(u => u.role === 'admin') || initialUsers[0];
  const loggedCustomer = currentCustomerId ? users.find(u => u.id === currentCustomerId) : null;

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
  // Auth Operations
  // ==========================================

  const registerCustomer = (name: string, phone: string, pass: string, zone: ZoneType | string, referralCode?: string): RegisterResult => {
    const cleanPhone = phone.trim();
    const existing = users.find(u => u.phone === cleanPhone);
    if (existing) {
      const msg = lang === 'bn' ? 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একাউন্ট খোলা হয়েছে' : 'An account already exists with this phone number';
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
      status: 'inactive', // Inactive until activation recharge
      userType: 'General', // Default user type is General
      balance: 0,
      totalEarned: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      tasksCompletedCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      referralCode: (name.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'USER') + Math.floor(100 + Math.random() * 900),
      referredBy: referralCode?.trim() || undefined,
      notes: `Registered from ${zone} active working zone.`
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentCustomerId(newUser.id);
    setCurrentRoleView('customer');

    showToast(lang === 'bn' ? 'রেজিস্ট্রেশন সফল হয়েছে! একাউন্ট সক্রিয় করতে রিচার্জ সম্পন্ন করুন।' : 'Registration successful! Recharge to activate your account.', 'success');
    triggerConfetti();

    return { success: true, isMymensingh: true };
  };

  const loginCustomer = (phone: string, pass: string): boolean => {
    const cleanPhone = phone.trim();
    const found = users.find(u => u.role === 'customer' && u.phone === cleanPhone);

    if (found) {
      if (found.password && found.password !== pass) {
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
    const cleanUser = userOrPhone.trim().toLowerCase();
    // Admin credentials mandate: user: admin, password: admin1
    if ((cleanUser === 'admin' || cleanUser === '01700000000') && pass === 'admin1') {
      setIsAdminLoggedIn(true);
      setCurrentRoleView('admin');
      showToast(lang === 'bn' ? 'অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে' : 'Admin logged in successfully', 'success');
      return true;
    }

    showToast(lang === 'bn' ? 'ভুল অ্যাডমিন ক্রেডেনশিয়াল (User: admin, Pass: admin1)' : 'Invalid admin credentials (User: admin, Pass: admin1)', 'error');
    return false;
  };

  const logoutCustomer = () => {
    setCurrentCustomerId(null);
    showToast(lang === 'bn' ? 'কাস্টমার একাউন্ট থেকে লগআউট হয়েছে' : 'Logged out from customer account', 'info');
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
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
    showToast(t.depositSuccessMsg, 'success');
    return true;
  };

  const approveDeposit = (depositId: string, adminNotes?: string) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit || deposit.status !== 'pending') return;

    // 1. Update deposit status
    setDeposits(prev => prev.map(d => d.id === depositId ? {
      ...d,
      status: 'approved',
      reviewedAt: new Date().toLocaleString(),
      reviewedBy: 'Admin',
      notes: adminNotes
    } : d));

    // 2. Update user balance & tier promotion
    // User promoting rules:
    // First 500 deposit to get General
    // More 1000 for Silver
    // More 3000 for Gold
    // More 5000 for Platinum
    // More 10000 for VIP
    setUsers(prev => prev.map(u => {
      if (u.id === deposit.userId) {
        const newDeposited = (u.totalDeposited || 0) + deposit.amount;
        const newBalance = (u.balance || 0) + deposit.amount;
        
        let upgradedTier: UserTier = u.userType || 'General';

        if (deposit.packageTier) {
          upgradedTier = deposit.packageTier;
        } else if (deposit.amount >= 10000 || newDeposited >= 10000) {
          upgradedTier = 'VIP';
        } else if (deposit.amount >= 5000 || newDeposited >= 5000) {
          upgradedTier = 'Platinum';
        } else if (deposit.amount >= 3000 || newDeposited >= 3000) {
          upgradedTier = 'Gold';
        } else if (deposit.amount >= 1000 || newDeposited >= 1500) {
          upgradedTier = 'Silver';
        } else if (newDeposited >= 500) {
          upgradedTier = 'General';
        }

        // Account activation rule: if new total deposited meets or exceeds minActivationAmount -> activate!
        const shouldActivate = u.status === 'inactive' && newDeposited >= settings.minActivationAmount;

        return {
          ...u,
          balance: newBalance,
          totalDeposited: newDeposited,
          userType: upgradedTier,
          status: shouldActivate ? 'active' : u.status
        };
      }
      return u;
    }));

    // 3. Update transaction record
    setTransactions(prev => prev.map(t => {
      if (t.referenceId === deposit.transactionId) {
        return { ...t, status: 'completed' };
      }
      return t;
    }));

    showToast(
      lang === 'bn' 
        ? `৳${deposit.amount} ডিপোজিট অনুমোদিত হয়েছে এবং মেম্বারশিপ আপডেট করা হয়েছে!` 
        : `Deposit of ৳${deposit.amount} approved and tier updated!`, 
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

    showToast(lang === 'bn' ? 'ডিপোজিট রিকোয়েস্ট বাতিল করা হয়েছে' : 'Deposit request rejected', 'warning');
  };

  // ==========================================
  // Withdrawal Operations
  // ==========================================

  const submitWithdrawal = (methodCode: PaymentMethodConfig['code'], amount: number, recipientNumber: string) => {
    if (currentUser.balance < amount) {
      showToast(t.insufficientBalance, 'error');
      return { success: false, message: t.insufficientBalance };
    }

    if (amount < settings.minWithdrawAmount) {
      const msg = lang === 'bn' ? `সর্বনিম্ন উত্তোলন ৳${settings.minWithdrawAmount}` : `Minimum withdrawal is ৳${settings.minWithdrawAmount}`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (currentUser.status === 'inactive') {
      showToast(t.inactiveWithdrawWarning, 'warning');
      return { success: false, message: t.inactiveWithdrawWarning };
    }

    // Deduct user balance immediately for safety
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance - amount } : u));

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
      title: `${methodCode.toUpperCase()} Cashout Request`,
      titleBn: `${methodCode.toUpperCase()} উইথড্র আবেদন`,
      status: 'pending',
      date: new Date().toLocaleString(),
      referenceId: newWithdraw.id,
      method: methodCode
    };

    setWithdrawals(prev => [newWithdraw, ...prev]);
    setTransactions(prev => [newTrx, ...prev]);
    showToast(t.withdrawSuccessMsg, 'success');
    return { success: true };
  };

  const approveWithdrawal = (withdrawalId: string, transactionRef?: string) => {
    const w = withdrawals.find(item => item.id === withdrawalId);
    if (!w || w.status !== 'pending') return;

    setWithdrawals(prev => prev.map(item => item.id === withdrawalId ? {
      ...item,
      status: 'approved',
      reviewedAt: new Date().toLocaleString(),
      transactionRef: transactionRef || 'TXN_OUT_' + Math.floor(100000 + Math.random() * 900000)
    } : item));

    setUsers(prev => prev.map(u => u.id === w.userId ? {
      ...u,
      totalWithdrawn: (u.totalWithdrawn || 0) + w.amount
    } : u));

    setTransactions(prev => prev.map(t => t.referenceId === withdrawalId ? { ...t, status: 'completed' } : t));

    showToast(lang === 'bn' ? `৳${w.amount} উইথড্র সফলভাবে অনুমোদিত হয়েছে` : `Withdrawal ৳${w.amount} approved and sent`, 'success');
  };

  const rejectWithdrawal = (withdrawalId: string, reason: string) => {
    const w = withdrawals.find(item => item.id === withdrawalId);
    if (!w || w.status !== 'pending') return;

    // Refund user balance
    setUsers(prev => prev.map(u => u.id === w.userId ? {
      ...u,
      balance: u.balance + w.amount
    } : u));

    setWithdrawals(prev => prev.map(item => item.id === withdrawalId ? {
      ...item,
      status: 'rejected',
      reviewedAt: new Date().toLocaleString(),
      rejectReason: reason
    } : item));

    setTransactions(prev => prev.map(t => t.referenceId === withdrawalId ? { ...t, status: 'rejected' } : t));

    showToast(lang === 'bn' ? `উইথড্র বাতিল এবং ৳${w.amount} ব্যালেন্সে রিফান্ড করা হয়েছে` : `Withdrawal rejected and ৳${w.amount} refunded to balance`, 'info');
  };

  // ==========================================
  // Task Operations
  // ==========================================

  const completeTask = (taskId: string, proofData?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found' };

    // Check account status restriction if configured
    if (!settings.allowInactiveUserTasks && currentUser.status === 'inactive') {
      showToast(t.accountActivationRequiredForTasks, 'warning');
      return { success: false, message: t.accountActivationRequiredForTasks };
    }

    // Check user daily limits
    const today = new Date().toISOString().split('T')[0];
    const userTodaySubmissions = submissions.filter(s => s.userId === currentUser.id && s.taskId === taskId && s.completedAt.includes(today));
    if (userTodaySubmissions.length >= task.dailyLimit) {
      showToast(t.taskLimitReached, 'warning');
      return { success: false, message: t.taskLimitReached };
    }

    // Tier-based reward multiplier and dynamic task daily limit
    const tierMultiplier = currentUser.userType === 'VIP' ? 2.0 : currentUser.userType === 'Platinum' ? 1.6 : currentUser.userType === 'Gold' ? 1.35 : currentUser.userType === 'Silver' ? 1.15 : 1.0;
    const finalReward = Math.round(task.reward * tierMultiplier * 10) / 10;

    // Record submission
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
      status: 'approved', // instant credit for standard captcha/quizzes
      proofData: proofData || 'Completed correctly'
    };

    // Credit user balance
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          balance: u.balance + finalReward,
          totalEarned: (u.totalEarned || 0) + finalReward,
          tasksCompletedCount: (u.tasksCompletedCount || 0) + 1
        };
      }
      return u;
    }));

    // Record transaction
    const newTrx: TransactionRecord = {
      id: 'trx_' + Date.now(),
      userId: currentUser.id,
      type: 'task_reward',
      amount: finalReward,
      title: `${task.title} Reward (${currentUser.userType || 'General'} Tier)`,
      titleBn: `${task.titleBn} রিওয়ার্ড (${currentUser.userType || 'General'} টিয়ার)`,
      status: 'completed',
      date: new Date().toLocaleString(),
      referenceId: task.id
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setTransactions(prev => [newTrx, ...prev]);
    triggerConfetti();

    showToast(
      lang === 'bn' 
        ? `অভিনন্দন! ৳${finalReward} আপনার ব্যালেন্সে যোগ হয়েছে${tierMultiplier > 1 ? ` (${currentUser.userType} বুস্টার রেট)` : ''}` 
        : `Congratulations! ৳${finalReward} added to your balance${tierMultiplier > 1 ? ` (${currentUser.userType} booster)` : ''}`, 
      'success'
    );
    return { success: true, message: 'Task completed successfully', rewardEarned: finalReward };
  };

  const createTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
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
    showToast(lang === 'bn' ? 'টাস্ক সফলভাবে মুছে ফেলা হয়েছে' : 'Task deleted successfully', 'info');
  };

  const approveSubmission = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub || sub.status !== 'pending') return;

    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'approved' } : s));
    setUsers(prev => prev.map(u => {
      if (u.id === sub.userId) {
        return {
          ...u,
          balance: u.balance + sub.reward,
          totalEarned: (u.totalEarned || 0) + sub.reward,
          tasksCompletedCount: (u.tasksCompletedCount || 0) + 1
        };
      }
      return u;
    }));

    showToast(lang === 'bn' ? `টাস্ক সাবমিশন অনুমোদিত এবং ৳${sub.reward} যুক্ত হয়েছে` : `Task submission approved and ৳${sub.reward} credited`, 'success');
  };

  const rejectSubmission = (submissionId: string, reason: string) => {
    setSubmissions(prev => prev.map(s => s.id === submissionId ? {
      ...s,
      status: 'rejected',
      rejectReason: reason
    } : s));
    showToast(lang === 'bn' ? 'টাস্ক সাবমিশন বাতিল করা হয়েছে' : 'Task submission rejected', 'info');
  };

  // ==========================================
  // Admin Operations
  // ==========================================

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        showToast(lang === 'bn' ? `ইউজার স্ট্যাটাস পরিবর্তিত: ${nextStatus === 'active' ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}` : `User status changed to ${nextStatus}`, 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const adjustUserBalance = (userId: string, amount: number, type: 'add' | 'deduct', reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newBal = type === 'add' ? u.balance + amount : Math.max(0, u.balance - amount);
        return {
          ...u,
          balance: newBal,
          totalEarned: type === 'add' ? (u.totalEarned || 0) + amount : u.totalEarned
        };
      }
      return u;
    }));

    const newTrx: TransactionRecord = {
      id: 'trx_' + Date.now(),
      userId,
      type: 'admin_adjustment',
      amount: type === 'add' ? amount : -amount,
      title: `Admin Balance Adjustment (${type.toUpperCase()})`,
      titleBn: `অ্যাডমিন ব্যালেন্স সমন্বয় (${type === 'add' ? 'যোগ' : 'কর্তন'})`,
      description: reason,
      status: 'completed',
      date: new Date().toLocaleString(),
    };

    setTransactions(prev => [newTrx, ...prev]);
    showToast(lang === 'bn' ? `ব্যালেন্স সমন্বয় সম্পন্ন হয়েছে (৳${amount})` : `Balance adjustment completed (৳${amount})`, 'success');
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
        paymentMethods,
        settings,
        lang,
        t,
        toasts,
        currentRoleView,
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
        toggleUserStatus,
        adjustUserBalance,
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
