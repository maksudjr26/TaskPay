import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, Languages, ArrowRightLeft, Sparkles } from 'lucide-react';

export const TopBarSwitcher: React.FC = () => {
  const { currentRoleView, setCurrentRoleView, currentUser, users, quickSwitchUser, lang, setLanguage } = useApp();

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-3 sm:px-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 select-none">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Role Switcher:</span>
        </span>
        
        {/* Toggle between Customer & Admin */}
        <div className="inline-flex items-center p-0.5 bg-slate-800 rounded-lg border border-slate-700">
          <button
            onClick={() => {
              setCurrentRoleView('customer');
              if (currentUser.role === 'admin') {
                // switch to first customer
                quickSwitchUser('user_1');
              }
            }}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              currentRoleView === 'customer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </button>

          <button
            onClick={() => {
              setCurrentRoleView('admin');
              quickSwitchUser('admin_1');
            }}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              currentRoleView === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick User Picker */}
        {currentRoleView === 'customer' && (
          <div className="flex items-center gap-1 text-slate-300">
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <select
              value={currentUser.id}
              onChange={(e) => quickSwitchUser(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === 'admin' ? 'Admin' : u.status === 'active' ? 'Active ৳' + u.balance : 'Inactive ৳' + u.balance})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(lang === 'bn' ? 'en' : 'bn')}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors font-medium"
          title="Toggle Language"
        >
          <Languages className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'bn' ? 'EN (English)' : 'বাং (বাংলা)'}</span>
        </button>
      </div>
    </div>
  );
};
