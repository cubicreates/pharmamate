'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, RefreshCw, Database } from 'lucide-react';

export type ConnectivityMode = 'live' | 'local' | 'syncing';

export default function ConnectivityStatus() {
    const [mode, setMode] = useState<ConnectivityMode>('live');
    const [lastSync, setLastSync] = useState<Date>(new Date());

    // Simulation logic for demonstration
    useEffect(() => {
        const modes: ConnectivityMode[] = ['live', 'local', 'syncing'];
        let currentIndex = 0;

        const interval = setInterval(() => {
            // Rotate for visual testing
            const nextMode = modes[currentIndex % modes.length];
            setMode(nextMode);
            if (nextMode === 'live') {
                setLastSync(new Date());
            }
            currentIndex++;
        }, 15000); // Rotate every 15 seconds

        return () => clearInterval(interval);
    }, []);

    const config = {
        live: {
            label: 'Live',
            icon: Wifi,
            color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            pulse: true
        },
        local: {
            label: 'Local Only',
            icon: Database,
            color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            pulse: false
        },
        syncing: {
            label: 'Syncing...',
            icon: RefreshCw,
            color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
            pulse: true
        }
    }[mode];

    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-2 px-2 min-[360px]:px-3 py-1.5 min-[360px]:gap-2.5 rounded-full border transition-all duration-500 ${config.color}`}>
            <div className="relative flex items-center justify-center">
                <Icon size={14} className={mode === 'syncing' ? 'animate-spin' : ''} />
                {config.pulse && (
                    <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-current animate-pulse ring-2 ring-white dark:ring-black`} />
                )}
            </div>

            <div className="hidden min-[360px]:flex flex-col -space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                    {config.label}
                </span>
                <span className="text-[8px] opacity-60 font-medium whitespace-nowrap">
                    {mode === 'local' ? 'Outage detected' : `Synced ${Math.floor((Date.now() - lastSync.getTime()) / 60000)}m ago`}
                </span>
            </div>
        </div>
    );
}
