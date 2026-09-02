import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationBellModal } from '../common/NotificationBellModal';
import { UserTierBadge } from '../common/UserTierBadge';
import {
  Wallet,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Bell,
  Lock,
  Settings,
  Gift,
  KeyRound,
  Crown,
  LogOut,
  ChevronDown,
  User,
  MapPin,
  Camera
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAccountActive?: boolean;
}

export const CustomerNavbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  isAccountActive: isAccountActiveProp
}) => {
  const { currentUser, t, lang, settings, logoutCustomer } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAccountActive =
    isAccountActiveProp !== undefined
      ? isAccountActiveProp
      : currentUser.status === 'active' ||
        (currentUser.depositBalance ?? 0) >= (settings.minActivationAmount || 500) ||
        (currentUser.totalDeposited ?? 0) >= (settings.minActivationAmount || 500);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const navItems = [
    { id: 'dashboard', label: t.navDashboard },
    { id: 'tasks', label: t.navTasks, badge: isAccountActive ? 'Daily' : 'Lock ৳500', isLocked: !isAccountActive },
    { id: 'deposit', label: t.navDeposit, highlight: true },
    { id: 'withdraw', label: t.navWithdraw, isLocked: !isAccountActive },
    { id: 'history', label: t.navHistory },
    { id: 'profile', label: t.navProfile },
  ];

  const handleOpenProfileSubTab = (tab: string) => {
    setActiveTab(tab);
    setShowProfileMenu(false);
  };

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
                    {item.isLocked && (
                      <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          item.isLocked
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
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

            {/* User Profile Avatar with Dropdown Menu Trigger & Badge Under Photo */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(prev => !prev)}
                className={`p-1 rounded-2xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  showProfileMenu || activeTab === 'profile'
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-100'
                }`}
                title={currentUser.name || 'User Profile'}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Popover Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* Menu Header with Photo & BADGE UNDER PHOTO */}
                  <div className="px-4 pb-3.5 border-b border-slate-100 flex flex-col items-center text-center">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/80 shadow-md mb-1.5"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-md mb-1.5">
                        {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                      </div>
                    )}

                    {/* BADGE STRICTLY UNDER THE PROFILE PHOTO */}
                    <div className="my-1.5">
                      <UserTierBadge tier={currentUser.userType || 'General'} size="xs" showPerkText lang={lang} />
                    </div>

                    <div className="font-extrabold text-sm text-slate-900 mt-0.5">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{currentUser.phone}</div>

                    {/* Balance quick overview */}
                    <div className="w-full mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-1 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">{lang === 'bn' ? 'ফিক্সড ব্যালেন্স' : 'Fixed Deposit'}</span>
                        <span className="font-bold text-blue-700">৳{(currentUser.depositBalance || 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{lang === 'bn' ? 'টাস্ক আর্নিং' : 'Task Earning'}</span>
                        <span className="font-bold text-emerald-700">৳{(currentUser.taskBalance || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Menu List */}
                  <div className="px-2 py-2 space-y-1">
                    <button
                      onClick={() => handleOpenProfileSubTab('profile')}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Settings className="w-3.5 h-3.5" />
                      </div>
                      <span>{lang === 'bn' ? 'একাউন্ট সেটিংস ও তথ্য' : 'Account Settings'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenProfileSubTab('profile')}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-between transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Gift className="w-3.5 h-3.5" />
                        </div>
                        <span>{lang === 'bn' ? 'রেফারেল ও ইনভাইট' : 'Referral & 5% Bonus'}</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                        {currentUser.referralCode || 'TASK10'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleOpenProfileSubTab('profile')}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <KeyRound className="w-3.5 h-3.5" />
                      </div>
                      <span>{lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenProfileSubTab('profile')}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Crown className="w-3.5 h-3.5" />
                      </div>
                      <span>{lang === 'bn' ? 'টিয়ার সুবিধা ও বিবরণ' : 'Membership Tier Perks'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('deposit');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <PlusCircle className="w-3.5 h-3.5" />
                      </div>
                      <span>{lang === 'bn' ? 'ডিপোজিট / রিচার্জ করুন' : 'Recharge & Deposit'}</span>
                    </button>
                  </div>

                  {/* Menu Footer with Logout */}
                  <div className="px-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logoutCustomer();
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                        <LogOut className="w-3.5 h-3.5" />
                      </div>
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
