"use client";

import React, { useEffect, useState } from 'react';
import { Minus, Square, X, Shield } from 'lucide-react';

interface ElectronWindow extends Window {
    electron?: {
        windowControls: {
            minimize: () => void;
            maximize: () => void;
            close: () => void;
        };
    };
}

export default function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        setIsDesktop(/Electron/.test(navigator.userAgent));
    }, []);

    if (!isDesktop) return null;

    const handleMinimize = () => {
        (window as unknown as ElectronWindow).electron?.windowControls?.minimize();
    };

    const handleMaximize = () => {
        (window as unknown as ElectronWindow).electron?.windowControls?.maximize();
        setIsMaximized(!isMaximized);
    };

    const handleClose = () => {
        (window as unknown as ElectronWindow).electron?.windowControls?.close();
    };

    return (
        <div className="h-10 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between select-none fixed top-0 left-0 right-0 z-[9999]">
            <div className="flex-1 h-full flex items-center px-4 gap-2" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                    PharmaMate — Pharmacy Management
                </span>
            </div>

            <div className="flex items-center h-full" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                <button 
                    onClick={handleMinimize}
                    className="h-full px-4 flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                    <Minus className="w-3.5 h-3.5" />
                </button>
                <button 
                    onClick={handleMaximize}
                    className="h-full px-4 flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                    <Square className="w-3 h-3" />
                </button>
                <button 
                    onClick={handleClose}
                    className="h-full px-4 flex items-center justify-center text-stone-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
