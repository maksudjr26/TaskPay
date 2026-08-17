import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  ClipboardCheck,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Settings,
  BarChart3,
  LogOut,
  Sparkles
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<Props> = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { t, deposits, withdrawals, submissions, setCurrentRoleView, quickSwitchUser } = useApp();

  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

  const menuItems = [
    { id: 'admin_dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'admin_users', label: t.navAdminUsers, icon: Users },
    { id: 'admin_tasks', label: t.navAdminTasks, icon: CheckSquare },
    { id: 'admin_submissions', label: t.navAdminSubmissions, icon: ClipboardCheck },
    { id: 'admin_deposits', label: t.navAdminDeposits, icon: ArrowDownLeft, badge: pendingDeposits },
    { id: 'admin_withdrawals', label: t.navAdminWithdrawals, icon: ArrowUpRight, badge: pendingWithdrawals },
    { id: 'admin_payments', label: t.navAdminPayments, icon: CreditCard },
    { id: 'admin_settings', label: t.navAdminSettings, icon: Settings },
    { id: 'admin_reports', label: t.navAdminReports, icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
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

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-2">
          <div className="flex items-center justify-between">
            <span>Admin v2.5 Enterprise</span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>
          <button
            onClick={() => {
              setCurrentRoleView('customer');
              quickSwitchUser('user_1');
            }}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.switchRole} ({t.customerPanel})</span>
          </button>
        </div>
      </aside>
    </>
  );
};
