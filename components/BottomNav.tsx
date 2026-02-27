'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    ScanLine,
    Clock,
    TrendingUp,
    Package,
    Repeat2
} from 'lucide-react';
import { usePersona } from '@/lib/context/PersonaContext';

export default function BottomNav() {
    const pathname = usePathname();
    const { activeRole } = usePersona();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const mainItems = [
        { href: '/', label: 'Home', icon: LayoutDashboard },
        { href: '/pos', label: 'Sales', icon: ScanLine },
        { href: '/queue', label: 'Flow', icon: Clock },
        ...(activeRole === 'CHEMIST_ADMIN'
            ? [
                { href: '/inventory', label: 'Stock', icon: Package },
                { href: '/revenue', label: 'Admin', icon: TrendingUp }
            ]
            : [
                { href: '/substitutes', label: 'Alts', icon: Repeat2 }
            ]
        )
    ];

    const getIsTabActive = (label: string, itemPath: string) => {
        const active = isActive(itemPath);
        if (label === 'Sales' && (pathname.startsWith('/pos') || pathname.startsWith('/counter') || pathname.startsWith('/substitutes'))) return true;
        if (label === 'Flow' && (pathname.startsWith('/queue') || pathname.startsWith('/orders') || pathname.startsWith('/dispatch'))) return true;
        if (label === 'Stock' && (pathname.startsWith('/inventory') || pathname.startsWith('/vendors'))) return true;
        if (label === 'Admin' && (pathname.startsWith('/revenue') || pathname.startsWith('/staff') || pathname.startsWith('/clinician-connect') || pathname.startsWith('/settings'))) return true;
        return active;
    };

    return (
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[96%] max-w-lg bg-surface/80 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-[100] px-2 py-2">
            <div className="flex items-center justify-between relative">
                {mainItems.map((item) => {
                    const Icon = item.icon;
                    const isTabActive = getIsTabActive(item.label, item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center flex-1 py-1"
                        >
                            {isTabActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl z-0"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`relative z-10 flex flex-col items-center gap-1.5 transition-colors duration-300 ${isTabActive ? 'text-primary' : 'text-stone-400'}`}
                            >
                                <Icon size={22} strokeWidth={isTabActive ? 2.5 : 2} />
                                <span className={`text-[9px] font-black uppercase tracking-wider md:tracking-widest ${isTabActive ? 'opacity-100' : 'opacity-50'}`}>
                                    {item.label}
                                </span>
                            </motion.div>

                            {isTabActive && (
                                <motion.div
                                    layoutId="nav-dot"
                                    className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
