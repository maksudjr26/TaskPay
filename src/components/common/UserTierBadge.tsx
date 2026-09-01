import React from 'react';
import { UserTier } from '../../types';
import { Shield, Star, Award, Gem, Crown, Sparkles, Zap } from 'lucide-react';

interface UserTierBadgeProps {
  tier?: UserTier;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showPerkText?: boolean;
  className?: string;
  lang?: 'bn' | 'en';
}

export const TIER_CONFIG: Record<UserTier, {
  level: number;
  levelLabelBn: string;
  levelLabelEn: string;
  nameBn: string;
  nameEn: string;
  shortDescBn: string;
  shortDescEn: string;
  amount: number;
  multiplier: string;
  multiplierNum: number;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  icon: React.ElementType;
}> = {
  General: {
    level: 1,
    levelLabelBn: 'লেভেল ১',
    levelLabelEn: 'Level 1',
    nameBn: 'লেভেল ১: জেনারেল মেম্বার',
    nameEn: 'Level 1: General Member',
    shortDescBn: '১.০x সাধারণ রিওয়ার্ড (১০টি টাস্ক)',
    shortDescEn: '1.0x Standard Rate (10 Tasks)',
    amount: 500,
    multiplier: '1.0x',
    multiplierNum: 1.0,
    bgGradient: 'from-emerald-500/15 via-teal-500/10 to-slate-200/40',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-300',
    glowColor: 'shadow-emerald-500/10',
    icon: Shield
  },
  Silver: {
    level: 2,
    levelLabelBn: 'লেভেল ২',
    levelLabelEn: 'Level 2',
    nameBn: 'লেভেল ২: সিলভার বুস্টার',
    nameEn: 'Level 2: Silver Booster',
    shortDescBn: '+২৫% রিওয়ার্ড বুস্ট (১.২৫x • ২০টি টাস্ক)',
    shortDescEn: '+25% Boost (1.25x • 20 Tasks)',
    amount: 1000,
    multiplier: '1.25x',
    multiplierNum: 1.25,
    bgGradient: 'from-slate-200 via-zinc-100 to-slate-300',
    textColor: 'text-slate-900',
    borderColor: 'border-slate-400',
    glowColor: 'shadow-slate-400/20',
    icon: Star
  },
  Gold: {
    level: 3,
    levelLabelBn: 'লেভেল ৩',
    levelLabelEn: 'Level 3',
    nameBn: 'লেভেল ৩: গোল্ড প্রো এলিট',
    nameEn: 'Level 3: Gold Pro Elite',
    shortDescBn: '+৭৫% রিওয়ার্ড বুস্ট (১.৭৫x • ৩৫টি টাস্ক)',
    shortDescEn: '+75% Boost (1.75x • 35 Tasks)',
    amount: 3000,
    multiplier: '1.75x',
    multiplierNum: 1.75,
    bgGradient: 'from-amber-400 via-yellow-200 to-amber-500',
    textColor: 'text-amber-950',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-500/30',
    icon: Award
  },
  Platinum: {
    level: 4,
    levelLabelBn: 'লেভেল ৪',
    levelLabelEn: 'Level 4',
    nameBn: 'লেভেল ৪: প্লাটিনাম মাস্টার',
    nameEn: 'Level 4: Platinum Master',
    shortDescBn: '+১২৫% সুপার বুস্ট (২.২৫x • ৫০টি টাস্ক)',
    shortDescEn: '+125% Super Boost (2.25x • 50 Tasks)',
    amount: 6000,
    multiplier: '2.25x',
    multiplierNum: 2.25,
    bgGradient: 'from-cyan-400 via-sky-200 to-teal-300',
    textColor: 'text-cyan-950',
    borderColor: 'border-cyan-300',
    glowColor: 'shadow-cyan-500/30',
    icon: Gem
  },
  VIP: {
    level: 5,
    levelLabelBn: 'লেভেল ৫ (ভিআইপি)',
    levelLabelEn: 'Level 5 (VIP)',
    nameBn: 'লেভেল ৫: রয়্যাল ভিআইপি সুপ্রিম',
    nameEn: 'Level 5: Royal VIP Supreme',
    shortDescBn: '৩.০x ট্রিপল রিওয়ার্ড (৩০০% • ৭৫টি টাস্ক)',
    shortDescEn: '3.0x TRIPLE Reward (75 Tasks)',
    amount: 10000,
    multiplier: '3.0x',
    multiplierNum: 3.0,
    bgGradient: 'from-purple-600 via-pink-600 to-amber-400 text-white',
    textColor: 'text-white',
    borderColor: 'border-purple-300/80',
    glowColor: 'shadow-purple-500/40',
    icon: Crown
  }
};

