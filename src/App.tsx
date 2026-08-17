import React, { useState } from 'react';
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
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminTasks } from './components/admin/AdminTasks';
import { AdminSubmissions } from './components/admin/AdminSubmissions';
import { AdminDeposits } from './components/admin/AdminDeposits';
import { AdminWithdrawals } from './components/admin/AdminWithdrawals';
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
  ArrowRightLeft,
  Check,
  Zap,
  LogOut,
  MapPin,
  LogIn
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
    quickSwitchUser,
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
  const [adminSidebarOpen, setAdminSidebarOpen] = useState<boolean>(false);
  const [activeTaskModal, setActiveTaskModal] = useState<Task | null>(null);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('responsive');

  const customerAccounts = users.filter(u => u.role === 'customer');
  const pendingDepositsCount = deposits.filter(d => d.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-200/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Global Website System Preview & Control Toolbar */}
      <aside
        aria-label="System Preview Toolbar"
        className="bg-slate-950 text-slate-200 text-xs py-2.5 px-3 sm:px-6 border-b border-slate-800 sticky top-0 z-50 shadow-md backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Role Switcher & App Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-black text-white text-xs sm:text-sm tracking-tight">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                TaskPay
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">
                System Live
              </span>
            </div>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            {/* Role switcher toggle buttons */}
            <div className="inline-flex bg-slate-900 p-0.5 rounded-xl border border-slate-800 shadow-inner">
              <button
                id="role-customer-btn"
                onClick={() => {
                  setCurrentRoleView('customer');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentRoleView === 'customer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t.customerPanel}</span>
                {isCustomerLoggedIn && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                )}
              </button>

              <button
                id="role-admin-btn"
                onClick={() => {
                  setCurrentRoleView('admin');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                  currentRoleView === 'admin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.adminPanel}</span>
                {isAdminLoggedIn && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                )}
                {pendingDepositsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                    {pendingDepositsCount}
                  </span>
                )}
              </button>
            </div>
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
              title="Fluid Full Width Web View"
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

          {/* Right: Quick Account Switcher & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentRoleView === 'customer' && isCustomerLoggedIn && (
              <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded-xl border border-slate-800">
                <span className="hidden md:inline text-[11px] text-slate-400 font-medium">
                  Active:
                </span>
                <span className="text-xs font-bold text-white max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  {currentUser.zone || 'Mymensingh'}
                </span>
                <button
                  onClick={logoutCustomer}
                  className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                  title="Logout Customer"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}

            {currentRoleView === 'customer' && !isCustomerLoggedIn && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                <LogIn className="w-3 h-3 text-emerald-400" />
                <span>Customer Login / Register</span>
              </div>
            )}

            {currentRoleView === 'admin' && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                <span className="text-slate-400">Admin:</span>
                <span className="font-bold text-indigo-300">
                  {isAdminLoggedIn ? 'Logged In (admin)' : 'user: admin | pass: admin1'}
                </span>
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

      {/* 2. Main System Container Frame with Viewport Simulation */}
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
            {/* If Customer is NOT logged in, show the Registration / Login Component */}
            {!isCustomerLoggedIn ? (
              <div className="flex-1 flex flex-col">
                <CustomerAuth onAuthSuccess={() => setCustomerActiveTab('dashboard')} />
                <CustomerFooter setActiveTab={setCustomerActiveTab} />
              </div>
            ) : (
              /* If Customer is logged in, show the full Dashboard & Features */
              <div className="flex-1 flex flex-col">
                {/* Customer Top Navigation */}
                <CustomerNavbar activeTab={customerActiveTab} setActiveTab={setCustomerActiveTab} />

                {/* Customer Screen Body */}
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
                    <CustomerProfile />
                  )}
                </main>

                {/* Customer Website Comprehensive Footer */}
                <CustomerFooter setActiveTab={setCustomerActiveTab} />

                {/* Mobile Bottom Navigation Bar (Responsive for smaller widths) */}
                <CustomerBottomNav activeTab={customerActiveTab} setActiveTab={setCustomerActiveTab} />
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
             ADMIN OPERATIONS CONTROL SYSTEM
             ========================================================================= */
          <div className="flex-1 flex flex-col bg-slate-100 min-h-screen">
            {!isAdminLoggedIn ? (
              <AdminAuth onAuthSuccess={() => setAdminActiveTab('admin_dashboard')} />
            ) : (
              <div className="flex-1 flex flex-col">
                <AdminHeader
                  sidebarOpen={adminSidebarOpen}
                  setSidebarOpen={setAdminSidebarOpen}
                  setActiveTab={setAdminActiveTab}
                />

                <div className="flex-1 flex">
                  {/* Admin Navigation Sidebar Drawer */}
                  <AdminSidebar
                    activeTab={adminActiveTab}
                    setActiveTab={setAdminActiveTab}
                    isOpen={adminSidebarOpen}
                    setIsOpen={setAdminSidebarOpen}
                  />

                  {/* Admin Main Body */}
                  <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
                    {adminActiveTab === 'admin_dashboard' && (
                      <AdminDashboard setActiveTab={setAdminActiveTab} />
                    )}
                    {adminActiveTab === 'admin_users' && (
                      <AdminUsers />
                    )}
                    {adminActiveTab === 'admin_tasks' && (
                      <AdminTasks />
                    )}
                    {adminActiveTab === 'admin_submissions' && (
                      <AdminSubmissions />
                    )}
                    {adminActiveTab === 'admin_deposits' && (
                      <AdminDeposits />
                    )}
                    {adminActiveTab === 'admin_withdrawals' && (
                      <AdminWithdrawals />
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
            // Handled in Context
          }}
        />
      )}

      {/* 4. Global Floating Toast Notifications Container */}
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

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
