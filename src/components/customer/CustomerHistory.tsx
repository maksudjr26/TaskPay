import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionRecord } from '../../types';
import {
  History,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  X,
  FileText
} from 'lucide-react';

export const CustomerHistory: React.FC = () => {
  const { transactions, currentUser, t, lang, settings } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionRecord | null>(null);

  const userTransactions = transactions.filter(t => t.userId === currentUser.id);

  const filtered = userTransactions.filter(trx => {
    if (filterType === 'deposit' && trx.type !== 'deposit') return false;
    if (filterType === 'withdrawal' && trx.type !== 'withdrawal') return false;
    if (filterType === 'task_reward' && trx.type !== 'task_reward') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = trx.title.toLowerCase().includes(q) || (trx.titleBn && trx.titleBn.toLowerCase().includes(q));
      const matchRef = trx.referenceId && trx.referenceId.toLowerCase().includes(q);
      return matchTitle || matchRef;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <History className="w-3.5 h-3.5" />
            <span>{t.transactionHistory}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {lang === 'bn' ? 'আর্থিক লেনদেন ও আয়ের হিসাব' : 'Financial Statement & Logs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.historySubtitle}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: t.allRecords },
            { id: 'deposit', label: t.depositsTab },
            { id: 'withdrawal', label: t.withdrawalsTab },
            { id: 'task_reward', label: t.earningsTab },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-300" />
            <p>{lang === 'bn' ? 'কোন লেনদেন তথ্য পাওয়া যায়নি' : 'No transaction records found'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((trx) => {
              const isIncome = trx.type === 'task_reward' || (trx.type === 'deposit' && trx.status === 'completed');
              const isPending = trx.status === 'pending';
              const isRejected = trx.status === 'rejected';

              return (
                <div
                  key={trx.id}
                  onClick={() => setSelectedReceipt(trx)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        trx.type === 'deposit'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : trx.type === 'withdrawal'
                          ? 'bg-purple-50 text-purple-600 border border-purple-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}
                    >
                      {trx.type === 'deposit' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : trx.type === 'withdrawal' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {lang === 'bn' ? trx.titleBn : trx.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {trx.date} {trx.referenceId && `• TrxID: ${trx.referenceId}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-sm sm:text-base font-black ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}৳{Math.abs(trx.amount)}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase inline-block mt-0.5 ${
                        isPending
                          ? 'bg-amber-100 text-amber-800'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isPending ? t.pending : isRejected ? t.rejected : t.completed}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">{t.receiptTitle}</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center pb-4 border-b border-dashed border-slate-200">
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  {lang === 'bn' ? selectedReceipt.titleBn : selectedReceipt.title}
                </span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  ৳{Math.abs(selectedReceipt.amount)}
                </div>
                <span
                  className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    selectedReceipt.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : selectedReceipt.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedReceipt.status}
                </span>
              </div>

              <div className="text-xs space-y-2.5 text-slate-600">
                <div className="flex justify-between">
                  <span>User:</span>
                  <strong className="text-slate-900">{currentUser.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <strong className="text-slate-900">{currentUser.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <strong className="text-slate-900">{selectedReceipt.date}</strong>
                </div>
                {selectedReceipt.referenceId && (
                  <div className="flex justify-between">
                    <span>Reference / TrxID:</span>
                    <strong className="text-slate-900 font-mono">{selectedReceipt.referenceId}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <strong className="text-emerald-700 font-bold">TaskPay System</strong>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.printReceipt}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
