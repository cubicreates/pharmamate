
'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SplashScreen from '@/components/SplashScreen';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { DashboardDesktop } from '@/components/dashboard/DashboardDesktop';
import { DashboardMobile } from '@/components/dashboard/DashboardMobile';

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
            <DashboardDesktop
                user={user}
                orders={orders}
                queue={queue}
                stats={stats}
                loading={loading}
                mounted={mounted}
                greeting={greeting}
            />
            <DashboardMobile
                user={user}
                orders={orders}
                queue={queue}
                stats={stats}
                loading={loading}
                greeting={greeting}
            />
        </Layout>
    );
}
