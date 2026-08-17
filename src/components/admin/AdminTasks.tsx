import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskType } from '../../types';
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Award,
  ToggleLeft,
  ToggleRight,
  Filter,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Calculator,
  FileText,
  Play,
  BarChart2
} from 'lucide-react';

export const AdminTasks: React.FC = () => {
  const { tasks, createTask, updateTask, deleteTask, t, lang } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Form State
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    titleBn: '',
    description: '',
    descriptionBn: '',
    type: 'captcha',
    reward: 10,
    dailyLimit: 5,
    estimatedSeconds: 20,
    status: 'active',
    category: 'Daily',
    config: {
      captchaLength: 6,
      mathDifficulty: 'easy',
      surveyQuestion: 'Which payment method do you prefer most in Bangladesh?',
      surveyQuestionBn: 'বাংলাদেশে আপনার সবচেয়ে পছন্দের পেমেন্ট মাধ্যম কোনটি?',
      surveyOptions: ['bKash', 'Nagad', 'Rocket', 'Bank'],
      surveyOptionsBn: ['বিকাশ', 'নগদ', 'রকেট', 'ব্যাংক'],
      articleContent: 'Digital micro-tasking in Bangladesh offers students and freelancers a flexible way to earn supplemental income in their spare time.',
      articleContentBn: 'বাংলাদেশে ডিজিটাল মাইক্রো-টাস্কিংয়ের মাধ্যমে শিক্ষার্থী ও ফ্রিল্যান্সাররা তাদের অবসর সময়ে নির্ভরযোগ্যভাবে অতিরিক্ত আয় করতে পারেন।'
    }
  });

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      titleBn: '',
      description: '',
      descriptionBn: '',
      type: 'captcha',
      reward: 10,
      dailyLimit: 5,
      estimatedSeconds: 20,
      status: 'active',
      category: 'Daily',
      config: {
        captchaLength: 6,
        mathDifficulty: 'easy'
      }
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      titleBn: task.titleBn,
      description: task.description,
      descriptionBn: task.descriptionBn,
      type: task.type,
      reward: task.reward,
      dailyLimit: task.dailyLimit,
      estimatedSeconds: task.estimatedSeconds,
      status: task.status,
      category: task.category,
      config: task.config || {}
    });
    setShowCreateModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.reward) return;

    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      createTask(formData);
    }
    setShowCreateModal(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filterType === 'all') return true;
    return task.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'bn' ? 'টাস্ক ও রিওয়ার্ড নিয়ন্ত্রণ' : 'Tasks & Reward Controls'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'bn'
              ? 'দৈনিক ক্যাপচা, কুইজ, বিজ্ঞাপন ও অন্যান্য টাস্ক তৈরি এবং সম্পাদন করুন।'
              : 'Create, update, activate or remove daily earning tasks for active customers.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'bn' ? '+ নতুন টাস্ক যোগ করুন' : '+ Create New Task'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'captcha', label: 'CAPTCHA' },
          { id: 'math_quiz', label: 'Math Quiz' },
          { id: 'read_article', label: 'Read Article' },
          { id: 'survey', label: 'Survey / Poll' },
          { id: 'video_ad', label: 'Video Ads' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Task Details</th>
                <th className="p-4">Type</th>
                <th className="p-4">Reward</th>
                <th className="p-4">Daily Limit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-sm">
                      {lang === 'bn' ? task.titleBn : task.title}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {lang === 'bn' ? task.descriptionBn : task.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-[11px] font-bold text-slate-700 uppercase">
                      {task.type}
                    </span>
                  </td>
                  <td className="p-4 font-black text-emerald-600 text-sm sm:text-base">
                    ৳{task.reward}
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    {task.dailyLimit} times/day
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateTask(task.id, { status: task.status === 'active' ? 'inactive' : 'active' })}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer ${
                        task.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${task.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{task.status === 'active' ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Task"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete task "${task.title}"?`)) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingTask ? 'Edit Task' : 'Create New Micro-Task'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Task Title (EN)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="e.g. Solve Math Expression"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Task Title (BN)</label>
                  <input
                    type="text"
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="যেমন: গণিত সমাধান করুন"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description (EN)</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="Provide simple instructions"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description (BN)</label>
                  <textarea
                    rows={2}
                    value={formData.descriptionBn}
                    onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="নির্দেশনা লিখুন"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Task Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskType })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="captcha">CAPTCHA</option>
                    <option value="math_quiz">Math Quiz</option>
                    <option value="read_article">Read Article</option>
                    <option value="survey">Survey / Poll</option>
                    <option value="video_ad">Video / Ad</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reward (BDT ৳)</label>
                  <input
                    type="number"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-emerald-700"
                    min={1}
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Daily Limit</label>
                  <input
                    type="number"
                    value={formData.dailyLimit}
                    onChange={(e) => setFormData({ ...formData, dailyLimit: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 border rounded-xl"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
