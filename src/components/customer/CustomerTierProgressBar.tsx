import React from 'react';
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
  Info
} from 'lucide-react';

interface Props {
  onUpgradeClick?: () => void;
}

const ICONS: Record<string, React.ElementType> = {
  General: Shield,
  Silver: Star,
  Gold: Award,
  Platinum: Gem,
  VIP: Crown
};

export const CustomerTierProgressBar: React.FC<Props> = ({ onUpgradeClick }) => {
  const { currentUser, lang } = useApp();

  const fixedBalance = currentUser.depositBalance ?? 0;
  const levelInfo = getNextLevelInfo(fixedBalance);
  const currentTier = currentUser.userType || levelInfo.currentTier;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-indigo-500/20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Header: Level Status and Target Callout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{lang === 'bn' ? 'মেম্বারশিপ লেভেল প্রগ্রেস' : 'Tier Level Progress'}</span>
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

          {/* Quick Upgrade Button */}
          {onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
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

        {/* Highlight Needed Amount Box */}
        <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
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

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
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

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'পরবর্তী লেভেল প্রগ্রেস' : 'Next Level Progress'}</span>
            </span>
            <span className="font-extrabold text-emerald-400">
              {levelInfo.isMaxLevel
                ? '100% Complete'
                : `৳${fixedBalance.toLocaleString()} / ৳${levelInfo.targetAmount.toLocaleString()} (${levelInfo.progressPercent}%)`}
            </span>
          </div>

          {/* Bar track */}
          <div className="w-full bg-slate-800/90 h-3 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                levelInfo.isMaxLevel
                  ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500'
                  : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400'
              }`}
              style={{ width: `${levelInfo.isMaxLevel ? 100 : Math.max(4, levelInfo.progressPercent)}%` }}
            />
          </div>
        </div>

        {/* 5-Stage Milestone Roadmap Nodes */}
        <div className="pt-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            {lang === 'bn' ? 'লেভেল ও ফিক্সড ডিপোজিট মাইলস্টোন ম্যাপ' : 'Tier Milestone Roadmap'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {TIER_LEVELS.map((stage) => {
              const isAchieved = fixedBalance >= stage.threshold;
              const isCurrent = currentTier === stage.tier;
              const isNextTarget = !isAchieved && levelInfo.nextTier === stage.tier;
              const IconComp = ICONS[stage.tier] || Shield;

              return (
                <div
                  key={stage.tier}
                  className={`p-3 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-emerald-950/70 border-emerald-400/80 ring-2 ring-emerald-400/30 shadow-md'
                      : isAchieved
                      ? 'bg-slate-800/60 border-emerald-600/40 text-slate-200'
                      : isNextTarget
                      ? 'bg-amber-950/40 border-amber-400/60 ring-1 ring-amber-400/30'
                      : 'bg-slate-800/40 border-slate-700/50 opacity-60'
                  }`}
                >
                  {/* Current or Target Marker */}
                  {isCurrent && (
                    <div className="absolute -top-2 right-2 bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.2 rounded-full uppercase shadow-xs">
                      {lang === 'bn' ? 'বর্তমান' : 'Active'}
                    </div>
                  )}

                  {isNextTarget && !isCurrent && (
                    <div className="absolute -top-2 right-2 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.2 rounded-full uppercase shadow-xs animate-pulse">
                      {lang === 'bn' ? 'লক্ষ্য' : 'Target'}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrent || isAchieved
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isNextTarget
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">
                        L{stage.level}: {stage.tier}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold">
                        ৳{stage.threshold.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px] pt-1 border-t border-slate-700/60">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{lang === 'bn' ? 'রিওয়ার্ড:' : 'Reward:'}</span>
                      <span className="font-bold text-amber-300">{stage.multiplier}x</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{lang === 'bn' ? 'দৈনিক সীমা:' : 'Daily Tasks:'}</span>
                      <span className="font-semibold text-slate-200">{stage.tasks} {lang === 'bn' ? 'টি' : 'tasks'}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-center">
                    {isAchieved ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{lang === 'bn' ? 'আনলকড' : 'Unlocked'}</span>
                      </span>
                    ) : isNextTarget ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-400/30">
                        <span>{lang === 'bn' ? `আরও ৳${levelInfo.neededAmount}` : `+৳${levelInfo.neededAmount}`}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{lang === 'bn' ? 'লকড' : 'Locked'}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Balance Adjustment Info Footer */}
        <div className="pt-2 flex items-start gap-2 text-[11px] text-slate-400 border-t border-slate-800/80">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            {lang === 'bn'
              ? 'আপনার মেম্বারশিপ লেভেল সরাসরি বর্তমান ফিক্সড ব্যালেন্সের সাথে সংযুক্ত। ডিপোজিট যুক্ত হলে লেভেল বৃদ্ধি পায় এবং ব্যালেন্স কর্তন হলে স্বয়ংক্রিয়ভাবে লেভেল নেমে যেতে পারে।'
              : 'Your tier level dynamically reflects your current fixed deposit balance. Levels upgrade automatically as balance increases, and downgrade if balance is deducted.'}
          </span>
        </div>
      </div>
    </div>
  );
};
