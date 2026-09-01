import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserTier, AccountStatus, ZoneType } from '../../types';
import { AVAILABLE_ZONES } from '../../utils/mockData';
import { UserTierBadge } from '../common/UserTierBadge';
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  DollarSign,
  Phone,
  Calendar,
  X,
  MapPin,
  Crown,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Lock,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  FileText,
  Key,
  UserPlus,
  Ban,
  RefreshCw,
  Copy,
  Check,
  Mail,
  User as UserIcon,
  Sparkles,
  Share2,
  AlertTriangle,
  History,
  ArrowDownLeft
} from 'lucide-react';

const TIER_OPTIONS: UserTier[] = ['General', 'Silver', 'Gold', 'Platinum', 'VIP'];

const BLOCK_REASONS = [
  'Suspicious or fraudulent activity',
  'Multiple fake task submissions',
  'Violation of platform terms of service',
  'Chargeback or payment dispute',
  'Multiple accounts under same IP/device',
  'Manual administrative review'
];

export const AdminUsers: React.FC = () => {
  const {
    users,
    addUserByAdmin,
    toggleUserStatus,
    blockUser,
    unblockUser,
    setUserStatus,
    adjustUserBalance,
    updateUserByAdmin,
    changeUserTier,
    deleteUser,
    transactions,
    deposits,
    withdrawals,
    t,
    lang,
    settings,
    showToast
  } = useApp();

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'blocked'>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState<User | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null);
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<User | null>(null);
  const [selectedUserForBlock, setSelectedUserForBlock] = useState<User | null>(null);
  const [blockReason, setBlockReason] = useState(BLOCK_REASONS[0]);
  const [customBlockReason, setCustomBlockReason] = useState('');

  // Password Visibility States
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showViewPassword, setShowViewPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // View Modal Active Tab
  const [viewTab, setViewTab] = useState<'overview' | 'transactions' | 'deposits' | 'withdrawals'>('overview');

  // ==========================================
  // Add User Form State
  // ==========================================
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newZone, setNewZone] = useState<string>('Dhaka');
  const [newUserType, setNewUserType] = useState<UserTier>('General');
  const [newStatus, setNewStatus] = useState<AccountStatus>('active');
  const [newDepositBalance, setNewDepositBalance] = useState<number>(0);
  const [newTaskBalance, setNewTaskBalance] = useState<number>(0);
  const [newReferralCode, setNewReferralCode] = useState('');
  const [newReferredBy, setNewReferredBy] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // ==========================================
  // Edit User Form State
  // ==========================================
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editUserType, setEditUserType] = useState<UserTier>('General');
  const [editZone, setEditZone] = useState<string>('Dhaka');
  const [editStatus, setEditStatus] = useState<AccountStatus>('active');
  const [editDepositBalance, setEditDepositBalance] = useState<number>(0);
  const [editTaskBalance, setEditTaskBalance] = useState<number>(0);
  const [editReferralCode, setEditReferralCode] = useState('');
  const [editReferredBy, setEditReferredBy] = useState('');
  const [editFirstDepositApproved, setEditFirstDepositApproved] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  // ==========================================
  // Balance Adjust Form State
  // ==========================================
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustBalanceType, setAdjustBalanceType] = useState<'deposit' | 'task' | 'total'>('deposit');
  const [adjustReason, setAdjustReason] = useState('');

  // Filter customers only (exclude admin from list management)
  const customerList = users.filter(u => u.role === 'customer');

  // Metrics
  const activeCount = customerList.filter(u => u.status === 'active').length;
  const inactiveCount = customerList.filter(u => u.status === 'inactive').length;
  const blockedCount = customerList.filter(u => u.status === 'blocked').length;
  const totalDepositBalance = customerList.reduce((sum, u) => sum + (u.depositBalance || 0), 0);
  const totalTaskBalance = customerList.reduce((sum, u) => sum + (u.taskBalance || 0), 0);

  // Filter logic
  const filteredUsers = customerList.filter(user => {
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    if (tierFilter !== 'all' && (user.userType || 'General') !== tierFilter) return false;
    if (zoneFilter !== 'all' && (user.zone || 'Dhaka') !== zoneFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (user.name || '').toLowerCase().includes(q);
      const matchPhone = (user.phone || '').includes(q);
      const matchZone = (user.zone || '').toLowerCase().includes(q);
      const matchId = (user.id || '').toLowerCase().includes(q);
      const matchTier = (user.userType || '').toLowerCase().includes(q);
      const matchEmail = (user.email || '').toLowerCase().includes(q);
      const matchUsername = (user.username || '').toLowerCase().includes(q);
      const matchRefCode = (user.referralCode || '').toLowerCase().includes(q);
      const matchNotes = (user.notes || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchZone || matchId || matchTier || matchEmail || matchUsername || matchRefCode || matchNotes;
    }

    return true;
  });

  // Generator helpers
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const generateReferralCode = () => {
    return 'TP' + Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(lang === 'bn' ? 'কপি করা হয়েছে!' : 'Copied to clipboard!', 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Open Add User Modal with fresh defaults
  const handleOpenAddUser = () => {
    setNewName('');
    setNewPhone('');
    setNewPassword('123456');
    setNewEmail('');
    setNewUsername('');
    setNewZone('Dhaka');
    setNewUserType('General');
    setNewStatus('active');
    setNewDepositBalance(0);
    setNewTaskBalance(0);
    setNewReferralCode(generateReferralCode());
    setNewReferredBy('');
    setNewNotes('');
    setShowAddPassword(false);
    setShowAddUserModal(true);
  };

  // Submit Add User
  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      showToast(lang === 'bn' ? 'নাম ও মোবাইল নম্বর আবশ্যক' : 'Name and phone are required', 'error');
      return;
    }

    const res = addUserByAdmin({
      name: newName.trim(),
      phone: newPhone.trim(),
      password: newPassword.trim() || '123456',
      email: newEmail.trim() || `${newPhone.trim()}@taskpay.com`,
      username: newUsername.trim() || `user_${newPhone.slice(-4)}`,
      zone: newZone,
      userType: newUserType,
      status: newStatus,
      depositBalance: Number(newDepositBalance) || 0,
      taskBalance: Number(newTaskBalance) || 0,
      referralCode: newReferralCode.trim() || generateReferralCode(),
      referredBy: newReferredBy.trim() || undefined,
      notes: newNotes.trim()
    });

    if (res.success) {
      setShowAddUserModal(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user: User) => {
    setSelectedUserForEdit(user);
    setEditName(user.name || '');
    setEditPhone(user.phone || '');
    setEditPassword(user.password || '123456');
    setEditEmail(user.email || '');
    setEditUsername(user.username || '');
    setEditUserType(user.userType || 'General');
    setEditZone(user.zone || 'Dhaka');
    setEditStatus(user.status || 'active');
    setEditDepositBalance(user.depositBalance ?? 0);
    setEditTaskBalance(user.taskBalance ?? 0);
    setEditReferralCode(user.referralCode || '');
    setEditReferredBy(user.referredBy || '');
    setEditFirstDepositApproved(Boolean(user.firstDepositApproved));
    setEditNotes(user.notes || '');
    setShowEditPassword(false);
  };

  // Submit Edit Form
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    const depBal = Number(editDepositBalance) || 0;
    const taskBal = Number(editTaskBalance) || 0;

    const updates: Partial<User> = {
      name: editName.trim(),
      phone: editPhone.trim(),
      password: editPassword.trim(),
      email: editEmail.trim(),
      username: editUsername.trim(),
      userType: editUserType,
      zone: editZone,
      status: editStatus,
      depositBalance: depBal,
      taskBalance: taskBal,
      balance: depBal + taskBal,
      referralCode: editReferralCode.trim(),
      referredBy: editReferredBy.trim() || undefined,
      firstDepositApproved: editFirstDepositApproved,
      notes: editNotes.trim()
    };

    updateUserByAdmin(selectedUserForEdit.id, updates);

    // If currently viewing the same user, update the view state too
    if (selectedUserForView && selectedUserForView.id === selectedUserForEdit.id) {
      setSelectedUserForView({
        ...selectedUserForView,
        ...updates
      });
    }

    setSelectedUserForEdit(null);
  };

  // Quick Block Action with Reason
  const handleOpenBlockModal = (user: User) => {
    setSelectedUserForBlock(user);
    setBlockReason(BLOCK_REASONS[0]);
    setCustomBlockReason('');
  };

  const handleConfirmBlock = () => {
    if (!selectedUserForBlock) return;
    const finalReason = customBlockReason.trim() || blockReason;
    blockUser(selectedUserForBlock.id, finalReason);
    setSelectedUserForBlock(null);
    if (selectedUserForView && selectedUserForView.id === selectedUserForBlock.id) {
      setSelectedUserForView({ ...selectedUserForView, status: 'blocked' });
    }
  };

  // Quick Unblock Action
  const handleQuickUnblock = (userId: string) => {
    unblockUser(userId);
    if (selectedUserForView && selectedUserForView.id === userId) {
      setSelectedUserForView({ ...selectedUserForView, status: 'active' });
    }
  };

  // Submit Balance Adjustment
  const handleBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBalance) return;
    const num = parseFloat(adjustAmount);
    if (!num || num <= 0) return;

    adjustUserBalance(
      selectedUserForBalance.id,
      num,
      adjustType,
      adjustBalanceType,
      adjustReason || 'Admin adjustment'
    );
    setSelectedUserForBalance(null);
    setAdjustAmount('');
    setAdjustReason('');
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!selectedUserForDelete) return;
    const success = deleteUser(selectedUserForDelete.id);
    if (success) {
      if (selectedUserForView && selectedUserForView.id === selectedUserForDelete.id) {
        setSelectedUserForView(null);
      }
      setSelectedUserForDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>{lang === 'bn' ? 'ইউজার ম্যানেজমেন্ট ও একাউন্ট নিয়ন্ত্রণ' : 'Customer Account Management'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {lang === 'bn'
                  ? `নতুন ইউজার যোগ করুন, তথ্য সম্পাদনা করুন, ব্লক/আনব্লক করুন এবং ব্যালেন্স নিয়ন্ত্রণ করুন`
                  : `Add new users, edit full profile info, block/unblock accounts, adjust balances & delete records`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Add New User Button */}
          <button
            onClick={handleOpenAddUser}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-200 transition-all cursor-pointer"
            id="admin-add-user-btn"
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'bn' ? '+ নতুন ইউজার তৈরি করুন' : '+ Add New Customer'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'bn' ? 'মোট কাস্টমার' : 'Total Customers'}</span>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">{customerList.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সক্রিয় ইউজার' : 'Active Users'}</span>
          </div>
          <div className="text-xl font-black text-emerald-700 mt-1">{activeCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-amber-600 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'নিষ্ক্রিয় ইউজার' : 'Inactive'}</span>
          </div>
          <div className="text-xl font-black text-amber-700 mt-1">{inactiveCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'blocked' ? 'all' : 'blocked')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'blocked'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200/80 hover:border-rose-200'
          }`}
          title="Click to filter blocked users"
        >
          <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1.5">
            <Ban className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ব্লকড ইউজার' : 'Blocked Users'}</span>
          </div>
          <div className="text-xl font-black text-rose-700 mt-1">{blockedCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'bn' ? 'সংরক্ষিত ফিক্সড' : 'Fixed Deposits'}</span>
          </div>
          <div className="text-base font-black text-emerald-700 mt-1">৳{totalDepositBalance.toLocaleString()}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'bn' ? 'উত্তোলনযোগ্য আর্নিং' : 'Task Earnings'}</span>
          </div>
          <div className="text-base font-black text-indigo-700 mt-1">৳{totalTaskBalance.toLocaleString()}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'নাম, ফোন নম্বর, আইডি, জোন বা রেফার কোড দিয়ে খুঁজুন...' : 'Search by name, phone, ID, zone, ref code...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none hover:border-slate-300 cursor-pointer"
          >
            <option value="all">{lang === 'bn' ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
            <option value="active">Active (সক্রিয়)</option>
            <option value="inactive">Inactive (নিষ্ক্রিয়)</option>
            <option value="blocked">Blocked (ব্লকড)</option>
          </select>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none hover:border-slate-300 cursor-pointer"
          >
            <option value="all">{lang === 'bn' ? 'সকল টিয়ার' : 'All Tiers'}</option>
            {TIER_OPTIONS.map(tr => (
              <option key={tr} value={tr}>{tr} Tier</option>
            ))}
          </select>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none hover:border-slate-300 cursor-pointer"
          >
            <option value="all">{lang === 'bn' ? 'সকল অঞ্চল / জোন' : 'All Zones'}</option>
            {AVAILABLE_ZONES.map(z => (
              <option key={z.id} value={z.id}>{z.id}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(statusFilter !== 'all' || tierFilter !== 'all' || zoneFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setTierFilter('all');
                setZoneFilter('all');
                setSearchQuery('');
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'রিসেট' : 'Reset'}
            </button>
          )}
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">
              {lang === 'bn' ? 'কোন কাস্টমার পাওয়া যায়নি' : 'No customers match your criteria'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'bn' ? 'ফিল্টার পরিবর্তন করুন অথবা নতুন কাস্টমার তৈরি করুন।' : 'Try adjusting your search terms or add a new customer.'}
            </p>
            <button
              onClick={handleOpenAddUser}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 cursor-pointer"
            >
              {lang === 'bn' ? '+ নতুন ইউজার তৈরি করুন' : '+ Add New Customer'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                  <th className="px-5 py-4">{lang === 'bn' ? 'কাস্টমার প্রোফাইল' : 'Customer Info'}</th>
                  <th className="px-4 py-4">{lang === 'bn' ? 'মেম্বারশিপ টিয়ার' : 'Membership Tier'}</th>
                  <th className="px-4 py-4">{lang === 'bn' ? 'জোন / অঞ্চল' : 'Zone'}</th>
                  <th className="px-4 py-4">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="px-4 py-4">{lang === 'bn' ? 'মোট ব্যালেন্স' : 'Total Balance'}</th>
                  <th className="px-4 py-4">{lang === 'bn' ? 'ওয়ালেট বিভাজন' : 'Wallet Split'}</th>
                  <th className="px-4 py-4">{lang === 'bn' ? 'টাস্ক সম্পন্ন' : 'Tasks'}</th>
                  <th className="px-5 py-4 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((user) => {
                  const currentTier = (user.userType || 'General') as UserTier;
                  const isBlocked = user.status === 'blocked';
                  const isActive = user.status === 'active';

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isBlocked ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* User Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl font-black flex items-center justify-center text-sm shrink-0 border ${
                            isBlocked
                              ? 'bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          }`}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isBlocked && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700 uppercase">
                                  Blocked
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{user.phone}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                              <span>ID: {user.id}</span>
                              {user.referralCode && (
                                <span className="text-indigo-600 font-bold">Ref: {user.referralCode}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tier Badge & Quick Tier Selector */}
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          <UserTierBadge tier={currentTier} size="xs" lang={lang} />
                          <div className="flex items-center gap-1">
                            <select
                              value={currentTier}
                              onChange={(e) => changeUserTier(user.id, e.target.value as UserTier)}
                              className="text-[10px] font-bold bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-700 outline-none hover:bg-slate-200 cursor-pointer"
                              title="Quickly change user tier"
                            >
                              {TIER_OPTIONS.map(tr => (
                                <option key={tr} value={tr}>
                                  {tr}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>

                      {/* Zone Column */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{user.zone || 'Dhaka'}</span>
                        </span>
                      </td>

                      {/* Status Badge with Quick Toggle */}
                      <td className="px-4 py-4">
                        {isBlocked ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <Ban className="w-3 h-3 text-rose-600" />
                              <span>Blocked</span>
                            </span>
                            <button
                              onClick={() => handleQuickUnblock(user.id)}
                              className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold cursor-pointer"
                              title="Click to unblock user"
                            >
                              Unblock
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            }`}
                            title="Click to toggle active / inactive status"
                          >
                            {isActive ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{t.active}</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>{t.inactive}</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>

                      {/* Total Balance */}
                      <td className="px-4 py-4 font-black text-slate-900 text-sm">
                        {settings.currencySymbol}{(user.balance ?? 0).toLocaleString()}
                      </td>

                      {/* Wallet Split: Deposit vs Task Balance */}
                      <td className="px-4 py-4 text-[11px] text-slate-600">
                        <div>
                          Fixed Dep: <span className="font-bold text-emerald-700">৳{(user.depositBalance ?? 0).toLocaleString()}</span>
                        </div>
                        <div>
                          Earning: <span className="font-bold text-indigo-700">৳{(user.taskBalance ?? 0).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Tasks Completed */}
                      <td className="px-4 py-4 font-bold text-slate-700">
                        {user.tasksCompletedCount || 0}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Info */}
                          <button
                            onClick={() => {
                              setSelectedUserForView(user);
                              setShowViewPassword(false);
                              setViewTab('overview');
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer"
                            title={lang === 'bn' ? 'ইউজার প্রোফাইল বিবরণ দেখুন' : 'View User Info'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit User Info */}
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
                            title={lang === 'bn' ? 'ইউজার তথ্য পরিবর্তন ও এডিট করুন' : 'Edit User Details'}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Adjust Balance */}
                          <button
                            onClick={() => setSelectedUserForBalance(user)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                            title={lang === 'bn' ? 'ব্যালেন্স সমন্বয় করুন' : 'Adjust Balance'}
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>

                          {/* Block / Unblock Toggle */}
                          {isBlocked ? (
                            <button
                              onClick={() => handleQuickUnblock(user.id)}
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                              title={lang === 'bn' ? 'অ্যাকাউন্ট আনব্লক করুন' : 'Unblock Account'}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenBlockModal(user)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                              title={lang === 'bn' ? 'ইউজার ব্লক করুন' : 'Block User'}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete User */}
                          <button
                            onClick={() => setSelectedUserForDelete(user)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                            title={lang === 'bn' ? 'কাস্টমার অ্যাকাউন্ট ডিলিট করুন' : 'Delete User'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. ADD NEW USER MODAL */}
      {/* ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {lang === 'bn' ? 'নতুন কাস্টমার একাউন্ট তৈরি করুন' : 'Create New Customer Account'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'সকল প্রয়োজনীয় তথ্য দিয়ে অ্যাডমিন কর্তৃক সরাসরি রেজিস্ট্রেশন' : 'Register a new customer directly into the platform'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewUser} className="space-y-4 pt-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Md. Hasan Ali"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone Number'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="017xxxxxxxx"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Password & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'লগইন পাসওয়ার্ড' : 'Login Password'} *
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewPassword(generateRandomPassword())}
                      className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{lang === 'bn' ? 'জেনারেট করুন' : 'Generate'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showAddPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-9 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddPassword(!showAddPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'অ্যাকাউন্ট স্ট্যাটাস' : 'Account Status'}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as AccountStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="active">Active (সক্রিয়)</option>
                    <option value="inactive">Inactive (নিষ্ক্রিয়)</option>
                    <option value="blocked">Blocked (ব্লকড)</option>
                  </select>
                </div>
              </div>

              {/* Email & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)' : 'Email Address (Optional)'}
                  </label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ইউজারনেম (ঐচ্ছিক)' : 'Username (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="hasan99"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Tier & Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'bn' ? 'মেম্বারশিপ টিয়ার' : 'Initial Membership Tier'}</span>
                  </label>
                  <select
                    value={newUserType}
                    onChange={(e) => setNewUserType(e.target.value as UserTier)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white outline-none focus:border-indigo-500"
                  >
                    {TIER_OPTIONS.map(tr => (
                      <option key={tr} value={tr}>
                        {tr} Tier
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'bn' ? 'অঞ্চল / জোন' : 'User Zone'}</span>
                  </label>
                  <select
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white outline-none focus:border-indigo-500"
                  >
                    {AVAILABLE_ZONES.map(z => (
                      <option key={z.id} value={z.id}>
                        {z.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Initial Balances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'প্রারম্ভিক ফিক্সড ডিপোজিট ব্যালেন্স (৳)' : 'Initial Fixed Deposit Balance (৳)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newDepositBalance}
                    onChange={(e) => setNewDepositBalance(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-emerald-700 outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {lang === 'bn' ? 'সংরক্ষিত লেভেল ডিপোজিট' : 'Reserved for Level Up'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'প্রারম্ভিক টাস্ক আর্নিং ব্যালেন্স (৳)' : 'Initial Task Earning Balance (৳)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newTaskBalance}
                    onChange={(e) => setNewTaskBalance(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-indigo-700 outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {lang === 'bn' ? 'উত্তোলনযোগ্য ব্যালেন্স' : 'Withdrawable balance'}
                  </span>
                </div>

                <div className="col-span-full text-xs font-bold text-slate-700 pt-1 border-t border-slate-200 flex items-center justify-between">
                  <span>{lang === 'bn' ? 'মোট ব্যালেন্স হবে:' : 'Total Calculated Balance:'}</span>
                  <span className="text-emerald-700 text-sm">৳{Number(newDepositBalance) + Number(newTaskBalance)}</span>
                </div>
              </div>

              {/* Referral Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ইউজারের নিজস্ব রেফার কোড' : 'Custom Referral Code'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newReferralCode}
                      onChange={(e) => setNewReferralCode(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-indigo-700 outline-none focus:border-indigo-500 uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => setNewReferralCode(generateReferralCode())}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'রেফার করেছেন কে (Referred By)' : 'Referred By (Code / Phone)'}
                  </label>
                  <input
                    type="text"
                    placeholder="Referrer code or phone"
                    value={newReferredBy}
                    onChange={(e) => setNewReferredBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'অ্যাডমিন নোট / মন্তব্য' : 'Admin Notes / Remarks'}
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: রেফারেন্স ইউজার, স্পেশাল অ্যাকাউন্ট ইত্যাদি' : 'e.g., Created manually by Admin'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 cursor-pointer transition-colors"
                >
                  {lang === 'bn' ? 'ইউজার তৈরি নিশ্চিত করুন' : 'Create User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDIT / UPDATE ALL USER INFO MODAL */}
      {/* ========================================================================= */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {lang === 'bn' ? 'ইউজারের সকল তথ্য সম্পাদনা ও আপডেট' : 'Edit Complete Customer Information'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {selectedUserForEdit.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForEdit(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'কাস্টমার নাম' : 'Customer Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Password & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'লগইন পাসওয়ার্ড' : 'Login Password'} *
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditPassword(generateRandomPassword())}
                      className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{lang === 'bn' ? 'নতুন জেনারেট' : 'Reset Random'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      required
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-9 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'অ্যাকাউন্ট স্ট্যাটাস' : 'Account Status'}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as AccountStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="active">Active (সক্রিয়)</option>
                    <option value="inactive">Inactive (নিষ্ক্রিয়)</option>
                    <option value="blocked">Blocked (ব্লকড / স্থগিত)</option>
                  </select>
                </div>
              </div>

              {/* Email & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ইউজারনেম' : 'Username'}
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Tier & Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'bn' ? 'মেম্বারশিপ টিয়ার' : 'Membership Tier'}</span>
                  </label>
                  <select
                    value={editUserType}
                    onChange={(e) => setEditUserType(e.target.value as UserTier)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white outline-none focus:border-indigo-500"
                  >
                    {TIER_OPTIONS.map(tr => (
                      <option key={tr} value={tr}>
                        {tr} Tier
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'bn' ? 'অঞ্চল / জোন' : 'User Zone'}</span>
                  </label>
                  <select
                    value={editZone}
                    onChange={(e) => setEditZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white outline-none focus:border-indigo-500"
                  >
                    {AVAILABLE_ZONES.map(z => (
                      <option key={z.id} value={z.id}>
                        {z.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Balance Overrides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reserved Fixed Deposit Balance (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editDepositBalance}
                    onChange={(e) => setEditDepositBalance(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-emerald-700 outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {lang === 'bn' ? 'সংরক্ষিত লেভেল ডিপোজিট' : 'Reserved Deposit for Level Up'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Withdrawable Task Earning Balance (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editTaskBalance}
                    onChange={(e) => setEditTaskBalance(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-indigo-700 outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {lang === 'bn' ? 'উত্তোলনযোগ্য ব্যালেন্স' : 'Withdrawable balance'}
                  </span>
                </div>

                <div className="col-span-full text-xs font-bold text-slate-700 pt-1 border-t border-slate-200 flex items-center justify-between">
                  <span>Total Calculated Balance:</span>
                  <span className="text-emerald-700 text-sm">৳{Number(editDepositBalance) + Number(editTaskBalance)}</span>
                </div>
              </div>

              {/* Referral Codes & First Deposit Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ইউজারের নিজস্ব রেফার কোড' : 'Referral Code'}
                  </label>
                  <input
                    type="text"
                    value={editReferralCode}
                    onChange={(e) => setEditReferralCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-indigo-700 outline-none focus:border-indigo-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'রেফার করেছেন কে (Referred By)' : 'Referred By'}
                  </label>
                  <input
                    type="text"
                    value={editReferredBy}
                    onChange={(e) => setEditReferredBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* First Deposit Approved Checkbox */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="editFirstDepositApproved"
                  checked={editFirstDepositApproved}
                  onChange={(e) => setEditFirstDepositApproved(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="editFirstDepositApproved" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  {lang === 'bn' ? 'প্রথম ডিপোজিট অনুমোদিত (5% রেফারেল বোনাস ছাড় হয়েছে)' : 'First Deposit Approved (Referral 5% Bonus Disbursed)'}
                </label>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'অ্যাডমিন নোট / মন্তব্য' : 'Admin Notes / Remarks'}
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: বিশ্বস্ত ইউজার, বিশেষ নোট ইত্যাদি' : 'e.g., Verified user / VIP client'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  {lang === 'bn' ? 'সকল পরিবর্তন সংরক্ষণ করুন' : 'Save All Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BLOCK USER MODAL */}
      {/* ========================================================================= */}
      {selectedUserForBlock && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Ban className="w-7 h-7" />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-lg text-slate-900">
                {lang === 'bn' ? 'কাস্টমার অ্যাকাউন্ট ব্লক করবেন?' : 'Block Customer Account?'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'bn'
                  ? `ব্লক করলে ইউজার লগইন করতে পারবে না এবং সকল টাস্ক/উত্তোলন সাময়িকভাবে স্থগিত থাকবে।`
                  : `Blocking will immediately prevent this user from logging in and suspend task earnings.`}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div>User: <strong>{selectedUserForBlock.name}</strong></div>
              <div>Phone: <strong>{selectedUserForBlock.phone}</strong></div>
              <div>Current Balance: <strong className="text-indigo-700">৳{selectedUserForBlock.balance}</strong></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'ব্লক করার কারণ নির্বাচন করুন:' : 'Select Block Reason:'}
              </label>
              <select
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:border-rose-500"
              >
                {BLOCK_REASONS.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'কাস্টম নোট / বিবরণ (ঐচ্ছিক):' : 'Custom Note (Optional):'}
              </label>
              <input
                type="text"
                placeholder="Optional details..."
                value={customBlockReason}
                onChange={(e) => setCustomBlockReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-rose-500"
              >
              </input>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForBlock(null)}
                className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 cursor-pointer"
              >
                {lang === 'bn' ? 'হ্যাঁ, একাউন্ট ব্লক করুন' : 'Confirm Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DELETE USER CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {selectedUserForDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900">
                {lang === 'bn' ? 'ব্যবহারকারী নিশ্চিতভাবে ডিলিট করবেন?' : 'Delete Customer Account?'}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {lang === 'bn'
                  ? `আপনি কি নিশ্চিত যে "${selectedUserForDelete.name}" (${selectedUserForDelete.phone}) এর অ্যাকাউন্টটি সম্পূর্ণ মুছে ফেলতে চান? এই ইউজারের লগইন এবং সকল অ্যাকাউন্ট ডাটা অপসারিত হবে।`
                  : `Are you sure you want to permanently delete "${selectedUserForDelete.name}" (${selectedUserForDelete.phone})? This customer will lose access and their data will be removed.`}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-left text-xs text-rose-950 space-y-1 font-mono">
              <div>Customer: <strong>{selectedUserForDelete.name}</strong></div>
              <div>Phone: <strong>{selectedUserForDelete.phone}</strong></div>
              <div>Current Balance: <strong className="text-rose-700">৳{selectedUserForDelete.balance}</strong></div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForDelete(null)}
                className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
              >
                {lang === 'bn' ? 'হ্যাঁ, ডিলিট করুন' : 'Yes, Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BALANCE ADJUST MODAL */}
      {/* ========================================================================= */}
      {selectedUserForBalance && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <span>{lang === 'bn' ? 'ব্যালেন্স সমন্বয় (Adjust Balance)' : 'Adjust User Balance'}</span>
              </h3>
              <button
                onClick={() => setSelectedUserForBalance(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-500">Customer:</span>{' '}
              <strong className="text-slate-900">{selectedUserForBalance.name}</strong> ({selectedUserForBalance.phone})
              <div className="mt-1 text-slate-500 flex items-center justify-between">
                <span>Current Total Balance:</span>
                <strong className="text-emerald-700 font-black">৳{selectedUserForBalance.balance}</strong>
              </div>
              <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                <span>Fixed Dep: <strong>৳{selectedUserForBalance.depositBalance || 0}</strong></span>
                <span>Task Earn: <strong>৳{selectedUserForBalance.taskBalance || 0}</strong></span>
              </div>
            </div>

            <form onSubmit={handleBalanceSubmit} className="space-y-4">
              {/* Type Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    adjustType === 'add' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addBalance}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('deduct')}
                  className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    adjustType === 'deduct' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>{t.deductBalance}</span>
                </button>
              </div>

              {/* Balance Type / Wallet */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Balance Wallet
                </label>
                <select
                  value={adjustBalanceType}
                  onChange={(e) => setAdjustBalanceType(e.target.value as 'deposit' | 'task' | 'total')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="deposit">Deposit Wallet (সংরক্ষিত ফিক্সড ডিপোজিট)</option>
                  <option value="task">Task Earning Wallet (উত্তোলনযোগ্য টাস্ক আর্নিং)</option>
                  <option value="total">Total Balance (সার্বিক ব্যালেন্স)</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'টাকার পরিমাণ' : 'Amount'} (৳)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold outline-none focus:border-indigo-500"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason / Description
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g., Manual deposit bonus / Adjustment"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              {/* Tier recalculation notice */}
              <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-[11px] text-indigo-900 leading-relaxed">
                <strong>{lang === 'bn' ? 'লেভেল আপডেট নোটিশ:' : 'Tier Recalculation:'}</strong>{' '}
                {lang === 'bn'
                  ? 'ডিপোজিট ব্যালেন্স কর্তন বা বৃদ্ধি করলে ইউজারের মেম্বারশিপ টিয়ার স্বয়ংক্রিয়ভাবে নতুন ব্যালেন্স অনুযায়ী পরিবর্তিত বা ডাউনগ্রেড হবে।'
                  : 'Adjusting or deducting deposit balance will automatically recalculate/downgrade the user membership tier according to the new fixed deposit balance.'}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBalance(null)}
                  className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. 360° USER PROFILE & AUDIT MODAL */}
      {/* ========================================================================= */}
      {selectedUserForView && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-2xl font-black text-xl flex items-center justify-center shadow-xs border ${
                  selectedUserForView.status === 'blocked'
                    ? 'bg-rose-100 text-rose-700 border-rose-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                }`}>
                  {selectedUserForView.name ? selectedUserForView.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900">{selectedUserForView.name}</h3>
                    <UserTierBadge tier={(selectedUserForView.userType || 'General') as UserTier} size="xs" lang={lang} />
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedUserForView.phone}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForView(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Modal Tab Selector */}
            <div className="flex items-center gap-2 pt-4 border-b border-slate-100 pb-2">
              <button
                onClick={() => setViewTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewTab('transactions')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewTab === 'transactions'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setViewTab('deposits')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewTab === 'deposits'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setViewTab('withdrawals')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewTab === 'withdrawals'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Withdrawals
              </button>
            </div>

            {/* Tab 1: Overview */}
            {viewTab === 'overview' && (
              <div className="space-y-4 pt-4">
                {/* Financial Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
                    <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Fixed Deposit</span>
                    </div>
                    <div className="text-lg font-black text-emerald-700 mt-1">
                      ৳{(selectedUserForView.depositBalance ?? 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/60">
                    <div className="text-[11px] text-indigo-800 font-semibold flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Task Wallet</span>
                    </div>
                    <div className="text-lg font-black text-indigo-700 mt-1">
                      ৳{(selectedUserForView.taskBalance ?? 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Total Deposited</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">
                      ৳{selectedUserForView.totalDeposited || 0}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Total Earned</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">
                      ৳{selectedUserForView.totalEarned || 0}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Tasks Completed</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">
                      {selectedUserForView.tasksCompletedCount || 0} tasks
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Total Withdrawn</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">
                      ৳{selectedUserForView.totalWithdrawn || 0}
                    </div>
                  </div>
                </div>

                {/* Account Details Specs */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-700 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Account Credentials & Details</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-slate-400">User ID:</span>{' '}
                      <span className="font-mono font-bold text-slate-800">{selectedUserForView.id}</span>
                    </div>

                    <div>
                      <span className="text-slate-400">Status:</span>{' '}
                      <span className={`font-bold capitalize ${
                        selectedUserForView.status === 'active'
                          ? 'text-emerald-700'
                          : selectedUserForView.status === 'blocked'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}>
                        {selectedUserForView.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400">Login Mobile:</span>{' '}
                      <span className="font-mono font-bold text-slate-800">{selectedUserForView.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Password:</span>{' '}
                      <span className="font-mono font-bold text-slate-800">
                        {showViewPassword ? (selectedUserForView.password || 'N/A') : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowViewPassword(!showViewPassword)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                      >
                        {showViewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div>
                      <span className="text-slate-400">Email:</span>{' '}
                      <span className="text-slate-800 font-semibold">{selectedUserForView.email || 'N/A'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400">Zone:</span>{' '}
                      <span className="text-slate-800 font-bold">{selectedUserForView.zone || 'Dhaka'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400">Referral Code:</span>{' '}
                      <span className="font-mono font-bold text-indigo-600">{selectedUserForView.referralCode || 'N/A'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400">Joined Date:</span>{' '}
                      <span className="font-bold text-slate-800">{selectedUserForView.joinedDate || 'Recent'}</span>
                    </div>
                  </div>

                  {selectedUserForView.notes && (
                    <div className="pt-2 border-t border-slate-200 text-slate-600">
                      <span className="font-semibold text-slate-700">Admin Notes:</span> {selectedUserForView.notes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Transactions */}
            {viewTab === 'transactions' && (
              <div className="pt-4 max-h-72 overflow-y-auto space-y-2">
                {transactions.filter(t => t.userId === selectedUserForView.id).length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">No transactions recorded for this user.</div>
                ) : (
                  transactions
                    .filter(t => t.userId === selectedUserForView.id)
                    .map((trx) => (
                      <div key={trx.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{lang === 'bn' ? trx.titleBn || trx.title : trx.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{trx.date}</div>
                        </div>
                        <div className={`font-black text-sm ${trx.amount >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {trx.amount >= 0 ? `+৳${trx.amount}` : `-৳${Math.abs(trx.amount)}`}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {/* Tab 3: Deposits */}
            {viewTab === 'deposits' && (
              <div className="pt-4 max-h-72 overflow-y-auto space-y-2">
                {deposits.filter(d => d.userId === selectedUserForView.id).length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">No deposit requests from this user.</div>
                ) : (
                  deposits
                    .filter(d => d.userId === selectedUserForView.id)
                    .map((dep) => (
                      <div key={dep.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{dep.methodTitle || dep.method.toUpperCase()} Deposit</div>
                          <div className="text-[10px] text-slate-400 font-mono">TrxID: {dep.transactionId} | {dep.createdAt}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-emerald-700">৳{dep.amount}</div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            dep.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : dep.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {dep.status}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {/* Tab 4: Withdrawals */}
            {viewTab === 'withdrawals' && (
              <div className="pt-4 max-h-72 overflow-y-auto space-y-2">
                {withdrawals.filter(w => w.userId === selectedUserForView.id).length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">No withdrawal requests from this user.</div>
                ) : (
                  withdrawals
                    .filter(w => w.userId === selectedUserForView.id)
                    .map((w) => (
                      <div key={w.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{(w.method || 'BKASH').toUpperCase()} Withdrawal</div>
                          <div className="text-[10px] text-slate-400 font-mono">To: {w.recipientNumber} | {w.createdAt}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-rose-700">৳{w.amount}</div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            w.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : w.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {w.status}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {/* Quick Actions Footer inside View Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const userToDelete = selectedUserForView;
                    setSelectedUserForView(null);
                    setSelectedUserForDelete(userToDelete);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                </button>

                {selectedUserForView.status === 'blocked' ? (
                  <button
                    type="button"
                    onClick={() => handleQuickUnblock(selectedUserForView.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'আনব্লক করুন' : 'Unblock'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const u = selectedUserForView;
                      setSelectedUserForView(null);
                      handleOpenBlockModal(u);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'ব্লক করুন' : 'Block'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const u = selectedUserForView;
                    setSelectedUserForView(null);
                    setSelectedUserForBalance(u);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ব্যালেন্স সমন্বয়' : 'Adjust Balance'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const u = selectedUserForView;
                    setSelectedUserForView(null);
                    handleOpenEdit(u);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'তথ্য এডিট করুন' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
