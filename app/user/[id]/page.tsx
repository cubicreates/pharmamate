'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import {
    User, Building2, Mail, Phone, MapPin, Award,
    ShieldCheck, Save, Settings, ChevronRight
} from 'lucide-react';
import './user-profile.css';

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
            const data = (await apiRequest('/api/chemists/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    name: formData.name,
                    shopName: formData.shopName,
                    mobile: formData.mobile,
                    address: formData.address,
                }),
            })) as Record<string, unknown>;
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
            <div className="up-workspace animate-fade-in">
                {/* ── Hero Banner ── */}
                <div className="up-hero">
                    <img
                        src="/clinician-connect-hero.png"
                        alt="Pharmacist workspace"
                        className="up-hero-img"
                    />
                    <div className="up-hero-overlay">
                        <div className="up-hero-content">
                            <div className="up-hero-identity">
                                <div className="up-hero-avatar">
                                    {formData.name ? formData.name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h1 className="up-hero-name">
                                        {formData.name || 'Pharmacist Profile'}
                                    </h1>
                                    <p className="up-hero-shop">
                                        {formData.shopName || 'Pharmacy'}
                                    </p>
                                </div>
                            </div>
                            <div className="up-hero-stats">
                                <div className="up-hero-stat">
                                    <div className="up-hero-badge">
                                        <ShieldCheck size={11} />
                                        Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main Grid ── */}
                <div className="up-grid">
                    {/* ── Profile Form ── */}
                    <div>
                        <div className="up-form-panel">
                            <div className="up-form-header">
                                <div className="up-form-header-icon">
                                    <User size={16} />
                                </div>
                                <div className="up-form-header-text">
                                    <h3>Account Information</h3>
                                    <p>Manage your personal and pharmacy details</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="up-form-body">
                                {message.text && (
                                    <div className={`up-message up-message--${message.type}`}>
                                        {message.type === 'success' ? (
                                            <ShieldCheck size={16} />
                                        ) : (
                                            <Settings size={16} />
                                        )}
                                        {message.text}
                                    </div>
                                )}

                                {/* Personal Information */}
                                <h4 className="up-section-title">Personal Information</h4>
                                <div className="up-form-row">
                                    <div className="up-field">
                                        <label className="up-label">Pharmacist Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="up-input"
                                            required
                                        />
                                    </div>
                                    <div className="up-field">
                                        <label className="up-label">Mobile Number</label>
                                        <input
                                            type="text"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="up-input"
                                        />
                                    </div>
                                </div>
                                <div className="up-form-row">
                                    <div className="up-field up-field--full">
                                        <label className="up-label">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="up-input"
                                            disabled
                                        />
                                        <span className="up-input-hint">
                                            Email cannot be changed. Contact support for assistance.
                                        </span>
                                    </div>
                                </div>

                                {/* Pharmacy Details */}
                                <h4 className="up-section-title">Pharmacy Details</h4>
                                <div className="up-form-row">
                                    <div className="up-field">
                                        <label className="up-label">Pharmacy Name</label>
                                        <input
                                            type="text"
                                            name="shopName"
                                            value={formData.shopName}
                                            onChange={handleChange}
                                            className="up-input"
                                            required
                                        />
                                    </div>
                                    <div className="up-field">
                                        <label className="up-label">License Number (PRN)</label>
                                        <input
                                            type="text"
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleChange}
                                            className="up-input"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="up-form-row">
                                    <div className="up-field up-field--full">
                                        <label className="up-label">Store Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="up-input"
                                        />
                                    </div>
                                </div>

                                <div className="up-form-actions">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="up-save-btn"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="up-save-spinner" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={15} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* ── Sidebar ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Credentials */}
                        <div className="up-sidebar-card">
                            <div className="up-sidebar-header">
                                <h3 className="up-sidebar-title">Credentials</h3>
                            </div>
                            <div className="up-sidebar-body">
                                <div className="up-credential-item">
                                    <div className="up-credential-icon up-credential-icon--green">
                                        <Award size={16} />
                                    </div>
                                    <div>
                                        <p className="up-credential-label">License</p>
                                        <p className="up-credential-value up-credential-value--mono">
                                            {formData.licenseNumber || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <div className="up-credential-item">
                                    <div className="up-credential-icon up-credential-icon--blue">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p className="up-credential-label">Email</p>
                                        <p className="up-credential-value">
                                            {formData.email || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <div className="up-credential-item">
                                    <div className="up-credential-icon up-credential-icon--amber">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="up-credential-label">Phone</p>
                                        <p className="up-credential-value">
                                            {formData.mobile || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="up-sidebar-card">
                            <div className="up-sidebar-header">
                                <h3 className="up-sidebar-title">Quick Links</h3>
                            </div>
                            <div style={{ padding: '8px' }}>
                                <div
                                    className="up-quick-link"
                                    onClick={() => router.push('/settings')}
                                >
                                    <div className="up-quick-link-icon">
                                        <Settings size={15} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="up-quick-link-text">Application Settings</p>
                                        <p className="up-quick-link-desc">Preferences &amp; security</p>
                                    </div>
                                    <ChevronRight size={14} color="#a8a29e" />
                                </div>
                                <div
                                    className="up-quick-link"
                                    onClick={() => router.push('/revenue')}
                                >
                                    <div className="up-quick-link-icon">
                                        <Building2 size={15} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="up-quick-link-text">Revenue &amp; Billing</p>
                                        <p className="up-quick-link-desc">Financial overview</p>
                                    </div>
                                    <ChevronRight size={14} color="#a8a29e" />
                                </div>
                                <div
                                    className="up-quick-link"
                                    onClick={() => router.push('/clinician-connect')}
                                >
                                    <div className="up-quick-link-icon">
                                        <MapPin size={15} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="up-quick-link-text">Clinician Connect</p>
                                        <p className="up-quick-link-desc">Doctor consultations</p>
                                    </div>
                                    <ChevronRight size={14} color="#a8a29e" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
