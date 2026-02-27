'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import {
    Users,
    Clock,
    Pill,
    ArrowRight,
    ShieldCheck,
    Hourglass,
    Activity,
    CheckCircle2,
    Search
} from 'lucide-react';
import MobileModeSwitcher from '@/components/MobileModeSwitcher';
import { MOBILE_CATEGORIES } from '@/lib/constants/navigation';

interface QueueItem {
    _id: string;
    patientName: string;
    patientPrn: string;
    arrivedAt: string;
    status: string;
    itemCount: number;
}

const STATUS_CONFIG: Record<string, { label: string; stripe: string; avatar: string; badge: string; Icon: React.ElementType }> = {
    verifying: {
        label: 'OTP Verification',
        stripe: 'queue-card-stripe--verifying',
        avatar: 'queue-card-avatar--verifying',
        badge: 'queue-card-status--verifying',
        Icon: ShieldCheck,
    },
    waiting: {
        label: 'Waiting',
        stripe: 'queue-card-stripe--waiting',
        avatar: 'queue-card-avatar--waiting',
        badge: 'queue-card-status--waiting',
        Icon: Hourglass,
    },
    serving: {
        label: 'Being Served',
        stripe: 'queue-card-stripe--serving',
        avatar: 'queue-card-avatar--serving',
        badge: 'queue-card-status--serving',
        Icon: Activity,
    },
};

