import React from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationBellModal } from '../common/NotificationBellModal';
import {
  Wallet,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Bell
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const CustomerNavbar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const { currentUser, t, lang, setLanguage, settings } = useApp();

  const isAccountActive = currentUser.status === 'active';
  const navItems = [
    { id: 'dashboard', label: t.navDashboard },
    { id: 'tasks', label: t.navTasks, badge: 'Daily' },
    { id: 'deposit', label: t.navDeposit, highlight: true },
    { id: 'withdraw', label: t.navWithdraw },
    { id: 'history', label: t.navHistory },
    { id: 'profile', label: t.navProfile },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="block text-[11px] font-medium text-slate-500 -mt-1">
                  {t.appTagline}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions: Account Status, Balance Pill, Quick Deposit */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Zone & Account Status Badge */}
            {currentUser.zone && (
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200"
                title={`Active Zone: ${currentUser.zone}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{currentUser.zone}</span>
              </div>
            )}

            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isAccountActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={isAccountActive ? 'Account is fully active' : `Requires ৳${settings.minActivationAmount} deposit to activate`}
            >
              {isAccountActive ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.active}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.inactive}</span>
                </>
              )}
            </div>

            {/* Balance Pill */}
            <div
              onClick={() => setActiveTab('deposit')}
              className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer hover:bg-slate-800 transition-colors"
              title="Click to Deposit"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <div className="flex items-baseline gap-1">
                <span className="text-slate-400 text-xs">{settings.currencySymbol}</span>
                <span className="tracking-tight text-emerald-400 font-extrabold text-sm sm:text-base">
                  {(currentUser.balance || 0).toLocaleString()}
                </span>
              </div>
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400/80 hidden sm:inline" />
            </div>

            {/* Quick Recharge button on desktop */}
            <button
              onClick={() => setActiveTab('deposit')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs shadow-emerald-600/20 cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{t.rechargeNow}</span>
            </button>

            {/* Notification Bell Dropdown */}
            <NotificationBellModal variant="customer" onNavigateTab={setActiveTab} />

            {/* User Profile Mini Tab Trigger */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-1.5 rounded-xl border transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:bg-slate-100'
              }`}
              title={currentUser.name || 'User'}
            >
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
