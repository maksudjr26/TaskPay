import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskType } from '../../types';
import {
  CheckSquare,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  Calculator,
  HelpCircle,
  BarChart2
} from 'lucide-react';

interface Props {
  onOpenTaskModal: (task: Task) => void;
  setActiveTab: (tab: string) => void;
}

export const CustomerTasks: React.FC<Props> = ({ onOpenTaskModal, setActiveTab }) => {
  const { tasks, submissions, currentUser, t, lang, settings } = useApp();
  const [selectedType, setSelectedType] = useState<string>('all');

  const today = new Date().toISOString().split('T')[0];

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'captcha':
        return HelpCircle;
      case 'math_quiz':
        return Calculator;
      case 'read_article':
        return FileText;
      case 'survey':
        return BarChart2;
      case 'video_ad':
        return Play;
      default:
        return CheckSquare;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (task.status !== 'active') return false;
    if (selectedType === 'all') return true;
    return task.type === selectedType;
  });

  const isInactive = currentUser.status === 'inactive';

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-700/50">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.dailyEarningTasks}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {lang === 'bn' ? 'টাস্ক সম্পন্ন করুন এবং ব্যালেন্স আয় করুন' : 'Complete Micro-Tasks & Earn Real Cash'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            {t.tasksSubtitle}
          </p>
        </div>
      </div>

      {/* Inactive Notice Banner if restricted */}
      {isInactive && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">{t.activationNoticeTitle}</span>
              <p className="text-xs text-amber-700 mt-0.5">
                {lang === 'bn'
                  ? `উইথড্র চালু করতে ৳${settings.minActivationAmount} রিচার্জ করে একাউন্ট এক্টিভ করুন।`
                  : `Please recharge ৳${settings.minActivationAmount} to activate withdrawals.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('deposit')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            {t.rechargeNow}
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: t.allTasks },
          { id: 'captcha', label: t.captchaTasks },
          { id: 'math_quiz', label: t.quizTasks },
          { id: 'read_article', label: t.readingTasks },
          { id: 'survey', label: t.surveyTasks },
          { id: 'video_ad', label: t.adTasks },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedType === tab.id
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const Icon = getTaskIcon(task.type);
          
          // User completed count today for this task
          const completedCount = submissions.filter(
            s => s.userId === currentUser.id && s.taskId === task.id && s.completedAt.includes(today)
          ).length;

          const isLimitReached = completedCount >= task.dailyLimit;

          return (
            <div
              key={task.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-emerald-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {task.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5 leading-snug">
                        {lang === 'bn' ? task.titleBn : task.title}
                      </h3>
                    </div>
                  </div>

                  {/* Reward Badge */}
                  <div className="text-right shrink-0">
                    <div className="text-base sm:text-lg font-black text-emerald-600">
                      +৳{task.reward}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{t.taskReward}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'bn' ? task.descriptionBn : task.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {task.estimatedSeconds}s
                  </span>
                  <span>•</span>
                  <span>
                    {completedCount}/{task.dailyLimit} {lang === 'bn' ? 'সম্পন্ন' : 'completed'}
                  </span>
                </div>

                <button
                  onClick={() => onOpenTaskModal(task)}
                  disabled={isLimitReached}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isLimitReached
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/20 active:scale-95'
                  }`}
                >
                  {isLimitReached ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.taskLimitReached}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.startTask}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
