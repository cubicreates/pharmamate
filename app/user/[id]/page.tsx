'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import {
    User, Building2, Mail, Phone, MapPin, Award,
    ShieldCheck, Save, Settings, ChevronRight, Loader2
} from 'lucide-react';

export default function UserProfilePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '', shopName: '', email: '', mobile: '', address: '', licenseNumber: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    };

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem('chemUser') || sessionStorage.getItem('chemUser') || '{}'
        );
        setFormData({
            name: user.name || '',
            shopName: user.shopName || '',
            email: user.email || '',
            mobile: user.phone || user.mobile || '',
            address: user.address || '',
            licenseNumber: user.licenseNumber || '',
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const data = await apiRequest<Record<string, unknown>>('/api/chemists/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    name: formData.name,
                    shopName: formData.shopName,
                    mobile: formData.mobile,
                    address: formData.address,
                }),
            });
            const currentUser = JSON.parse(
                localStorage.getItem('chemUser') || sessionStorage.getItem('chemUser') || '{}'
            );
            const updatedUser = { ...currentUser, ...data };
            if (localStorage.getItem('chemUser'))
                localStorage.setItem('chemUser', JSON.stringify(updatedUser));
            else sessionStorage.setItem('chemUser', JSON.stringify(updatedUser));
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch (err: unknown) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout onLogout={handleLogout}>
            <div className="flex flex-col gap-4 sm:gap-6 pb-8 max-w-[1200px] mx-auto animate-fade-in">
                {/* ── Hero Banner ── */}
                <div className="relative w-full min-h-[160px] sm:min-h-[180px] rounded-lg sm:rounded-2xl overflow-hidden bg-[#0f3d2e] border border-border-subtle">
                    <img
                        src="/clinician-connect-hero.png"
                        alt="Pharmacist workspace"
                        className="absolute inset-0 w-full h-full object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f3d2e]/40 to-[#0f3d2e]/95 flex items-end p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-xl bg-white/10 border-2 border-white/20 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg">
                                    {formData.name ? formData.name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight m-0">
                                        {formData.name || 'Pharmacist Profile'}
                                    </h1>
                                    <p className="text-white/70 text-sm mt-1 mb-0">
                                        {formData.shopName || 'Pharmacy'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-400 text-[11px] font-bold uppercase tracking-wide">
                                        <ShieldCheck size={12} strokeWidth={3} />
                                        Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 sm:gap-6">
                    {/* ── Profile Form ── */}
                    <div>
                        <div className="bg-surface border border-border-subtle rounded-lg sm:rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-4 sm:p-6 border-b border-border-subtle flex items-center gap-3 sm:gap-4 bg-background">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <User size={16} />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-foreground m-0">Account Information</h3>
                                    <p className="text-xs sm:text-sm text-muted mt-0.5 mb-0">Manage your personal and pharmacy details</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                                {message.text && (
                                    <div className={`p-4 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2 border ${message.type === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-red-50/50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'}`}>
                                        {message.type === 'success' ? (
                                            <ShieldCheck size={16} />
                                        ) : (
                                            <Settings size={16} />
                                        )}
                                        {message.text}
                                    </div>
                                )}

                                {/* Personal Information */}
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mt-0 mb-4 pb-2 border-b-2 border-border-subtle">Personal Information</h4>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <label className="text-xs sm:text-[13px] font-semibold text-foreground">Pharmacist Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 sm:py-3 bg-background border border-border-subtle rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <label className="text-xs sm:text-[13px] font-semibold text-foreground">Mobile Number</label>
                                        <input
                                            type="text"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 sm:py-3 bg-background border border-border-subtle rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
                                    <div className="w-full flex-1 flex flex-col gap-1.5">
                                        <label className="text-xs sm:text-[13px] font-semibold text-foreground">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 sm:py-3 bg-stone-50 dark:bg-white/5 border border-border-subtle rounded-xl text-stone-500 cursor-not-allowed opacity-80 text-sm transition-all focus:outline-none"
                                            disabled
                                        />
                                        <span className="text-[11px] sm:text-xs text-muted">
                                            Email cannot be changed. Contact support for assistance.
                                        </span>
                                    </div>
                                </div>

                                {/* Pharmacy Details */}
                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mt-8 mb-4 pb-2 border-b-2 border-border-subtle">Pharmacy Details</h4>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <label className="text-xs sm:text-[13px] font-semibold text-foreground">Pharmacy Name</label>
                                        <input
                                            type="text"
                                            name="shopName"
                                            value={formData.shopName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 sm:py-3 bg-background border border-border-subtle rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <label className="text-xs sm:text-[13px] font-semibold text-foreground">License Number (PRN)</label>
                                        <input
                                            type="text"
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 sm:py-3 bg-stone-50 dark:bg-white/5 border border-border-subtle rounded-xl text-stone-500 cursor-not-allowed opacity-80 text-sm transition-all focus:outline-none"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
                                    <div className="w-full flex-1 flex flex-col gap-1.5">
                                        <label className="text-xs sm:text-[13px] font-semibold text-foreground">Store Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 sm:py-3 bg-background border border-border-subtle rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border-subtle">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed text-white border-none rounded-xl font-bold text-sm cursor-pointer transition-colors shadow-sm"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Credentials */}
                        <div className="bg-surface border border-border-subtle rounded-lg sm:rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-border-subtle bg-background">
                                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide m-0">Credentials</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                                        <Award size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-muted font-black uppercase tracking-widest m-0">License</p>
                                        <p className="text-sm text-foreground font-semibold mt-0.5 mb-0 font-mono truncate">
                                            {formData.licenseNumber || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                        <Mail size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-muted font-black uppercase tracking-widest m-0">Email</p>
                                        <p className="text-sm text-foreground font-semibold mt-0.5 mb-0 truncate">
                                            {formData.email || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                                        <Phone size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-muted font-black uppercase tracking-widest m-0">Phone</p>
                                        <p className="text-sm text-foreground font-semibold mt-0.5 mb-0 truncate">
                                            {formData.mobile || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-surface border border-border-subtle rounded-lg sm:rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-border-subtle bg-background">
                                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide m-0">Quick Links</h3>
                            </div>
                            <div className="p-2">
                                <div
                                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-white/5 group"
                                    onClick={() => router.push('/settings')}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-background border border-border-subtle flex items-center justify-center text-muted transition-colors group-hover:text-emerald-500 group-hover:border-emerald-500/20">
                                        <Settings size={15} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground m-0 truncate">Application Settings</p>
                                        <p className="text-[11px] text-muted mt-0.5 mb-0 truncate">Preferences & security</p>
                                    </div>
                                    <ChevronRight size={14} className="text-stone-300 dark:text-stone-700 transition-colors group-hover:text-emerald-500" />
                                </div>
                                <div
                                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-white/5 group"
                                    onClick={() => router.push('/revenue')}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-background border border-border-subtle flex items-center justify-center text-muted transition-colors group-hover:text-emerald-500 group-hover:border-emerald-500/20">
                                        <Building2 size={15} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground m-0 truncate">Revenue & Billing</p>
                                        <p className="text-[11px] text-muted mt-0.5 mb-0 truncate">Financial overview</p>
                                    </div>
                                    <ChevronRight size={14} className="text-stone-300 dark:text-stone-700 transition-colors group-hover:text-emerald-500" />
                                </div>
                                <div
                                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-white/5 group"
                                    onClick={() => router.push('/clinician-connect')}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-background border border-border-subtle flex items-center justify-center text-muted transition-colors group-hover:text-emerald-500 group-hover:border-emerald-500/20">
                                        <MapPin size={15} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground m-0 truncate">Clinician Connect</p>
                                        <p className="text-[11px] text-muted mt-0.5 mb-0 truncate">Doctor consultations</p>
                                    </div>
                                    <ChevronRight size={14} className="text-stone-300 dark:text-stone-700 transition-colors group-hover:text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
