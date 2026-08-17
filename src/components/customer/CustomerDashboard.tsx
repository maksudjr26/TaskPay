import React from 'react';
import { useApp } from '../../context/AppContext';
import { SiteHistoryLiveStats } from '../common/SiteHistoryLiveStats';
import { UserTierBadge } from '../common/UserTierBadge';
import { TierAnnouncementBanner } from '../common/TierAnnouncementBanner';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckSquare,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  History,
  Headphones,
  ChevronRight,
  ShieldCheck,
  Zap,
  Gift,
  Coins,
  CreditCard,
  Crown
} from 'lucide-react';

interface Props {
  setActiveTab: (tab: string) => void;
  onOpenTaskModal: (task: any) => void;
}

export const CustomerDashboard: React.FC<Props> = ({ setActiveTab, onOpenTaskModal }) => {
  const { currentUser, t, lang, settings, tasks, transactions, submissions } = useApp();

  const isInactive = currentUser.status === 'inactive';
  const minActivation = settings.minActivationAmount;
  const currentDepositProgress = Math.min(100, Math.round(((currentUser.totalDeposited || 0) / minActivation) * 100));

  // Today's completed tasks
  const today = new Date().toISOString().split('T')[0];
  const todaySubmissions = submissions.filter(s => s.userId === currentUser.id && s.completedAt.includes(today));
  const activeTasks = tasks.filter(t => t.status === 'active');
  const featuredTask = activeTasks[0];

  const userTransactions = transactions.filter(t => t.userId === currentUser.id).slice(0, 5);

  const depositBal = currentUser.depositBalance !== undefined ? currentUser.depositBalance : currentUser.balance;
  const taskBal = currentUser.taskBalance !== undefined ? currentUser.taskBalance : (currentUser.totalEarned || 0);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Dynamic Tier-Targeted Announcement Banner */}
      <TierAnnouncementBanner onActionClick={(tab) => setActiveTab(tab)} />

      {/* 2. Platform Broadcast Notice Ticker */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm text-slate-800 font-medium overflow-hidden">
          <span className="font-bold text-emerald-800 mr-1.5">
            {lang === 'bn' ? 'জরুরি ঘোষণা:' : 'Platform Notice:'}
          </span>
          {lang === 'bn' ? settings.platformNoticeBn : settings.platformNotice}
        </div>
      </div>

      {/* 3. Account Status & Activation Required Hero Card */}
      {isInactive ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/50">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.activationNoticeTitle}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                {lang === 'bn'
                  ? `একাউন্ট সক্রিয় করতে ন্যূনতম ৳${minActivation} রিচার্জ করুন`
                  : `Deposit ৳${minActivation} minimum to activate your account`}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t.activationNoticeDesc} <strong className="text-emerald-400 font-bold">৳{minActivation}</strong> {t.activationNoticeAction}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{t.activationProgress}</span>
                  <span className="font-bold text-emerald-400">
                    ৳{currentUser.totalDeposited || 0} / ৳{minActivation} ({currentDepositProgress}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700/80 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentDepositProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
              <button
                onClick={() => setActiveTab('deposit')}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <PlusCircleIcon className="w-4 h-4" />
                <span>{t.rechargeNow}</span>
              </button>

              <button
                onClick={() => setActiveTab('tasks')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'bn' ? 'টাস্ক প্রিভিউ দেখুন' : 'Explore Tasks'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-700/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{t.accountIsActive}</span>
                  </div>
                  <UserTierBadge tier={currentUser.userType || 'General'} size="sm" showPerkText lang={lang} />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                  {t.welcomeBack} {currentUser.name}
                </h2>
                <p className="text-xs text-emerald-100/80">
                  {lang === 'bn' ? 'সকল টাস্ক ও উইথড্র সুবিধা আপনার জন্য সক্রিয়' : 'All daily tasks and instant withdrawals unlocked'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('tasks')}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckSquare className="w-4 h-4" />
                <span>{t.navTasks}</span>
              </button>
              <button
                onClick={() => setActiveTab('deposit')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>{lang === 'bn' ? 'টিয়ার আপগ্রেড' : 'Upgrade Tier'}</span>
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-300" />
                <span>{t.navWithdraw}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Separated Balances Grid (Deposit Balance & Task Complete Balance) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Deposit Balance */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span className="font-bold text-blue-900 uppercase tracking-wide text-[11px]">
              {lang === 'bn' ? 'ডিপোজিট ব্যালেন্স' : 'Deposit Balance'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-700 tracking-tight">
            ৳{depositBal.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
            <span>{lang === 'bn' ? 'রিচার্জকৃত মূল ব্যালেন্স' : 'Approved Deposit Funds'}</span>
          </div>
        </div>

        {/* Task Complete Balance */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span className="font-bold text-emerald-900 uppercase tracking-wide text-[11px]">
              {lang === 'bn' ? 'টাস্ক কমপ্লিট ব্যালেন্স' : 'Task Reward Balance'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
            ৳{taskBal.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{lang === 'bn' ? 'টাস্ক ও ইনকাম রিওয়ার্ড' : 'Earned from Daily Tasks'}</span>
          </div>
        </div>

        {/* Total Available Balance */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">
              {t.currentBalance} ({lang === 'bn' ? 'মোট' : 'Total'})
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ৳{currentUser.balance.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>{lang === 'bn' ? 'মোট উত্তোলনযোগ্য ব্যালেন্স' : 'Total Withdrawable'}</span>
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span className="font-bold text-purple-900 uppercase tracking-wide text-[11px]">
              {t.totalWithdrawn}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-700 tracking-tight">
            ৳{(currentUser.totalWithdrawn || 0).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-purple-600 font-medium">
            {lang === 'bn' ? 'সফল ক্যাশআউট হিস্ট্রি' : 'Total Successful Cashouts'}
          </div>
        </div>
      </div>

      {/* 5. Quick Actions Row */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <button
          onClick={() => setActiveTab('deposit')}
          className="bg-white hover:bg-emerald-50 border border-slate-200/80 p-3 sm:p-4 rounded-2xl text-center group transition-all shadow-xs flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <PlusCircleIcon className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-800">{t.navDeposit}</span>
        </button>

        <button
          onClick={() => setActiveTab('withdraw')}
          className="bg-white hover:bg-teal-50 border border-slate-200/80 p-3 sm:p-4 rounded-2xl text-center group transition-all shadow-xs flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-800">{t.navWithdraw}</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className="bg-white hover:bg-amber-50 border border-slate-200/80 p-3 sm:p-4 rounded-2xl text-center group transition-all shadow-xs flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-800">{t.navTasks}</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className="bg-white hover:bg-indigo-50 border border-slate-200/80 p-3 sm:p-4 rounded-2xl text-center group transition-all shadow-xs flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-800">{t.navHistory}</span>
        </button>
      </div>

      {/* 6. Live Platform Activity & Site History (Randomized daily per requirement) */}
      <SiteHistoryLiveStats lang={lang} />

      {/* 7. Featured Daily Task Spotlight */}
      {featuredTask && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {lang === 'bn' ? 'আজকের বিশেষ টাস্ক' : 'Featured Daily Task'}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {t.taskReward}: <strong className="text-emerald-600">৳{featuredTask.reward}</strong>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                {lang === 'bn' ? featuredTask.titleBn : featuredTask.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">
                {lang === 'bn' ? featuredTask.descriptionBn : featuredTask.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenTaskModal(featuredTask)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>{t.startTask}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 8. Recent Transactions Preview Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <span>{t.recentTransactions}</span>
          </h3>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === 'bn' ? 'সব দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {userTransactions.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs sm:text-sm">
            {t.noRecentTransactions}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userTransactions.map((trx) => {
              const isIncome = trx.type === 'task_reward' || trx.type === 'deposit';
              const isPending = trx.status === 'pending';
              const isRejected = trx.status === 'rejected';

              return (
                <div key={trx.id} className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        trx.type === 'deposit'
                          ? 'bg-emerald-50 text-emerald-600'
                          : trx.type === 'withdrawal'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {trx.type === 'deposit' ? '+' : trx.type === 'withdrawal' ? '-' : '★'}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        {lang === 'bn' ? trx.titleBn : trx.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {trx.date} {trx.referenceId && `• ${trx.referenceId}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-extrabold ${
                        isIncome ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                    >
                      {isIncome ? '+' : '-'}৳{Math.abs(trx.amount)}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isPending
                          ? 'bg-amber-100 text-amber-800'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isPending ? t.pending : isRejected ? t.rejected : t.completed}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 9. Support & Assistance Box */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">{t.needHelp}</div>
            <div className="text-xs text-slate-400">
              {lang === 'bn' ? 'রিচার্জ বা টাস্ক সংক্রান্ত যে কোন তথ্যে আমাদের সাথে কথা বলুন' : '24/7 Live telegram & phone customer assistance'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${settings.customerSupportPhone}`}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            {settings.customerSupportPhone}
          </a>
        </div>
      </div>
    </div>
  );
};

function PlusCircleIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
