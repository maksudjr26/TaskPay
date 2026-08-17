import { User, Task, DepositRequest, WithdrawalRequest, PaymentMethodConfig, SystemSettings, TransactionRecord, TaskSubmission } from '../types';

export const AVAILABLE_ZONES = [
  { id: 'Mymensingh', nameBn: 'ময়মনসিংহ (অফিসিয়াল আর্নিং জোন)', nameEn: 'Mymensingh (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Dhaka', nameBn: 'ঢাকা (ভবিষ্যৎ অনুসন্ধান/কোয়ারি)', nameEn: 'Dhaka (Future Queries)', isActiveWorkingZone: false },
  { id: 'Rongpur', nameBn: 'রংপুর (ভবিষ্যৎ অনুসন্ধান/কোয়ারি)', nameEn: 'Rongpur (Future Queries)', isActiveWorkingZone: false },
  { id: 'Chittagong', nameBn: 'চট্টগ্রাম (ভবিষ্যৎ অনুসন্ধান/কোয়ারি)', nameEn: 'Chittagong (Future Queries)', isActiveWorkingZone: false },
  { id: 'Rajshahi', nameBn: 'রাজশাহী (ভবিষ্যৎ অনুসন্ধান/কোয়ারি)', nameEn: 'Rajshahi (Future Queries)', isActiveWorkingZone: false },
  { id: 'Khulna', nameBn: 'খুলনা (ভবিষ্যৎ অনুসন্ধান/কোয়ারি)', nameEn: 'Khulna (Future Queries)', isActiveWorkingZone: false },
  { id: 'Sylhet', nameBn: 'সিলেট (ভবিষ্যৎ অনুসন্ধান/কোয়ারি)', nameEn: 'Sylhet (Future Queries)', isActiveWorkingZone: false },
  { id: 'Barisal', nameBn: 'বরিশাল (ভবিষ্যৎ অনুসন্ধান/কোয়ারি)', nameEn: 'Barisal (Future Queries)', isActiveWorkingZone: false },
  { id: 'Kolkata', nameBn: 'কলকাতা (ভবিষ্যৎ অনুসন্ধান/কোয়ারি)', nameEn: 'Kolkata (Future Queries)', isActiveWorkingZone: false },
  { id: 'Other', nameBn: 'অন্যান্য (ভবিষ্যৎ অনুসন্ধান/কোয়ারি)', nameEn: 'Other (Future Queries)', isActiveWorkingZone: false }
];

