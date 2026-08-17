export type UserRole = 'customer' | 'admin';
export type AccountStatus = 'active' | 'inactive';
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
  balance: number;
  totalEarned: number;
  totalDeposited: number;
  totalWithdrawn: number;
  tasksCompletedCount: number;
  joinedDate: string;
  avatar?: string;
  referredBy?: string;
  referralCode?: string;
  notes?: string;
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
