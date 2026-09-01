export type UserRole = 'customer' | 'admin';
export type AccountStatus = 'active' | 'inactive' | 'blocked';
export type UserTier = 'General' | 'Silver' | 'Gold' | 'Platinum' | 'VIP';
export type TaskType = 'captcha' | 'math_quiz' | 'read_article' | 'video_ad' | 'survey' | 'social_share';
export type TransactionType = 'deposit' | 'withdrawal' | 'task_reward' | 'activation_fee' | 'admin_adjustment' | 'referral_bonus' | 'tier_upgrade';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type PaymentMethodCode = 'bkash' | 'nagad' | 'rocket' | 'bank';
export type Language = 'bn' | 'en';
export type ZoneType = 'Mymensingh' | 'Dhaka' | 'Rongpur' | 'Chittagong' | 'Rajshahi' | 'Khulna' | 'Sylhet' | 'Barisal' | 'Gazipur' | 'Narayanganj' | 'Comilla' | 'Kolkata' | 'All Zones' | 'Other';

export interface DepositPackage {
  id: string;
  name: string;
  nameBn: string;
  tier: UserTier;
  amount: number;
  description: string;
  descriptionBn: string;
  badgeColor: string;
  perks: string[];
  perksBn: string[];
  dailyTaskLimit: number;
  rewardMultiplier: number;
  isPopular?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  username?: string;
  zone: ZoneType | string;
  role: UserRole;
  status: AccountStatus;
  userType: UserTier;
  balance: number; // Total balance = depositBalance + taskBalance
  depositBalance: number; // Reserved Fixed Balance from approved deposits/recharges & referral bonuses
  taskBalance: number; // Withdrawable Earning Balance earned from completing tasks
  totalEarned: number;
  totalDeposited: number;
  totalWithdrawn: number;
  tasksCompletedCount: number;
  joinedDate: string;
  avatar?: string;
  referredBy?: string;
  referralCode?: string;
  referralCount?: number;
  referralBonusEarned?: number;
  firstDepositApproved?: boolean;
  notes?: string;
}

export interface TierAnnouncement {
  id: string;
  target: 'all' | 'guest' | 'General' | 'Silver' | 'Gold' | 'Platinum' | 'VIP';
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  type: 'info' | 'promotion' | 'warning' | 'celebration';
  badgeText?: string;
  badgeTextBn?: string;
  actionText?: string;
  actionTextBn?: string;
  actionTab?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  type: TaskType;
  reward: number; // e.g. 5, 10, 20 BDT
  dailyLimit: number;
  estimatedSeconds: number;
  status: 'active' | 'inactive';
  category: 'Daily' | 'Special' | 'Instant' | 'Survey';
  config?: {
    captchaLength?: number;
    captchaType?: 'alphanumeric' | 'numeric';
    mathDifficulty?: 'easy' | 'medium' | 'hard';
    articleContent?: string;
    articleContentBn?: string;
    targetUrl?: string;
    surveyQuestion?: string;
    surveyQuestionBn?: string;
    surveyOptions?: string[];
    surveyOptionsBn?: string[];
  };
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  taskTitleBn: string;
  userId: string;
  userName: string;
  userPhone: string;
  reward: number;
  completedAt: string;
  status: RequestStatus;
  proofData?: string;
  rejectReason?: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  packageTier?: UserTier;
  packageName?: string;
  method: PaymentMethodCode;
  methodTitle: string;
  senderNumber: string;
  transactionId: string;
  screenshotSlipUrl?: string;
  status: RequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectReason?: string;
  notes?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  method: PaymentMethodCode;
  recipientNumber: string;
  status: RequestStatus;
  createdAt: string;
  reviewedAt?: string;
  rejectReason?: string;
  transactionRef?: string;
}

export interface PaymentMethodConfig {
  id: string;
  code: PaymentMethodCode;
  name: string;
  nameBn: string;
  accountType: 'Personal' | 'Merchant' | 'Agent' | 'Bank Account';
  accountTypeBn: string;
  accountNumber: string;
  instructions: string;
  instructionsBn: string;
  active: boolean;
  minDeposit: number;
  maxDeposit: number;
  logoBg: string;
  badgeColor: string;
  bankDetails?: {
    bankName: string;
    branchName: string;
    accountHolder: string;
    routingNumber: string;
  };
}

export interface SystemSettings {
  minActivationAmount: number; // e.g. 500 BDT
  minWithdrawAmount: number; // e.g. 100 BDT
  maxWithdrawAmount: number; // e.g. 25000 BDT
  referralBonusPercent: number; // e.g. 5% from first deposit
  level1Threshold: number; // 500 BDT (General)
  level2Threshold: number; // 1000 BDT (Silver)
  level3Threshold: number; // 3000 BDT (Gold)
  level4Threshold: number; // 6000 BDT (Platinum)
  level5Threshold: number; // 10000 BDT (VIP)
  dailyTaskLimit: number;
  currencySymbol: string;
  currencyCode: string;
  platformNotice: string;
  platformNoticeBn: string;
  allowInactiveUserTasks: boolean;
  customerSupportPhone: string;
  customerSupportTelegram: string;
  customerSupportEmail: string;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  title: string;
  titleBn: string;
  description?: string;
  status: 'completed' | 'pending' | 'rejected';
  date: string;
  referenceId?: string;
  method?: PaymentMethodCode;
}

export type NotificationTarget = 'all' | 'admin' | 'customer';
export type NotificationCategory = 'deposit' | 'withdrawal' | 'task' | 'tier' | 'system' | 'account' | 'referral' | 'level_up';

export interface AppNotification {
  id: string;
  userId?: string; // specific customer ID, or 'admin', or 'all'
  target: NotificationTarget;
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  category: NotificationCategory;
  type: 'success' | 'error' | 'info' | 'warning';
  read: boolean;
  createdAt: string;
  actionTab?: string;
  referenceId?: string;
  amount?: number;
}

export interface NotificationPreferences {
  soundEnabled: boolean;
  depositAlerts: boolean;
  withdrawalAlerts: boolean;
  taskRewardAlerts: boolean;
  systemAlerts: boolean;
}
