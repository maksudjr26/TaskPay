import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, CheckSquare, PlusCircle, ArrowUpRight, History, User, Lock } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAccountActive?: boolean;
}

export const CustomerBottomNav: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  isAccountActive: isAccountActiveProp
}) => {
  const { t, currentUser, settings } = useApp();

  const isAccountActive =
    isAccountActiveProp !== undefined
      ? isAccountActiveProp
      : currentUser.status === 'active' ||
        (currentUser.depositBalance ?? 0) >= (settings.minActivationAmount || 500) ||
        (currentUser.totalDeposited ?? 0) >= (settings.minActivationAmount || 500);

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'tasks', label: t.navTasks, icon: CheckSquare, isLocked: !isAccountActive },
    { id: 'deposit', label: t.navDeposit, icon: PlusCircle, isCenter: true },
    { id: 'withdraw', label: t.navWithdraw, icon: ArrowUpRight, isLocked: !isAccountActive },
    { id: 'history', label: t.navHistory, icon: History },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center -mt-5 group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-emerald-500/30'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/20'
                  }`}
                >
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-emerald-700">
                  {t.navDeposit}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors relative cursor-pointer ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.isLocked && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Lock className="w-2 h-2" />
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
