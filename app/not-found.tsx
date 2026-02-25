'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 p-6 text-center">
            {/* Premium 404 Visual */}
            <div className="relative mb-12">
                <h1 className="text-[140px] font-black text-stone-100 dark:text-stone-900/40 leading-none select-none">404</h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-3xl shadow-xl flex items-center justify-center text-3xl mb-4 rotate-12">
                        📂
                    </div>
                    <div className="px-5 py-1.5 bg-primary text-white rounded-full shadow-2xl font-black text-[10px] uppercase tracking-[0.3em] -rotate-3">
                        Resource Not Found
                    </div>
                </div>
            </div>

            {/* Vague Production Message */}
            <div className="max-w-sm space-y-3">
                <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Are you lost?</h2>
                <p className="text-sm text-stone-500 leading-relaxed">
                    The prescription, clinical module, or record you are searching for could not be located in our secure database. It may have been relocated or archived.
                </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button onClick={() => router.push('/')} className="btn-primary">
                    Back to Dashboard
                </button>
                <button className="px-6 py-2.5 rounded-xl text-sm font-bold border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5 transition-all">
                    Contact Support
                </button>
            </div>

            {/* Corporate Metadata Footer */}
            <div className="mt-20 pt-8 border-t border-stone-200 dark:border-white/5 w-full max-w-xs">
                <div className="flex justify-between items-center text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    <span>Terminal Status</span>
                    <span className="text-success flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Encrypted
                    </span>
                </div>
                <p className="mt-3 text-[9px] text-stone-300 dark:text-stone-700 font-medium">
                    PharmaMate Distributed Network • Version 4.0.1
                </p>
            </div>
        </div>
    );
}