export const initialUsers: User[] = [
  {
    id: 'admin_1',
    username: 'admin',
    name: 'System Super Admin',
    phone: '01700000000',
    email: 'admin@taskpay.com',
    password: 'admin1', // Admin panel login: user: admin / password: admin1
    role: 'admin',
    zone: 'Mymensingh',
    status: 'active',
    balance: 0,
    totalEarned: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    tasksCompletedCount: 0,
    joinedDate: '2026-01-01',
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task_1',
    title: 'Standard Alphanumeric CAPTCHA',
    titleBn: 'সাধারণ আলফানিউমেরিক ক্যাপচা পূরণ',
    description: 'Type the 6-character code accurately to claim instant task reward.',
    descriptionBn: 'নিচের বক্সে প্রদর্শিত ৬ অক্ষরের ক্যাপচা কোডটি সঠিকভাবে টাইপ করে রিওয়ার্ড নিন।',
    type: 'captcha',
    reward: 10,
    dailyLimit: 5,
    estimatedSeconds: 15,
    status: 'active',
    category: 'Daily',
    config: {
      captchaLength: 6,
      captchaType: 'alphanumeric'
    }
  },
  {
    id: 'task_2',
    title: 'Fast Mental Arithmetic Quiz',
    titleBn: 'দ্রুত মানসিক গণিত কুইজ সমাধান',
    description: 'Solve the simple addition or multiplication problem in 30 seconds.',
    descriptionBn: 'সহজ যোগ অথবা গুণের সমাধান করে তাৎক্ষণিক একাউন্টে রিওয়ার্ড যোগ করুন।',
    type: 'math_quiz',
    reward: 15,
    dailyLimit: 5,
    estimatedSeconds: 20,
    status: 'active',
    category: 'Daily',
    config: {
      mathDifficulty: 'easy'
    }
  },
  {
    id: 'task_3',
    title: 'Tech & Economy Article Read',
    titleBn: 'প্রযুক্তি ও অনলাইন আয় প্রবন্ধ পড়ুন',
    description: 'Read the short educational article for 15 seconds to unlock reward.',
    descriptionBn: 'অনলাইন নিরাপত্তা ও ফ্রিল্যান্সিং সম্পর্কিত ছোট প্রবন্ধটি ১৫ সেকেন্ড পড়ে সম্পন্ন করুন।',
    type: 'read_article',
    reward: 20,
    dailyLimit: 3,
    estimatedSeconds: 25,
    status: 'active',
    category: 'Special',
    config: {
      articleContent: 'Digital micro-tasking and prompt verification platforms are empowering mobile earners across emerging economies. By maintaining account safety and accurate submissions, users build strong performance metrics.',
      articleContentBn: 'ডিজিটাল মাইক্রো-টাস্ক ও সঠিক ভেরিফিকেশন প্ল্যাটফর্মগুলো তরুণদের ঘরে বসে উপার্জনের সুযোগ তৈরি করছে। সঠিক নিয়মে নিয়মিত ক্যাপচা সমাধান ও সক্রিয় একাউন্ট বজায় রাখার মাধ্যমে নির্ভরযোগ্য আয় নিশ্চিত করা সম্ভব।'
    }
  },
  {
    id: 'task_4',
    title: 'Digital Banking Poll & Feedback',
    titleBn: 'ডিজিটাল ব্যাংকিং জরিপ ও মতামত',
    description: 'Share your preferred mobile banking wallet in this single-choice survey.',
    descriptionBn: 'দৈনন্দিন লেনদেনে আপনার পছন্দের মোবাইল ব্যাংকিং ওয়ালেট নির্বাচন করুন।',
    type: 'survey',
    reward: 25,
    dailyLimit: 2,
    estimatedSeconds: 20,
    status: 'active',
    category: 'Survey',
    config: {
      surveyQuestion: 'Which mobile banking service do you use most frequently for online tasks?',
      surveyQuestionBn: 'অনলাইন লেনদেন ও রিচার্জের জন্য আপনি সাধারণত কোন ওয়ালেট বেশি ব্যবহার করেন?',
      surveyOptions: ['bKash (বিকাশ)', 'Nagad (নগদ)', 'Rocket (রকেট)', 'Bank Transfer (ব্যাংক)']
    }
  },
  {
    id: 'task_5',
    title: 'Short Brand Spotlight Preview',
    titleBn: 'স্পন্সরড পার্টনার ভিডিও প্রিভিউ',
    description: 'Watch the 10-second sponsor interactive preview to claim balance.',
    descriptionBn: 'স্পন্সর পার্টনারদের ১০ সেকেন্ডের প্রিভিউ কার্ডটি দেখে রিওয়ার্ড গ্রহণ করুন।',
    type: 'video_ad',
    reward: 12,
    dailyLimit: 4,
    estimatedSeconds: 15,
    status: 'active',
    category: 'Instant'
  }
];

