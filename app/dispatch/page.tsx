'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';

interface Delivery {
    _id: string; patientName: string; orderId: string;
    riderName: string; riderPhone: string; status: 'in-transit' | 'delivered' | 'failed';
    isColdChain: boolean; dispatchedAt: string; total: number;
}

export default function DispatchTrackingPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deliveries] = useState<Delivery[]>([
        { _id: '1', patientName: 'Rahul Sharma', orderId: 'ORD-102', riderName: 'Suresh Kumar', riderPhone: '+91 99887 76655', status: 'in-transit', isColdChain: true, dispatchedAt: '2026-02-24T13:00:00.000Z', total: 1250 },
        { _id: '2', patientName: 'Sneha Desai', orderId: 'ORD-105', riderName: 'Amit Singh', riderPhone: '+91 88776 65544', status: 'delivered', isColdChain: false, dispatchedAt: '2026-02-24T12:30:00.000Z', total: 850 },
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        router.push('/');
    };

    const stats = {
        inTransit: deliveries.filter(d => d.status === 'in-transit').length,
        deliveredToday: deliveries.filter(d => d.status === 'delivered').length,
        coldChainActive: deliveries.filter(d => d.status === 'in-transit' && d.isColdChain).length
    };

    return (
        <Layout onLogout={handleLogout}>
            <div className="orders-animate-in">

                {/* Header */}
                <div className="dispatch-header">
                    <div className="dispatch-header-left">
                        <h1>Dispatch & Delivery Hub</h1>
                        <p>Real-time tracking of medicinal logistics and rider status</p>
                    </div>
                    <button className="dispatch-add-btn">
                        <Plus size={14} /> Add New Rider
                    </button>
                </div>

                {/* Stats */}
                <div className="dispatch-stats">
                    <div className="dispatch-stat-card">
                        <div className="dispatch-stat-icon dispatch-stat-icon--transit">🚚</div>
                        <div>
                            <p className="dispatch-stat-value">{stats.inTransit}</p>
                            <p className="dispatch-stat-label">In Transit</p>
                        </div>
                    </div>
                    <div className="dispatch-stat-card">
                        <div className="dispatch-stat-icon dispatch-stat-icon--delivered">✅</div>
                        <div>
                            <p className="dispatch-stat-value">{stats.deliveredToday}</p>
                            <p className="dispatch-stat-label">Delivered Today</p>
                        </div>
                    </div>
                    <div className="dispatch-stat-card">
                        <div className="dispatch-stat-icon dispatch-stat-icon--cold">❄️</div>
                        <div>
                            <p className="dispatch-stat-value">{stats.coldChainActive}</p>
                            <p className="dispatch-stat-label">Active Cold Chain</p>
                        </div>
                    </div>
                </div>

                {/* Deliveries Table */}
                <div className="dispatch-table-container">
                    <div className="dispatch-table-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h3>Active Deliveries</h3>
                            <span className="dispatch-live-badge">
                                <span className="dispatch-live-dot" />
                                Live Tracking
                            </span>
                        </div>
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                            <input
                                type="text"
                                data-search-global
                                placeholder="Search deliveries... (/)"
                                className="w-full bg-surface border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="orders-table-wrap">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Patient & Order</th>
                                    <th>Logistics Rider</th>
                                    <th>Status</th>
                                    <th>Verification</th>
                                    <th>Time</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.filter(d =>
                                    d.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    d.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    d.riderName.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((delivery) => (
                                    <tr key={delivery._id}>
                                        <td>
                                            <p className="orders-patient-name">{delivery.patientName}</p>
                                            <p className="orders-patient-prn">{delivery.orderId} · ₹{delivery.total}</p>
                                        </td>
                                        <td>
                                            <div className="dispatch-rider-row">
                                                <div className="dispatch-rider-avatar">👤</div>
                                                <div>
                                                    <p className="dispatch-rider-name">{delivery.riderName}</p>
                                                    <p className="dispatch-rider-phone">{delivery.riderPhone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`orders-status ${delivery.status === 'in-transit' ? 'orders-status--pending' : 'orders-status--completed'}`}>
                                                <span className="orders-status-dot" />
                                                {delivery.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="dispatch-verifications">
                                                {delivery.isColdChain && (
                                                    <span className="dispatch-verify-badge dispatch-verify-badge--cold">❄️ ICE</span>
                                                )}
                                                <span className="dispatch-verify-badge dispatch-verify-badge--photo">📸 PHOTO</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="orders-date-text">
                                                {mounted ? new Date(delivery.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="dispatch-actions">
                                                <button onClick={() => alert(`Sending location update to ${delivery.patientName}...`)}
                                                    className="dispatch-map-btn" title="Live Track Link">
                                                    🗺️
                                                </button>
                                                <button onClick={() => alert(`Out-for-delivery update sent to ${delivery.patientName} ✅`)}
                                                    className="dispatch-notify-btn">
                                                    💬 Notify
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
