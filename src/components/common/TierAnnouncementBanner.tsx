import React from 'react';
import { useApp } from '../../context/AppContext';
import { TierAnnouncement } from '../../types';
import { Bell, Sparkles, AlertCircle, ArrowRight, CheckCircle, Zap } from 'lucide-react';

interface Props {
  onActionClick?: (tab: string) => void;
}

export const TierAnnouncementBanner: React.FC<Props> = ({ onActionClick }) => {
  const { currentUser, announcements, isCustomerLoggedIn, lang } = useApp();

  // Find relevant announcement
  // Target priority:
  // 1. If not logged in -> target === 'guest'
  // 2. If logged in -> target === currentUser.userType (e.g. 'General', 'Silver', 'Gold', 'Platinum', 'VIP')
  // 3. Fallback -> target === 'all'
  const activeAnnouncements = announcements.filter(a => a.isActive);

  let targetAnnouncement: TierAnnouncement | undefined;

  if (!isCustomerLoggedIn) {
    targetAnnouncement = activeAnnouncements.find(a => a.target === 'guest') || activeAnnouncements.find(a => a.target === 'all');
  } else {
    const userTier = currentUser.userType || 'General';
    targetAnnouncement = activeAnnouncements.find(a => a.target === userTier) || activeAnnouncements.find(a => a.target === 'all');
  }

  if (!targetAnnouncement) return null;

  const isBn = lang === 'bn';
  const title = isBn ? targetAnnouncement.titleBn : targetAnnouncement.title;
  const message = isBn ? targetAnnouncement.messageBn : targetAnnouncement.message;
  const badgeText = isBn ? targetAnnouncement.badgeTextBn || targetAnnouncement.badgeText : targetAnnouncement.badgeText;
  const actionText = isBn ? targetAnnouncement.actionTextBn || targetAnnouncement.actionText : targetAnnouncement.actionText;

  // Visual styling based on type
  const themeStyles = {
    promotion: {
      container: 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/10 border-amber-300/80 text-amber-950',
      badge: 'bg-amber-500 text-white font-bold',
      icon: <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />,
      btn: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20'
    },
    celebration: {
      container: 'bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-indigo-500/10 border-purple-300/80 text-purple-950',
      badge: 'bg-purple-600 text-white font-bold',
      icon: <Zap className="w-4 h-4 text-purple-600" />,
      btn: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/20'
    },
    warning: {
      container: 'bg-gradient-to-r from-rose-500/15 via-red-500/10 to-orange-500/10 border-rose-300/80 text-rose-950',
      badge: 'bg-rose-600 text-white font-bold',
      icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
    },
    info: {
      container: 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/10 border-emerald-300/80 text-emerald-950',
      badge: 'bg-emerald-600 text-white font-bold',
      icon: <Bell className="w-4 h-4 text-emerald-600" />,
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
    }
  }[targetAnnouncement.type || 'info'];

  return (
    <div
      id="tier_announcement_banner"
      className={`rounded-2xl border p-3.5 sm:p-4 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 ${themeStyles.container}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200/60 flex items-center justify-center shrink-0 mt-0.5">
          {themeStyles.icon}
        </div>
        <div className="space-y-0.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {badgeText && (
              <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider ${themeStyles.badge}`}>
                {badgeText}
              </span>
            )}
            <h4 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900">
              {title}
            </h4>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
            {message}
          </p>
        </div>
      </div>

      {actionText && targetAnnouncement.actionTab && (
        <div className="shrink-0 flex items-center justify-end">
          <button
            id="announcement_action_btn"
            onClick={() => onActionClick && onActionClick(targetAnnouncement.actionTab || 'deposit')}
            className={`w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${themeStyles.btn}`}
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
