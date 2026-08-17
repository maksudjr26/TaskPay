import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethodConfig, PaymentMethodCode } from '../../types';
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
  Upload
} from 'lucide-react';

export const CustomerDeposit: React.FC = () => {
  const { paymentMethods, submitDeposit, deposits, currentUser, t, lang, settings, showToast } = useApp();
  const [selectedMethodCode, setSelectedMethodCode] = useState<PaymentMethodCode>('bkash');
  const [amount, setAmount] = useState<string>('500');
  const [senderPhone, setSenderPhone] = useState<string>(currentUser.phone || '');
  const [trxId, setTrxId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < (selectedMethod?.minDeposit || 100)) {
      showToast(
        lang === 'bn'
          ? `সর্বনিম্ন রিচার্জ পরিমাণ ৳${selectedMethod?.minDeposit || 100}`
          : `Minimum deposit amount is ৳${selectedMethod?.minDeposit || 100}`,
        'error'
      );
      return;
    }

    if (!senderPhone.trim()) {
      showToast(lang === 'bn' ? 'প্রেরক নম্বর দিন' : 'Please enter sender number', 'error');
      return;
    }

    if (!trxId.trim()) {
      showToast(lang === 'bn' ? 'সঠিক Transaction ID দিন' : 'Please enter Transaction ID', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = submitDeposit(selectedMethodCode, numAmount, senderPhone.trim(), trxId.trim());
    setIsSubmitting(false);

    if (success) {
      setTrxId('');
    }
  };

  // User's deposits
  const userDeposits = deposits.filter(d => d.userId === currentUser.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-teal-800/50">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.depositTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {lang === 'bn' ? 'ম্যানুয়াল রিচার্জ ও ডিপোজিট' : 'Fast & Secure Manual Deposit'}
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
            {t.depositSubtitle}
          </p>
        </div>
      </div>

      {/* Main Form & Method Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Method Selector & Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              {t.selectMethod}
            </h3>

            {/* Payment Method Pills */}
            <div className="grid grid-cols-2 gap-2.5">
              {paymentMethods.filter(m => m.active).map((pm) => {
                const isSelected = selectedMethodCode === pm.code;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedMethodCode(pm.code)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
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
              <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {lang === 'bn' ? selectedMethod.nameBn : selectedMethod.name} ({selectedMethod.accountType})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                  <div className="font-mono text-base sm:text-lg font-bold tracking-wider text-emerald-400">
                    {selectedMethod.accountNumber}
                  </div>
                  <button
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all"
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
              <p className="leading-relaxed">{t.step1}</p>
              <p className="leading-relaxed">{t.step2}</p>
              <p className="leading-relaxed">{t.step3}</p>
              <p className="leading-relaxed text-emerald-700 font-semibold">{t.step4}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'bn' ? 'রিচার্জ তথ্য জমা দিন' : 'Submit Deposit Details'}
            </h3>

            {/* Quick Amount Suggestion Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.depositAmount}
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['300', '500', '1000', '2000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      amount === val
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
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
                  placeholder="500"
                  min={selectedMethod?.minDeposit || 100}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-bold text-slate-900 text-base outline-none transition-all"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {lang === 'bn'
                  ? `সর্বনিম্ন রিচার্জ: ৳${selectedMethod?.minDeposit || 300}`
                  : `Minimum deposit: ৳${selectedMethod?.minDeposit || 300}`}
              </span>
            </div>

            {/* Sender Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.senderPhone}
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-900 text-sm outline-none transition-all"
                required
              />
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.trxId}
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                placeholder={t.trxIdPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-mono uppercase tracking-wider text-slate-900 text-sm font-bold outline-none transition-all"
                required
              />
            </div>

            {/* Account Activation Highlight Notice */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">
                  {lang === 'bn' ? 'স্বয়ংক্রিয় একাউন্ট সক্রিয়করণ:' : 'Automatic Account Activation:'}
                </span>
                {lang === 'bn'
                  ? `ন্যূনতম ৳${settings.minActivationAmount} রিচার্জ অ্যাডমিন অনুমোদন করার সাথে সাথে আপনার একাউন্ট স্বয়ংক্রিয়ভাবে Active হয়ে যাবে।`
                  : `Your account will automatically activate as soon as admin verifies a deposit of ৳${settings.minActivationAmount} or more.`}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? t.loading : t.submitDepositRequest}</span>
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
                      <div className="font-semibold text-slate-800">
                        {dep.method.toUpperCase()} • ৳{dep.amount}
                      </div>
                      <div className="text-[11px] text-slate-400">
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
