import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SystemSettings } from '../../types';
import {
  Settings,
  ShieldCheck,
  Save,
  Bell,
  Phone,
  MessageCircle,
  Mail,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSystemSettings, adminPassword, changeAdminPassword, lang, t, showToast } = useApp();
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });

  // Admin password change form
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(formData);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast(lang === 'bn' ? 'নতুন পাসওয়ার্ড দুটি মিলছে না' : 'New passwords do not match', 'error');
      return;
    }
    const success = changeAdminPassword(oldPass, newPass);
    if (success) {
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Rules & Controls</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'bn' ? 'সিস্টেম পলিসি, অ্যাডমিন পাসওয়ার্ড ও সেটিংস' : 'System Rules, Admin Security & Config'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'অ্যাডমিন পাসওয়ার্ড পরিবর্তন, রিচার্জ সক্রিয়করণ থ্রেশহোল্ড ও সিস্টেম পলিসি পরিবর্তন করুন।'
              : 'Update admin credentials, activation deposit thresholds, withdrawal constraints, and announcements.'}
          </p>
        </div>
      </div>

      {/* Admin Password Change Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {lang === 'bn' ? 'অ্যাডমিন সিকিউরিটি ও পাসওয়ার্ড পরিবর্তন' : 'Admin Security & Password Management'}
              </h3>
              <p className="text-xs text-indigo-200/70">
                {lang === 'bn' ? `ডিফল্ট: User: admin | বর্তমান পাসওয়ার্ড: "${adminPassword}"` : `Default: User: admin | Current Password: "${adminPassword}"`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 bg-indigo-900/60 px-3 py-1.5 rounded-xl border border-indigo-700/50 cursor-pointer"
          >
            {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPass ? 'Hide' : 'Show'}</span>
          </button>
        </div>

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-indigo-200 mb-1">
              {lang === 'bn' ? 'বর্তমান পাসওয়ার্ড (Current)' : 'Current Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPass ? 'text' : 'password'}
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="e.g. admin1"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-indigo-500/40 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-200 mb-1">
              {lang === 'bn' ? 'নতুন পাসওয়ার্ড (New)' : 'New Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPass ? 'text' : 'password'}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-indigo-500/40 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-200 mb-1">
              {lang === 'bn' ? 'পুনরায় নতুন পাসওয়ার্ড' : 'Confirm Password'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-indigo-500/40 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              >
                {lang === 'bn' ? 'পরিবর্তন' : 'Update'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Rules Bento Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Financial & Activation Thresholds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Minimum Activation Recharge */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <label className="block text-xs font-black text-emerald-950 uppercase tracking-wide">
                Min. Activation Deposit (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                <input
                  type="number"
                  value={formData.minActivationAmount}
                  onChange={(e) => setFormData({ ...formData, minActivationAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-emerald-300 bg-white font-black text-lg text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Customer account activates automatically once their approved deposit reaches this amount (Level 1).
              </p>
            </div>

            {/* Minimum Withdrawal */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                Min. Withdrawal Limit (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                <input
                  type="number"
                  value={formData.minWithdrawAmount}
                  onChange={(e) => setFormData({ ...formData, minWithdrawAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Minimum Earning Balance required before a user can submit a withdrawal request.
              </p>
            </div>

            {/* Max Withdrawal */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                Max. Single Withdrawal (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                <input
                  type="number"
                  value={formData.maxWithdrawAmount}
                  onChange={(e) => setFormData({ ...formData, maxWithdrawAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Safety ceiling per withdrawal submission to prevent rapid liquidity drain.
              </p>
            </div>

            {/* Referral Commission % */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <label className="block text-xs font-black text-amber-950 uppercase tracking-wide">
                Referral Bonus (% on 1st Deposit)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-amber-600">%</span>
                <input
                  type="number"
                  value={formData.referralBonusPercent || 5}
                  onChange={(e) => setFormData({ ...formData, referralBonusPercent: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-amber-300 bg-white font-black text-lg text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                Referrer earns this percentage from the referee's 1st approved deposit. Credited directly as Fixed Balance!
              </p>
            </div>
          </div>

          {/* Tiered Level-Up Milestones Grid */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-800">
                Tiered Level-Up Milestones (Cumulative Fixed Deposit Balance)
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-emerald-700">Level 1 (General)</div>
                <div className="text-xs text-slate-500">৳{formData.level1Threshold || 500}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-slate-700">Level 2 (Silver)</div>
                <div className="text-xs text-slate-500">৳{formData.level2Threshold || 1000} (+৳500)</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-amber-700">Level 3 (Gold)</div>
                <div className="text-xs text-slate-500">৳{formData.level3Threshold || 3000} (+৳2,000)</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-cyan-700">Level 4 (Platinum)</div>
                <div className="text-xs text-slate-500">৳{formData.level4Threshold || 6000} (+৳3,000)</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-purple-700">Level 5 (VIP)</div>
                <div className="text-xs text-slate-500">৳{formData.level5Threshold || 10000}+</div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Notice Announcements */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>Platform Broadcast Notice</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notice Text (English)
              </label>
              <textarea
                rows={3}
                value={formData.platformNotice}
                onChange={(e) => setFormData({ ...formData, platformNotice: e.target.value })}
                className="w-full p-3 border rounded-xl text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notice Text (বাংলা)
              </label>
              <textarea
                rows={3}
                value={formData.platformNoticeBn}
                onChange={(e) => setFormData({ ...formData, platformNoticeBn: e.target.value })}
                className="w-full p-3 border rounded-xl text-xs sm:text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Customer Support Contacts */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            <Phone className="w-5 h-5 text-indigo-600" />
            <span>Customer Helpdesk & Support Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Support Helpline / WhatsApp
              </label>
              <input
                type="text"
                value={formData.customerSupportPhone}
                onChange={(e) => setFormData({ ...formData, customerSupportPhone: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telegram Channel / Bot
              </label>
              <input
                type="text"
                value={formData.customerSupportTelegram}
                onChange={(e) => setFormData({ ...formData, customerSupportTelegram: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                value={formData.customerSupportEmail}
                onChange={(e) => setFormData({ ...formData, customerSupportEmail: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs sm:text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save System Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

