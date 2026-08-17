import React, { Component, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CustomerNavbar } from './components/customer/CustomerNavbar';
import { CustomerBottomNav } from './components/customer/CustomerBottomNav';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CustomerTasks } from './components/customer/CustomerTasks';
import { CustomerDeposit } from './components/customer/CustomerDeposit';
import { CustomerWithdraw } from './components/customer/CustomerWithdraw';
import { CustomerHistory } from './components/customer/CustomerHistory';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { CustomerFooter } from './components/customer/CustomerFooter';
import { CustomerAuth } from './components/customer/CustomerAuth';
import { TaskInteractionModal } from './components/customer/TaskInteractionModal';

import { AdminHeader } from './components/admin/AdminHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminTasks } from './components/admin/AdminTasks';
import { AdminSubmissions } from './components/admin/AdminSubmissions';
import { AdminDeposits } from './components/admin/AdminDeposits';
import { AdminWithdrawals } from './components/admin/AdminWithdrawals';
import { AdminAnnouncements } from './components/admin/AdminAnnouncements';
import { AdminPayments } from './components/admin/AdminPayments';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminReports } from './components/admin/AdminReports';
import { AdminAuth } from './components/admin/AdminAuth';

import { Task } from './types';
import {
  Users,
  ShieldCheck,
  Languages,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Check,
  Zap,
  LogOut,
  LogIn,
  KeyRound
} from 'lucide-react';

type ViewportMode = 'responsive' | 'desktop' | 'tablet' | 'mobile';

