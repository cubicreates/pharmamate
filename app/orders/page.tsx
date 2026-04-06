'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import {
    Bell, Package, CheckCircle2, Bike, Clock, Inbox,
    AlertTriangle, Wifi, WifiOff, MapPin, Phone, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:8000';

interface OrderItem { name: string; dosage?: string; quantity?: number; }
interface LiveOrder {
    id: string;
    patient_id: string;
    status: string;
    items: OrderItem[];
    delivery_address: string;
    estimated_total?: number;
    requires_signature: boolean;
    created_at: string;
    next_action?: string;
}

const STATUS_CONFIG = {
    PENDING:        { label: 'New Order',       color: 'bg-blue-500',   ring: 'ring-blue-400',   icon: Bell,         next: 'Accept Order' },
    ACCEPTED:       { label: 'Accepted',        color: 'bg-amber-500',  ring: 'ring-amber-400',  icon: Clock,        next: 'Mark as Packed' },
    PACKED:         { label: 'Packed',          color: 'bg-purple-500', ring: 'ring-purple-400', icon: Package,      next: 'Request Rider' },
    RIDER_ASSIGNED: { label: 'Rider Assigned',  color: 'bg-indigo-500', ring: 'ring-indigo-400', icon: Bike,         next: 'Rider Picks Up' },
    IN_TRANSIT:     { label: 'Out for Delivery',color: 'bg-primary',    ring: 'ring-primary',    icon: Bike,         next: null },
    DELIVERED:      { label: 'Delivered',       color: 'bg-emerald-500',ring: 'ring-emerald-400',icon: CheckCircle2, next: null },
    CANCELLED:      { label: 'Cancelled',       color: 'bg-stone-400',  ring: 'ring-stone-300',  icon: AlertTriangle,next: null },
};

export default function LiveOrderTerminal() {
    const router = useRouter();
    const [orders, setOrders] = useState<LiveOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [pharmacyId, setPharmacyId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [newOrderAlert, setNewOrderAlert] = useState(false);
    const [acting, setActing] = useState<string | null>(null);
    const prevCountRef = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // ── Boot ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('chemUser') || '{}');
        setUserId(user.internal_id || null);

        // Bootstrap pharmacy profile
        if (user.internal_id) {
            fetch(`${API}/pharmacy/profile/${user.internal_id}`)
                .then(r => r.json())
                .then(p => { setPharmacyId(p.id); setIsOnline(p.is_online); })
                .catch(() => {
                    // If no profile exists, create one
                    fetch(`${API}/pharmacy/profile`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: user.internal_id, name: user.full_name || 'My Pharmacy' })
                    }).then(r => r.json()).then(p => setPharmacyId(p.id));
                });
        }

        // Try to create audio context for ding
        try { audioRef.current = new Audio('/sounds/ding.mp3'); } catch { /* ignore */ }
    }, []);

    // ── Fetch live orders ────────────────────────────────────────────────────
    const fetchOrders = useCallback(async () => {
        if (!pharmacyId) return;
        try {
            const res = await fetch(`${API}/orders/pharmacy/${pharmacyId}`);
            if (!res.ok) return;
            const data: LiveOrder[] = await res.json();
            setOrders(data);

            // Ring the bell on new PENDING orders
            const pending = data.filter(o => o.status === 'PENDING').length;
            if (pending > prevCountRef.current) {
                setNewOrderAlert(true);
                try { audioRef.current?.play(); } catch { /* ignore */ }
                setTimeout(() => setNewOrderAlert(false), 4000);
            }
            prevCountRef.current = pending;
        } catch { /* ignore */ } finally { setLoading(false); }
    }, [pharmacyId]);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 8000); // poll every 8s
        return () => clearInterval(interval);
    }, [fetchOrders]);

    // ── Toggle Online Status ─────────────────────────────────────────────────
    const toggleOnline = async () => {
        await fetch(`${API}/pharmacy/toggle`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        setIsOnline(s => !s);
    };

    // ── Advance Order ────────────────────────────────────────────────────────
    const advanceOrder = async (order: LiveOrder) => {
        const nextStatus = order.next_action === 'Accept Order' ? 'ACCEPTED'
            : order.next_action === 'Mark as Packed' ? 'PACKED'
            : order.next_action === 'Request Rider' ? 'RIDER_ASSIGNED'
            : null;
        if (!nextStatus) return;

        setActing(order.id);
        await fetch(`${API}/orders/${order.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: nextStatus })
        });
        await fetchOrders();
        setActing(null);
    };

    const pending = orders.filter(o => o.status === 'PENDING');
    const active = orders.filter(o => ['ACCEPTED', 'PACKED', 'RIDER_ASSIGNED', 'IN_TRANSIT'].includes(o.status));
    const done = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));

    const handleLogout = () => { localStorage.clear(); sessionStorage.clear(); router.push('/'); };

    return (
        <Layout onLogout={handleLogout}>
            <div className="space-y-6 animate-fade-in">

                {/* ── New Order Alert Banner ──────────────────────────────── */}
                <AnimatePresence>
                    {newOrderAlert && (
                        <motion.div
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            className="fixed top-14 left-0 right-0 z-[200] flex justify-center px-4"
                        >
                            <div className="flex items-center gap-4 bg-blue-600 text-white rounded-2xl px-8 py-4 shadow-2xl shadow-blue-500/40 ring-4 ring-blue-400/30">
                                <Bell size={24} className="animate-bounce" />
                                <div>
                                    <p className="font-black text-base tracking-tight">New Order Incoming!</p>
                                    <p className="text-[11px] opacity-80 uppercase tracking-widest">Patient prescription received — review below</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Hero / Store Status Panel ───────────────────────────── */}
                <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Store Terminal</p>
                        <h1 className="text-2xl font-black tracking-tight text-foreground">Live Fulfillment Queue</h1>
                        <p className="text-xs text-muted mt-1 font-medium">Orders auto-refresh every 8 seconds · Bill in your own POS</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${isOnline ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-600' : 'bg-stone-100 dark:bg-stone-800 border-border-subtle text-muted'}`}>
                            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                            {isOnline ? 'Store Open' : 'Store Closed'}
                        </div>
                        <button
                            onClick={toggleOnline}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${isOnline ? 'bg-stone-700 text-white hover:bg-stone-800' : 'bg-primary text-white hover:bg-primary-light shadow-primary/30'}`}
                        >
                            {isOnline ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>
                </div>

                {/* ── Stats Row ──────────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'New Orders', val: pending.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                        { label: 'In Progress', val: active.filter(o => ['ACCEPTED','PACKED'].includes(o.status)).length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
                        { label: 'Out for Delivery', val: active.filter(o => o.status === 'IN_TRANSIT').length, color: 'text-primary', bg: 'bg-primary/5' },
                        { label: 'Delivered Today', val: done.filter(o => o.status === 'DELIVERED').length, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
                    ].map((s, i) => (
                        <div key={i} className={`glass-card rounded-xl p-4 ${s.bg}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">{s.label}</p>
                            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
                        </div>
                    ))}
                </div>

                {/* ── MAIN KANBAN COLUMNS ─────────────────────────────────── */}
                {loading ? (
                    <div className="flex items-center justify-center h-40 text-muted font-black uppercase tracking-widest text-xs animate-pulse">
                        Loading queue...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="glass-card rounded-2xl p-16 text-center">
                        <Inbox size={48} className="mx-auto text-muted opacity-30 mb-4" />
                        <p className="font-black text-foreground opacity-40 uppercase tracking-widest text-sm">Queue is clear</p>
                        <p className="text-xs text-muted mt-2">{isOnline ? 'Awaiting patient orders...' : 'Go online to start receiving orders'}</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* PENDING QUEUE */}
                        {pending.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                                    <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Incoming ({pending.length})</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {pending.map(order => <OrderCard key={order.id} order={order} onAdvance={advanceOrder} acting={acting} />)}
                                </div>
                            </section>
                        )}

                        {/* ACTIVE */}
                        {active.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <h2 className="text-sm font-black uppercase tracking-widest text-foreground">In Progress ({active.length})</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {active.map(order => <OrderCard key={order.id} order={order} onAdvance={advanceOrder} acting={acting} />)}
                                </div>
                            </section>
                        )}

                        {/* COMPLETED */}
                        {done.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Completed ({done.length})</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-60">
                                    {done.map(order => <OrderCard key={order.id} order={order} onAdvance={advanceOrder} acting={acting} />)}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}

