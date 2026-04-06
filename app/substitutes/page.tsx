'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { 
    FlaskConical, Search, AlertCircle, 
    CheckCircle2, Loader2, Info, Pill, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:8000';

interface SubstituteResult {
    original: string;
    salt: string;
    alternatives: { name: string; strength: string; company: string }[];
    counseling: string;
}

export default function SubstitutesPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SubstituteResult | null>(null);

    const findSubstitutes = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API}/meds/substitutes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medicine_name: query })
            });
            if (res.ok) setResult(await res.json());
        } catch (e) { console.error('AI error', e); }
        finally { setLoading(false); }
    };

    const handleLogout = () => { localStorage.clear(); sessionStorage.clear(); window.location.href = 'http://localhost:5173'; };

    return (
        <Layout onLogout={handleLogout}>
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-foreground">
                
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground italic uppercase">Substitute Lab</h1>
                        <p className="text-sm text-muted mt-1 font-medium">Identify salts and find therapeutic equivalents via Omni-AI</p>
                    </div>
                </div>

                {/* ── Search Hero ── */}
                <div className="glass-card rounded-[32px] p-8 md:p-12 border border-border-subtle relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
                    
                    <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FlaskConical size={32} />
                        </div>
                        <h2 className="text-2xl font-black">Which medicine is out of stock?</h2>
                        
                        <div className="flex flex-col md:flex-row gap-3 pt-4">
                            <div className="flex-1 bg-stone-50 dark:bg-stone-900 border border-border-subtle rounded-2xl px-6 py-4 flex items-center gap-4 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                                <Search size={20} className="text-muted" />
                                <input 
                                    type="text" 
                                    placeholder="Enter Brand name (e.g. Augmentin 625)" 
                                    className="bg-transparent border-none outline-none text-lg font-bold w-full text-stone-900"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && findSubstitutes()}
                                />
                            </div>
                            <button 
                                onClick={findSubstitutes}
                                disabled={loading || !query}
                                className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-light transition-all shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 size={24} className="animate-spin" /> : 'Analyze'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── AI Results ── */}
                <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12"
                    >
                        {/* 1. Substance Identification */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="glass-card rounded-3xl p-6 border border-border-subtle h-full">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Molecule profile</p>
                                <div className="space-y-4">
                                    <div className="p-4 bg-primary/5 rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Drug Name</p>
                                        <p className="text-xl font-black">{result.original}</p>
                                    </div>
                                    <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Active Salts</p>
                                        <p className="text-sm font-bold text-foreground leading-relaxed">{result.salt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Direct Substitutes */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card rounded-3xl p-8 border border-border-subtle">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <Pill size={24} className="text-primary" />
                                        <h3 className="text-xl font-black italic uppercase">Suggested Substitutes</h3>
                                    </div>
                                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Verified Salts</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {result.alternatives.map((alt, i) => (
                                        <motion.div 
                                            key={i}
                                            whileHover={{ scale: 1.02 }}
                                            className="p-5 bg-stone-50 dark:bg-stone-800/50 hover:bg-white dark:hover:bg-stone-800 rounded-2xl border border-border-subtle cursor-pointer transition-all shadow-sm group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <div className="px-3 py-1 bg-white/50 dark:bg-stone-900/50 rounded-lg text-[9px] font-black uppercase border border-border-subtle">
                                                    {alt.strength}
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-black tracking-tight mb-1 text-foreground">{alt.name}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted">{alt.company}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* AI Counseling Note */}
                                <div className="mt-8 pt-8 border-t border-border-subtle">
                                    <div className="flex items-center gap-3 mb-4">
                                        <BookOpen size={18} className="text-primary" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">AIAssistant Counselor Note</h4>
                                    </div>
                                    <div className="bg-stone-50 dark:bg-stone-900 border border-primary/20 p-6 rounded-2xl relative">
                                        <div className="absolute top-4 right-4">
                                            <Info size={16} className="text-primary opacity-30" />
                                        </div>
                                        <p className="text-sm font-medium leading-[1.8] text-foreground italic">
                                            "{result.counseling}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}
