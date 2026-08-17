import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Bell,
  Languages,
  UserCheck,
  Menu,
  X,
  CreditCard,
  ArrowUpRight,
  LogOut
} from 'lucide-react';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const AdminHeader: React.FC<Props> = ({ sidebarOpen, setSidebarOpen, setActiveTab }) => {
  const { deposits, withdrawals, t, lang, setLanguage, setCurrentRoleView, logoutAdmin } = useApp();

  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const totalPending = pendingDeposits + pendingWithdrawals;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight leading-tight">
                  {t.adminDashboardTitle}
                </h1>
                <span className="text-[11px] text-slate-400 font-medium">
                  {lang === 'bn' ? 'ম্যানেজমেন্ট ও কন্ট্রোল প্যানেল (admin / admin1)' : 'Admin Control Panel (admin / admin1)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Urgent Pending Badge */}
            {totalPending > 0 && (
              <button
                onClick={() => setActiveTab(pendingDeposits > 0 ? 'admin_deposits' : 'admin_withdrawals')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold animate-pulse cursor-pointer"
                title={`${pendingDeposits} Pending Deposits, ${pendingWithdrawals} Pending Withdrawals`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{totalPending} {lang === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}</span>
              </button>
            )}

            {/* Quick Switch to Customer View */}
            <button
              onClick={() => {
                setCurrentRoleView('customer');
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.customerPanel}</span>
            </button>

            {/* Logout Admin */}
            <button
              onClick={logoutAdmin}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white transition-colors cursor-pointer"
              title="Admin Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(lang === 'bn' ? 'en' : 'bn')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Language"
            >
              <Languages className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

