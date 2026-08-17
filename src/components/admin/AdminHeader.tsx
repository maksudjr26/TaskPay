import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminPasswordModal } from './AdminPasswordModal';
import { NotificationBellModal } from '../common/NotificationBellModal';
import {
  ShieldCheck,
  Bell,
  Languages,
  LogOut,
  KeyRound,
  LayoutDashboard,
  Users,
  CheckSquare,
  ClipboardCheck,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Settings,
  BarChart3,
  Megaphone,
  Menu,
  X
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminHeader: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const { deposits, withdrawals, lang, setLanguage, logoutAdmin, adminPassword } = useApp();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const totalPending = pendingDeposits + pendingWithdrawals;

  const navMenuItems = [
    { id: 'admin_dashboard', label: lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', icon: LayoutDashboard },
    { id: 'admin_tasks', label: lang === 'bn' ? 'টাস্ক নিয়ন্ত্রণ' : 'Tasks Manager', icon: CheckSquare },
    { id: 'admin_submissions', label: lang === 'bn' ? 'টাস্ক যাচাই' : 'Submissions', icon: ClipboardCheck },
    { id: 'admin_users', label: lang === 'bn' ? 'সদস্য ও টিয়ার' : 'Users & Tiers', icon: Users },
    { id: 'admin_deposits', label: lang === 'bn' ? 'ডিপোজিট' : 'Deposits', icon: ArrowDownLeft, badge: pendingDeposits },
    { id: 'admin_withdrawals', label: lang === 'bn' ? 'উইথড্রল' : 'Withdrawals', icon: ArrowUpRight, badge: pendingWithdrawals },
    { id: 'admin_announcements', label: lang === 'bn' ? 'ঘোষণা নিয়ন্ত্রণ' : 'Announcements', icon: Megaphone },
    { id: 'admin_payments', label: lang === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Gateways', icon: CreditCard },
    { id: 'admin_settings', label: lang === 'bn' ? 'পাসওয়ার্ড ও সেটিংস' : 'Settings', icon: Settings },
    { id: 'admin_reports', label: lang === 'bn' ? 'রিপোর্ট' : 'Reports', icon: BarChart3 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        {/* Top Tier Bar */}
        <div className="px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
          <div className="flex items-center justify-between h-14">
            {/* Logo & Admin Status */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-tight text-white">
                    TaskPay Enterprise
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                    Super Admin
                  </span>
                </div>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Center */}
              <NotificationBellModal variant="admin" onNavigateTab={setActiveTab} />

              {/* Change Password Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-200 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Change admin password"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
              </button>

              {/* Language Switch */}
              <button
                onClick={() => setLanguage(lang === 'bn' ? 'en' : 'bn')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Toggle Language"
              >
                <Languages className="w-4 h-4 text-emerald-400" />
              </button>

              {/* Logout Button */}
              <button
                onClick={logoutAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                title="Logout from Admin Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Bar (Desktop Horizontal Navigation) */}
        <div className="hidden lg:block px-4 sm:px-6 lg:px-8 bg-slate-950/60 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-1 py-1.5">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 ml-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-4 bg-slate-950 border-b border-slate-800 space-y-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Password Change Modal */}
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};
