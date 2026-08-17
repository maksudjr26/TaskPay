import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Check,
  X,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

export const AdminWithdrawals: React.FC = () => {
  const { withdrawals, approveWithdrawal, rejectWithdrawal, t, lang, settings } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<string | null>(null);
  const [txnRef, setTxnRef] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Account number was incorrect');

  const filteredWithdrawals = withdrawals.filter(w => {
    if (filterStatus !== 'all' && w.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.userName.toLowerCase().includes(q) ||
        w.userPhone.includes(q) ||
        w.recipientNumber.includes(q)
      );
    }
    return true;
  });

  const handleConfirmApprove = () => {
    if (selectedWithdrawal) {
      approveWithdrawal(selectedWithdrawal, txnRef || undefined);
      setSelectedWithdrawal(null);
      setTxnRef('');
    }
  };

  const handleConfirmReject = () => {
    if (rejectingId) {
      rejectWithdrawal(rejectingId, rejectReason);
      setRejectingId(null);
      setRejectReason('Account number was incorrect');
    }
  };

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-2 border border-rose-500/30">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Withdrawal Requests</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'bn' ? 'কাস্টমার ক্যাশআউট / উইথড্র নিয়ন্ত্রণ' : 'Customer Cashout & Payout Processing'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'বিকাশ, নগদ বা ব্যাংক একাউন্টে পেমেন্ট পাঠিয়ে ট্রানজেকশন রেফারেন্স যুক্ত করুন।'
              : 'Review withdrawal queues, send payout to recipient number, and approve.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
            <span className="text-xs text-slate-400 block">Pending Payouts</span>
            <span className="text-lg font-black text-rose-400">{pendingCount} requests</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'approved', label: 'Approved & Paid' },
            { id: 'rejected', label: 'Rejected / Refunded' },
            { id: 'all', label: 'All Requests' },
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
            placeholder="Search Recipient or User..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Payout Method</th>
                <th className="p-4">Amount (BDT)</th>
                <th className="p-4">Recipient Number</th>
                <th className="p-4">Request Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{w.userName}</div>
                      <div className="text-xs text-slate-500">{w.userPhone}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold uppercase text-[11px] border border-rose-200/50">
                        {w.method}
                      </span>
                    </td>
                    <td className="p-4 font-black text-rose-600 text-base">
                      ৳{w.amount}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {w.recipientNumber}
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {w.createdAt}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          w.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : w.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {w.status === 'pending' && <Clock className="w-3 h-3" />}
                        {w.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {w.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        <span className="capitalize">{w.status}</span>
                      </span>
                      {w.transactionRef && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Ref: {w.transactionRef}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {w.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(w.id);
                              setTxnRef('TXN_' + Math.floor(10000000 + Math.random() * 90000000));
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Paid</span>
                          </button>
                          <button
                            onClick={() => setRejectingId(w.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject & Refund</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {w.reviewedAt ? `Processed ${w.reviewedAt}` : 'Complete'}
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

      {/* Approve Modal with Transaction Reference Input */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Withdrawal Payout
            </h3>
            <p className="text-xs text-slate-600">
              Enter the bank/MFS payout transaction reference number after sending money:
            </p>
            <input
              type="text"
              value={txnRef}
              onChange={(e) => setTxnRef(e.target.value)}
              className="w-full p-3 border rounded-xl font-mono text-sm font-bold text-slate-900 uppercase"
              placeholder="e.g. 9JA2K810PQ"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedWithdrawal(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Reject Withdrawal (Auto-Refund)
            </h3>
            <p className="text-xs text-slate-600">
              Rejecting this request will immediately refund the withdrawn amount back to the customer's wallet.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 border rounded-xl text-xs sm:text-sm text-slate-800"
              placeholder="e.g. Account number could not receive money"
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
                Refund & Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
