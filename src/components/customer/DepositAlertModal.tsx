import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  X,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Gift
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDepositClick: () => void;
  featureName?: string;
  featureNameBn?: string;
}

export const DepositAlertModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDepositClick,
  featureName = 'Daily Tasks & Earning',
  featureNameBn = 'দৈনিক টাস্ক ও ইনকাম'
}) => {
  const { lang, settings, currentUser } = useApp();

  if (!isOpen) return null;

  const minAmount = settings.minActivationAmount || 500;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center relative overflow-hidden transform animate-scaleUp">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close / বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock / Alert Graphic */}
        <div className="relative mx-auto w-20 h-20 mb-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
            <Lock className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-600 text-white border-2 border-white flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          {lang === 'bn' ? 'অ্যাকাউন্ট অ্যাক্টিভেশন আবশ্যক!' : 'Account Activation Required!'}
        </h3>

        {/* Subtitle / Notice */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'bn' ? `ন্যূনতম ৳${minAmount} ডিপোজিট প্রয়োজন` : `Minimum ৳${minAmount} Deposit Required`}</span>
        </div>

        {/* Description Box */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5 text-xs sm:text-sm text-slate-600">
          <p className="font-medium text-slate-800 leading-relaxed">
            {lang === 'bn' ? (
              <>
                নতুন অ্যাকাউন্ট তৈরি করার পর <strong>{featureNameBn}</strong> সহ প্ল্যাটফর্মের সকল সুবিধা ব্যবহার করতে ন্যূনতম <strong className="text-emerald-700 font-black">৳{minAmount}/-</strong> রিচার্জ করে অ্যাকাউন্ট সক্রিয় করতে হবে।
              </>
            ) : (
              <>
                After creating your account, you must deposit at least <strong className="text-emerald-700 font-black">৳{minAmount}</strong> to unlock <strong>{featureName}</strong> and activate daily high-reward task earnings.
              </>
            )}
          </p>

          <ul className="space-y-1.5 pt-1 text-xs text-slate-700 font-semibold">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'bn' ? 'দৈনিক আনলিমিটেড টাস্ক অ্যাক্সেস' : 'Daily Task Access Unlocked'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'bn' ? 'টাস্ক ও রেফারেল রিওয়ার্ড প্রত্যাহার' : 'Instant Withdrawal Eligibility'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'bn' ? '১০০% আসল ব্যালেন্স সুরক্ষিত থাকবে' : '100% Secure & Retained Deposit'}</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {lang === 'bn' ? 'পরে করব' : 'Later'}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onDepositClick();
            }}
            className="flex-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {lang === 'bn' ? `এখনই ৳${minAmount} ডিপোজিট করুন` : `Deposit ৳${minAmount} Now`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
