import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethodConfig } from '../../types';
import {
  CreditCard,
  Edit2,
  Check,
  Building,
  Smartphone,
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { paymentMethods, updatePaymentMethod, lang, t, showToast } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentMethodConfig>>({});

  const handleStartEdit = (pm: PaymentMethodConfig) => {
    setEditingId(pm.id);
    setFormData({
      accountNumber: pm.accountNumber,
      accountType: pm.accountType,
      minDeposit: pm.minDeposit,
      maxDeposit: pm.maxDeposit,
      active: pm.active,
      bankDetails: pm.bankDetails ? { ...pm.bankDetails } : undefined
    });
  };

  const handleSave = (id: string) => {
    updatePaymentMethod(id, formData);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Manual Payment Gateways</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'bn' ? 'ম্যানুয়াল পেমেন্ট মেথড ও নাম্বার সেটিং' : 'Payment Accounts & Number Configuration'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'বিকাশ, নগদ, রকেট এবং ব্যাংকের সেন্ড-মানি নাম্বার ও নির্দেশনা পরিবর্তন করুন।'
              : 'Configure official bKash, Nagad, Rocket and Bank accounts displayed to customers during recharge.'}
          </p>
        </div>
      </div>

      {/* Grid of Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((pm) => {
          const isEditing = editingId === pm.id;

          return (
            <div
              key={pm.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Method Title Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm border border-indigo-100">
                      {pm.code.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {lang === 'bn' ? pm.nameBn : pm.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {pm.code.toUpperCase()} Manual Gateway
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => updatePaymentMethod(pm.id, { active: !pm.active })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      pm.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {pm.active ? 'Active' : 'Disabled'}
                  </button>
                </div>

                {/* Form Fields / View Mode */}
                {isEditing ? (
                  <div className="space-y-3 pt-2 text-xs sm:text-sm border-t border-slate-100">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Account / Wallet Number
                      </label>
                      <input
                        type="text"
                        value={formData.accountNumber || ''}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="w-full p-2.5 border rounded-xl font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Account Type</label>
                        <select
                          value={formData.accountType || 'Personal'}
                          onChange={(e) => setFormData({ ...formData, accountType: e.target.value as any })}
                          className="w-full p-2.5 border rounded-xl bg-white"
                        >
                          <option value="Personal">Personal (Send Money)</option>
                          <option value="Merchant">Merchant (Payment)</option>
                          <option value="Agent">Agent (Cash Out)</option>
                          <option value="Bank Account">Bank Account</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Min Deposit (BDT)</label>
                        <input
                          type="number"
                          value={formData.minDeposit || 100}
                          onChange={(e) => setFormData({ ...formData, minDeposit: parseFloat(e.target.value) || 100 })}
                          className="w-full p-2.5 border rounded-xl font-bold text-emerald-700"
                        />
                      </div>
                    </div>

                    {/* If bank, allow editing bank details */}
                    {pm.bankDetails && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="font-bold text-slate-800 block text-xs">Bank Details</span>
                        <input
                          type="text"
                          placeholder="Bank Name"
                          value={formData.bankDetails?.bankName || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            bankDetails: { ...formData.bankDetails!, bankName: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Account Holder"
                          value={formData.bankDetails?.accountHolder || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            bankDetails: { ...formData.bankDetails!, accountHolder: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg text-xs"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs sm:text-sm">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                      <span className="text-slate-400 text-xs block mb-0.5">Receiver Number:</span>
                      <div className="font-mono text-base sm:text-lg font-bold text-slate-900">
                        {pm.accountNumber}
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">
                        Type: {pm.accountType} • Min: ৳{pm.minDeposit}
                      </span>
                    </div>

                    {pm.bankDetails && (
                      <div className="p-3 bg-slate-900 text-slate-200 rounded-2xl text-xs space-y-1">
                        <div><strong>Bank:</strong> {pm.bankDetails.bankName}</div>
                        <div><strong>Holder:</strong> {pm.bankDetails.accountHolder}</div>
                        <div><strong>Branch:</strong> {pm.bankDetails.branchName}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(pm.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStartEdit(pm)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Number & Limits</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