const MainLayout: React.FC = () => {
  const {
    currentUser,
    users,
    currentRoleView,
    setCurrentRoleView,
    isCustomerLoggedIn,
    isAdminLoggedIn,
    logoutCustomer,
    logoutAdmin,
    lang,
    setLanguage,
    t,
    toasts,
    removeToast,
    settings,
    deposits
  } = useApp();

  const [customerActiveTab, setCustomerActiveTab] = useState<string>('dashboard');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('admin_dashboard');
  const [activeTaskModal, setActiveTaskModal] = useState<Task | null>(null);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('responsive');

  return (
    <div className="min-h-screen bg-slate-200/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Global Platform System Header Toolbar */}
      <aside
        aria-label="Platform Top Header"
        className="bg-slate-950 text-slate-200 text-xs py-2 px-3 sm:px-6 border-b border-slate-800 sticky top-0 z-50 shadow-md backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: App Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-black text-white text-xs sm:text-sm tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent text-sm sm:text-base">
                TaskPay
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">
                Bangladesh Live
              </span>
            </div>

            {isAdminLoggedIn && currentRoleView === 'admin' && (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Mode</span>
              </span>
            )}
          </div>

          {/* Center: Viewport Switcher Controls (Full Web, Tablet, Mobile) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewportMode('responsive')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewportMode === 'responsive'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Width Web View"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Website</span>
            </button>

            <button
              onClick={() => setViewportMode('tablet')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewportMode === 'tablet'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tablet Screen Preview (768px)"
            >
              <Tablet className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tablet (768px)</span>
            </button>

            <button
              onClick={() => setViewportMode('mobile')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewportMode === 'mobile'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Device Preview (390px)"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Mobile Phone (390px)</span>
            </button>
          </div>

          {/* Right: Auth Status & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* If Customer is Logged In */}
            {isCustomerLoggedIn && currentRoleView === 'customer' && (
              <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-white max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  {currentUser.userType || 'General'}
                </span>
                <button
                  onClick={logoutCustomer}
                  className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* If Admin is Logged In */}
            {isAdminLoggedIn && currentRoleView === 'admin' && (
              <div className="flex items-center gap-2 bg-indigo-950/60 px-2.5 py-1 rounded-xl border border-indigo-800/50">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-200">
                  Admin Active
                </span>
                <button
                  onClick={logoutAdmin}
                  className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                  title="Logout Admin"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Language Switcher */}
            <button
              id="global-language-toggle"
              onClick={() => setLanguage(lang === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold hover:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              title="Change Language / ভাষা পরিবর্তন"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Container Frame with Viewport Simulation */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 w-full ${
          viewportMode === 'responsive'
            ? 'w-full'
            : viewportMode === 'tablet'
            ? 'max-w-[768px] mx-auto my-4 rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-900 bg-slate-100'
            : 'max-w-[400px] mx-auto my-4 rounded-[40px] shadow-2xl overflow-hidden border-[12px] border-slate-900 bg-slate-100'
        }`}
      >
        {currentRoleView === 'customer' ? (
          /* =========================================================================
             CUSTOMER WEB SYSTEM PORTAL
             ========================================================================= */
          <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
            {!isCustomerLoggedIn ? (
              <div className="flex-1 flex flex-col">
                <CustomerAuth onAuthSuccess={() => setCustomerActiveTab('dashboard')} />
                <CustomerFooter setActiveTab={setCustomerActiveTab} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {/* Customer Top Navigation */}
                <CustomerNavbar activeTab={customerActiveTab} setActiveTab={setCustomerActiveTab} />

                {/* Customer Main Screen Body */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
                  {customerActiveTab === 'dashboard' && (
                    <CustomerDashboard
                      setActiveTab={setCustomerActiveTab}
                      onOpenTaskModal={(task) => setActiveTaskModal(task)}
                    />
                  )}
                  {customerActiveTab === 'tasks' && (
                    <CustomerTasks
                      setActiveTab={setCustomerActiveTab}
                      onOpenTaskModal={(task) => setActiveTaskModal(task)}
                    />
                  )}
                  {customerActiveTab === 'deposit' && (
                    <CustomerDeposit setActiveTab={setCustomerActiveTab} />
                  )}
                  {customerActiveTab === 'withdraw' && (
                    <CustomerWithdraw setActiveTab={setCustomerActiveTab} />
                  )}
                  {customerActiveTab === 'history' && (
                    <CustomerHistory />
                  )}
                  {customerActiveTab === 'profile' && (
                    <CustomerProfile setActiveTab={setCustomerActiveTab} />
                  )}
                </main>

                {/* Customer Footer */}
                <CustomerFooter setActiveTab={setCustomerActiveTab} />

                {/* Mobile Bottom Nav */}
                <CustomerBottomNav activeTab={customerActiveTab} setActiveTab={setCustomerActiveTab} />
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
             ADMIN OPERATIONS CONTROL SYSTEM (WITH TOP MENU BAR)
             ========================================================================= */
          <div className="flex-1 flex flex-col bg-slate-100 min-h-screen">
            {!isAdminLoggedIn ? (
              <AdminAuth onAuthSuccess={() => setAdminActiveTab('admin_dashboard')} />
            ) : (
              <div className="flex-1 flex flex-col">
                {/* Redesigned Admin Header with Top Horizontal Menu Bar */}
                <AdminHeader
                  activeTab={adminActiveTab}
                  setActiveTab={setAdminActiveTab}
                />

                {/* Admin Main Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
                  {adminActiveTab === 'admin_dashboard' && (
                    <AdminDashboard setActiveTab={setAdminActiveTab} />
                  )}
                  {adminActiveTab === 'admin_tasks' && (
                    <AdminTasks />
                  )}
                  {adminActiveTab === 'admin_submissions' && (
                    <AdminSubmissions />
                  )}
                  {adminActiveTab === 'admin_users' && (
                    <AdminUsers />
                  )}
                  {adminActiveTab === 'admin_deposits' && (
                    <AdminDeposits />
                  )}
                  {adminActiveTab === 'admin_withdrawals' && (
                    <AdminWithdrawals />
                  )}
                  {adminActiveTab === 'admin_announcements' && (
                    <AdminAnnouncements />
                  )}
                  {adminActiveTab === 'admin_payments' && (
                    <AdminPayments />
                  )}
                  {adminActiveTab === 'admin_settings' && (
                    <AdminSettings />
                  )}
                  {adminActiveTab === 'admin_reports' && (
                    <AdminReports />
                  )}
                </main>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Task Interactive Modal (CAPTCHA, Math, Video, Survey) */}
      {activeTaskModal && (
        <TaskInteractionModal
          task={activeTaskModal}
          onClose={() => setActiveTaskModal(null)}
          onTaskCompleted={() => {
            // Context handles balances & tier rewards
          }}
        />
      )}

      {/* 4. Global Floating Toast Notifications */}
      <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl text-white text-xs sm:text-sm font-semibold transition-all transform animate-slideIn ${
              toast.type === 'success'
                ? 'bg-emerald-700/95 border border-emerald-500/50'
                : toast.type === 'error'
                ? 'bg-rose-700/95 border border-rose-500/50'
                : 'bg-indigo-700/95 border border-indigo-500/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-200 shrink-0" />}
              <span>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/20 rounded-lg ml-2 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AppErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('taskpay_customer_id_v4');
    localStorage.removeItem('taskpay_admin_auth_v4');
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-750 text-white shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black">Something went wrong / সাময়িক ত্রুটি হয়েছে</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              The page encountered a minor render issue. Please click below to refresh and resume your session smoothly.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all"
              >
                Reload Page / পেজ রিফ্রেশ করুন
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl text-xs transition-all"
              >
                Reset Session & Login Again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AppErrorBoundary>
  );
}
