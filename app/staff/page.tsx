'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import {
    Users,
    Shield,
    Coffee,
    BarChart3,
    ChevronRight,
    UserCheck,
    UserX,
} from 'lucide-react';
import MobileModeSwitcher from '@/components/MobileModeSwitcher';
import { MOBILE_CATEGORIES } from '@/lib/constants/navigation';
import { apiRequest } from '@/lib/utils/api';
import type { StaffMember } from '@/lib/mock/platform-data';

export default function StaffPage() {
    const router = useRouter();
    const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await apiRequest<StaffMember[]>('/api/staff');
                setStaffList(data || []);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        router.push('/');
    };

    const onDuty = useMemo(() => staffList.filter(s => s.status === 'On Duty'), [staffList]);
    const onBreak = useMemo(() => staffList.filter(s => s.status === 'On Break'), [staffList]);
    const offDuty = useMemo(() => staffList.filter(s => s.status === 'Off Duty'), [staffList]);

    const getShiftProgress = (staff: StaffMember): number => {
        const now = new Date();
        const start = new Date(staff.shiftStart);
        const end = new Date(staff.shiftEnd);
        const total = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();
        return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
    };

    const getTimeRemaining = (staff: StaffMember): string => {
        const now = new Date();
        const end = new Date(staff.shiftEnd);
        const diff = end.getTime() - now.getTime();
        if (diff <= 0) return 'Shift ended';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m remaining`;
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'On Duty': return 'bg-emerald-500';
            case 'On Break': return 'bg-amber-500';
            default: return 'bg-stone-400';
        }
    };

    if (loading) {
        return (
            <Layout onLogout={handleLogout}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout onLogout={handleLogout}>
            <div className="space-y-8 pb-12 animate-fade-in">
                <MobileModeSwitcher options={MOBILE_CATEGORIES.ADMIN} />
                {/* Header */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ minHeight: '180px' }}>
                    <img
                        src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80"
                        alt="Pharmacy team"
                        className="w-full h-56 object-cover"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-transparent flex items-center px-10">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Users size={18} className="text-emerald-400" />
                                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest">Admin Hub</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">Staff & Shift Management</h1>
                            <p className="text-sm text-stone-300/60 mt-2 max-w-md leading-relaxed">
                                Monitor active shifts, till assignments, and team performance.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-surface border border-border-subtle rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                <UserCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">On Duty</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">{onDuty.length}</p>
                    </div>
                    <div className="bg-surface border border-border-subtle rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                <Coffee size={16} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">On Break</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">{onBreak.length}</p>
                    </div>
                    <div className="bg-surface border border-border-subtle rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                                <UserX size={16} className="text-stone-500" />
                            </div>
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Off Duty</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">{offDuty.length}</p>
                    </div>
                    <div className="bg-surface border border-border-subtle rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                <BarChart3 size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Txns</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">
                            {staffList.reduce((sum, s) => sum + s.transactionsToday, 0)}
                        </p>
                    </div>
                </div>

                {/* Staff List */}
                <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield size={15} className="text-emerald-600" />
                            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Team</h3>
                        </div>
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500">
                            {staffList.length} Members
                        </span>
                    </div>

                    <div className="divide-y divide-border-subtle">
                        {staffList.map(staff => {
                            const progress = getShiftProgress(staff);
                            const remaining = getTimeRemaining(staff);
                            const isExpanded = selectedStaff === staff._id;

                            return (
                                <button
                                    key={staff._id}
                                    onClick={() => setSelectedStaff(isExpanded ? null : staff._id)}
                                    className="w-full text-left px-5 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className="relative">
                                                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                                    {staff.avatar}
                                                </div>
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-stone-900 ${statusColor(staff.status)}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{staff.name}</p>
                                                <p className="text-xs text-stone-500">{staff.role} • {staff.tillAssignment}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-medium text-foreground">{remaining}</p>
                                                <p className="text-[10px] text-stone-400">{staff.transactionsToday} transactions</p>
                                            </div>
                                            <ChevronRight size={14} className={`text-stone-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="mt-4 ml-15 space-y-4 animate-fade-in" onClick={e => e.stopPropagation()}>
                                            {/* Shift Progress */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Shift Progress</span>
                                                    <span className="text-[10px] font-mono text-stone-500">{progress}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between mt-1">
                                                    <span className="text-[10px] text-stone-400">{new Date(staff.shiftStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="text-[10px] text-stone-400">{new Date(staff.shiftEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>

                                            {/* Performance */}
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3 text-center">
                                                    <p className="text-lg font-semibold text-foreground">{staff.salesAccuracy}%</p>
                                                    <p className="text-[10px] text-stone-400 uppercase">Accuracy</p>
                                                </div>
                                                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3 text-center">
                                                    <p className="text-lg font-semibold text-foreground">{staff.transactionsToday}</p>
                                                    <p className="text-[10px] text-stone-400 uppercase">TXNs Today</p>
                                                </div>
                                                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <div className={`w-2 h-2 rounded-full ${statusColor(staff.status)}`} />
                                                        <p className="text-sm font-semibold text-foreground">{staff.status}</p>
                                                    </div>
                                                    <p className="text-[10px] text-stone-400 uppercase">Status</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
