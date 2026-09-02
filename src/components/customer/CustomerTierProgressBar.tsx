import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserTierBadge,
  getNextLevelInfo,
  TIER_LEVELS,
  TIER_CONFIG
} from '../common/UserTierBadge';
import {
  TrendingUp,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  Star,
  Award,
  Gem,
  CheckCircle2,
  Lock,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Check,
  Flame
} from 'lucide-react';

interface Props {
  onUpgradeClick?: () => void;
  defaultExpanded?: boolean;
}

const ICONS: Record<string, React.ElementType> = {
  General: Shield,
  Silver: Star,
  Gold: Award,
  Platinum: Gem,
  VIP: Crown
};

export const CustomerTierProgressBar: React.FC<Props> = ({
  onUpgradeClick,
  defaultExpanded = false
}) => {
  const { currentUser, lang } = useApp();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const fixedBalance = currentUser.depositBalance ?? 0;
  const levelInfo = getNextLevelInfo(fixedBalance);
  const currentTier = currentUser.userType || levelInfo.currentTier;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-indigo-500/20 relative overflow-hidden transition-all duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{lang === 'bn' ? 'মেম্বারশিপ লেভেল আপগ্রেড' : 'Tier Upgrade Progress'}</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {lang === 'bn' ? 'ফিক্সড ব্যালেন্স:' : 'Fixed Balance:'}{' '}
                <strong className="text-emerald-400 font-bold">৳{fixedBalance.toLocaleString()}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <UserTierBadge tier={currentTier} size="md" showPerkText lang={lang} />
              
              {!levelInfo.isMaxLevel && levelInfo.nextTier && (
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? 'পরবর্তী লক্ষ্য:' : 'Next Goal:'}</span>
                  <span className="font-extrabold text-amber-300">
                    {lang === 'bn'
                      ? TIER_CONFIG[levelInfo.nextTier]?.nameBn
                      : TIER_CONFIG[levelInfo.nextTier]?.nameEn}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Upgrade Button */}
          {onUpgradeClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpgradeClick();
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>
                {levelInfo.isMaxLevel
                  ? (lang === 'bn' ? 'রিচার্জ করুন' : 'Add Deposit')
                  : (lang === 'bn' ? 'ডিপোজিট করে লেভেল আপগ্রেড করুন' : 'Deposit to Level Up')}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clickable Progress Bar Container (Clicking expands/collapses tier options) */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all hover:border-emerald-500/50 shadow-inner group"
        >
          {/* Progress Status and Target text */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                {levelInfo.isMaxLevel ? (
                  <div>
                    <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'bn' ? 'সর্বোচ্চ ভিআইপি লেভেল অর্জিত!' : 'Maximum VIP Tier Achieved!'}</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {lang === 'bn'
                        ? 'আপনি সর্বোচ্চ ৩.০x ট্রিপল রিওয়ার্ড এবং দৈনিক ৭৫টি টাস্ক সীমা উপভোগ করছেন।'
                        : 'You are enjoying the highest 3.0x triple rewards and 75 daily tasks.'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-slate-300">
                      {lang === 'bn' ? 'পরবর্তী লেভেলে পৌঁছাতে প্রয়োজন:' : 'Required for next tier upgrade:'}
                    </div>
                    <div className="text-sm sm:text-base font-black text-white mt-0.5">
                      {lang === 'bn' ? (
                        <>
                          আর মাত্র <span className="text-emerald-400 font-black">৳{levelInfo.neededAmount.toLocaleString()}</span> ডিপোজিট করলেই{' '}
                          <span className="text-amber-300 font-extrabold">{levelInfo.nextTier}</span> লেভেল আনলক হবে!
                        </>
                      ) : (
                        <>
                          Deposit <span className="text-emerald-400 font-black">৳{levelInfo.neededAmount.toLocaleString()}</span> more to unlock{' '}
                          <span className="text-amber-300 font-extrabold">{levelInfo.nextTier}</span> Tier!
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <div className="text-right">
                <div className="text-[11px] text-slate-400">
                  {levelInfo.isMaxLevel
                    ? (lang === 'bn' ? 'ম্যাক্স রেট' : 'Max Multiplier')
                    : (lang === 'bn' ? 'আপগ্রেড বোনাস' : 'Next Perk')}
                </div>
                <div className="text-xs font-black text-amber-300">
                  {lang === 'bn' ? levelInfo.multiplierBoostBn : levelInfo.multiplierBoostEn}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Progress Bar Track */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'bn' ? 'লেভেল প্রগ্রেস বার' : 'Level Upgrade Progress'}</span>
              </span>
              <span className="font-extrabold text-emerald-400">
                {levelInfo.isMaxLevel
                  ? '100% Complete'
                  : `৳${fixedBalance.toLocaleString()} / ৳${levelInfo.targetAmount.toLocaleString()} (${levelInfo.progressPercent}%)`}
              </span>
            </div>

            <div className="w-full bg-slate-900/90 h-3.5 rounded-full overflow-hidden border border-slate-700 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                  levelInfo.isMaxLevel
                    ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500'
                    : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400'
                }`}
                style={{ width: `${levelInfo.isMaxLevel ? 100 : Math.max(5, levelInfo.progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Expand / Collapse Click Prompt */}
          <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300 font-bold">
            <span className="text-emerald-400 flex items-center gap-1.5 group-hover:text-emerald-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {isExpanded
                ? (lang === 'bn' ? 'সকল টিয়ার অপশন সংক্ষেপ করুন' : 'Hide Tier Options')
                : (lang === 'bn' ? 'সকল টিয়ার অপশন ও রিওয়ার্ড দেখতে এখানে ক্লিক করুন' : 'Click here to view all tier options & perks')}
            </span>

            <div className="flex items-center gap-1 text-[11px] bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700 group-hover:border-emerald-500/40">
              <span>{isExpanded ? (lang === 'bn' ? 'সংক্ষেপ' : 'Collapse') : (lang === 'bn' ? 'সকল অপশন দেখুন' : 'Show All')}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5 text-amber-400" />}
            </div>
          </div>
        </div>

        {/* 5-Stage Milestone Roadmap Nodes (Shown when expanded) */}
        {isExpanded && (
          <div className="pt-2 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'সকল ৫টি মেম্বারশিপ টিয়ার অপশন ও সুবিধাসমূহ' : 'All 5 Tier Membership Options & Perks'}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'স্বয়ংক্রিয় প্রমোশন ও ফিক্সড ডিপোজিট' : 'Auto-promotion based on deposit balance'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {TIER_LEVELS.map((stage) => {
                const isAchieved = fixedBalance >= stage.threshold;
                const isCurrent = currentTier === stage.tier;
                const isNextTarget = !isAchieved && levelInfo.nextTier === stage.tier;
                const IconComp = ICONS[stage.tier] || Shield;

                return (
                  <div
                    key={stage.tier}
                    className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                        : isAchieved
                        ? 'bg-slate-800/70 border-emerald-600/40 text-slate-200'
                        : isNextTarget
                        ? 'bg-amber-950/50 border-amber-400/80 ring-2 ring-amber-400/30'
                        : 'bg-slate-800/40 border-slate-700/50 opacity-70'
                    }`}
                  >
                    {/* Current or Target Marker */}
                    {isCurrent && (
                      <div className="absolute -top-2.5 right-2.5 bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-md flex items-center gap-1">
                        <Check className="w-3 h-3 text-slate-950" />
                        <span>{lang === 'bn' ? 'বর্তমান লেভেল' : 'Current'}</span>
                      </div>
                    )}

                    {isNextTarget && !isCurrent && (
                      <div className="absolute -top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-md animate-pulse">
                        {lang === 'bn' ? 'পরবর্তী লক্ষ্য' : 'Next Target'}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isCurrent || isAchieved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isNextTarget
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">
                            L{stage.level}: {stage.tier}
                          </div>
                          <div className="text-xs text-emerald-400 font-mono font-bold">
                            ৳{stage.threshold.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs pt-2 border-t border-slate-700/60">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">{lang === 'bn' ? 'রিওয়ার্ড গুণক:' : 'Reward Multiplier:'}</span>
                          <span className="font-extrabold text-amber-300">{stage.multiplier}x</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">{lang === 'bn' ? 'দৈনিক টাস্ক সীমা:' : 'Daily Tasks:'}</span>
                          <span className="font-semibold text-slate-200">{stage.tasks} {lang === 'bn' ? 'টি' : 'tasks'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-700/40 text-center">
                      {isAchieved ? (
                        <span className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 py-1.5 rounded-xl border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'সক্রিয় ও আনলকড' : 'Unlocked'}</span>
                        </span>
                      ) : isNextTarget ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onUpgradeClick) onUpgradeClick();
                          }}
                          className="w-full inline-flex items-center justify-center gap-1 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 py-1.5 rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
                        >
                          <span>{lang === 'bn' ? `৳${levelInfo.neededAmount} রিচার্জ` : `+৳${levelInfo.neededAmount} Deposit`}</span>
                        </button>
                      ) : (
                        <span className="w-full inline-flex items-center justify-center gap-1 text-xs font-medium text-slate-400 bg-slate-800/90 py-1.5 rounded-xl border border-slate-700">
                          <Lock className="w-3 h-3" />
                          <span>{lang === 'bn' ? `৳${stage.threshold} ফিক্সড` : `৳${stage.threshold} Fixed`}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Balance Adjustment Info Footer */}
            <div className="pt-3 flex items-start gap-2 text-[11px] text-slate-400 border-t border-slate-800/80">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'bn'
                  ? 'আপনার মেম্বারশিপ লেভেল সরাসরি বর্তমান ফিক্সড ব্যালেন্সের সাথে সংযুক্ত। ডিপোজিট যুক্ত হলে লেভেল স্বয়ংক্রিয়ভাবে বৃদ্ধি পায় এবং অ্যাডমিন কর্তন বা ব্যালেন্স হ্রাস পেলে লেভেল নেমে যেতে পারে।'
                  : 'Your tier level dynamically reflects your current fixed deposit balance. Levels upgrade automatically as balance increases, and downgrade if balance is deducted.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