export const calculateTierFromFixedBalance = (fixedBalance: number): UserTier => {
  if (fixedBalance >= 10000) return 'VIP';
  if (fixedBalance >= 6000) return 'Platinum';
  if (fixedBalance >= 3000) return 'Gold';
  if (fixedBalance >= 1000) return 'Silver';
  if (fixedBalance >= 500) return 'General';
  return 'General';
};

export const TIER_LEVELS: {
  tier: UserTier;
  level: number;
  threshold: number;
  multiplier: number;
  tasks: number;
}[] = [
  { tier: 'General', level: 1, threshold: 500, multiplier: 1.0, tasks: 10 },
  { tier: 'Silver', level: 2, threshold: 1000, multiplier: 1.25, tasks: 20 },
  { tier: 'Gold', level: 3, threshold: 3000, multiplier: 1.75, tasks: 35 },
  { tier: 'Platinum', level: 4, threshold: 6000, multiplier: 2.25, tasks: 50 },
  { tier: 'VIP', level: 5, threshold: 10000, multiplier: 3.0, tasks: 75 },
];

export const getNextLevelInfo = (currentFixedBalance: number) => {
  const fixed = Math.max(0, currentFixedBalance || 0);

  if (fixed < 500) {
    return {
      currentLevel: 0,
      currentTier: 'General' as UserTier,
      nextLevel: 1,
      nextTier: 'General' as UserTier,
      currentThreshold: 0,
      targetAmount: 500,
      neededAmount: 500 - fixed,
      progressPercent: Math.min(100, Math.max(0, Math.round((fixed / 500) * 100))),
      totalProgressPercent: Math.min(100, Math.max(0, Math.round((fixed / 10000) * 100))),
      currentConfig: TIER_CONFIG.General,
      nextConfig: TIER_CONFIG.General,
      isMaxLevel: false,
      multiplierBoostBn: '১.০x স্ট্যান্ডার্ড রিওয়ার্ড (১০টি টাস্ক)',
      multiplierBoostEn: '1.0x Standard Rate (10 Tasks)'
    };
  }
  if (fixed < 1000) {
    return {
      currentLevel: 1,
      currentTier: 'General' as UserTier,
      nextLevel: 2,
      nextTier: 'Silver' as UserTier,
      currentThreshold: 500,
      targetAmount: 1000,
      neededAmount: 1000 - fixed,
      progressPercent: Math.min(100, Math.max(0, Math.round(((fixed - 500) / 500) * 100))),
      totalProgressPercent: Math.min(100, Math.max(0, Math.round((fixed / 10000) * 100))),
      currentConfig: TIER_CONFIG.General,
      nextConfig: TIER_CONFIG.Silver,
      isMaxLevel: false,
      multiplierBoostBn: '+২৫% রিওয়ার্ড বুস্ট (১.২৫x • ২০টি টাস্ক)',
      multiplierBoostEn: '+25% Boost (1.25x • 20 Tasks)'
    };
  }
  if (fixed < 3000) {
    return {
      currentLevel: 2,
      currentTier: 'Silver' as UserTier,
      nextLevel: 3,
      nextTier: 'Gold' as UserTier,
      currentThreshold: 1000,
      targetAmount: 3000,
      neededAmount: 3000 - fixed,
      progressPercent: Math.min(100, Math.max(0, Math.round(((fixed - 1000) / 2000) * 100))),
      totalProgressPercent: Math.min(100, Math.max(0, Math.round((fixed / 10000) * 100))),
      currentConfig: TIER_CONFIG.Silver,
      nextConfig: TIER_CONFIG.Gold,
      isMaxLevel: false,
      multiplierBoostBn: '+৭৫% রিওয়ার্ড বুস্ট (১.৭৫x • ৩৫টি টাস্ক)',
      multiplierBoostEn: '+75% Boost (1.75x • 35 Tasks)'
    };
  }
  if (fixed < 6000) {
    return {
      currentLevel: 3,
      currentTier: 'Gold' as UserTier,
      nextLevel: 4,
      nextTier: 'Platinum' as UserTier,
      currentThreshold: 3000,
      targetAmount: 6000,
      neededAmount: 6000 - fixed,
      progressPercent: Math.min(100, Math.max(0, Math.round(((fixed - 3000) / 3000) * 100))),
      totalProgressPercent: Math.min(100, Math.max(0, Math.round((fixed / 10000) * 100))),
      currentConfig: TIER_CONFIG.Gold,
      nextConfig: TIER_CONFIG.Platinum,
      isMaxLevel: false,
      multiplierBoostBn: '+১২৫% সুপার বুস্ট (২.২৫x • ৫০টি টাস্ক)',
      multiplierBoostEn: '+125% Super Boost (2.25x • 50 Tasks)'
    };
  }
  if (fixed < 10000) {
    return {
      currentLevel: 4,
      currentTier: 'Platinum' as UserTier,
      nextLevel: 5,
      nextTier: 'VIP' as UserTier,
      currentThreshold: 6000,
      targetAmount: 10000,
      neededAmount: 10000 - fixed,
      progressPercent: Math.min(100, Math.max(0, Math.round(((fixed - 6000) / 4000) * 100))),
      totalProgressPercent: Math.min(100, Math.max(0, Math.round((fixed / 10000) * 100))),
      currentConfig: TIER_CONFIG.Platinum,
      nextConfig: TIER_CONFIG.VIP,
      isMaxLevel: false,
      multiplierBoostBn: '৩.০x ট্রিপল রিওয়ার্ড (৩০০% • ৭৫টি টাস্ক)',
      multiplierBoostEn: '3.0x TRIPLE Reward (75 Tasks)'
    };
  }
  return {
    currentLevel: 5,
    currentTier: 'VIP' as UserTier,
    nextLevel: null,
    nextTier: null,
    currentThreshold: 10000,
    targetAmount: 10000,
    neededAmount: 0,
    progressPercent: 100,
    totalProgressPercent: 100,
    currentConfig: TIER_CONFIG.VIP,
    nextConfig: null,
    isMaxLevel: true,
    multiplierBoostBn: '৩.০x সর্বোচ্চ ট্রিপল রিওয়ার্ড (আনলকড)',
    multiplierBoostEn: '3.0x TRIPLE Maximum Reward (Active)'
  };
};

