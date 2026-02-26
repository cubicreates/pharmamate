'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import {
    Clock,
    Package,
    CheckCircle2,
    IndianRupee,
    Inbox,
    FileText,
    ShoppingBag,
    Activity,
    Search
} from 'lucide-react';

interface OrderItem {
    name: string; dosage: string; quantity: number; price: number; salt?: string;
}

interface Order {
    _id: string; patientName: string; patientPrn: string;
    orderDate: string; status: string;
    items: OrderItem[]; chemistName: string; total: number;
    doctorName?: string; doctorPhone?: string;
    batchNumber?: string; fulfilledAt?: string;
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<{ _id?: string }>({});

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    };

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('chemUser') || '{}');
        setUser(savedUser);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user._id) return;
            try {
                const data = await apiRequest<Order[]>(`/api/orders/chemist/${user._id}`);
                setOrders(data);
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetchOrders();
    }, [user._id]);

    const filters = ['All', 'Pending', 'Ready', 'Completed'];
    const filtered = orders.filter(o => {
        const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
        const matchesSearch = o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.patientPrn.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleMarkReady = async (order: Order) => {
        setOrders(prev => prev.map(o => o._id === order._id ? { ...o, status: 'Ready' } : o));
    };

    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const readyCount = orders.filter(o => o.status === 'Ready').length;
    const completedCount = orders.filter(o => o.status === 'Completed').length;
    const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.total, 0);

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch { return dateStr; }
    };

    const statusClass = (s: string) =>
        s === 'Completed' ? 'orders-status--completed' : s === 'Ready' ? 'orders-status--ready' : 'orders-status--pending';

    return (
        <Layout onLogout={handleLogout}>
            <div className="orders-animate-in">

                {/* ===== Hero Banner ===== */}
                <div className="orders-hero">
                    <img
                        src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1400&q=80"
                        alt="Pharmacy workspace"
                        className="orders-hero-img"
                    />
                    <div className="orders-hero-overlay">
                        <div className="orders-hero-content">
                            <div className="orders-hero-badge">
                                <Activity size={12} />
                                Live Fulfillment Queue
                            </div>
                            <h1 className="orders-hero-title">Order Management</h1>
                            <p className="orders-hero-subtitle">
                                Track prescriptions from receipt through fulfillment. Manage dispensing workflows and generate invoices.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== Stats Grid ===== */}
                <div className="orders-stats-grid">
                    <div className="orders-stat-card">
                        <div className="orders-stat-header">
                            <div className="orders-stat-icon orders-stat-icon--pending">
                                <Clock size={16} />
                            </div>
                            <p className="orders-stat-label">Pending</p>
                        </div>
                        <p className="orders-stat-value">{pendingCount}</p>
                    </div>
                    <div className="orders-stat-card">
                        <div className="orders-stat-header">
                            <div className="orders-stat-icon orders-stat-icon--ready">
                                <Package size={16} />
                            </div>
                            <p className="orders-stat-label">Ready</p>
                        </div>
                        <p className="orders-stat-value">{readyCount}</p>
                    </div>
                    <div className="orders-stat-card">
                        <div className="orders-stat-header">
                            <div className="orders-stat-icon orders-stat-icon--completed">
                                <CheckCircle2 size={16} />
                            </div>
                            <p className="orders-stat-label">Completed</p>
                        </div>
                        <p className="orders-stat-value">{completedCount}</p>
                    </div>
                    <div className="orders-stat-card">
                        <div className="orders-stat-header">
                            <div className="orders-stat-icon orders-stat-icon--revenue">
                                <IndianRupee size={16} />
                            </div>
                            <p className="orders-stat-label">Revenue</p>
                        </div>
                        <p className="orders-stat-value">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                {/* ===== Toolbar: Section Title & Filters ===== */}
                <div className="orders-toolbar">
                    <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                            <input
                                type="text"
                                data-search-global
                                placeholder="Search by patient name or PRN... (Press /)"
                                className="w-full bg-surface border border-border-subtle rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="orders-filters">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`orders-filter-btn ${statusFilter === f ? 'orders-filter-btn--active' : ''}`}
                            >
                                {f}
                                {f !== 'All' && (
                                    <span className="orders-filter-count">
                                        {orders.filter(o => o.status === f).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ===== Content ===== */}
                {loading ? (
                    <div className="orders-loading">
                        <div className="orders-skeleton-row" style={{ width: '100%' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="skeleton orders-skeleton-card" />
                            ))}
                        </div>
                        <div className="skeleton orders-skeleton-table" style={{ width: '100%' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="orders-empty">
                        <div className="orders-empty-icon">
                            <Inbox size={24} />
                        </div>
                        <p className="orders-empty-title">
                            No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} orders found
                        </p>
                        <p className="orders-empty-desc">
                            {statusFilter === 'Pending'
                                ? 'All prescriptions have been processed. Check back later for new orders.'
                                : statusFilter === 'Ready'
                                    ? 'No orders are awaiting pickup at the moment.'
                                    : statusFilter === 'Completed'
                                        ? 'No completed orders to display yet.'
                                        : 'Orders will appear here once prescriptions are received from the clinic.'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="orders-desktop-table">
                            <div className="orders-table-container">
                                <div className="orders-table-header">
                                    <div className="orders-table-header-left">
                                        <ShoppingBag size={16} />
                                        <h3>Order Queue</h3>
                                    </div>
                                    <span className="orders-table-total-badge">
                                        {filtered.length} {filtered.length === 1 ? 'order' : 'orders'}
                                    </span>
                                </div>
                                <div className="orders-table-wrap">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Patient</th>
                                                <th>Items</th>
                                                <th>Prescriber</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th style={{ textAlign: 'right' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map((order, i) => (
                                                <tr key={order._id} className="orders-animate-in" style={{ animationDelay: `${i * 40}ms` }}>
                                                    <td>
                                                        <p className="orders-patient-name">{order.patientName}</p>
                                                        <p className="orders-patient-prn">{order.patientPrn}</p>
                                                    </td>
                                                    <td>
                                                        <span className="orders-items-summary">
                                                            {order.items.slice(0, 2).map(it => it.name).join(', ')}
                                                        </span>
                                                        {order.items.length > 2 && (
                                                            <span className="orders-items-more"> +{order.items.length - 2} more</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {order.doctorName ? (
                                                            <p className="orders-doctor-name">Dr. {order.doctorName}</p>
                                                        ) : (
                                                            <span className="orders-batch-id">—</span>
                                                        )}
                                                        {order.batchNumber && (
                                                            <p className="orders-batch-id">#{order.batchNumber}</p>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className="orders-amount">₹{order.total}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`orders-status ${statusClass(order.status)}`}>
                                                            <span className="orders-status-dot" />
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="orders-date-text">
                                                            {formatDate(order.orderDate)}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {order.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleMarkReady(order)}
                                                                className="orders-action-btn orders-action-btn--ready"
                                                            >
                                                                Mark Ready
                                                            </button>
                                                        )}
                                                        {order.status === 'Ready' && (
                                                            <button
                                                                onClick={() => router.push(`/orders/${order._id}/fulfillment`)}
                                                                className="orders-action-btn orders-action-btn--fulfill"
                                                            >
                                                                <CheckCircle2 size={13} />
                                                                Fulfill
                                                            </button>
                                                        )}
                                                        {order.status === 'Completed' && (
                                                            <button
                                                                onClick={() => router.push(`/orders/${order._id}/invoice`)}
                                                                className="orders-action-btn orders-action-btn--invoice"
                                                            >
                                                                <FileText size={13} />
                                                                Invoice
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="orders-mobile-cards">
                            <div className="orders-card-list">
                                {filtered.map((order, i) => (
                                    <div key={order._id} className="orders-card orders-animate-in" style={{ animationDelay: `${i * 40}ms` }}>
                                        <div className="orders-card-top">
                                            <div>
                                                <p className="orders-patient-name">{order.patientName}</p>
                                                <p className="orders-patient-prn">{order.patientPrn}</p>
                                            </div>
                                            <span className={`orders-status ${statusClass(order.status)}`}>
                                                <span className="orders-status-dot" />
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="orders-card-body">
                                            <div className="orders-card-items">
                                                {order.items.map((item, j) => (
                                                    <div key={j} className="orders-card-item-row">
                                                        <span className="orders-card-item-name">{item.name}</span>
                                                        <span className="orders-card-item-qty">×{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {order.doctorName && <p className="orders-card-meta">Rx by: Dr. {order.doctorName}</p>}
                                            {order.batchNumber && <p className="orders-card-meta">Batch: #{order.batchNumber}</p>}
                                        </div>
                                        <div className="orders-card-footer">
                                            <span className="orders-card-amount">₹{order.total}</span>
                                            <div>
                                                {order.status === 'Pending' && (
                                                    <button onClick={() => handleMarkReady(order)} className="orders-action-btn orders-action-btn--ready">
                                                        Mark Ready
                                                    </button>
                                                )}
                                                {order.status === 'Ready' && (
                                                    <button onClick={() => router.push(`/orders/${order._id}/fulfillment`)} className="orders-action-btn orders-action-btn--fulfill">
                                                        <CheckCircle2 size={13} /> Fulfill
                                                    </button>
                                                )}
                                                {order.status === 'Completed' && (
                                                    <button onClick={() => router.push(`/orders/${order._id}/invoice`)} className="orders-action-btn orders-action-btn--invoice">
                                                        <FileText size={13} /> Invoice
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
