import React from 'react';
import { useApp } from '../../context/AppContext';
import { SiteHistoryLiveStats } from '../common/SiteHistoryLiveStats';
import {
  Users,
  UserCheck,
  UserX,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  Settings,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Check,
  X
} from 'lucide-react';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ setActiveTab }) => {
  const {
    users,
    deposits,
    withdrawals,
    transactions,
    settings,
    t,
    lang,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal
  } = useApp();

  const customerUsers = users.filter(u => u.role === 'customer');
  const activeCustomers = customerUsers.filter(u => u.status === 'active');
  const inactiveCustomers = customerUsers.filter(u => u.status === 'inactive');

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  const totalDepositVolume = deposits
    .filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalWithdrawalVolume = withdrawals
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);

  const totalTaskRewards = transactions
    .filter(t => t.type === 'task_reward' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.adminDashboardTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {lang === 'bn' ? 'সিস্টেম ওভারভিউ ও রিয়েলটাইম পরিসংখ্যান' : 'Live Platform Analytics & Controls'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.adminDashboardSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('admin_deposits')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>{t.navAdminDeposits}</span>
            </button>
            <button
              onClick={() => setActiveTab('admin_settings')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              <span>{t.navAdminSettings}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Customers */}
        <div
          onClick={() => setActiveTab('admin_users')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>{t.totalUsers}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {customerUsers.length}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <span className="text-emerald-600 font-bold">{activeCustomers.length} {t.active}</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">{inactiveCustomers.length} {t.inactive}</span>
          </div>
        </div>

        {/* Pending Deposits */}
        <div
          onClick={() => setActiveTab('admin_deposits')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>{t.pendingDepositsCount}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
            {pendingDeposits.length}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {lang === 'bn' ? 'যাচাইয়ের অপেক্ষায়' : 'Awaiting verification'}
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div
          onClick={() => setActiveTab('admin_withdrawals')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>{t.pendingWithdrawalsCount}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-600 tracking-tight">
            {pendingWithdrawals.length}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {lang === 'bn' ? 'ক্যাশ আউট রিকোয়েস্ট' : 'Awaiting payout'}
          </div>
        </div>

        {/* Total Deposit Volume */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>{t.totalPlatformDeposits}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
            ৳{totalDepositVolume.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Payouts: ৳{totalWithdrawalVolume.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Live Site History & Daily Statistics (Randomized daily per requirement) */}
      <SiteHistoryLiveStats lang={lang} />

      {/* Urgent Action Queue: Pending Deposits Needing Approval */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              {pendingDeposits.length}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {t.urgentActions} ({t.depositRequestsTitle})
              </h3>
              <p className="text-xs text-slate-500">
                {t.autoActivateInfo}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('admin_deposits')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>{lang === 'bn' ? 'সকল ডিপোজিট' : 'View All Deposits'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingDeposits.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs sm:text-sm bg-slate-50 rounded-2xl">
            {t.noPendingRequests}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingDeposits.map((dep) => (
              <div key={dep.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{dep.userName}</span>
                    <span className="text-xs text-slate-500">({dep.userPhone})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 uppercase text-slate-700">
                      {dep.method.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    TrxID: <strong className="font-mono text-indigo-600">{dep.transactionId}</strong> • Sender: {dep.senderNumber} • Time: {dep.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-lg font-black text-emerald-600">
                    ৳{dep.amount}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => approveDeposit(dep.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      title={t.approveDeposit}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.approveDeposit}</span>
                    </button>

                    <button
                      onClick={() => {
                        const reason = prompt(t.rejectReasonPrompt) || 'Transaction ID not verified';
                        rejectDeposit(dep.id, reason);
                      }}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{t.rejectDeposit}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Activation Threshold Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
            {lang === 'bn' ? 'বর্তমান এক্টিভেশন চার্জ ও পলিসি' : 'Current Platform Parameters'}
          </div>
          <h4 className="text-base font-bold">
            {t.minActivationLabel}: <span className="text-emerald-400">৳{settings.minActivationAmount}</span> | {t.minWithdrawLabel}: <span className="text-emerald-400">৳{settings.minWithdrawAmount}</span>
          </h4>
          <p className="text-xs text-slate-400">
            {lang === 'bn'
              ? 'কাস্টমাররা ৳৫০০ বা নির্ধারিত পরিমাণ রিচার্জ করলে সাথে সাথে তাদের একাউন্ট Active হয়।'
              : 'Users automatically get full Active status once total approved deposit meets or exceeds activation threshold.'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('admin_settings')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shrink-0"
        >
          {lang === 'bn' ? 'সেটিংস পরিবর্তন করুন' : 'Modify Settings'}
        </button>
      </div>
    </div>
  );
};
