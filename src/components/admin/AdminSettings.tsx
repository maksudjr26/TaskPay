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
  CheckCircle2
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSystemSettings, lang, t, showToast } = useApp();
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(formData);
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
            {lang === 'bn' ? 'সিস্টেম পলিসি ও একাউন্ট সক্রিয়করণ কনফিগারেশন' : 'System Rules & Account Activation Config'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'ন্যূনতম রিচার্জের পরিমাণ নির্ধারণ করুন যা জমা হলে গ্রাহকের একাউন্ট স্বয়ংক্রিয়ভাবে একটিভ হবে।'
              : 'Set minimum activation deposit threshold, withdrawal constraints, and announcements.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Rules Bento Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Financial & Activation Thresholds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Customer account activates automatically once their approved deposit reaches this amount.
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
                Minimum earned balance required before a user can submit a withdrawal request.
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
