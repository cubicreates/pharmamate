'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ScanLine,
    ChevronRight,
    AlertTriangle,
    Clock,
    Package,
    ArrowLeft,
    Download,
    Upload,
    Plus,
    TrendingUp,
    MapPin
} from 'lucide-react';
import { InventoryItem } from '@/lib/types';
import MobileModeSwitcher from '../MobileModeSwitcher';
import { MOBILE_CATEGORIES } from '@/lib/constants/navigation';

interface InventoryMobileProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    filteredInventory: InventoryItem[];
    lowStockCount: number;
    expiringSoonCount: number;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function InventoryMobile({
    searchQuery,
    setSearchQuery,
    filteredInventory,
    lowStockCount,
    expiringSoonCount
}: InventoryMobileProps) {
    const [view, setView] = useState<'overview' | 'stock'>('overview');

    return (
        <div className="md:hidden animate-fade-in pb-32 overflow-x-hidden">
            <AnimatePresence mode="wait">
                {view === 'stock' ? (
                    <motion.div
                        key="stock-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <MobileModeSwitcher options={MOBILE_CATEGORIES.STOCK} />

                        <div className="flex items-center justify-between px-1">
                            <button
                                onClick={() => setView('overview')}
                                className="flex items-center gap-2 text-stone-500 font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
                            >
                                <ArrowLeft size={14} /> Back
                            </button>
                            <div className="text-[10px] font-black text-primary px-3 py-1 bg-primary/5 rounded-full uppercase tracking-tighter">
                                {filteredInventory.length} Items Found
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                                <Search size={14} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                className="w-full bg-surface border border-border-subtle rounded-3xl pl-14 pr-14 py-4 text-sm font-medium focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <ScanLine size={14} />
                            </button>
                        </div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="space-y-4"
                        >
                            {filteredInventory.slice(0, 25).map((item) => (
                                <motion.div
                                    variants={itemAnim}
                                    key={item._id}
                                    whileTap={{ scale: 0.98 }}
                                    className="group p-4 sm:p-5 bg-surface border border-border-subtle rounded-[2rem] shadow-sm flex items-center justify-between relative overflow-hidden active:bg-stone-50 transition-colors"
                                >
                                    {item.stock <= item.reorderLevel && (
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full -mr-8 -mt-8" />
                                    )}

                                    <div className="min-w-0 flex-1 mr-2 sm:mr-4">
                                        <h3 className="font-black text-sm sm:text-base text-foreground tracking-tight truncate">{item.name}</h3>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
                                            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                                <MapPin size={10} className="text-stone-300" />
                                                Shelf {item.shelf}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-stone-200" />
                                            <div className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                                {item.batchNo}
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 sm:gap-2 mt-4 flex-wrap">
                                            {item.stock <= item.reorderLevel ? (
                                                <span className="text-[8px] sm:text-[9px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm shadow-red-500/20">Critical Stock</span>
                                            ) : (
                                                <span className="text-[8px] sm:text-[9px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">In Stock</span>
                                            )}
                                            <span className="text-[8px] sm:text-[9px] font-black bg-stone-100 dark:bg-stone-800 text-foreground px-2 py-0.5 rounded-full uppercase tracking-tighter">₹{item.price}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end shrink-0">
                                        <div className={`text-xl sm:text-2xl font-black ${item.stock <= item.reorderLevel ? 'text-red-500' : 'text-primary'}`}>
                                            {item.stock}
                                        </div>
                                        <p className="text-[8px] sm:text-[9px] font-black text-stone-400 uppercase tracking-widest sm:tracking-[0.2em] -mt-1">QTY</p>
                                        <ChevronRight size={14} className="mt-2 text-stone-300 group-active:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            ))}

                            {filteredInventory.length === 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
                                    <div className="w-20 h-20 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Package size={32} className="text-stone-300" />
                                    </div>
                                    <p className="text-sm font-black text-stone-400 uppercase tracking-widest">No Products Found</p>
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.button
                            key="fab"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            className="fixed bottom-32 right-6 w-16 h-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center z-50 ring-4 ring-white dark:ring-stone-950"
                        >
                            <Plus size={32} />
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="overview-view"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-12"
                    >
                        <MobileModeSwitcher options={MOBILE_CATEGORIES.STOCK} />

                        {/* Mobile Header */}
                        <div className="px-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.2em]">Live Status</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter leading-none text-foreground">Stock<br /><span className="text-primary italic">Intelligence</span></h1>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <motion.div whileTap={{ scale: 0.95 }} className="p-4 sm:p-6 bg-red-500/5 border border-red-500/10 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden">
                                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-500/10 rounded-full" />
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-red-500">
                                    <AlertTriangle size={12} className="sm:w-3.5 sm:h-3.5" />
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Low Stock</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-black text-red-500 leading-none">{lowStockCount}</p>
                                <p className="text-[9px] sm:text-[10px] font-bold text-red-500/60 mt-2 sm:mt-3 uppercase tracking-tight">Requires Action</p>
                            </motion.div>

                            <motion.div whileTap={{ scale: 0.95 }} className="p-4 sm:p-6 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden">
                                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/10 rounded-full" />
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-amber-500">
                                    <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Expiring</span>
                                </div>
                                <p className="text-3xl sm:text-4xl font-black text-amber-500 leading-none">{expiringSoonCount}</p>
                                <p className="text-[9px] sm:text-[10px] font-bold text-amber-500/60 mt-2 sm:mt-3 uppercase tracking-tight">Next 90 Days</p>
                            </motion.div>
                        </div>

                        {/* Primary Actions */}
                        <div className="space-y-4">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setView('stock')}
                                className="w-full flex items-center justify-between p-4 sm:p-6 bg-surface border border-border-subtle rounded-[2rem] sm:rounded-[2.5rem] shadow-sm text-left group active:bg-stone-50 transition-all border-b-4 border-b-stone-100 dark:border-b-stone-800"
                            >
                                <div className="flex items-center gap-3 sm:gap-5">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner ring-4 ring-primary/5">
                                        <Search size={22} strokeWidth={2.5} />
                                    </div>
                                    <div className="min-w-0 pr-2">
                                        <p className="font-black text-base sm:text-lg tracking-tight truncate">Inventory Search</p>
                                        <p className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-wider sm:tracking-[0.15em] mt-0.5 truncate">Edit SKU · Audit Logs</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-stone-50 dark:bg-stone-900 border border-border-subtle flex items-center justify-center group-active:translate-x-1 transition-transform">
                                    <ChevronRight size={16} className="text-stone-300" />
                                </div>
                            </motion.button>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-3 sm:gap-4 py-6 sm:py-8 bg-emerald-600 text-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-emerald-600/20 active:bg-emerald-700 transition-colors">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <Download size={22} className="sm:w-6 sm:h-6" />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center">Inward Entry</span>
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-3 sm:gap-4 py-6 sm:py-8 bg-purple-600 text-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-purple-600/20 active:bg-purple-700 transition-colors">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <Upload size={22} className="sm:w-6 sm:h-6" />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center">Stock Out</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Recent Insights */}
                        <div className="px-1">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400">System Insights</h3>
                                <TrendingUp size={14} className="text-blue-500" />
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 relative overflow-hidden group">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                        <TrendingUp size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-blue-600/80 dark:text-blue-400 leading-relaxed">
                                        AI Forecast: <span className="text-foreground">Anti-allergics</span> demand will spike by <span className="text-blue-600 dark:text-blue-400 font-black">25%</span> next week due to seasonal change.
                                    </p>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <TrendingUp size={100} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
