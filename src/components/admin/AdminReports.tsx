import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  CheckSquare,
  DollarSign,
  Download,
  Calendar
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { users, deposits, withdrawals, transactions, submissions, lang, t, showToast } = useApp();

  const totalDeposited = deposits
    .filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);

  const totalUserBalances = users
    .filter(u => u.role === 'customer')
    .reduce((sum, u) => sum + u.balance, 0);

  const totalRewardsDistributed = submissions
    .filter(s => s.status === 'approved')
    .reduce((sum, s) => sum + s.reward, 0);

  const netPlatformProfit = totalDeposited - (totalWithdrawn + totalUserBalances);

  const handleExportCSV = () => {
    const headers = 'ID,Type,User,Amount,Date,Status\n';
    const rows = transactions.map(t => `${t.id},${t.type},${t.userId},${t.amount},"${t.date}",${t.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast(lang === 'bn' ? 'রিপোর্ট ডাউনলোড হয়েছে' : 'Report CSV exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Financial & Analytical Reports</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'bn' ? 'প্ল্যাটফর্ম আয়-ব্যয় ও হিসাব বিবরণী' : 'Platform Revenue & Performance Ledger'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'রিচার্জ, উত্তোলন, বিতরণকৃত রিওয়ার্ড ও সিস্টেম ব্যালেন্সের সম্পূর্ণ সারসংক্ষেপ।'
              : 'Detailed audit summary of deposits, cashouts, micro-task payouts, and net reserve.'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Approved Deposits</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ৳{totalDeposited.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Total verified incoming funds</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Paid Out Withdrawals</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            ৳{totalWithdrawn.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Sent to customer mobile wallets</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Total Task Rewards</span>
            <CheckSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">
            ৳{totalRewardsDistributed.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Awarded across micro-tasks</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Customer Wallet Liability</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            ৳{totalUserBalances.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Current unpaid customer balances</span>
        </div>
      </div>

      {/* Breakdown Summary Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">
          Platform Liquidity & Safety Ledger
        </h3>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-600 font-medium">Total Customer Deposits Inflow (+)</span>
            <span className="font-black text-emerald-600">৳{totalDeposited.toLocaleString()}</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-600 font-medium">Total Customer Withdrawals Outflow (-)</span>
            <span className="font-black text-rose-600">৳{totalWithdrawn.toLocaleString()}</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-600 font-medium">Circulating In-App Balances</span>
            <span className="font-bold text-slate-900">৳{totalUserBalances.toLocaleString()}</span>
          </div>

          <div className="py-4 flex items-center justify-between bg-slate-50 px-4 rounded-2xl mt-2">
            <div>
              <span className="font-bold text-slate-900 block text-sm">Estimated Net Reserve Vault</span>
              <span className="text-[11px] text-slate-500">Deposits - (Withdrawals + User Balances)</span>
            </div>
            <span className={`text-lg sm:text-xl font-black ${netPlatformProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ৳{netPlatformProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