export default function QueuePage() {
    const router = useRouter();
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    };

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const data = await apiRequest<QueueItem[]>('/api/queue');
                setQueue(data);
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetchQueue();
        const interval = setInterval(fetchQueue, 15000);
        return () => clearInterval(interval);
    }, []);

    const minutesAgo = (iso: string) => {
        const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
        return diff < 1 ? 'Just now' : `${diff}m ago`;
    };

    const waitMinutes = (iso: string) =>
        Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));

    const avgWait = queue.length > 0
        ? Math.round(queue.reduce((sum, q) => sum + waitMinutes(q.arrivedAt), 0) / queue.length)
        : 0;

    const counts = {
        verifying: queue.filter(q => q.status === 'verifying').length,
        waiting: queue.filter(q => q.status === 'waiting').length,
        serving: queue.filter(q => q.status === 'serving').length,
    };

    const filteredQueue = queue.filter(q =>
        q.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.patientPrn.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout onLogout={handleLogout}>
            <div className="queue-workspace space-y-8 pb-12">
                <MobileModeSwitcher options={MOBILE_CATEGORIES.FLOW} />

                {/* ── Hero Banner ── */}
                <div className="queue-hero">
                    <img
                        src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80"
                        alt="Pharmacy counter workspace"
                        className="queue-hero-img"
                        loading="eager"
                    />
                    <div className="queue-hero-overlay">
                        <div className="queue-hero-content">
                            <div className="queue-hero-text">
                                <div className="queue-hero-badge">
                                    <span className="queue-live-dot" />
                                    Live Queue
                                </div>
                                <h1 className="queue-hero-title">Patient Queue</h1>
                                <p className="queue-hero-subtitle">
                                    Real-time view of patients at the counter. Auto-refreshes every 15 seconds.
                                </p>
                            </div>
                            {!loading && queue.length > 0 && (
                                <div className="queue-hero-stats">
                                    <div className="queue-hero-stat">
                                        <div className="queue-hero-stat-value">{queue.length}</div>
                                        <div className="queue-hero-stat-label">In Queue</div>
                                    </div>
                                    <div className="queue-hero-stat">
                                        <div className="queue-hero-stat-value">{avgWait}</div>
                                        <div className="queue-hero-stat-label">Avg Min</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Status Bar ── */}
                {!loading && queue.length > 0 && (
                    <div className="queue-status-bar">
                        <div className="flex-1 max-w-md relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                            <input
                                type="text"
                                data-search-global
                                placeholder="Filter queue... (/)"
                                className="w-full bg-surface border border-border-subtle rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="queue-status-group hidden md:flex">
                            <div className="queue-status-item">
                                <span className="queue-status-dot queue-status-dot--verifying" />
                                Verifying
                                <span className="queue-status-count">{counts.verifying}</span>
                            </div>
                            <div className="queue-status-item">
                                <span className="queue-status-dot queue-status-dot--waiting" />
                                Waiting
                                <span className="queue-status-count">{counts.waiting}</span>
                            </div>
                            <div className="queue-status-item">
                                <span className="queue-status-dot queue-status-dot--serving" />
                                Serving
                                <span className="queue-status-count">{counts.serving}</span>
                            </div>
                        </div>
                        <div className="queue-avg-wait">
                            Avg wait: <strong>{avgWait} min{avgWait !== 1 ? 's' : ''}</strong>
                        </div>
                    </div>
                )}

                {/* ── Queue Content ── */}
                {loading ? (
                    <div className="queue-skeleton-grid">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="queue-skeleton-card">
                                <div className="queue-skeleton-row">
                                    <div className="queue-skeleton-avatar skeleton" />
                                    <div style={{ flex: 1 }}>
                                        <div className="queue-skeleton-line skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
                                        <div className="queue-skeleton-line skeleton" style={{ height: 10, width: '40%' }} />
                                    </div>
                                </div>
                                <div className="queue-skeleton-details skeleton" />
                                <div className="queue-skeleton-btn skeleton" />
                            </div>
                        ))}
                    </div>
                ) : filteredQueue.length === 0 ? (
                    <div className="queue-empty">
                        <div className="queue-empty-icon">
                            <Search size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="queue-empty-title">No matches found</h3>
                        <p className="queue-empty-desc">
                            We couldn&apos;t find any patient in the queue matching &quot;{searchQuery}&quot;.
                        </p>
                    </div>
                ) : (
                    <div className="queue-grid">
                        {filteredQueue.map((q, i) => {
                            const config = STATUS_CONFIG[q.status] || STATUS_CONFIG.waiting;
                            const wait = waitMinutes(q.arrivedAt);
                            const isUrgent = wait > 10;

                            return (
                                <div
                                    key={q._id}
                                    className={`queue-card ${isUrgent ? 'queue-card--urgent' : ''}`}
                                    style={{ animationDelay: `${i * 70}ms` }}
                                >
                                    <div className={`queue-card-stripe ${config.stripe}`} />
                                    <div className="queue-card-body">

                                        {/* Patient Header */}
                                        <div className="queue-card-header">
                                            <div className="queue-card-patient">
                                                <div className={`queue-card-avatar ${config.avatar}`}>
                                                    {q.patientName[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <p className="queue-card-name">{q.patientName}</p>
                                                    <p className="queue-card-prn">{q.patientPrn}</p>
                                                </div>
                                            </div>
                                            <div className={`queue-card-status ${config.badge}`}>
                                                <span className="queue-card-status-icon" />
                                                {config.label}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="queue-card-details">
                                            <div className="queue-card-detail-row">
                                                <span className="queue-card-detail-label">
                                                    <Pill size={13} />
                                                    Items
                                                </span>
                                                <span className="queue-card-detail-value">
                                                    {q.itemCount} medicine{q.itemCount > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="queue-card-detail-row">
                                                <span className="queue-card-detail-label">
                                                    <Clock size={13} />
                                                    Arrived
                                                </span>
                                                <span className="queue-card-detail-value">
                                                    {minutesAgo(q.arrivedAt)}
                                                </span>
                                            </div>
                                            <div className="queue-card-detail-row">
                                                <span className="queue-card-detail-label">
                                                    <Users size={13} />
                                                    Wait Time
                                                </span>
                                                <span className={`queue-card-detail-value ${isUrgent ? 'queue-card-detail-value--urgent' : ''}`}>
                                                    {wait} min{wait !== 1 ? 's' : ''}
                                                    {isUrgent && (
                                                        <span className="queue-card-urgent-badge">Overdue</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="queue-card-action">
                                            <button
                                                onClick={() => router.push(`/counter?prn=${q.patientPrn}`)}
                                                className="queue-action-btn"
                                            >
                                                <CheckCircle2 size={15} />
                                                Open at Counter
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
