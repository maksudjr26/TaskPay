import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Check,
  X,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

export const AdminSubmissions: React.FC = () => {
  const { submissions, approveSubmission, rejectSubmission, lang, t } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sub.userName.toLowerCase().includes(q) ||
        sub.taskTitle.toLowerCase().includes(q) ||
        sub.userPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Task Proof Submissions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'bn' ? 'টাস্ক সাবমিশন ও অডিট লগ' : 'Task Submissions & Audit Log'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'ইউজারদের সম্পন্ন করা সকল ক্যাপচা, সার্ভে ও কুইজের রেকর্ড এবং প্রুফ ডাটা।'
              : 'All micro-task completions, automated verifications, and reward credits.'}
          </p>
        </div>

        <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
          <span className="text-xs text-slate-400 block">Total Completed</span>
          <span className="text-lg font-black text-emerald-400">{submissions.length} tasks</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Submissions' },
            { id: 'approved', label: 'Approved & Credited' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'rejected', label: 'Rejected' },
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
            placeholder="Search User or Task..."
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
                <th className="p-4">Task Name</th>
                <th className="p-4">Reward</th>
                <th className="p-4">Proof / Activity Details</th>
                <th className="p-4">Completed Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No task submissions found.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{sub.userName}</div>
                      <div className="text-xs text-slate-500">{sub.userPhone}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {lang === 'bn' ? sub.taskTitleBn : sub.taskTitle}
                    </td>
                    <td className="p-4 font-black text-emerald-600 text-base">
                      +৳{sub.reward}
                    </td>
                    <td className="p-4 text-xs text-slate-600 font-mono bg-slate-50/50">
                      {sub.proofData || 'Auto-Verified'}
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {sub.completedAt}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          sub.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sub.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {sub.status === 'pending' && <Clock className="w-3 h-3" />}
                        {sub.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        <span className="capitalize">{sub.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {sub.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approveSubmission(sub.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => rejectSubmission(sub.id, 'Invalid proof')}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">
                          Verified
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
    </div>
  );
};
