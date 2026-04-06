'use client';

import React, { useEffect } from 'react';

import { PersonaProvider } from '@/lib/context/PersonaContext';

export default function PharmaClientWrapper({ children }: { children: React.ReactNode }) {
    const [isVerifying, setIsVerifying] = React.useState(true);

    useEffect(() => {
        // 1. Check for SSO redirect params
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get('token');
        const userFromUrl  = params.get('user');

        if (tokenFromUrl && userFromUrl) {
            localStorage.setItem('auth_token', tokenFromUrl);
            localStorage.setItem('auth_user', userFromUrl);
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }

        // 2. Check if logged in
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');

        if (!token || !userStr) {
            window.location.href = 'http://localhost:5111?redirect=pharmamate';
            return;
        }

        // 3. Strict Role Check: Pharma Mate is ONLY for Chemists
        try {
            const user = JSON.parse(userStr);
            if (user.type !== 'chemist') {
                // Clear session and redirect with error
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                window.location.href = 'http://localhost:5111?error=role_mismatch&required=chemist';
                return;
            }
        } catch {
            window.location.href = 'http://localhost:5111?redirect=pharmamate';
            return;
        }

        // 4. Setup complete
        setTimeout(() => setIsVerifying(false), 0);
    }, []);

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center animate-pulse">
                <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-6">
                    <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Connecting Pharmacy...</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verifying Regulatory Access</p>
            </div>
        );
    }

    return (
        <PersonaProvider>
            {children}
        </PersonaProvider>
    );
}
