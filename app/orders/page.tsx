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
    Search,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import MobileModeSwitcher from '@/components/MobileModeSwitcher';
import { MOBILE_CATEGORIES } from '@/lib/constants/navigation';

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
                <MobileModeSwitcher options={MOBILE_CATEGORIES.FLOW} />

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
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="orders-card-list space-y-6 pb-32"
                            >
                                {filtered.map((order) => (
                                    <motion.div variants={itemAnim} key={order._id}>
                                        <div className="relative overflow-hidden rounded-[2rem] bg-stone-100 dark:bg-stone-900 border border-border-subtle shadow-inner group">
                                            {/* Swipe Action Background */}
                                            <div className={`absolute inset-y-0 right-0 w-24 flex flex-col items-center justify-center transition-colors ${order.status === 'Pending' ? 'text-primary' :
                                                order.status === 'Ready' ? 'text-amber-500' :
                                                    'text-stone-500'
                                                }`}>
                                                {order.status === 'Pending' && <CheckCircle2 size={24} className="mb-1" />}
                                                {order.status === 'Ready' && <Package size={24} className="mb-1" />}
                                                {order.status === 'Completed' && <FileText size={24} className="mb-1" />}
                                                <span className="text-[9px] font-black uppercase tracking-widest">
                                                    {order.status === 'Pending' ? 'Process' :
                                                        order.status === 'Ready' ? 'Fulfill' :
                                                            'Invoice'}
                                                </span>
                                            </div>

                                            {/* Draggable Foreground Card */}
                                            <motion.div
                                                drag="x"
                                                dragConstraints={{ left: -90, right: 0 }}
                                                dragElastic={0.2}
                                                onDragEnd={(e, info) => {
                                                    if (info.offset.x < -50) {
                                                        if (order.status === 'Pending') handleMarkReady(order);
                                                        else if (order.status === 'Ready') router.push(`/orders/${order._id}/fulfillment`);
                                                        else if (order.status === 'Completed') router.push(`/orders/${order._id}/invoice`);
                                                    }
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                className="bg-surface border border-border-subtle rounded-[2rem] shadow-lg flex flex-col relative z-10 w-full"
                                            >
                                                <div className="p-4 sm:p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex-1 min-w-0 pr-2">
                                                            <p className="text-base sm:text-lg font-black tracking-tight text-foreground leading-none truncate">{order.patientName}</p>
                                                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1.5">
                                                                <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest">{order.patientPrn}</span>
                                                                <div className="w-1 h-1 rounded-full bg-stone-200 hidden sm:block" />
                                                                <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest">{formatDate(order.orderDate)}</span>
                                                            </div>
                                                        </div>
                                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 shrink-0 ${order.status === 'Completed' ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' :
                                                            order.status === 'Ready' ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' :
                                                                'bg-blue-500 text-white shadow-sm shadow-blue-500/20'
                                                            }`}>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2 mb-6">
                                                        {order.items.map((item, j) => (
                                                            <div key={j} className="flex items-center justify-between py-2 border-b border-border-subtle/50 last:border-0">
                                                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-stone-50 dark:bg-stone-900 border border-border-subtle flex items-center justify-center text-stone-400 text-xs font-bold">
                                                                        {item.quantity}
                                                                    </div>
                                                                    <span className="text-xs sm:text-sm font-bold text-foreground/80 truncate">{item.name}</span>
                                                                </div>
                                                                <span className="text-[10px] sm:text-xs font-black text-stone-400 uppercase shrink-0">₹{item.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] sm:text-[9px] font-black text-stone-300 uppercase tracking-widest">Total Amount</span>
                                                            <span className="text-xl sm:text-2xl font-black text-primary tracking-tighter">₹{order.total.toLocaleString()}</span>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] font-black text-stone-300 uppercase tracking-widest">
                                                            <ArrowLeft size={10} className="opacity-50 sm:w-3 sm:h-3" /> Swipe to action
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
