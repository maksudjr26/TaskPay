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
  nameBn: string;
  nameEn: string;
  shortDescBn: string;
  shortDescEn: string;
  amount: number;
  multiplier: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  icon: React.ElementType;
}> = {
  General: {
    nameBn: 'জেনারেল মেম্বার',
    nameEn: 'General Member',
    shortDescBn: '১.০x স্ট্যান্ডার্ড রেট',
    shortDescEn: '1.0x Standard Rate',
    amount: 500,
    multiplier: '1.0x',
    bgGradient: 'from-emerald-500/15 via-teal-500/10 to-slate-200/40',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-300',
    glowColor: 'shadow-emerald-500/10',
    icon: Shield
  },
  Silver: {
    nameBn: 'সিলভার বুস্টার',
    nameEn: 'Silver Booster',
    shortDescBn: '+১৫% রিওয়ার্ড বুস্ট',
    shortDescEn: '+15% Reward Boost',
    amount: 1000,
    multiplier: '1.15x',
    bgGradient: 'from-slate-200 via-zinc-100 to-slate-300',
    textColor: 'text-slate-900',
    borderColor: 'border-slate-400',
    glowColor: 'shadow-slate-400/20',
    icon: Star
  },
  Gold: {
    nameBn: 'গোল্ড প্রো এলিট',
    nameEn: 'Gold Pro Elite',
    shortDescBn: '+৩৫% রিওয়ার্ড বুস্ট',
    shortDescEn: '+35% Reward Boost',
    amount: 3000,
    multiplier: '1.35x',
    bgGradient: 'from-amber-400 via-yellow-200 to-amber-500',
    textColor: 'text-amber-950',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-500/30',
    icon: Award
  },
  Platinum: {
    nameBn: 'প্লাটিনাম মাস্টার',
    nameEn: 'Platinum Master',
    shortDescBn: '+৬০% সুপার রিওয়ার্ড',
    shortDescEn: '+60% Super Boost',
    amount: 5000,
    multiplier: '1.60x',
    bgGradient: 'from-cyan-400 via-sky-200 to-teal-300',
    textColor: 'text-cyan-950',
    borderColor: 'border-cyan-300',
    glowColor: 'shadow-cyan-500/30',
    icon: Gem
  },
  VIP: {
    nameBn: 'রয়্যাল ভিআইপি সুপ্রিম',
    nameEn: 'Royal VIP Supreme',
    shortDescBn: '২.০x ডাবল রিওয়ার্ড',
    shortDescEn: '2.0x DOUBLE Reward',
    amount: 10000,
    multiplier: '2.0x',
    bgGradient: 'from-purple-600 via-pink-600 to-amber-400 text-white',
    textColor: 'text-white',
    borderColor: 'border-purple-300/80',
    glowColor: 'shadow-purple-500/40',
    icon: Crown
  }
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
