'use client';

import React from 'react';
import { StatGrid } from './StatGrid';
import { ActivityTable } from './ActivityTable';
import { ShoppingBag } from 'lucide-react';
import { User, Order, QueueItem } from '@/lib/types';

interface DashboardDesktopProps {
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
    mounted: boolean;
    greeting: string;
}

export function DashboardDesktop({ user, orders, stats, loading, mounted, greeting }: DashboardDesktopProps) {
    if (!user) return null;

    return (
        <div className="space-y-6 pb-8 hidden md:block">
            {/* Welcome Section */}
            <div className="flex flex-row gap-5 animate-fade-in">
                <div className="flex-1 bg-surface border border-border-subtle rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-stone-400 font-medium">
                                {mounted ? greeting : 'Welcome'}
                            </p>
                            <h1 className="text-2xl font-semibold text-foreground mt-1 tracking-tight">
                                {user.name || 'Pharmacist'}
                            </h1>
                            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                                Here&apos;s what&apos;s happening at{' '}
                                <span className="font-medium text-foreground">
                                    {user.shopName || 'your pharmacy'}
                                </span>{' '}
                                today.
                            </p>
                        </div>
                        {mounted && (
                            <div className="text-right hidden sm:block flex-shrink-0 ml-6">
                                <p className="text-sm font-medium text-foreground tabular-nums">
                                    {new Date().toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                    })}
                                </p>
                                <div className="flex items-center gap-2 mt-2 justify-end">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                        System Online
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pharmacy Banner Image */}
                <div className="w-80 rounded-xl overflow-hidden relative flex-shrink-0" style={{ minHeight: '160px' }}>
                    <img
                        src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80"
                        alt="Pharmacy supplies"
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/30 to-transparent flex items-end p-5">
                        <div>
                            <p className="text-white font-semibold text-sm">PharmaMate Pro</p>
                            <p className="text-emerald-200/70 text-xs mt-0.5">
                                Clinical Management Suite
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <StatGrid stats={stats} loading={loading} />

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 items-start">
                <div className="space-y-6">
                    <ActivityTable orders={orders} loading={loading} />

                    {/* Operational Insights */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-surface border border-border-subtle rounded-xl p-5">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                    <ShoppingBag size={16} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                                    Live Fulfillment
                                </h4>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-3xl font-semibold text-foreground tabular-nums">
                                        {loading ? '\u2014' : stats.pending}
                                    </p>
                                    <p className="text-xs text-stone-400 mt-1">Active Orders</p>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400`}>
                                    Real-time Stream
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
