import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_ZONES } from '../../utils/mockData';
import {
  UserPlus,
  LogIn,
  Phone,
  Lock,
  User as UserIcon,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface Props {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
  onAuthSuccess?: () => void;
}

export const CustomerAuth: React.FC<Props> = ({ initialMode = 'login', onSuccess, onAuthSuccess }) => {
  const { registerCustomer, loginCustomer, lang, t } = useApp();

  const handleSuccessTrigger = () => {
    if (onAuthSuccess) onAuthSuccess();
    if (onSuccess) onSuccess();
  };

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [zone, setZone] = useState<string>('Dhaka');
  const [referralCode, setReferralCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedZoneObj = AVAILABLE_ZONES.find(z => z.id === zone) || AVAILABLE_ZONES[0];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage(lang === 'bn' ? 'দয়া করে আপনার নাম লিখুন' : 'Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage(lang === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)' : 'Please enter a valid 11-digit mobile number');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে' : 'Password must be at least 4 characters');
      return;
    }

    setIsSubmitting(true);
    const res = registerCustomer(name.trim(), phone.trim(), password, zone, referralCode.trim());
    setIsSubmitting(false);

    if (res.success) {
      handleSuccessTrigger();
    } else {
      setErrorMessage(res.message || (lang === 'bn' ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' : 'Registration failed'));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phone.trim()) {
      setErrorMessage(lang === 'bn' ? 'দয়া করে মোবাইল নম্বর দিন' : 'Please enter your mobile number');
      return;
    }
    if (!password) {
      setErrorMessage(lang === 'bn' ? 'দয়া করে পাসওয়ার্ড দিন' : 'Please enter your password');
      return;
    }

    setIsSubmitting(true);
    const success = loginCustomer(phone.trim(), password);
    setIsSubmitting(false);

    if (success) {
      handleSuccessTrigger();
    } else {
      setErrorMessage(t.invalidCredentials);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 sm:my-10 px-4">
      {/* Container Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-3 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {mode === 'register' ? t.registerTitle : t.loginTitle}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {mode === 'register' ? t.registerSubtitle : t.loginSubtitle}
          </p>

          {/* Mode Switch Tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.loginNow}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.signUpNow}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'register' ? (
            /* =========================================================================
               CUSTOMER REGISTRATION FORM
               ========================================================================= */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.name} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* 2. Mobile Number (Phone) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.phone} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* 3. Password */}
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
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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

              {/* 4. Zone Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{t.zoneLabel} <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{lang === 'bn' ? 'সক্রিয় আর্নিং জোন' : 'Active Working Zone'}</span>
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-emerald-300 bg-emerald-50/40 text-emerald-950 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    {AVAILABLE_ZONES.map((z) => (
                      <option key={z.id} value={z.id} className="text-slate-800 font-semibold py-1">
                        {lang === 'bn' ? z.nameBn : z.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active Zone Notice Card */}
                <div className="mt-2.5 p-3 rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-900 text-xs leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        {lang === 'bn' 
                          ? 'আমাদের সকল জোনেই মাইক্রো-টাস্ক ও দৈনিক উপার্জন কার্যক্রম বর্তমানে সক্রিয় ও পরিচালিত হচ্ছে।' 
                          : 'Micro-task earning operations are fully active and operational across all zones.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Referral Code (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.referralCodeOptional}
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="যেমন: TASK2026"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 uppercase transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{t.signUpNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* =========================================================================
               CUSTOMER LOGIN FORM (Phone & Password Only)
               ========================================================================= */
            <form onSubmit={handleLogin} className="space-y-4">
              {/* 1. Mobile Number (Phone) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.phone} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* 2. Password */}
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
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{t.loginNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>{t.dontHaveAccount} </span>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                >
                  {t.signUpNow}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
