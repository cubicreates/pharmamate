'use client';

import React from 'react';
import {
    PlusCircle,
    Scan,
    ChevronRight,
    Clock,
    AlertCircle,
    Package,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { User, Order, QueueItem } from '@/lib/types';
import MobileModeSwitcher from '../MobileModeSwitcher';
import { MOBILE_CATEGORIES } from '@/lib/constants/navigation';

interface DashboardMobileProps {
    user: User | null;
    orders: Order[];
    queue: QueueItem[];
    stats: {
        pending: number;
        ready: number;
        completed: number;
        revenue: number;
        expiring: number;
    };
    loading: boolean;
    greeting: string;
}

export function DashboardMobile({ user, orders, queue, stats, loading, greeting }: DashboardMobileProps) {
    const today = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    if (!user) return null;

    return (
        <div className="md:hidden space-y-10 animate-fade-in pb-20">
            <MobileModeSwitcher options={MOBILE_CATEGORIES.HOME} />

            {/* Mobile Header Greeting */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        {greeting}, {user.name?.split(' ')[0] || 'Pharmacist'}
                    </h1>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-widest mt-0.5">
                        {today} · <span className="text-emerald-500">System Online</span>
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center border border-border-subtle overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Quick Actions Grid - Big Tap Targets */}
            <div className="grid grid-cols-2 gap-4">
                <Link href="/counter" className="flex flex-col items-center justify-center p-6 bg-primary text-white rounded-3xl shadow-lg shadow-primary/20 transition-transform active:scale-95 text-center">
                    <PlusCircle size={24} className="mb-2" />
                    <span className="text-sm font-bold">New Sale</span>
                </Link>
                <Link href="/pos" className="flex flex-col items-center justify-center p-6 bg-surface border border-border-subtle rounded-3xl transition-transform active:scale-95 text-center shadow-sm">
                    <Scan size={24} className="mb-2 text-primary" />
                    <span className="text-sm font-bold">POS Scanner</span>
                </Link>
            </div>

            {/* Critical Stats Bar */}
            <div className="bg-surface border border-border-subtle rounded-3xl p-7 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">System Snapshot</h3>
                    <AlertCircle size={14} className="text-amber-500" />
                </div>
                <div className="flex justify-between items-center text-center">
                    <div className="flex-1">
                        <p className="text-xl font-black text-foreground">{loading ? '—' : stats.pending}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tight mt-1">Pending</p>
                    </div>
                    <div className="w-px h-10 bg-border-subtle" />
                    <div className="flex-1">
                        <p className="text-xl font-black text-foreground">{loading ? '—' : stats.completed}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tight mt-1">Filled</p>
                    </div>
                    <div className="w-px h-10 bg-border-subtle" />
                    <div className="flex-1">
                        <p className="text-xl font-black text-foreground">₹{loading ? '—' : (stats.revenue / 1000).toFixed(1)}k</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tight mt-1">Revenue</p>
                    </div>
                </div>
            </div>

            {/* Live Queue Strip */}
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-bold">Ready for Pickup</h3>
                    <Link href="/queue" className="text-xs font-bold text-primary flex items-center gap-1">
                        View All <ChevronRight size={14} />
                    </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                    {queue.length === 0 ? (
                        <div className="flex-shrink-0 w-48 p-4 rounded-2xl bg-stone-50 dark:bg-white/[0.02] border border-dashed border-border-subtle flex items-center justify-center">
                            <p className="text-[10px] text-stone-400 font-bold uppercase">Queue Empty</p>
                        </div>
                    ) : (
                        queue.map((item, i) => (
                            <div key={i} className="flex-shrink-0 w-48 p-4 rounded-2xl bg-surface border border-border-subtle shadow-sm">
                                <p className="text-xs font-bold truncate">{item.patientName}</p>
                                <p className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-wider">{item.patientPrn}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md">READY</span>
                                    <Clock size={12} className="text-stone-300" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Recent Orders List */}
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-bold">Recent Fulfillment</h3>
                </div>
                <div className="space-y-3 px-1">
                    {orders.slice(0, 5).map((order, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-surface border border-border-subtle rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{order.patientName}</p>
                                    <p className="text-[10px] text-stone-400 font-bold">{order.patientPrn}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black">₹{order.total}</p>
                                <p className="text-[10px] text-stone-400 font-bold uppercase">{order.status}</p>
                            </div>
                        </div>
                    ))}
                    <Link href="/orders" className="block w-full text-center py-4 text-xs font-bold text-stone-400 uppercase tracking-widest bg-stone-50 dark:bg-white/5 rounded-2xl border border-dashed border-border-subtle">
                        View More Orders
                    </Link>
                </div>
            </div>

            {/* Health & Insights */}
            <div className="grid grid-cols-2 gap-3 px-1">
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                    <TrendingUp size={16} className="text-blue-500 mb-2" />
                    <p className="text-lg font-black text-blue-500">94%</p>
                    <p className="text-[10px] font-bold text-blue-500/60 uppercase">Stock Info</p>
                </div>
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                    <AlertCircle size={16} className="text-amber-500 mb-2" />
                    <p className="text-lg font-black text-amber-500">{stats.expiring}</p>
                    <p className="text-[10px] font-bold text-amber-500/60 uppercase">Expiry Alert</p>
                </div>
            </div>
        </div>
    );
}
