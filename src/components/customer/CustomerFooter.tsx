import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Headphones,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  Lock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const CustomerFooter: React.FC<Props> = ({ setActiveTab }) => {
  const { t, lang, settings } = useApp();

  return (
    <footer className="mt-12 bg-slate-900 text-slate-300 border-t border-slate-800 text-xs sm:text-sm">
      {/* Top Banner: Trust & Security Badges */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'bn' ? '১০০% নিরাপদ লেনদেন' : '100% Secure System'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ম্যানুয়াল ভেরিফিকেশন ও এনক্রিপ্টেড পেমেন্ট' : 'Direct manual TrxID verification system'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'bn' ? 'দৈনিক রিওয়ার্ড গ্যারান্টি' : 'Daily Task Rewards'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ক্যাপচা ও কুইজ সম্পন্ন করলেই ব্যালেন্স যোগ' : 'Instant balance credits upon task completion'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'bn' ? '২৪/৭ কাস্টমার সাপোর্ট' : '24/7 Helpline Support'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'হোয়াটসঅ্যাপ ও টেলিগ্রামে সরাসরি সহায়তা' : 'WhatsApp & Telegram live operator support'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              {t.appName}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'bn'
              ? 'বাংলাদেশের শীর্ষস্থানীয় বিশ্বস্ত মাইক্রো-টাস্কিং ও ক্যাশআউট প্ল্যাটফর্ম। সহজে ক্যাপচা পূরণ করে উপার্জন করুন।'
              : 'Leading trusted micro-tasking and daily earnings platform in Bangladesh with bKash, Nagad, and Rocket integration.'}
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>SSL Secured & Verified 2026</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            {lang === 'bn' ? 'দ্রুত লিঙ্ক' : 'Quick Navigation'}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {t.navDashboard}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('tasks')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {t.navTasks} (Daily CAPTCHA & Quizzes)
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('deposit')}
                className="hover:text-emerald-400 transition-colors cursor-pointer text-emerald-400 font-semibold"
              >
                {t.navDeposit} ({lang === 'bn' ? 'একাউন্ট সক্রিয়করণ' : 'Account Recharge'})
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('withdraw')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {t.navWithdraw} (bKash/Nagad Payout)
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('history')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {t.navHistory}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Policy & Rules */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            {lang === 'bn' ? 'নিয়মাবলী ও নির্দেশিকা' : 'System Guidelines'}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>
                {lang === 'bn'
                  ? `ন্যূনতম রিচার্জ: ৳${settings.minActivationAmount}`
                  : `Min. Activation: ৳${settings.minActivationAmount}`}
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>
                {lang === 'bn'
                  ? `ন্যূনতম ক্যাশআউট: ৳${settings.minWithdrawAmount}`
                  : `Min. Withdrawal: ৳${settings.minWithdrawAmount}`}
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>
                {lang === 'bn' ? 'ক্যাশআউট সময়: ৫-৩০ মিনিট' : 'Payout Time: 5-30 Mins'}
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>
                {lang === 'bn' ? 'একটি ডিভাইসে একটি একাউন্ট' : 'Single Account Policy'}
              </span>
            </li>
          </ul>
        </div>

        {/* Col 4: Official Helpdesk */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            {lang === 'bn' ? 'অফিসিয়াল যোগাযোগ' : 'Official Support'}
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{settings.customerSupportPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MessageCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{settings.customerSupportTelegram}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{settings.customerSupportEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 {t.appName} Technologies Bangladesh Ltd. All Rights Reserved.</span>
          <span className="text-[11px] text-slate-400">
            Powered by Secure Manual Payment Gateways & Micro-Task Engine
          </span>
        </div>
      </div>
    </footer>
  );
};
