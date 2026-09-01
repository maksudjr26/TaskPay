import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface Props {
  variant?: 'customer' | 'admin';
  onNavigateTab?: (tab: string) => void;
}

export const NotificationBellModal: React.FC<Props> = ({
  variant = 'customer',
  onNavigateTab
}) => {
  const {
    notifications,
    currentUser,
    customerUnreadCount,
    adminUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    notificationPreferences,
    updateNotificationPreferences,
    lang,
    t
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'task' | 'system'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = variant === 'admin' ? adminUnreadCount : customerUnreadCount;

  // Filter notifications based on viewer and category
  const relevantNotifications = notifications.filter(n => {
    if (variant === 'admin') {
      return n.target === 'admin' || n.target === 'all';
    } else {
      return n.target === 'customer' || n.target === 'all' || (currentUser.id && n.userId === currentUser.id);
    }
  });

  const filteredNotifications = relevantNotifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  const getCategoryIcon = (category: AppNotification['category'], type: AppNotification['type']) => {
    switch (category) {
      case 'deposit':
        return <ArrowDownLeft className={`w-4 h-4 ${type === 'success' ? 'text-emerald-500' : type === 'error' ? 'text-rose-500' : 'text-amber-500'}`} />;
      case 'withdrawal':
        return <ArrowUpRight className={`w-4 h-4 ${type === 'success' ? 'text-emerald-500' : type === 'error' ? 'text-rose-500' : 'text-amber-500'}`} />;
      case 'task':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      case 'account':
      case 'tier':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return type === 'error' ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.read) {
      markNotificationAsRead(notif.id);
    }
    if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
      setIsOpen(false);
    }
  };

  const isDark = variant === 'admin';

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id={`notification-bell-${variant}`}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80'
            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
        }`}
        title={lang === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notification Center'}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        
        {/* Unread Badge Indicator */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Modal / Panel */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl border z-50 overflow-hidden transition-all duration-200 ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Panel Header */}
          <div
            className={`px-4 py-3 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-100 text-emerald-700'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold leading-tight">
                  {lang === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notifications'}
                </h3>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {unreadCount > 0 
                    ? (lang === 'bn' ? `${unreadCount} টি অপঠিত নোটিফিকেশন` : `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`)
                    : (lang === 'bn' ? 'সব নোটিফিকেশন পড়া হয়েছে' : 'All caught up')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showSettings
                    ? (isDark ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white')
                    : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-200')
                }`}
                title="Notification Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Settings Panel (Collapsible) */}
          {showSettings && (
            <div className={`px-4 py-3 border-b text-xs space-y-2.5 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between font-semibold">
                <span>{lang === 'bn' ? 'শব্দ সতর্কতা (Audio Chime)' : 'Notification Sound'}</span>
                <button
                  onClick={() => updateNotificationPreferences({ soundEnabled: !notificationPreferences.soundEnabled })}
                  className={`p-1 rounded-md cursor-pointer flex items-center gap-1 font-bold ${
                    notificationPreferences.soundEnabled
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {notificationPreferences.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{notificationPreferences.soundEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPreferences.depositAlerts}
                    onChange={e => updateNotificationPreferences({ depositAlerts: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{lang === 'bn' ? 'ডিপোজিট এলার্ট' : 'Deposit Alerts'}</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPreferences.withdrawalAlerts}
                    onChange={e => updateNotificationPreferences({ withdrawalAlerts: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{lang === 'bn' ? 'উইথড্রল এলার্ট' : 'Withdraw Alerts'}</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPreferences.taskRewardAlerts}
                    onChange={e => updateNotificationPreferences({ taskRewardAlerts: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{lang === 'bn' ? 'টাস্ক রিওয়ার্ড' : 'Task Rewards'}</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPreferences.systemAlerts}
                    onChange={e => updateNotificationPreferences({ systemAlerts: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{lang === 'bn' ? 'সিস্টেম এলার্ট' : 'System Alerts'}</span>
                </label>
              </div>
            </div>
          )}

          {/* Filter Categories Bar */}
          <div
            className={`flex items-center gap-1 px-3 py-2 border-b overflow-x-auto text-[11px] font-medium no-scrollbar ${
              isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-white'
            }`}
          >
            {[
              { id: 'all', label: lang === 'bn' ? 'সকল' : 'All' },
              { id: 'deposit', label: lang === 'bn' ? 'ডিপোজিট' : 'Deposits' },
              { id: 'withdrawal', label: lang === 'bn' ? 'উইথড্র' : 'Withdraws' },
              { id: 'task', label: lang === 'bn' ? 'টাস্ক' : 'Tasks' },
              { id: 'system', label: lang === 'bn' ? 'সিস্টেম' : 'System' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === tab.id
                    ? (isDark ? 'bg-indigo-600 text-white font-bold' : 'bg-emerald-100 text-emerald-800 font-bold')
                    : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100')
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <Bell className={`w-8 h-8 mx-auto mb-2 opacity-30 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {lang === 'bn' ? 'কোন নোটিফিকেশন পাওয়া যায়নি' : 'No notifications in this category'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const title = lang === 'bn' && notif.titleBn ? notif.titleBn : notif.title;
                const message = lang === 'bn' && notif.messageBn ? notif.messageBn : notif.message;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start relative group ${
                      !notif.read
                        ? isDark ? 'bg-indigo-950/20 hover:bg-indigo-950/40' : 'bg-emerald-50/50 hover:bg-emerald-50/80'
                        : isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!notif.read && (
                      <span className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300" />
                    )}

                    {/* Icon */}
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-2xs'
                      }`}
                    >
                      {getCategoryIcon(notif.category, notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className={`text-xs font-bold truncate ${!notif.read ? (isDark ? 'text-indigo-200' : 'text-emerald-900') : (isDark ? 'text-slate-200' : 'text-slate-800')}`}>
                          {title}
                        </h4>
                        <span className={`text-[10px] shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {notif.createdAt}
                        </span>
                      </div>

                      <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {message}
                      </p>

                      {/* Action Pill if applicable */}
                      {notif.actionTab && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700">
                          <span>{lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    {/* Delete single notification button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity cursor-pointer ${
                        isDark ? 'text-slate-500 hover:text-rose-400' : 'text-slate-400 hover:text-rose-600'
                      }`}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div
            className={`px-4 py-2.5 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <button
              onClick={() => markAllNotificationsAsRead(variant)}
              className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-emerald-700 hover:text-emerald-800'
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সব পঠিত চিহ্নিত করুন' : 'Mark all as read'}</span>
            </button>

            <button
              onClick={() => clearAllNotifications(variant)}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                isDark ? 'text-slate-500 hover:text-rose-400' : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সব মুছে ফেলুন' : 'Clear all'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
