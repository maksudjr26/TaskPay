import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethodCode } from '../../types';
import {
  ArrowUpRight,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const CustomerWithdraw: React.FC<Props> = ({ setActiveTab }) => {
  const {
    currentUser,
    paymentMethods,
    submitWithdrawal,
    withdrawals,
    settings,
    t,
    lang,
    showToast
  } = useApp();

  const [selectedMethodCode, setSelectedMethodCode] = useState<PaymentMethodCode>('bkash');
  const [amount, setAmount] = useState<string>('300');
  const [recipientNumber, setRecipientNumber] = useState<string>(currentUser.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isInactive = currentUser.status === 'inactive';
  const minWithdraw = settings.minWithdrawAmount;
  const maxWithdraw = settings.maxWithdrawAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount < minWithdraw) {
      showToast(
        lang === 'bn'
          ? `সর্বনিম্ন উত্তোলন সীমা ৳${minWithdraw}`
          : `Minimum withdrawal amount is ৳${minWithdraw}`,
        'error'
      );
      return;
    }

    if (numAmount > currentUser.balance) {
      showToast(t.insufficientBalance, 'error');
      return;
    }

    if (!recipientNumber.trim()) {
      showToast(lang === 'bn' ? 'প্রাপকের একাউন্ট নম্বর দিন' : 'Please enter recipient number', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = submitWithdrawal(selectedMethodCode, numAmount, recipientNumber.trim());
    setIsSubmitting(false);

    if (res.success) {
      // Clear or reset
    }
  };

  const userWithdrawals = withdrawals.filter(w => w.userId === currentUser.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-purple-800/50">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.withdrawTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {lang === 'bn' ? 'ব্যালেন্স ক্যাশ আউট ও উত্তোলন' : 'Fast Payout & Cash Out'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed">
            {t.withdrawSubtitle}
          </p>
        </div>
      </div>

      {/* Inactive Account Warning */}
      {isInactive && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-rose-950 text-base">
                {lang === 'bn' ? 'একাউন্ট নিষ্ক্রিয়: উইথড্র সীমাবদ্ধ' : 'Account Inactive: Withdrawals Locked'}
              </h4>
              <p className="text-xs sm:text-sm text-rose-800 mt-0.5">
                {t.inactiveWithdrawWarning}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('deposit')}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            {t.rechargeNow}
          </button>
        </div>
      )}

      {/* Grid: Form & User Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Balance overview & method */}
        <div className="lg:col-span-5 space-y-4">
          {/* Balance card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              {t.withdrawableBalance}
            </span>
            <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1">
              <span className="text-emerald-600 text-2xl font-bold">৳</span>
              <span>{currentUser.balance.toLocaleString()}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-medium">
              <span>{t.minWithdraw}: ৳{minWithdraw}</span>
              <span>{t.maxWithdraw}: ৳{maxWithdraw}</span>
            </div>
          </div>

          {/* Method Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              {t.withdrawMethod}
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {paymentMethods.filter(m => m.active).map((pm) => {
                const isSelected = selectedMethodCode === pm.code;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedMethodCode(pm.code)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-400/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {lang === 'bn' ? pm.nameBn : pm.name}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      {pm.accountType}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Withdrawal Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'bn' ? 'উইথড্র আবেদন ফরম' : 'Cash Out Details'}
            </h3>

            {/* Quick Amount Suggestion Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.withdrawAmount}
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['100', '300', '500', '1000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      amount === val
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ৳{val}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                  ৳
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="300"
                  min={minWithdraw}
                  max={currentUser.balance}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 font-bold text-slate-900 text-base outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Recipient Account Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.recipientNumber} ({selectedMethodCode.toUpperCase()})
              </label>
              <input
                type="text"
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-slate-900 text-sm font-semibold outline-none transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || currentUser.balance < minWithdraw}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? t.loading : t.submitWithdrawRequest}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* User's Withdrawal History */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>{lang === 'bn' ? 'আপনার উত্তোলনের রেকর্ড' : 'Your Withdrawal History'}</span>
              <span className="text-xs text-slate-500 font-normal">({userWithdrawals.length})</span>
            </h3>

            {userWithdrawals.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs sm:text-sm">
                {lang === 'bn' ? 'কোন উইথড্র হিস্ট্রি পাওয়া যায়নি' : 'No withdrawal records found'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {userWithdrawals.map((wth) => (
                  <div key={wth.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {wth.method.toUpperCase()} • ৳{wth.amount}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        A/C: {wth.recipientNumber} • {wth.createdAt}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          wth.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : wth.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {wth.status === 'pending' ? t.pending : wth.status === 'rejected' ? t.rejected : t.approved}
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
