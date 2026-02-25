
'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SplashScreen from '@/components/SplashScreen';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { StatGrid } from '@/components/dashboard/StatGrid';
import { ActivityTable } from '@/components/dashboard/ActivityTable';
import { QueueSidebar } from '@/components/dashboard/QueueSidebar';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function HomePage() {
    const router = useRouter();
    const { user, orders, queue, stats, loading, mounted } = useDashboard();
    const [showSplash, setShowSplash] = useState(false);

    useEffect(() => {
        const hasShownSplash = sessionStorage.getItem('splashShown');
        if (!hasShownSplash) {
            setShowSplash(true);
            const splashTimer = setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem('splashShown', 'true');
            }, 1500);
            return () => clearTimeout(splashTimer);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        router.push('/');
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    if (showSplash) return <SplashScreen />;

    return (
        <Layout onLogout={handleLogout}>
            <div className="space-y-6 pb-8">

                {/* Welcome Section */}
                <div className="flex flex-col lg:flex-row gap-5 animate-fade-in">
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
                    <div className="lg:w-80 rounded-xl overflow-hidden relative flex-shrink-0" style={{ minHeight: '160px' }}>
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <div className="lg:col-span-3 space-y-6">
                        <ActivityTable orders={orders} loading={loading} />

                        {/* Operational Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-surface border border-border-subtle rounded-xl p-5">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                        <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                                        Inventory Health
                                    </h4>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-3xl font-semibold text-foreground tabular-nums">94%</p>
                                        <p className="text-xs text-stone-400 mt-1">Sufficient Stock</p>
                                    </div>
                                    <div className="w-24">
                                        <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '94%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface border border-border-subtle rounded-xl p-5">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                                        <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                                        Expiry Alerts
                                    </h4>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-3xl font-semibold text-foreground tabular-nums">
                                            {loading ? '\u2014' : stats.expiring}
                                        </p>
                                        <p className="text-xs text-stone-400 mt-1">Expiring within 90 days</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${stats.expiring > 5
                                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                        }`}>
                                        {stats.expiring > 5 ? 'Review needed' : 'All clear'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Queue Sidebar */}
                    <div className="lg:col-span-1 h-full min-h-[500px]">
                        <QueueSidebar queue={queue} loading={loading} mounted={mounted} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
