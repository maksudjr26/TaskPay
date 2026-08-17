import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowDownLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Check,
  X,
  CreditCard,
  ShieldCheck,
  User,
  Sparkles
} from 'lucide-react';

export const AdminDeposits: React.FC = () => {
  const { deposits, approveDeposit, rejectDeposit, t, lang, settings } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Invalid Transaction ID or Not Received');

  const filteredDeposits = deposits.filter(dep => {
    if (filterStatus !== 'all' && dep.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        dep.userName.toLowerCase().includes(q) ||
        dep.userPhone.includes(q) ||
        dep.transactionId.toLowerCase().includes(q) ||
        dep.senderNumber.includes(q)
      );
    }
    return true;
  });

  const handleConfirmReject = () => {
    if (rejectingId) {
      rejectDeposit(rejectingId, rejectReason);
      setRejectingId(null);
      setRejectReason('Invalid Transaction ID or Not Received');
    }
  };

  const pendingCount = deposits.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Deposit Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'bn' ? 'ম্যানুয়াল রিচার্জ ও ডিপোজিট অনুমোদন' : 'Manual Recharge & Deposit Verifications'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? `অনুমোদন করার সাথে সাথে ইউজারের ব্যালেন্স যোগ হবে এবং ৳${settings.minActivationAmount} পৌঁছালে একাউন্ট স্বয়ংক্রিয়ভাবে একটিভ হবে।`
              : `Approving credits user balance and activates customer accounts once min activation threshold is met.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
            <span className="text-xs text-slate-400 block">Pending Queue</span>
            <span className="text-lg font-black text-amber-400">{pendingCount} requests</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'all', label: 'All Deposits' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TrxID, Phone or User..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Deposits List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Sender & TrxID</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No deposit requests found under this filter.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map(dep => (
                  <tr key={dep.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{dep.userName}</div>
                      <div className="text-xs text-slate-500">{dep.userPhone}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold uppercase text-[11px] border border-emerald-200/50">
                        {dep.method}
                      </span>
                    </td>
                    <td className="p-4 font-black text-emerald-600 text-base">
                      ৳{dep.amount}
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-600">
                        Sender: <span className="font-semibold">{dep.senderNumber}</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {dep.transactionId}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {dep.createdAt}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          dep.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : dep.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {dep.status === 'pending' && <Clock className="w-3 h-3" />}
                        {dep.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {dep.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        <span className="capitalize">{dep.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {dep.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approveDeposit(dep.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Credit</span>
                          </button>
                          <button
                            onClick={() => setRejectingId(dep.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {dep.reviewedAt ? `Reviewed ${dep.reviewedAt}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Reject Deposit Request
            </h3>
            <p className="text-xs text-slate-600">
              Please enter the reason for rejection to inform the customer:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 border rounded-xl text-xs sm:text-sm text-slate-800"
              placeholder="e.g. Transaction ID was not found in statement"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
