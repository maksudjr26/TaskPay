import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethodConfig, PaymentMethodCode, DepositPackage, UserTier } from '../../types';
import { DEPOSIT_PACKAGES } from '../../utils/mockData';
import { UserTierBadge } from '../common/UserTierBadge';
import {
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Building,
  Upload,
  Lock,
  Zap,
  Star,
  Award,
  Gem,
  Crown
} from 'lucide-react';

export const CustomerDeposit: React.FC = () => {
  const { paymentMethods, submitDeposit, deposits, currentUser, t, lang, settings, showToast } = useApp();
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg_general_500');
  const [selectedMethodCode, setSelectedMethodCode] = useState<PaymentMethodCode>('bkash');
  const [senderPhone, setSenderPhone] = useState<string>(currentUser.phone || '');
  const [trxId, setTrxId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPackage: DepositPackage = DEPOSIT_PACKAGES.find(p => p.id === selectedPackageId) || DEPOSIT_PACKAGES[0];
  const selectedMethod = paymentMethods.find(m => m.code === selectedMethodCode) || paymentMethods[0];

  const handleCopyNumber = () => {
    if (selectedMethod) {
      navigator.clipboard.writeText(selectedMethod.accountNumber);
      setCopied(true);
      showToast(lang === 'bn' ? 'নম্বর কপি করা হয়েছে' : 'Number copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে একটি প্যাকেজ সিলেক্ট করুন' : 'Please select a package', 'error');
      return;
    }

    if (!senderPhone.trim()) {
      showToast(lang === 'bn' ? 'প্রেরক নম্বর দিন' : 'Please enter sender phone number', 'error');
      return;
    }

    if (!trxId.trim()) {
      showToast(lang === 'bn' ? 'সঠিক Transaction ID দিন' : 'Please enter Transaction ID', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = submitDeposit(
      selectedMethodCode,
      selectedPackage.amount,
      senderPhone.trim(),
      trxId.trim(),
      selectedPackage.tier,
      lang === 'bn' ? selectedPackage.nameBn : selectedPackage.name
    );
    setIsSubmitting(false);

    if (success) {
      setTrxId('');
    }
  };

  // User's deposits
  const userDeposits = deposits.filter(d => d.userId === currentUser.id);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-teal-800/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ফিক্সড প্যাকেজ রিচার্জ ও মেম্বারশিপ আপগ্রেড' : 'Fixed Package Recharge & Tier Promotion'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {lang === 'bn' ? 'নির্ধারিত প্যাকেজ সিলেক্ট করে রিচার্জ করুন' : 'Select Fixed Package & Upgrade Your Tier'}
          </h2>

          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-2xl">
            {lang === 'bn' 
              ? 'কাস্টম অ্যামাউন্ট প্রযোজ্য নয়। আপনার পছন্দের মেম্বারশিপ প্যাকেজটি সিলেক্ট করে সঠিক ফিক্সড অ্যামাউন্ট সেন্ড মানি করুন। অ্যাডমিন অনুমোদনের সাথে সাথে আপনার একাউন্ট ও মেম্বারশিপ টিয়ার স্বয়ংক্রিয়ভাবে সক্রিয় হবে।' 
              : 'Custom deposit amounts are not accepted. Please select a fixed package below to upgrade your tier and unlock higher task rewards.'}
          </p>

          {/* Current Tier Indicator */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-300 font-semibold">{lang === 'bn' ? 'আপনার বর্তমান স্ট্যাটাস:' : 'Your Current Status:'}</span>
            <UserTierBadge tier={currentUser.userType || 'General'} size="sm" showPerkText lang={lang} />
          </div>
        </div>

        {/* Ambient Decorative glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Step 1: Fixed Packages Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black">1</span>
              <span>{lang === 'bn' ? 'মেম্বারশিপ প্যাকেজ নির্বাচন করুন (Fixed Amounts)' : 'Select Deposit Package (Fixed Amounts)'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn' ? 'প্রত্যেক প্যাকেজের সাথে রয়েছে বিশেষ রিওয়ার্ড বুস্টার ও দৈনিক টাস্ক লিমিট' : 'Each fixed package provides unique reward boosters and daily limits'}
            </p>
          </div>
          <span className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold items-center gap-1">
            <Lock className="w-3 h-3 text-amber-600" />
            {lang === 'bn' ? 'ফিক্সড রেট' : 'Fixed Amount Only'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DEPOSIT_PACKAGES.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            const isCurrentTier = (currentUser.userType || 'General') === pkg.tier;

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`relative rounded-3xl p-5 border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'border-emerald-500 bg-white ring-4 ring-emerald-500/20 shadow-lg -translate-y-1'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white hover:shadow-xs'
                }`}
              >
                {/* Popular or Current Badge */}
                {pkg.isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-400 text-amber-950 font-black text-[9px] px-3 py-0.5 rounded-bl-xl tracking-wider uppercase shadow-xs">
                    ★ Popular
                  </div>
                )}
                {isCurrentTier && (
                  <div className="absolute top-0 left-0 bg-emerald-600 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-br-xl uppercase">
                    {lang === 'bn' ? 'বর্তমান' : 'Active'}
                  </div>
                )}

                <div>
                  <div className="mt-1">
                    <UserTierBadge tier={pkg.tier} size="xs" lang={lang} />
                  </div>

                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      ৳{pkg.amount.toLocaleString()}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {pkg.rewardMultiplier}x {lang === 'bn' ? 'রিওয়ার্ড রেট' : 'Reward Rate'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                    {lang === 'bn' ? pkg.descriptionBn : pkg.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                    {(lang === 'bn' ? pkg.perksBn : pkg.perks).slice(0, 3).map((perk, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div
                    className={`w-full py-2 rounded-xl text-xs font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {isSelected ? (lang === 'bn' ? '✓ নির্বাচিত প্যাকেজ' : '✓ Selected') : (lang === 'bn' ? 'নির্বাচন করুন' : 'Select Package')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Payment Method & Deposit Submission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Method Selector & Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-black">2</span>
              <span>{t.selectMethod}</span>
            </h3>

            {/* Payment Method Pills */}
            <div className="grid grid-cols-2 gap-2.5">
              {paymentMethods.filter(m => m.active).map((pm) => {
                const isSelected = selectedMethodCode === pm.code;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedMethodCode(pm.code)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {lang === 'bn' ? pm.nameBn : pm.name}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      {lang === 'bn' ? pm.accountTypeBn : pm.accountType}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Account Info Box */}
            {selectedMethod && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {lang === 'bn' ? selectedMethod.nameBn : selectedMethod.name} ({selectedMethod.accountType})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Active Channel
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                  <div className="font-mono text-base sm:text-lg font-bold tracking-wider text-emerald-400">
                    {selectedMethod.accountNumber}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    {copied ? (
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

                {/* If Bank, show bank details */}
                {selectedMethod.bankDetails && (
                  <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                    <div><strong>Bank:</strong> {selectedMethod.bankDetails.bankName}</div>
                    <div><strong>Branch:</strong> {selectedMethod.bankDetails.branchName}</div>
                    <div><strong>A/C Holder:</strong> {selectedMethod.bankDetails.accountHolder}</div>
                    <div><strong>Routing:</strong> {selectedMethod.bankDetails.routingNumber}</div>
                  </div>
                )}
              </div>
            )}

            {/* Step-by-Step Instructions */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>{t.sendMoneyInstructions}</span>
              </h4>
              <p className="leading-relaxed font-medium">১. আপনার {selectedMethod?.name} একাউন্ট থেকে <strong>Send Money</strong> করুন।</p>
              <p className="leading-relaxed font-medium">২. প্রেরণের পরিমাণ ফিক্সড প্যাকেজ অনুযায়ী ঠিক <strong>৳{selectedPackage?.amount}</strong> টাকা হতে হবে।</p>
              <p className="leading-relaxed font-medium">৩. সফল সেন্ড মানির পর ট্রানজেকশন আইডি (TrxID) কপি করুন।</p>
              <p className="leading-relaxed text-emerald-700 font-bold">৪. নিচের ফর্মে তথ্য জমা দিলে অ্যাডমিন ভেরিফাই করে আপনার মেম্বারশিপ সক্রিয় করবে।</p>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-black">3</span>
                <span>{lang === 'bn' ? 'রিচার্জ তথ্য জমা দিন' : 'Submit Deposit Details'}</span>
              </h3>
              <UserTierBadge tier={selectedPackage?.tier} size="sm" lang={lang} />
            </div>

            {/* Selected Package Confirmation Box */}
            <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white p-4 rounded-2xl flex items-center justify-between border border-teal-900">
              <div>
                <span className="text-[11px] text-teal-300 font-bold uppercase tracking-wider block">
                  {lang === 'bn' ? 'নির্বাচিত প্যাকেজের নির্ধারিত পরিমাণ' : 'Fixed Package Amount'}
                </span>
                <span className="text-sm font-bold text-slate-200">
                  {lang === 'bn' ? selectedPackage?.nameBn : selectedPackage?.name}
                </span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ৳{selectedPackage?.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  (Fixed Package)
                </span>
              </div>
            </div>

            {/* Sender Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.senderPhone} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-900 text-sm outline-none transition-all font-medium"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {lang === 'bn' ? 'যে নম্বর থেকে টাকা পাঠানো হয়েছে' : 'The number from which money was sent'}
              </span>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.trxId} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                placeholder={t.trxIdPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-mono uppercase tracking-wider text-slate-900 text-sm font-bold outline-none transition-all"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {lang === 'bn' ? 'যেমন: BK92X88LK1 বা 7H92189' : 'e.g. BK92X88LK1 or 7H92189'}
              </span>
            </div>

            {/* Promotion Perks Summary */}
            <div className="bg-emerald-50/90 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'bn' ? 'মেম্বারশিপ সুবিধা ও প্রমোশন গ্যারান্টি:' : 'Tier Promotion Benefits:'}</span>
              </div>
              <p className="leading-relaxed font-medium">
                {lang === 'bn'
                  ? `এই ৳${selectedPackage?.amount} রিচার্জ অনুমোদিত হলে আপনি সরাসরি ${selectedPackage?.nameBn} টিয়ারে উন্নীত হবেন এবং প্রতি টাস্কে ${selectedPackage?.rewardMultiplier}x হারে রিওয়ার্ড পাবেন।`
                  : `Upon approval of this ৳${selectedPackage?.amount} recharge, your tier will be upgraded to ${selectedPackage?.tier} with a ${selectedPackage?.rewardMultiplier}x reward rate.`}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? t.loading : (lang === 'bn' ? `৳${selectedPackage?.amount} রিচার্জ রিকোয়েস্ট পাঠান` : `Submit ৳${selectedPackage?.amount} Deposit Request`)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* User's Deposit History List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>{lang === 'bn' ? 'আপনার রিচার্জ রিকোয়েস্টসমূহ' : 'Your Recent Deposits'}</span>
              <span className="text-xs text-slate-500 font-normal">({userDeposits.length})</span>
            </h3>

            {userDeposits.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs sm:text-sm">
                {lang === 'bn' ? 'এখনো কোন ডিপোজিট রিকোয়েস্ট দেওয়া হয়নি' : 'No deposit requests submitted yet'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {userDeposits.map((dep) => (
                  <div key={dep.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        <span>{dep.method.toUpperCase()} • ৳{dep.amount}</span>
                        {dep.packageTier && (
                          <UserTierBadge tier={dep.packageTier} size="xs" lang={lang} />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        TrxID: <span className="font-mono text-slate-600 font-semibold">{dep.transactionId}</span> • {dep.createdAt}
                      </div>
                    </div>

                    <div>
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          dep.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : dep.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {dep.status === 'pending' ? t.pending : dep.status === 'rejected' ? t.rejected : t.approved}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

