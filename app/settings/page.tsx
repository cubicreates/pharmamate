'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import {
    Settings, Shield, Bell, Eye, Palette, Globe, Monitor,
    Moon, Sun, Lock, Trash2, LogOut, ChevronRight
} from 'lucide-react';
import MobileModeSwitcher from '@/components/MobileModeSwitcher';
import { MOBILE_CATEGORIES } from '@/lib/constants/navigation';

interface ToggleProps {
    active: boolean;
    onToggle: () => void;
}

function Toggle({ active, onToggle }: ToggleProps) {
    return (
        <button
            className={`st-toggle ${active ? 'st-toggle--active' : ''}`}
            onClick={onToggle}
            type="button"
        >
            <div className="st-toggle-knob" />
        </button>
    );
}

export default function SettingsPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Settings state
    const [notifications, setNotifications] = useState(true);
    const [orderAlerts, setOrderAlerts] = useState(true);
    const [stockAlerts, setStockAlerts] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [compactView, setCompactView] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [language, setLanguage] = useState('en');
    const [timezone, setTimezone] = useState('Asia/Kolkata');

    useEffect(() => {
        setMounted(true);
        setDarkMode(document.documentElement.classList.contains('dark'));
        setCompactView(localStorage.getItem('precisionView') === 'true');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    };

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        if (next) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    if (!mounted) return null;

    return (
        <Layout onLogout={handleLogout}>
            <div className="st-workspace space-y-8 pb-12 animate-fade-in">
                <MobileModeSwitcher options={MOBILE_CATEGORIES.HOME} />
                {/* ── Hero Banner ── */}
                <div className="st-hero">
                    <div className="st-hero-content">
                        <div className="st-hero-text">
                            <div className="st-hero-badge">
                                <Settings size={11} />
                                System Configuration
                            </div>
                            <h1 className="st-hero-title">Settings</h1>
                            <p className="st-hero-subtitle">
                                Configure your application preferences, security options, and
                                notification controls.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Settings Grid ── */}
                <div className="st-grid">
                    {/* ── Appearance ── */}
                    <div className="st-section">
                        <div className="st-section-header">
                            <div className="st-section-icon st-section-icon--blue">
                                <Palette size={16} />
                            </div>
                            <div>
                                <h3 className="st-section-title">Appearance</h3>
                                <p className="st-section-desc">Visual preferences</p>
                            </div>
                        </div>
                        <div className="st-section-body">
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">
                                        {darkMode ? (
                                            <Moon size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                                        ) : (
                                            <Sun size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                                        )}
                                        Dark Mode
                                    </p>
                                    <p className="st-row-desc">Switch to dark theme for low-light environments</p>
                                </div>
                                <Toggle active={darkMode} onToggle={toggleDarkMode} />
                            </div>
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">
                                        <Eye size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                                        Compact View
                                    </p>
                                    <p className="st-row-desc">Increase data density for expert users</p>
                                </div>
                                <Toggle active={compactView} onToggle={() => setCompactView(!compactView)} />
                            </div>
                        </div>
                    </div>

                    {/* ── Notifications ── */}
                    <div className="st-section">
                        <div className="st-section-header">
                            <div className="st-section-icon st-section-icon--amber">
                                <Bell size={16} />
                            </div>
                            <div>
                                <h3 className="st-section-title">Notifications</h3>
                                <p className="st-section-desc">Alert preferences</p>
                            </div>
                        </div>
                        <div className="st-section-body">
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">Push Notifications</p>
                                    <p className="st-row-desc">Receive real-time alerts in-app</p>
                                </div>
                                <Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />
                            </div>
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">Order Alerts</p>
                                    <p className="st-row-desc">New orders and fulfillment updates</p>
                                </div>
                                <Toggle active={orderAlerts} onToggle={() => setOrderAlerts(!orderAlerts)} />
                            </div>
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">Stock Warnings</p>
                                    <p className="st-row-desc">Low inventory and expiry alerts</p>
                                </div>
                                <Toggle active={stockAlerts} onToggle={() => setStockAlerts(!stockAlerts)} />
                            </div>
                        </div>
                    </div>

                    {/* ── Security ── */}
                    <div className="st-section">
                        <div className="st-section-header">
                            <div className="st-section-icon st-section-icon--green">
                                <Shield size={16} />
                            </div>
                            <div>
                                <h3 className="st-section-title">Security</h3>
                                <p className="st-section-desc">Account protection</p>
                            </div>
                        </div>
                        <div className="st-section-body">
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">
                                        <Lock size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                                        Two-Factor Authentication
                                    </p>
                                    <p className="st-row-desc">Add an extra layer of security to your account</p>
                                </div>
                                <Toggle active={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
                            </div>
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">Change Password</p>
                                    <p className="st-row-desc">Update your account credentials</p>
                                </div>
                                <ChevronRight size={16} color="#a8a29e" />
                            </div>
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">Active Sessions</p>
                                    <p className="st-row-desc">View and manage logged-in devices</p>
                                </div>
                                <ChevronRight size={16} color="#a8a29e" />
                            </div>
                        </div>
                    </div>

                    {/* ── Locale ── */}
                    <div className="st-section">
                        <div className="st-section-header">
                            <div className="st-section-icon st-section-icon--blue">
                                <Globe size={16} />
                            </div>
                            <div>
                                <h3 className="st-section-title">Locale</h3>
                                <p className="st-section-desc">Regional settings</p>
                            </div>
                        </div>
                        <div className="st-section-body">
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">Language</p>
                                    <p className="st-row-desc">Interface language</p>
                                </div>
                                <select
                                    className="st-select"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                    <option value="mr">Marathi</option>
                                </select>
                            </div>
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">Timezone</p>
                                    <p className="st-row-desc">System clock reference</p>
                                </div>
                                <select
                                    className="st-select"
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                >
                                    <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                                    <option value="UTC">UTC</option>
                                </select>
                            </div>
                            <div className="st-row">
                                <div className="st-row-info">
                                    <p className="st-row-label">
                                        <Monitor size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                                        Currency
                                    </p>
                                    <p className="st-row-desc">Financial display format</p>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
                                    ₹ INR
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Danger Zone ── */}
                <div className="st-section st-danger-section" style={{ marginTop: 20 }}>
                    <div className="st-section-header">
                        <div className="st-section-icon st-section-icon--amber">
                            <Trash2 size={16} />
                        </div>
                        <div>
                            <h3 className="st-section-title">Danger Zone</h3>
                            <p className="st-section-desc">Irreversible actions</p>
                        </div>
                    </div>
                    <div className="st-section-body">
                        <div className="st-row">
                            <div className="st-row-info">
                                <p className="st-row-label">Sign Out of All Devices</p>
                                <p className="st-row-desc">
                                    Terminate all active sessions across all devices
                                </p>
                            </div>
                            <button className="st-danger-btn" onClick={handleLogout}>
                                <LogOut size={14} />
                                Sign Out All
                            </button>
                        </div>
                        <div className="st-row">
                            <div className="st-row-info">
                                <p className="st-row-label">Delete Account</p>
                                <p className="st-row-desc">
                                    Permanently remove your account and all associated data
                                </p>
                            </div>
                            <button className="st-danger-btn">
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