export const initialPaymentMethods: PaymentMethodConfig[] = [
  {
    id: 'pm_bkash',
    code: 'bkash',
    name: 'bKash Send Money',
    nameBn: 'বিকাশ সেন্ড মানি',
    accountType: 'Personal',
    accountTypeBn: 'ব্যক্তিগত (Personal)',
    accountNumber: '01712-334455',
    instructions: 'Send Money to our personal bKash number. After sending, enter your sender phone number and TrxID.',
    instructionsBn: 'আমাদের বিকাশ পার্সোনাল নম্বরে সেন্ড মানি করুন। টাকা পাঠানোর পর প্রেরক নম্বর ও TrxID সাবমিট করুন।',
    active: true,
    minDeposit: 300,
    maxDeposit: 25000,
    logoBg: 'bg-[#D12053]',
    badgeColor: 'text-[#D12053] bg-pink-50 border-pink-200'
  },
  {
    id: 'pm_nagad',
    code: 'nagad',
    name: 'Nagad Send Money',
    nameBn: 'নগদ সেন্ড মানি',
    accountType: 'Personal',
    accountTypeBn: 'ব্যক্তিগত (Personal)',
    accountNumber: '01899-776655',
    instructions: 'Send Money to our Nagad personal wallet. Enter the 8-character Transaction ID in the deposit form.',
    instructionsBn: 'আমাদের নগদ পার্সোনাল নম্বরে সেন্ড মানি করুন। এরপর ৮ অক্ষরের TrxID এবং প্রেরক নম্বর জমা দিন।',
    active: true,
    minDeposit: 300,
    maxDeposit: 25000,
    logoBg: 'bg-[#F7941D]',
    badgeColor: 'text-[#EA580C] bg-orange-50 border-orange-200'
  },
  {
    id: 'pm_rocket',
    code: 'rocket',
    name: 'Rocket (DBBL)',
    nameBn: 'রকেট (DBBL)',
    accountType: 'Personal',
    accountTypeBn: 'পার্সোনাল (Rocket)',
    accountNumber: '01911-889900-3',
    instructions: 'Send money to Rocket personal account including the 12th checking digit.',
    instructionsBn: '১২ ডিজিটের রকেট পার্সোনাল নম্বরে সেন্ড মানি করে TrxID দিয়ে সাবমিট করুন।',
    active: true,
    minDeposit: 300,
    maxDeposit: 25000,
    logoBg: 'bg-[#8B2385]',
    badgeColor: 'text-[#8B2385] bg-purple-50 border-purple-200'
  },
  {
    id: 'pm_bank',
    code: 'bank',
    name: 'Islami Bank Bangladesh Ltd',
    nameBn: 'ইসলামী ব্যাংক বাংলাদেশ লি.',
    accountType: 'Bank Account',
    accountTypeBn: 'ব্যাংক হিসাব (Current)',
    accountNumber: '20501234567890123',
    instructions: 'Deposit or online transfer (NPSB/BEFTN/RTGS). Mention your phone number in remark.',
    instructionsBn: 'ব্যাংক ট্রান্সফার বা অনলাইন ডিপোজিট করুন। রেফারেন্সে আপনার মোবাইল নম্বর দিন।',
    active: true,
    minDeposit: 1000,
    maxDeposit: 100000,
    logoBg: 'bg-[#00843D]',
    badgeColor: 'text-[#00843D] bg-emerald-50 border-emerald-200',
    bankDetails: {
      bankName: 'Islami Bank Bangladesh PLC',
      branchName: 'Motijheel Corporate Branch, Dhaka',
      accountHolder: 'TaskPay Digital Services Ltd',
      routingNumber: '125273641'
    }
  }
];

export const initialSettings: SystemSettings = {
  minActivationAmount: 500, // 500 BDT required to activate account
  minWithdrawAmount: 100, // 100 BDT minimum withdrawal
  maxWithdrawAmount: 25000,
  dailyTaskLimit: 15,
  currencySymbol: '৳',
  currencyCode: 'BDT',
  platformNotice: 'Special Bonus: Recharge ৳500+ today to activate your account instantly and receive 5 free bonus tasks!',
  platformNoticeBn: 'জরুরি নোটিশ: একাউন্ট সক্রিয় করতে বিকাশ/নগদে ন্যূনতম ৳৫০০ রিচার্জ করুন। ৫-১৫ মিনিটের মধ্যে একাউন্ট সক্রিয় হয়ে যাবে!',
  allowInactiveUserTasks: true,
  customerSupportPhone: '+880 1700-112233',
  customerSupportTelegram: '@TaskPayOfficialSupport',
  customerSupportEmail: 'support@taskpaybd.com'
};

export const initialDeposits: DepositRequest[] = [];

export const initialWithdrawals: WithdrawalRequest[] = [];

export const initialTransactions: TransactionRecord[] = [];

export const initialSubmissions: TaskSubmission[] = [];
