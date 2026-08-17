import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Share2,
  Lock,
  Headphones,
  Send,
  Languages,
  CheckCircle2,
  MapPin,
  LogOut,
  Info
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { currentUser, t, lang, setLanguage, settings, changeUserPassword, showToast, logoutCustomer } = useApp();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  const referralLink = `${window.location.origin}/?ref=${currentUser.referralCode || 'TASK10'}`;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedRef(true);
    showToast(lang === 'bn' ? 'রেফারেল লিংক কপি হয়েছে!' : 'Referral link copied!', 'info');
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass) {
      showToast(t.fillAllFields, 'error');
      return;
    }
    if (newPass.length < 4) {
      showToast(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে' : 'Password must be at least 4 chars', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      showToast(lang === 'bn' ? 'নতুন পাসওয়ার্ড দুটি মিলছে না' : 'New passwords do not match', 'error');
      return;
    }

    changeUserPassword(currentUser.id, currentPass, newPass);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const isInactive = currentUser.status === 'inactive';
  const isMymensingh = currentUser.zone === 'Mymensingh';

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentUser.name}
              </h2>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold border flex items-center gap-1 ${
                  !isInactive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {!isInactive ? (
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
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {currentUser.phone}
              </span>
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {t.zoneLabel}: {currentUser.zone || 'Mymensingh'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {t.joinedSince}: {currentUser.joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutCustomer}
          className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Zone Status Announcement Card */}
      <div className="p-5 rounded-3xl border border-emerald-200 bg-emerald-50/80 text-emerald-900 flex items-start gap-3.5 shadow-xs">
        <div className="p-2.5 rounded-2xl shrink-0 bg-emerald-200/70 text-emerald-800">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm">
              {currentUser.zone || 'Dhaka'} {lang === 'bn' ? 'জোন (সক্রিয় আর্নিং হাব)' : 'Zone (Active Working Hub)'}
            </h4>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">
              {lang === 'bn' ? 'সক্রিয় আর্নিং জোন' : 'Active Working Zone'}
            </span>
          </div>
          <p className="text-xs mt-1 leading-relaxed text-emerald-800 font-medium">
            {lang === 'bn' 
              ? 'আপনার নির্বাচিত জোনে আমাদের মাইক্রো-টাস্ক ও দৈনিক উপার্জন কার্যক্রম বর্তমানে সক্রিয় ও পরিচালিত হচ্ছে।' 
              : 'Micro-task earning and recharge operations are fully operational in your selected zone.'}
          </p>
        </div>
      </div>

      {/* Referral & Invite Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-800/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">{t.referralProgram}</h3>
            <p className="text-xs text-slate-300">{t.referralBonusInfo}</p>
          </div>
        </div>

        <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs font-mono text-indigo-300 truncate select-all">
            {referralLink}
          </div>
          <button
            onClick={handleCopyRef}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            {copiedRef ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copy}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Change Password & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password Form */}
        <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>{t.changePassword}</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.currentPassword}
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.newPassword}
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.confirmPassword}
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
          >
            {t.updatePassword}
          </button>
        </form>

        {/* Customer Care & Preferences */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-600" />
              <span>{t.contactSupport}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-600 font-medium">Helpline Phone:</span>
                <a href={`tel:${settings.customerSupportPhone}`} className="font-bold text-emerald-700">
                  {settings.customerSupportPhone}
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-600 font-medium">Telegram Channel:</span>
                <span className="font-bold text-indigo-700">{settings.customerSupportTelegram}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-600 font-medium">Email:</span>
                <span className="font-bold text-slate-800">{settings.customerSupportEmail}</span>
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>{t.appSettings} - {t.language}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage('bn')}
                className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                  lang === 'bn'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                  lang === 'en'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
