import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserTierBadge, TIER_CONFIG } from '../common/UserTierBadge';
import { DEPOSIT_PACKAGES } from '../../utils/mockData';
import { UserTier } from '../../types';
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
  Info,
  Crown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Props {
  setActiveTab?: (tab: string) => void;
}

export const CustomerProfile: React.FC<Props> = ({ setActiveTab }) => {
  const {
    currentUser,
    t,
    lang,
    setLanguage,
    settings,
    changeUserPassword,
    showToast,
    logoutCustomer,
    notificationPreferences,
    updateNotificationPreferences
  } = useApp();

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
  const currentTier: UserTier = currentUser.userType || 'General';

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <UserTierBadge tier={currentTier} size="xs" lang={lang} />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentUser.name}
              </h2>
              <UserTierBadge tier={currentTier} size="sm" showPerkText lang={lang} />
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
                {t.zoneLabel}: {currentUser.zone || 'Dhaka'}
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

      {/* User Tier & Promoting Levels Showcase Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'bn' ? 'মেম্বারশিপ লেভেল ও প্রমোশন' : 'Tier Badges & Promotion System'}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {lang === 'bn' ? 'ইউজার টাইপ ও বিশেষ সুবিধাসমূহ' : 'User Types & Tier Benefits'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn'
                ? 'ডিপোজিটের মাধ্যমে মেম্বারশিপ লেভেল আপগ্রেড করে প্রতিটি টাস্কে দ্বিগুণ পর্যন্ত রিওয়ার্ড উপভোগ করুন।'
                : 'Upgrade your tier via fixed package deposit to boost task rewards up to 2.0x.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('deposit')}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>{lang === 'bn' ? 'টিয়ার আপগ্রেড করুন' : 'Upgrade Tier Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* All 5 Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {DEPOSIT_PACKAGES.map((pkg) => {
            const isUserCurrent = currentTier === pkg.tier;
            const config = TIER_CONFIG[pkg.tier];
            const Icon = config.icon;

            return (
              <div
                key={pkg.id}
                className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  isUserCurrent
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/50'
                }`}
              >
                {isUserCurrent && (
                  <div className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase">
                    {lang === 'bn' ? 'আপনার বর্তমান ব্যাজ' : 'Your Badge'}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <UserTierBadge tier={pkg.tier} size="xs" lang={lang} />
                    <span className="text-[11px] font-mono font-bold text-slate-600">
                      ৳{pkg.amount}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span>{pkg.rewardMultiplier}x {lang === 'bn' ? 'আর্নিং রেট' : 'Earn Multiplier'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {lang === 'bn' ? `দৈনিক সীমা: ${pkg.dailyTaskLimit}টি টাস্ক` : `Daily limit: ${pkg.dailyTaskLimit} tasks`}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {lang === 'bn' ? pkg.descriptionBn : pkg.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    {pkg.tier === 'General'
                      ? (lang === 'bn' ? 'শুরুর জন্য ৳৫০০ রিচার্জ' : 'First 500 deposit')
                      : (lang === 'bn' ? `আরও ৳${pkg.amount} ডিপোজিট` : `More ৳${pkg.amount} deposit`)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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

          {/* Notification Preferences Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'bn' ? 'নোটিফিকেশন ও অ্যালার্ট সেটিংস' : 'Notification Preferences'}</span>
              </h3>
              <button
                onClick={() => updateNotificationPreferences({ soundEnabled: !notificationPreferences.soundEnabled })}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  notificationPreferences.soundEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {notificationPreferences.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{notificationPreferences.soundEnabled ? (lang === 'bn' ? 'শব্দ চালু' : 'Sound ON') : (lang === 'bn' ? 'শব্দ বন্ধ' : 'Sound OFF')}</span>
              </button>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <span className="font-medium text-slate-700">{lang === 'bn' ? 'ডিপোজিট সফল / বাতিল নোটিফিকেশন' : 'Deposit Status Alerts'}</span>
                <input
                  type="checkbox"
                  checked={notificationPreferences.depositAlerts}
                  onChange={e => updateNotificationPreferences({ depositAlerts: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <span className="font-medium text-slate-700">{lang === 'bn' ? 'উইথড্রল অনুমোদন / বাতিল নোটিফিকেশন' : 'Withdrawal Status Alerts'}</span>
                <input
                  type="checkbox"
                  checked={notificationPreferences.withdrawalAlerts}
                  onChange={e => updateNotificationPreferences({ withdrawalAlerts: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <span className="font-medium text-slate-700">{lang === 'bn' ? 'দৈনিক টাস্ক বোনাস ও রিওয়ার্ড সতর্কতা' : 'Task Rewards & Tier Perk Alerts'}</span>
                <input
                  type="checkbox"
                  checked={notificationPreferences.taskRewardAlerts}
                  onChange={e => updateNotificationPreferences({ taskRewardAlerts: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>
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

