import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TierAnnouncement, UserTier } from '../../types';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  Bell,
  Eye,
  Filter
} from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement, toggleAnnouncement, lang } = useApp();
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<TierAnnouncement, 'id' | 'createdAt'>>({
    target: 'General',
    title: '',
    titleBn: '',
    message: '',
    messageBn: '',
    type: 'promotion',
    badgeText: '',
    badgeTextBn: '',
    actionText: 'View Details',
    actionTextBn: 'বিস্তারিত দেখুন',
    actionTab: 'deposit',
    isActive: true
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      target: 'General',
      title: '',
      titleBn: '',
      message: '',
      messageBn: '',
      type: 'promotion',
      badgeText: 'Special Notice',
      badgeTextBn: 'বিশেষ ঘোষণা',
      actionText: 'Upgrade Now',
      actionTextBn: 'আপগ্রেড করুন',
      actionTab: 'deposit',
      isActive: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (ann: TierAnnouncement) => {
    setEditingId(ann.id);
    setFormData({
      target: ann.target,
      title: ann.title,
      titleBn: ann.titleBn,
      message: ann.message,
      messageBn: ann.messageBn,
      type: ann.type,
      badgeText: ann.badgeText || '',
      badgeTextBn: ann.badgeTextBn || '',
      actionText: ann.actionText || '',
      actionTextBn: ann.actionTextBn || '',
      actionTab: ann.actionTab || 'deposit',
      isActive: ann.isActive
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;

    if (editingId) {
      updateAnnouncement(editingId, formData);
    } else {
      createAnnouncement(formData);
    }
    setShowModal(false);
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (selectedTarget === 'all') return true;
    return a.target === selectedTarget;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Tiered Announcement Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'bn' ? 'টিয়ার-ভিত্তিক ঘোষণা নিয়ন্ত্রণ' : 'Tier-Targeted Announcements'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'লগইন ছাড়া ইউজার এবং General, Silver, Gold, Platinum, VIP মেম্বারদের জন্য আলাদা নোটিশ ও প্রমোশন সেট করুন।'
              : 'Configure tailored announcements and promotions specifically targeted to guests or specific user tiers.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'bn' ? '+ নতুন নোটিশ যোগ করুন' : '+ Create Announcement'}</span>
        </button>
      </div>

      {/* Filter Tabs by Target */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Targets (সব)' },
          { id: 'guest', label: 'Non-Logged Guests' },
          { id: 'General', label: 'General (1.0x)' },
          { id: 'Silver', label: 'Silver (1.25x)' },
          { id: 'Gold', label: 'Gold (1.75x)' },
          { id: 'Platinum', label: 'Platinum (2.25x)' },
          { id: 'VIP', label: 'VIP Supreme (3.0x)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTarget(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTarget === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Announcements List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAnnouncements.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all relative overflow-hidden ${
              item.isActive ? 'border-slate-200' : 'border-slate-200 bg-slate-50/50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  item.target === 'guest'
                    ? 'bg-blue-100 text-blue-800'
                    : item.target === 'VIP'
                    ? 'bg-purple-100 text-purple-800'
                    : item.target === 'Platinum'
                    ? 'bg-cyan-100 text-cyan-800'
                    : item.target === 'Gold'
                    ? 'bg-amber-100 text-amber-800'
                    : item.target === 'Silver'
                    ? 'bg-slate-200 text-slate-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Target: {item.target}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.type === 'promotion'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : item.type === 'celebration'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : item.type === 'warning'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {item.type}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleAnnouncement(item.id)}
                  className={`text-xs font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.isActive ? 'Active' : 'Disabled'}
                </button>
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this announcement?')) deleteAnnouncement(item.id);
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">
                {lang === 'bn' ? item.titleBn : item.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'bn' ? item.messageBn : item.message}
              </p>
            </div>

            {(item.actionText || item.actionTextBn) && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Action Tab: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">{item.actionTab}</code></span>
                <span className="font-bold text-indigo-600">{lang === 'bn' ? item.actionTextBn : item.actionText}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingId ? 'Edit Tier Announcement' : 'Create Tier Announcement'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="guest">Non-Logged In Guests</option>
                    <option value="General">General Members (1.0x)</option>
                    <option value="Silver">Silver Members (1.25x)</option>
                    <option value="Gold">Gold Members (1.75x)</option>
                    <option value="Platinum">Platinum Members (2.25x)</option>
                    <option value="VIP">Royal VIP Members (3.0x)</option>
                    <option value="all">All Users</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Theme / Style</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="promotion">Promotion / Upgrade Offer</option>
                    <option value="celebration">Celebration / VIP Special</option>
                    <option value="info">General Info / Update</option>
                    <option value="warning">Important Alert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title (EN)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="e.g. Upgrade to Gold for 1.75x"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title (BN)</label>
                  <input
                    type="text"
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="যেমন: গোল্ডে আপগ্রেড করে ১.৭৫x পান"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message (EN)</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="Announcement message..."
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message (BN)</label>
                  <textarea
                    rows={3}
                    value={formData.messageBn}
                    onChange={(e) => setFormData({ ...formData, messageBn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="ঘোষণার বিবরণ লিখুন..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Button (BN)</label>
                  <input
                    type="text"
                    value={formData.actionTextBn}
                    onChange={(e) => setFormData({ ...formData, actionTextBn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="আপগ্রেড করুন"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Button (EN)</label>
                  <input
                    type="text"
                    value={formData.actionText}
                    onChange={(e) => setFormData({ ...formData, actionText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="Upgrade Now"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Tab</label>
                  <select
                    value={formData.actionTab}
                    onChange={(e) => setFormData({ ...formData, actionTab: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="deposit">Deposit / Upgrade (রিচার্জ)</option>
                    <option value="tasks">Tasks (টাস্ক)</option>
                    <option value="withdraw">Withdraw (উইথড্র)</option>
                    <option value="profile">Profile (প্রোফাইল)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingId ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
