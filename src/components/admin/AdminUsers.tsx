import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { AVAILABLE_ZONES } from '../../utils/mockData';
import { UserTierBadge } from '../common/UserTierBadge';
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  DollarSign,
  Phone,
  Calendar,
  X,
  MapPin,
  Crown
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, toggleUserStatus, adjustUserBalance, t, lang, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  
  // Balance Adjust Modal
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustReason, setAdjustReason] = useState('');

  const customerList = users.filter(u => u.role === 'customer');

  const filteredUsers = customerList.filter(user => {
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    if (zoneFilter !== 'all' && (user.zone || 'Mymensingh') !== zoneFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q);
      const matchPhone = user.phone.includes(q);
      const matchZone = (user.zone || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchZone;
    }

    return true;
  });

  const handleBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBalance) return;
    const num = parseFloat(adjustAmount);
    if (!num || num <= 0) return;

    adjustUserBalance(selectedUserForBalance.id, num, adjustType, adjustReason || 'Manual adjustment');
    setSelectedUserForBalance(null);
    setAdjustAmount('');
    setAdjustReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.customerManagement}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'bn' ? `মোট রেজিস্টার্ড কাস্টমার: ${customerList.length} জন (সকল জোনে একাউন্ট ও আর্নিং সক্রিয়)` : `Total Registered Customers: ${customerList.length} (Active across all zones)`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Zone Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none px-2 py-1 cursor-pointer"
            >
              <option value="all">{lang === 'bn' ? 'সকল জোন (All Zones)' : 'All Zones'}</option>
              {AVAILABLE_ZONES.map(z => (
                <option key={z.id} value={z.id}>
                  {z.id} 🟢 (Active)
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', 'active', 'inactive'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st === 'all' ? t.allStatus : st === 'active' ? t.active : t.inactive}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchUsers}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Users Table / Card Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-700 text-base">
              {lang === 'bn' ? 'কোনো কাস্টমার পাওয়া যায়নি' : 'No registered customers found'}
            </h4>
            <p className="text-xs max-w-sm mx-auto text-slate-400">
              {lang === 'bn' ? 'কাস্টমার প্যানেলে গিয়ে নতুন মোবাইল নম্বর, পাসওয়ার্ড, নাম ও জোন দিয়ে রেজিস্ট্রেশন করতে পারেন।' : 'Switch to Customer Panel to register with phone number, password, name, and zone.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Customer Info</th>
                  <th className="px-4 py-4">Tier Badge</th>
                  <th className="px-4 py-4">Zone (অঞ্চল)</th>
                  <th className="px-4 py-4">Account Status</th>
                  <th className="px-4 py-4">Balance</th>
                  <th className="px-4 py-4">Deposited / Earned</th>
                  <th className="px-4 py-4">Tasks</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isActive = user.status === 'active';
                  const isMymensingh = (user.zone || 'Mymensingh') === 'Mymensingh';
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* User Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="px-4 py-4">
                        <UserTierBadge tier={user.userType || 'General'} size="xs" lang={lang} />
                      </td>

                      {/* Zone Column */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{user.zone || 'Dhaka'}</span>
                          <span className="text-[9px] font-semibold text-emerald-700">
                            (Active)
                          </span>
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle status"
                        >
                          {isActive ? (
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
                        </button>
                      </td>

                      {/* Balance */}
                      <td className="px-4 py-4 font-black text-slate-900">
                        {settings.currencySymbol}{user.balance.toLocaleString()}
                      </td>

                      {/* Deposited / Earned */}
                      <td className="px-4 py-4 text-xs text-slate-600">
                        <div>Dep: <span className="font-bold text-emerald-700">৳{user.totalDeposited || 0}</span></div>
                        <div>Earned: <span className="font-bold text-slate-800">৳{user.totalEarned || 0}</span></div>
                      </td>

                      {/* Tasks Completed */}
                      <td className="px-4 py-4 font-bold text-slate-700">
                        {user.tasksCompletedCount || 0}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedUserForBalance(user)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{t.adjustBalance}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Balance Adjust Modal */}
      {selectedUserForBalance && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <span>{t.adjustBalanceModalTitle}</span>
              </h3>
              <button
                onClick={() => setSelectedUserForBalance(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-500">Customer:</span>{' '}
              <strong className="text-slate-900">{selectedUserForBalance.name}</strong> ({selectedUserForBalance.phone})
              <div className="mt-1 text-slate-500">
                Current Balance: <strong className="text-emerald-700 font-black">৳{selectedUserForBalance.balance}</strong>
              </div>
            </div>

            <form onSubmit={handleBalanceSubmit} className="space-y-4">
              {/* Type Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    adjustType === 'add' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addBalance}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('deduct')}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    adjustType === 'deduct' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>{t.deductBalance}</span>
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.amount} (৳)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold outline-none focus:border-indigo-500"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason / Description
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g., Manual deposit bonus / Adjustment"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBalance(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