export const UserTierBadge: React.FC<UserTierBadgeProps> = ({
  tier = 'General',
  size = 'md',
  showPerkText = false,
  className = '',
  lang = 'bn'
}) => {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.General;
  const IconComponent = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1 rounded-md font-bold',
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg font-bold',
    md: 'px-3 py-1.5 text-xs sm:text-sm gap-2 rounded-xl font-extrabold',
    lg: 'px-4 py-2 text-sm sm:text-base gap-2.5 rounded-2xl font-black shadow-md',
    xl: 'px-5 py-3 text-base sm:text-lg gap-3 rounded-2xl font-black shadow-lg'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  return (
    <div
      className={`inline-flex items-center border bg-gradient-to-r ${config.bgGradient} ${config.textColor} ${config.borderColor} ${config.glowColor} ${sizeClasses[size]} ${className} select-none transition-all`}
    >
      <IconComponent className={`${iconSizes[size]} shrink-0 ${tier === 'VIP' ? 'animate-pulse text-yellow-300' : ''}`} />
      <span className="tracking-wide">
        {lang === 'bn' ? config.nameBn : config.nameEn}
      </span>

      {showPerkText && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase ${tier === 'VIP' ? 'bg-amber-400 text-purple-950' : 'bg-black/10'}`}>
          {config.multiplier}
        </span>
      )}
    </div>
  );
};