function OrderCard({ order, onAdvance, acting }: { order: LiveOrder; onAdvance: (o: LiveOrder) => void; acting: string | null }) {
    const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
    const Icon = cfg.icon;
    const isActing = acting === order.id;
    const canAdvance = !!order.next_action && !['IN_TRANSIT', 'DELIVERED', 'CANCELLED'].includes(order.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl overflow-hidden border-border-subtle hover:border-primary/30 transition-all"
        >
            {/* Status Bar */}
            <div className={`${cfg.color} px-4 py-2 flex items-center justify-between`}>
                <div className="flex items-center gap-2 text-white">
                    <Icon size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{cfg.label}</span>
                </div>
                {order.requires_signature && (
                    <div className="flex items-center gap-1 bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                        <ShieldAlert size={10} /> Sig. Required
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                {/* Order ID & Time */}
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-bold text-muted font-mono">#{order.id.substring(4, 12).toUpperCase()}</p>
                    <p className="text-[10px] font-bold text-muted">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                {/* Items */}
                <div className="space-y-1.5">
                    {order.items.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span className="font-semibold text-foreground truncate">{item.name}</span>
                            {item.dosage && <span className="text-muted shrink-0">{item.dosage}</span>}
                            {item.quantity && <span className="ml-auto font-black text-muted shrink-0">×{item.quantity}</span>}
                        </div>
                    ))}
                    {order.items.length > 4 && (
                        <p className="text-[10px] text-muted font-bold pl-3.5">+{order.items.length - 4} more items</p>
                    )}
                </div>

                {/* Deliver to */}
                {order.delivery_address && (
                    <div className="flex items-start gap-2 pt-1 border-t border-border-subtle">
                        <MapPin size={12} className="text-muted shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted leading-tight">{order.delivery_address}</p>
                    </div>
                )}

                {/* Note: Billing outside */}
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest bg-stone-50 dark:bg-stone-800/50 px-2 py-1 rounded-lg text-center">
                    💡 Bill via your local POS · No billing required here
                </p>

                {/* Action Button */}
                {canAdvance && (
                    <button
                        onClick={() => onAdvance(order)}
                        disabled={isActing}
                        className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60 ${cfg.next?.includes('Accept') ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600' :
                            cfg.next?.includes('Packed') ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600' :
                            'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-light'}`}
                    >
                        {isActing ? 'Processing...' : cfg.next}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
