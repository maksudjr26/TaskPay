import React, { useState, useEffect } from 'react';
import { getTodaySiteStats } from '../../utils/mockData';
import {
  UserPlus,
  ArrowDownLeft,
  ArrowUpRight,
  Activity,
  History,
  ShieldCheck,
  Zap,
  Clock,
  TrendingUp,
  Globe,
  Sparkles
} from 'lucide-react';

interface Props {
  lang?: 'bn' | 'en';
}

export const SiteHistoryLiveStats: React.FC<Props> = ({ lang = 'bn' }) => {
  const initial = getTodaySiteStats();

  // Dynamic state that increments randomly time to time in a day
  const [stats, setStats] = useState({
    todayRegistrations: initial.todayRegistrations,
    todayDepositsAmount: initial.todayDepositsAmount,
    todayDepositsCount: initial.todayDepositsCount,
    todayWithdrawalsAmount: initial.todayWithdrawalsAmount,
    todayWithdrawalsCount: initial.todayWithdrawalsCount,
    totalSiteMembers: initial.totalSiteMembers,
    totalPaidOut: initial.totalPaidOut,
    dateFormatted: initial.dateFormatted
  });

  const [recentPings, setRecentPings] = useState<{
    type: 'reg' | 'dep' | 'with';
    text: string;
    textBn: string;
    id: number;
  }[]>([]);

  // Random simulation interval
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      const randId = Date.now();

      if (rand < 0.4) {
        // Increment registration
        setStats(prev => ({
          ...prev,
          todayRegistrations: prev.todayRegistrations + 1,
          totalSiteMembers: prev.totalSiteMembers + 1
        }));
        const phone = `01${['7', '8', '9', '6', '3'][Math.floor(Math.random() * 5)]}${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 2)}***${Math.floor(100 + Math.random() * 900)}`;
        setRecentPings(prev => [
          {
            type: 'reg',
            text: `New member registered (${phone})`,
            textBn: `নতুন মেম্বার নিবন্ধিত হয়েছেন (${phone})`,
            id: randId
          },
          ...prev.slice(0, 4)
        ]);
      } else if (rand < 0.75) {
        // Increment deposit
        const depositBoost = [500, 1000, 1500, 3000, 5000][Math.floor(Math.random() * 5)];
        setStats(prev => ({
          ...prev,
          todayDepositsAmount: prev.todayDepositsAmount + depositBoost,
          todayDepositsCount: prev.todayDepositsCount + 1
        }));
        setRecentPings(prev => [
          {
            type: 'dep',
            text: `Approved deposit ৳${depositBoost} credited`,
            textBn: `৳${depositBoost} ডিপোজিট সফলভাবে জমা হয়েছে`,
            id: randId
          },
          ...prev.slice(0, 4)
        ]);
      } else {
        // Increment withdrawal
        const withdrawBoost = [300, 500, 800, 1200, 2500][Math.floor(Math.random() * 5)];
        setStats(prev => ({
          ...prev,
          todayWithdrawalsAmount: prev.todayWithdrawalsAmount + withdrawBoost,
          todayWithdrawalsCount: prev.todayWithdrawalsCount + 1,
          totalPaidOut: prev.totalPaidOut + withdrawBoost
        }));
        setRecentPings(prev => [
          {
            type: 'with',
            text: `Cashout ৳${withdrawBoost} disbursed instantly`,
            textBn: `৳${withdrawBoost} ক্যাশআউট সফলভাবে পরিশোধিত হয়েছে`,
            id: randId
          },
          ...prev.slice(0, 4)
        ]);
      }
    }, 4500); // Ticks every 4.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'bn' ? 'আজকের লাইভ হিস্ট্রি ও সাইট পরিসংখ্যান' : "Today's Live Site History & Activity"}
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {lang === 'bn' 
                ? `আজকের তারিখ: ${stats.dateFormatted} • সার্বিক সিস্টেম হিস্ট্রি ও লাইভ লেনদেন ডাটা` 
                : `Date: ${stats.dateFormatted} • Platform 24-Hour activity and site history`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            {lang === 'bn' ? 'সার্ভার রেসপন্স: ৯৯.৯৮%' : 'Server Uptime: 99.98%'}
          </span>
        </div>
      </div>

      {/* 3 Core Highlight Cards: Today Registered, Today Deposits, Today Withdrawals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* 1. Today Registered */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200/80 flex items-center justify-between transition-all hover:scale-[1.01]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              {lang === 'bn' ? 'আজকের নতুন রেজিস্ট্রেশন' : 'Today Registered'}
            </span>
            <div className="text-2xl font-black text-blue-950 font-mono tracking-tight transition-all">
              {stats.todayRegistrations.toLocaleString()} {lang === 'bn' ? 'জন' : 'Users'}
            </div>
            <span className="text-[10px] text-blue-700 font-semibold block">
              {lang === 'bn' ? 'নতুন সক্রিয় সদস্য যুক্ত হয়েছে' : 'New registered accounts today'}
            </span>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-700 flex items-center justify-center shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Today Deposits */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/80 flex items-center justify-between transition-all hover:scale-[1.01]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
              {lang === 'bn' ? 'আজকের মোট ডিপোজিট' : 'Today Deposits'}
            </span>
            <div className="text-2xl font-black text-emerald-950 font-mono tracking-tight transition-all">
              ৳{stats.todayDepositsAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              {stats.todayDepositsCount} {lang === 'bn' ? 'টি সফল প্যাকেজ রিচার্জ' : 'recharges processed'}
            </span>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Today Withdrawals */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/50 border border-purple-200/80 flex items-center justify-between transition-all hover:scale-[1.01]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
              {lang === 'bn' ? 'আজকের সফল উইথড্রয়াল' : 'Today Withdrawals'}
            </span>
            <div className="text-2xl font-black text-purple-950 font-mono tracking-tight transition-all">
              ৳{stats.todayWithdrawalsAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-700 font-semibold block">
              {stats.todayWithdrawalsCount} {lang === 'bn' ? 'টি সফল ক্যাশআউট সম্পন্ন' : 'withdrawals disbursed'}
            </span>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-purple-500/15 text-purple-700 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Recent Event Ticker */}
      {recentPings.length > 0 && (
        <div className="p-3 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">
              {lang === 'bn' ? 'লাইভ আপডেট:' : 'Live Activity:'}
            </span>
            <span className="text-emerald-300 font-medium truncate">
              {lang === 'bn' ? recentPings[0].textBn : recentPings[0].text}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
            {lang === 'bn' ? 'এইমাত্র' : 'Just now'}
          </span>
        </div>
      )}

      {/* Site History & Lifetime Milestones Strip */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              {lang === 'bn' ? 'প্ল্যাটফর্ম লাইফটাইম হিস্ট্রি' : 'Site Lifetime History'}
            </div>
            <div className="text-xs text-slate-300">
              {lang === 'bn' ? 'স্বচ্ছ ও নিরাপদ মাইক্রো-টাস্ক আর্নিং প্ল্যাটফর্ম' : 'Verified instant payouts and task rewards'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto text-center sm:text-left">
          <div className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">
              {lang === 'bn' ? 'মোট নিবন্ধিত মেম্বার' : 'Total Members'}
            </span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              {stats.totalSiteMembers.toLocaleString()}+
            </span>
          </div>

          <div className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">
              {lang === 'bn' ? 'সর্বমোট পেইড-আউট' : 'Total Disbursed'}
            </span>
            <span className="text-sm font-black text-amber-400 font-mono">
              ৳{stats.totalPaidOut.toLocaleString()}+
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-semibold block">
              {lang === 'bn' ? 'নিরাপত্তা ও পেমেন্ট রেট' : 'Trust Score'}
            </span>
            <span className="text-sm font-black text-cyan-400 font-mono">
              100% Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
