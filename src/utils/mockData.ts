import { User, Task, DepositRequest, WithdrawalRequest, PaymentMethodConfig, SystemSettings, TransactionRecord, TaskSubmission, DepositPackage, UserTier } from '../types';

export const AVAILABLE_ZONES = [
  { id: 'Dhaka', nameBn: 'ঢাকা (সক্রিয় আর্নিং জোন)', nameEn: 'Dhaka (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Mymensingh', nameBn: 'ময়মনসিংহ (সক্রিয় আর্নিং জোন)', nameEn: 'Mymensingh (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Chittagong', nameBn: 'চট্টগ্রাম (সক্রিয় আর্নিং জোন)', nameEn: 'Chittagong (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Rongpur', nameBn: 'রংপুর (সক্রিয় আর্নিং জোন)', nameEn: 'Rongpur (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Rajshahi', nameBn: 'রাজশাহী (সক্রিয় আর্নিং জোন)', nameEn: 'Rajshahi (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Khulna', nameBn: 'খুলনা (সক্রিয় আর্নিং জোন)', nameEn: 'Khulna (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Sylhet', nameBn: 'সিলেট (সক্রিয় আর্নিং জোন)', nameEn: 'Sylhet (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Barisal', nameBn: 'বরিশাল (সক্রিয় আর্নিং জোন)', nameEn: 'Barisal (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Gazipur', nameBn: 'গাজীপুর (সক্রিয় আর্নিং জোন)', nameEn: 'Gazipur (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ (সক্রিয় আর্নিং জোন)', nameEn: 'Narayanganj (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Comilla', nameBn: 'কুমিল্লা (সক্রিয় আর্নিং জোন)', nameEn: 'Comilla (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'Kolkata', nameBn: 'কলকাতা (সক্রিয় আর্নিং জোন)', nameEn: 'Kolkata (Active Working Zone)', isActiveWorkingZone: true },
  { id: 'All Zones', nameBn: 'সমগ্র বাংলাদেশ (সক্রিয় জোন)', nameEn: 'All Zones (Active Working Zone)', isActiveWorkingZone: true }
];

export const DEPOSIT_PACKAGES: DepositPackage[] = [
  {
    id: 'pkg_general_500',
    name: 'General Starter',
    nameBn: 'জেনারেল মেম্বারশিপ (স্টার্টার)',
    tier: 'General',
    amount: 500,
    description: 'First 500 deposit for account activation and standard daily tasks.',
    descriptionBn: 'একাউন্ট সক্রিয় করতে ও সাধারণ মাইক্রো টাস্কে উপার্জনের জন্য প্রথম ৫০০ টাকা রিচার্জ।',
    badgeColor: 'emerald',
    perks: ['Account Activation', 'Standard Task Access', 'Regular Payout Speed', 'Standard 1.0x Rate'],
    perksBn: ['একাউন্ট স্বয়ংক্রিয় সক্রিয়', 'দৈনিক সাধারণ টাস্ক আনলক', 'রেগুলার উইথড্রল সুবিধা', '১.০x সাধারণ রিওয়ার্ড রেট'],
    dailyTaskLimit: 5,
    rewardMultiplier: 1.0,
  },
  {
    id: 'pkg_silver_1000',
    name: 'Silver Booster',
    nameBn: 'সিলভার বুস্টার মেম্বারশিপ',
    tier: 'Silver',
    amount: 1000,
    description: 'Promote to Silver tier with +15% reward bonus and 10 daily tasks.',
    descriptionBn: 'সিলভার টিয়ারে প্রমোশন, ১৫% অতিরিক্ত রিওয়ার্ড বোনাস ও ১০টি দৈনিক টাস্ক।',
    badgeColor: 'slate',
    perks: ['Silver Verified Badge', '10 Tasks Daily Limit', '+15% Reward Booster (1.15x)', 'Fast Withdrawal Queue'],
    perksBn: ['সিলভার ভেরিফাইড ব্যাজ', 'দৈনিক ১০টি টাস্ক লিমিট', '+১৫% রিওয়ার্ড বুস্টার (১.১৫x)', 'দ্রুত পেমেন্ট অনুমোদন'],
    dailyTaskLimit: 10,
    rewardMultiplier: 1.15,
  },
  {
    id: 'pkg_gold_3000',
    name: 'Gold Pro Elite',
    nameBn: 'গোল্ড প্রো মেম্বারশিপ',
    tier: 'Gold',
    amount: 3000,
    description: 'Promote to Gold tier with +35% reward booster and 20 daily tasks.',
    descriptionBn: 'গোল্ড টিয়ারে প্রমোশন, ৩৫% অতিরিক্ত আর্নিং বুস্টার ও ২০টি দৈনিক টাস্ক।',
    badgeColor: 'amber',
    perks: ['Gold Shining Badge', '20 Tasks Daily Limit', '+35% Reward Booster (1.35x)', 'Priority Processing'],
    perksBn: ['গোল্ড গোল্ডেন ব্যাজ', 'দৈনিক ২০টি টাস্ক লিমিট', '+৩৫% রিওয়ার্ড বুস্টার (১.৩৫x)', 'অগ্রাধিকার ভিত্তিতে উইথড্রল'],
    dailyTaskLimit: 20,
    rewardMultiplier: 1.35,
    isPopular: true
  },
  {
    id: 'pkg_platinum_5000',
    name: 'Platinum Master',
    nameBn: 'প্লাটিনাম মাস্টার মেম্বারশিপ',
    tier: 'Platinum',
    amount: 5000,
    description: 'Promote to Platinum tier with +60% reward bonus and 35 daily tasks.',
    descriptionBn: 'প্লাটিনাম টিয়ারে প্রমোশন, ৬০% বোনাস রিওয়ার্ড ও ৩৫টি দৈনিক টাস্ক।',
    badgeColor: 'cyan',
    perks: ['Platinum Diamond Badge', '35 Tasks Daily Limit', '+60% Reward Booster (1.60x)', 'Dedicated VIP Support'],
    perksBn: ['প্লাটিনাম ডায়মন্ড ব্যাজ', 'দৈনিক ৩৫টি টাস্ক লিমিট', '+৬০% রিওয়ার্ড বুস্টার (১.৬০x)', 'ডেডিকেটেড ২৪/৭ সাপোর্ট'],
    dailyTaskLimit: 35,
    rewardMultiplier: 1.6,
  },
  {
    id: 'pkg_vip_10000',
    name: 'Royal VIP Supreme',
    nameBn: 'রয়্যাল ভিআইপি সুপ্রিম মেম্বারশিপ',
    tier: 'VIP',
    amount: 10000,
    description: 'Ultimate VIP status with 2.0x DOUBLE rewards, 60 daily tasks & instant zero-fee withdrawals.',
    descriptionBn: 'সর্বোচ্চ ভিআইপি স্ট্যাটাস, ডাবল ২.০x রিওয়ার্ড (২০০%), ৬০টি দৈনিক টাস্ক ও ইনস্ট্যান্ট উইথড্রল।',
    badgeColor: 'purple',
    perks: ['Royal VIP Crown Badge', '60 Tasks Daily Limit', '2.0x DOUBLE Task Rewards', 'Instant Zero-Fee Payouts'],
    perksBn: ['রয়্যাল ভিআইপি ক্রাউন ব্যাজ', 'দৈনিক ৬০টি টাস্ক লিমিট', '২.০x ডাবল রিওয়ার্ড রেট (২০০%)', 'ইনস্ট্যান্ট জিরো-ফি উইথড্রল'],
    dailyTaskLimit: 60,
    rewardMultiplier: 2.0,
  }
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
    userType: 'VIP',
    balance: 0,
    totalEarned: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    tasksCompletedCount: 0,
    joinedDate: '2026-01-01',
  }
];

