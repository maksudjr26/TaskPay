import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  User as UserIcon,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface Props {
  onSuccess?: () => void;
}

export const AdminAuth: React.FC<Props> = ({ onSuccess }) => {
  const { loginAdmin, lang, t } = useApp();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage(lang === 'bn' ? 'ইউজারনেম লিখুন' : 'Enter admin username');
      return;
    }
    if (!password) {
      setErrorMessage(lang === 'bn' ? 'পাসওয়ার্ড লিখুন' : 'Enter admin password');
      return;
    }

    setIsSubmitting(true);
    const success = loginAdmin(username.trim(), password);
    setIsSubmitting(false);

    if (success) {
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(lang === 'bn' ? 'ইউজারনেম বা পাসওয়ার্ড সঠিক নয়' : 'Invalid admin credentials');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 sm:my-14 px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {t.adminLoginTitle}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {t.adminLoginSubtitle}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Admin Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.adminUsername} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onPaste={(e) => {
                    const text = e.clipboardData.getData('text');
                    if (text) setUsername(text.trim());
                  }}
                  placeholder={t.adminUsernamePlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* 2. Admin Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.password} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onPaste={(e) => {
                    const text = e.clipboardData.getData('text');
                    if (text) setPassword(text.trim());
                  }}
                  placeholder={lang === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড লিখুন' : 'Enter admin password'}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-900 text-white font-bold text-sm shadow-md hover:from-indigo-500 hover:to-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{lang === 'bn' ? 'অ্যাডমিন প্যানেলে লগইন করুন' : 'Authenticate & Enter Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
