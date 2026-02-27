'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SwitcherOption {
    label: string;
    href: string;
    icon: LucideIcon;
}

interface MobileModeSwitcherProps {
    options: SwitcherOption[];
}

export default function MobileModeSwitcher({ options }: MobileModeSwitcherProps) {
    const pathname = usePathname();

    return (
        <div className="md:hidden flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900/50 rounded-2xl mb-8 overflow-x-auto scrollbar-hide border border-border-subtle/50">
            {options.map((option) => {
                const Icon = option.icon;
                const active = pathname === option.href;
                return (
                    <Link
                        key={option.href}
                        href={option.href}
                        className="relative flex items-center gap-2 px-5 py-3 rounded-xl transition-colors whitespace-nowrap min-w-fit"
                    >
                        {active && (
                            <motion.div
                                layoutId="switcher-pill"
                                className="absolute inset-0 bg-white dark:bg-stone-800 shadow-sm border border-border-subtle/30 rounded-xl z-0"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Icon size={16} className={`relative z-10 transition-colors ${active ? 'text-primary' : 'text-stone-400'}`} />
                        <span className={`relative z-10 text-[11px] font-bold uppercase tracking-wider transition-colors ${active ? 'text-primary' : 'text-stone-500'}`}>
                            {option.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
