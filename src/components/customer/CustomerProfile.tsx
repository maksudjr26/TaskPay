import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserTierBadge, TIER_CONFIG } from '../common/UserTierBadge';
import { DEPOSIT_PACKAGES } from '../../utils/mockData';
import { UserTier, ZoneType } from '../../types';
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
  VolumeX,
  Camera,
  Settings,
  KeyRound,
  Gift,
  HelpCircle,
  ChevronRight,
  Edit3,
  X
} from 'lucide-react';

const PRESET_AVATARS = [
  { id: 'av1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Pro Portrait' },
  { id: 'av2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Executive' },
  { id: 'av3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', label: 'Creative' },
  { id: 'av4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: 'Tech Pro' },
  { id: 'av5', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', label: 'Manager' },
  { id: 'av6', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', label: 'Avatar 3D' },
  { id: 'av7', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', label: 'Analyst' },
  { id: 'av8', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', label: 'Investor' }
];

interface Props {
  setActiveTab?: (tab: string) => void;
  initialSubTab?: 'settings' | 'referral' | 'password' | 'tier' | 'support';
}

export const CustomerProfile: React.FC<Props> = ({ setActiveTab, initialSubTab = 'settings' }) => {
  const {
    currentUser,
    t,
    lang,
    setLanguage,
    settings,
    changeUserPassword,
    updateUserProfile,
    showToast,
    logoutCustomer,
    notificationPreferences,
    updateNotificationPreferences
  } = useApp();

  const [activeMenu, setActiveMenu] = useState<'settings' | 'referral' | 'password' | 'tier' | 'support'>(initialSubTab);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Edit user info state
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [editZone, setEditZone] = useState<ZoneType | string>(currentUser.zone || 'Dhaka');
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Password fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  const referralCode = currentUser.referralCode || 'TASK10';
  const currentTier: UserTier = currentUser.userType || 'General';
  const isInactive = currentUser.status === 'inactive';

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedRef(true);
    showToast(lang === 'bn' ? 'রেফারেল কোড কপি হয়েছে!' : 'Referral code copied!', 'info');
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast(lang === 'bn' ? 'নাম খালি রাখা যাবে না' : 'Name cannot be empty', 'error');
      return;
    }
    updateUserProfile(currentUser.id, {
      name: editName.trim(),
      email: editEmail.trim() || undefined,
      zone: editZone
    });
    setIsEditingInfo(false);
  };

  const handleSelectAvatar = (url: string) => {
    updateUserProfile(currentUser.id, { avatar: url });
    setShowAvatarPicker(false);
    showToast(lang === 'bn' ? 'প্রোফাইল ছবি সফলভাবে পরিবর্তন হয়েছে!' : 'Profile photo updated!', 'success');
  };

  const handleCustomAvatarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAvatarUrl.trim()) return;
    handleSelectAvatar(customAvatarUrl.trim());
    setCustomAvatarUrl('');
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

  const menuItems = [
    {
      id: 'settings',
      label: lang === 'bn' ? 'একাউন্ট সেটিংস' : 'Account Settings',
      icon: Settings,
      desc: lang === 'bn' ? 'নাম, ইমেইল, জোন ও অ্যালার্ট' : 'Profile info, zone & alerts'
    },
    {
      id: 'referral',
      label: lang === 'bn' ? 'রেফারেল প্রোগ্রাম' : 'Referral Program',
      icon: Gift,
      desc: lang === 'bn' ? '৫% বোনাস কোড ও ইনভাইট' : '5% commission & friend invites',
      highlight: true
    },
    {
      id: 'password',
      label: lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password',
      icon: KeyRound,
      desc: lang === 'bn' ? 'নিরাপত্তা ও লগইন পাসওয়ার্ড' : 'Security credentials'
    },
    {
      id: 'tier',
      label: lang === 'bn' ? 'মেম্বারশিপ ও টিয়ার' : 'Membership & Tiers',
      icon: Crown,
      desc: lang === 'bn' ? 'টিয়ার লেভেল ও রিওয়ার্ড মাল্টিপ্লায়ার' : 'Tier badges & perks'
    },
    {
      id: 'support',
      label: lang === 'bn' ? 'হেল্প ও সাপোর্ট' : 'Help & Support',
      icon: Headphones,
      desc: lang === 'bn' ? '২৪/৭ গ্রাহক সেবা ও হেল্পলাইন' : '24/7 hotline & live chat'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Profile Hero Section with Photo & BADGE UNDER PHOTO */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Profile Photo / Avatar with Edit Trigger & BADGE STRICTLY UNDER IT */}
            <div className="flex flex-col items-center shrink-0">
              <div
                onClick={() => setShowAvatarPicker(true)}
                className="relative group cursor-pointer"
                title={lang === 'bn' ? 'প্রোফাইল ছবি পরিবর্তন করতে ক্লিক করুন' : 'Click to change profile picture'}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-24 h-24 rounded-3xl object-cover border-2 border-emerald-400/80 shadow-md group-hover:opacity-90 transition-all"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                )}
                
                {/* Camera / Edit Overlay Badge */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAvatarPicker(true);
                  }}
                  className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white shadow-md border-2 border-white transition-colors cursor-pointer"
                  title="Change avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* BADGE UNDER PROFILE PHOTO AS REQUESTED */}
              <div className="mt-3 flex flex-col items-center">
                <UserTierBadge tier={currentTier} size="sm" showPerkText lang={lang} />
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="space-y-2 mt-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {currentUser.name}
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
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

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-slate-800 font-mono">{currentUser.phone}</strong>
                </span>

                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-100 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {t.zoneLabel}: {currentUser.zone || 'Dhaka'}
                </span>

                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {t.joinedSince}: {currentUser.joinedDate}
                </span>
              </div>

              {/* Balances Mini Row */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <div className="bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700">
                  <span className="text-slate-500 text-[11px] mr-1.5">{lang === 'bn' ? 'ফিক্সড ডিপোজিট:' : 'Fixed Deposit:'}</span>
                  <span className="font-extrabold text-blue-700">৳{(currentUser.depositBalance || 0).toLocaleString()}</span>
                </div>
                <div className="bg-emerald-50 px-3 py-1.5 rounded-xl text-emerald-900">
                  <span className="text-emerald-700 text-[11px] mr-1.5">{lang === 'bn' ? 'টাস্ক আর্নিং:' : 'Task Earning:'}</span>
                  <span className="font-extrabold text-emerald-700">৳{(currentUser.taskBalance || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Header Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'bn' ? 'ছবি পরিবর্তন' : 'Change Avatar'}</span>
            </button>

            <button
              onClick={logoutCustomer}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive Profile Menu Tabs Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id as any)}
                  className={`p-3 rounded-2xl text-left transition-all flex flex-col justify-between border cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-emerald-600 border border-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {item.highlight && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                          isActive ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        5% Bonus
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black leading-snug">{item.label}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Dynamic Menu Views */}

      {/* VIEW: Settings & Account Information */}
      {activeMenu === 'settings' && (
        <div className="space-y-6">
          {/* Edit Profile Info Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'ব্যক্তিগত তথ্য ও সেটিংস' : 'Personal Information & Settings'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'bn' ? 'আপনার একাউন্টের নাম, জোন ও যোগাযোগ তথ্য আপডেট করুন' : 'Update your personal name, zone, and contact info'}
                </p>
              </div>

              {!isEditingInfo ? (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'bn' ? 'তথ্য সম্পাদনা' : 'Edit Info'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingInfo(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              )}
            </div>

            {isEditingInfo ? (
              <form onSubmit={handleSaveInfo} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={currentUser.phone}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs sm:text-sm font-mono cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{lang === 'bn' ? 'নম্বর পরিবর্তন করতে সাপোর্টে যোগাযোগ করুন' : 'Phone is locked for security'}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'bn' ? 'কাজের জোন / Working Zone' : 'Working Zone'}
                    </label>
                    <select
                      value={editZone}
                      onChange={(e) => setEditZone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="Dhaka">Dhaka (ঢাকা)</option>
                      <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                      <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                      <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                      <option value="Khulna">Khulna (খুলনা)</option>
                      <option value="Sylhet">Sylhet (সিলেট)</option>
                      <option value="Barisal">Barisal (বরিশাল)</option>
                      <option value="Rongpur">Rongpur (রংপুর)</option>
                      <option value="Gazipur">Gazipur (গাজীপুর)</option>
                      <option value="Narayanganj">Narayanganj (নারায়ণগঞ্জ)</option>
                      <option value="Comilla">Comilla (কুমিল্লা)</option>
                      <option value="All Zones">All Zones</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {lang === 'bn' ? 'তথ্য সংরক্ষণ করুন' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block mb-1">{lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}</span>
                  <span className="font-bold text-slate-800 text-sm">{currentUser.name}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block mb-1">{lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}</span>
                  <span className="font-bold text-slate-800 font-mono text-sm">{currentUser.phone}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block mb-1">{lang === 'bn' ? 'সক্রিয় আর্নিং জোন' : 'Active Zone'}</span>
                  <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {currentUser.zone || 'Dhaka'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Notifications, Sound Alerts & Language Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification & Sound Alerts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'নোটিফিকেশন ও সাউন্ড অ্যালার্ট' : 'Notification & Sound Alerts'}</span>
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
                  <span>{notificationPreferences.soundEnabled ? (lang === 'bn' ? 'সাউন্ড চালু' : 'Sound ON') : (lang === 'bn' ? 'সাউন্ড বন্ধ' : 'Sound OFF')}</span>
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

            {/* Language Selection */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Languages className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'bn' ? 'ভাষা নির্বাচন / Language' : 'System Language'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'আপনার সুবিধাজনক ভাষা বেছে নিন' : 'Choose your preferred display language'}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`py-3 rounded-2xl font-bold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    lang === 'bn'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm">🇧🇩</span>
                  <span>বাংলা (Bengali)</span>
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-3 rounded-2xl font-bold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    lang === 'en'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm">🇺🇸</span>
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Referral Program (Managed by Referral Code with 5% Bonus) */}
      {activeMenu === 'referral' && (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-800/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                <Gift className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                  <span>{t.referralProgram}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    5% Instant Commission
                  </span>
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mt-0.5 leading-relaxed">
                  {lang === 'bn'
                    ? 'আপনার রেফারেল কোড ব্যবহার করে বন্ধুরা রেজিস্টার করে ১ম ডিপোজিট করলেই ৫% ক্যাশ বোনাস আপনার ফিক্সড ব্যালেন্সে জমা হবে!'
                    : 'Earn 5% instant cash bonus on your invited friends first deposit, added directly to your Fixed Balance!'}
                </p>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <div className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400 font-medium">{lang === 'bn' ? 'রেফারকৃত মেম্বার' : 'Referred Users'}</div>
                <div className="text-sm font-black text-white">{currentUser.referralCount || 0} জন</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                <div className="text-[10px] text-slate-400 font-medium">{lang === 'bn' ? 'অর্জিত ৫% বোনাস' : 'Referral Earnings'}</div>
                <div className="text-sm font-black text-emerald-400">৳{(currentUser.referralBonusEarned || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-700/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'আপনার ব্যক্তিগত রেফারেল কোড:' : 'Your Unique Referral Code:'}
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-amber-300 select-all">
                {referralCode}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyRef}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
              >
                {copiedRef ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>{lang === 'bn' ? 'কোড কপি হয়েছে!' : 'Code Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-950" />
                    <span>{lang === 'bn' ? 'রেফারেল কোড কপি করুন' : 'Copy Referral Code'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3 Step Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-2xl">
              <div className="font-bold text-amber-300 mb-1">১. কোড শেয়ার করুন</div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'bn'
                  ? 'আপনার বন্ধুদের সাথে এই রেফারেল কোডটি শেয়ার করুন।'
                  : 'Share your unique referral code with friends and family.'}
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-2xl">
              <div className="font-bold text-amber-300 mb-1">২. রেজিস্ট্রেশনে কোড ইনপুট</div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'bn'
                  ? 'বন্ধুরা একাউন্ট খোলার সময় রেফারেল কোড বক্সে আপনার কোডটি লিখবে।'
                  : 'They enter your referral code in the registration box.'}
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-2xl">
              <div className="font-bold text-emerald-400 mb-1">৩. ৫% ইনস্ট্যান্ট ফিক্সড বোনাস</div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'bn'
                  ? 'তারা প্রথম ডিপোজিট করলেই ৫% ক্যাশ বোনাস আপনার ফিক্সড ব্যালেন্সে যোগ হবে।'
                  : 'Get 5% instant bonus credited straight to your Fixed Deposit balance!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Change Password */}
      {activeMenu === 'password' && (
        <div className="max-w-xl mx-auto">
          <form onSubmit={handlePasswordChange} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Login Password'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'আপনার একাউন্টের নিরাপত্তা নিশ্চিত করতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন' : 'Keep your account secure with a strong password'}
                </p>
              </div>
            </div>

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
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              {t.updatePassword}
            </button>
          </form>
        </div>
      )}

      {/* VIEW: Membership Tier Badges & Multipliers */}
      {activeMenu === 'tier' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
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

            {setActiveTab && (
              <button
                onClick={() => setActiveTab('deposit')}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>{lang === 'bn' ? 'টিয়ার আপগ্রেড করুন' : 'Upgrade Tier Now'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* All 5 Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {DEPOSIT_PACKAGES.map((pkg) => {
              const isUserCurrent = currentTier === pkg.tier;

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
                        : (lang === 'bn' ? `মোট ৳${pkg.amount} ডিপোজিট` : `Total ৳${pkg.amount} deposit`)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: Help & Customer Care */}
      {activeMenu === 'support' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-emerald-600" />
              <span>{t.contactSupport}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'রিচার্জ, উইথড্রল অথবা টাস্ক সম্পর্কিত যে কোন প্রয়োজনে আমাদের সাপোর্ট টিম সদা প্রস্তুত।' : 'Our support team is available 24/7 for deposit, withdrawal or task queries.'}
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block">Helpline Phone:</span>
                  <span className="font-bold text-emerald-800 text-sm">{settings.customerSupportPhone}</span>
                </div>
                <a
                  href={`tel:${settings.customerSupportPhone}`}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  {lang === 'bn' ? 'কল করুন' : 'Call'}
                </a>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block">Telegram Channel:</span>
                  <span className="font-bold text-indigo-700 text-sm">{settings.customerSupportTelegram}</span>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold">
                  24/7 Live
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block">Official Email:</span>
                  <span className="font-bold text-slate-800 text-sm">{settings.customerSupportEmail}</span>
                </div>
                <span className="text-slate-400 text-xs font-medium">Official</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {lang === 'bn' ? 'প্রোফাইল ছবি নির্বাচন করুন' : 'Select Profile Photo'}
                </h3>
              </div>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar presets grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2.5">
                {lang === 'bn' ? 'জনপ্রিয় প্রোফাইল অ্যাভাটারসমূহ:' : 'Choose from Pre-designed Avatars:'}
              </label>
              <div className="grid grid-cols-4 gap-3">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => handleSelectAvatar(av.url)}
                    className="group relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold text-center p-1">
                      {av.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image URL Option */}
            <form onSubmit={handleCustomAvatarSubmit} className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                {lang === 'bn' ? 'অথবা নিজের ছবির লিংক দিন (Image URL):' : 'Or paste your custom Image URL:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shrink-0"
                >
                  {lang === 'bn' ? 'প্রয়োগ' : 'Apply'}
                </button>
              </div>
            </form>

            <button
              onClick={() => setShowAvatarPicker(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
