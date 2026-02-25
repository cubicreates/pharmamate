'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        // Hidden toggle for development details
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            setIsDev(true);
        }
        console.error('System Exception:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 p-6 text-center">
            {/* Visual Identity */}
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center text-4xl mb-8 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-ping opacity-20" />
                📋
            </div>

            {/* Production Message */}
            <div className="max-w-md space-y-4">
                <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Something went wrong.</h1>
                <p className="text-sm text-stone-500 leading-relaxed">
                    We&apos;re experiencing a temporary technical issue with our clinical modules. Our systems have flagged this for our engineers to resolve.
                </p>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <button
                    onClick={() => reset()}
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    <span>🔄 Sync & Try Again</span>
                </button>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5 transition-all"
                >
                    Return to Dashboard
                </button>
            </div>

            <p className="mt-8 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                Error Code: PM-SYNC-EXC
            </p>

            {/* Developer Diagnostics - Only visible in local dev or via hidden state */}
            {isDev && (
                <div className="mt-16 p-5 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-white/5 rounded-2xl text-left max-w-2xl w-full">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Developer Console Data</p>
                        <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">DEBUG MODE</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 font-mono mb-2 p-3 bg-white dark:bg-black/20 rounded-lg border border-stone-200 dark:border-white/5">
                        {error.message || 'Fatal system exception detected.'}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] text-stone-400 uppercase font-bold mb-1">Trace Identity</p>
                            <p className="text-[10px] text-stone-500 font-mono">{error.digest || 'anonymous-trace'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-stone-400 uppercase font-bold mb-1">Execution Env</p>
                            <p className="text-[10px] text-stone-500 font-mono">Turbopack (SSR)</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Support Footer */}
            <div className="mt-12 text-[10px] text-stone-500">
                Need immediate assistance? <span className="text-primary font-bold cursor-pointer hover:underline">Contact Pharmacy IT →</span>
            </div>
        </div>
    );
}