// Generates deterministic daily randomized statistics for site history
export const getTodaySiteStats = () => {
  const todayStr = new Date().toISOString().slice(0, 10);
  // Hash the date string into a consistent numeric seed
  let seed = 0;
  for (let i = 0; i < todayStr.length; i++) {
    seed = (seed << 5) - seed + todayStr.charCodeAt(i);
    seed |= 0;
  }
  const absSeed = Math.abs(seed);

  // Deterministic daily numbers
  const todayRegistered = 115 + (absSeed % 145); // 115 - 259
  const todayDepositAmount = 145000 + ((absSeed * 7) % 185000); // 145,000 - 330,000
  const todayDepositsCount = 65 + (absSeed % 55); // 65 - 120
  const todayWithdrawalAmount = 78000 + ((absSeed * 13) % 96000); // 78,000 - 174,000
  const todayWithdrawalsCount = 42 + (absSeed % 40); // 42 - 82
  const todayTasksCompleted = 2800 + ((absSeed * 19) % 3200); // 2,800 - 6,000
  const activeMembersToday = 1420 + ((absSeed * 3) % 980); // 1,420 - 2,400
  const totalSiteMembers = 24850 + (absSeed % 1200);
  const totalPaidOut = 4820000 + (absSeed % 350000);
  const dateFormatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Live activity history items for the day
  const samplePhones = ['01718***421', '01912***890', '01834***112', '01678***554', '01309***789', '01552***341', '01799***003', '01844***996', '01988***412', '01611***723'];
  const sampleActivities = [
    { type: 'deposit', amount: 500, tier: 'General', titleBn: 'জেনারেল একাউন্ট রিচার্জ সম্পন্ন (৳৫০০)', titleEn: 'General Account Activated (৳500)', time: '2 mins ago' },
    { type: 'upgrade', amount: 1000, tier: 'Silver', titleBn: 'সিলভার মেম্বারশিপে প্রমোশন (+৳১০০০)', titleEn: 'Promoted to Silver Tier (+৳1000)', time: '5 mins ago' },
    { type: 'withdrawal', amount: 450, method: 'bKash', titleBn: 'বিকাশে ক্যাশআউট পরিশোধিত (৳৪৫০)', titleEn: 'bKash Cashout Disbursed (৳450)', time: '8 mins ago' },
    { type: 'upgrade', amount: 3000, tier: 'Gold', titleBn: 'গোল্ড প্রো প্যাকেজ সক্রিয় (+৳৩০০০)', titleEn: 'Gold Pro Package Activated (+৳3000)', time: '12 mins ago' },
    { type: 'task', amount: 60, titleBn: '৫টি ক্যাপচা টাস্ক সম্পন্ন (+৳৬০)', titleEn: '5 CAPTCHA Tasks Completed (+৳60)', time: '15 mins ago' },
    { type: 'withdrawal', amount: 1200, method: 'Nagad', titleBn: 'নগদ ক্যাশআউট পরিশোধিত (৳১২০০)', titleEn: 'Nagad Withdrawal Paid (৳1200)', time: '18 mins ago' },
    { type: 'upgrade', amount: 10000, tier: 'VIP', titleBn: 'রয়্যাল ভিআইপি এলিট স্ট্যাটাস সক্রিয়! (+৳১০০০০)', titleEn: 'Royal VIP Elite Activated! (+৳10000)', time: '22 mins ago' },
    { type: 'deposit', amount: 500, tier: 'General', titleBn: 'নতুন মেম্বার একাউন্ট একটিভ (৳৫০০)', titleEn: 'New Member Activated (৳500)', time: '28 mins ago' },
    { type: 'upgrade', amount: 5000, tier: 'Platinum', titleBn: 'প্লাটিনাম মেম্বারশিপ প্রমোশন (+৳৫০০০)', titleEn: 'Platinum Membership Promoted (+৳5000)', time: '34 mins ago' },
    { type: 'withdrawal', amount: 850, method: 'Rocket', titleBn: 'রকেট উইথড্রল পরিশোধিত (৳৮৫০)', titleEn: 'Rocket Withdrawal Paid (৳850)', time: '41 mins ago' }
  ];

  const recentSiteHistory = sampleActivities.map((act, index) => ({
    id: `site_hist_${index + 1}`,
    phone: samplePhones[index % samplePhones.length],
    ...act
  }));

  return {
    todayStr,
    dateFormatted,
    todayRegistered,
    todayRegistrations: todayRegistered,
    todayDepositAmount,
    todayDepositsAmount: todayDepositAmount,
    todayDepositsCount,
    todayWithdrawalAmount,
    todayWithdrawalsAmount: todayWithdrawalAmount,
    todayWithdrawalsCount,
    todayTasksCompleted,
    activeMembersToday,
    totalSiteMembers,
    totalPaidOut,
    recentSiteHistory
  };
};

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
