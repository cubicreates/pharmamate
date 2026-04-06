'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import {
    Bell, Package, CheckCircle2, Bike, Clock, Inbox,
    AlertTriangle, Wifi, WifiOff, MapPin, Phone, ShieldAlert,
    Navigation, X, User, MessageCircle
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

interface TrackingData {
    order_id: string;
    status: string;
    delivery_address: string;
    estimated_arrival?: string;
    rider?: {
        id: string;
        name: string;
        phone: string;
        lat: number;
        lng: number;
        last_seen: string;
    } | null;
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
    const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
    const prevCountRef = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // ── Boot ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const stored = localStorage.getItem('ma_user');
        const user = stored ? JSON.parse(stored) : {};
        setUserId(user.internal_id || null);

        if (user.internal_id) {
            fetch(`${API}/pharmacy/profile/${user.internal_id}`)
                .then(r => r.json())
                .then(p => { setPharmacyId(p.id); setIsOnline(p.is_online); })
                .catch(() => {
                    fetch(`${API}/pharmacy/profile`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: user.internal_id, name: user.full_name || 'My Pharmacy' })
                    }).then(r => r.json()).then(p => setPharmacyId(p.id));
                });
        }
    }, []);

    // ── Fetch live orders ────────────────────────────────────────────────────
    const fetchOrders = useCallback(async () => {
        if (!pharmacyId) return;
        try {
            const res = await fetch(`${API}/orders/pharmacy/${pharmacyId}`);
            if (!res.ok) return;
            const data: LiveOrder[] = await res.json();
            setOrders(data);

            const pending = data.filter(o => o.status === 'PENDING').length;
            if (pending > prevCountRef.current) {
                setNewOrderAlert(true);
                setTimeout(() => setNewOrderAlert(false), 4000);
            }
            prevCountRef.current = pending;
        } catch { /* ignore */ } finally { setLoading(false); }
    }, [pharmacyId]);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 8000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const toggleOnline = async () => {
        await fetch(`${API}/pharmacy/toggle`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        setIsOnline(s => !s);
    };

    const advanceOrder = async (order: LiveOrder) => {
        if (order.status === 'ACCEPTED') {
            router.push(`/orders/${order.id}/fulfillment`);
            return;
        }
        const nextStatus = order.next_action === 'Accept Order' ? 'ACCEPTED'
            : order.next_action === 'Request Rider' ? 'RIDER_ASSIGNED'
            : order.next_action === 'Rider Picks Up' ? 'IN_TRANSIT'
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

    const handleLogout = () => { localStorage.clear(); sessionStorage.clear(); window.location.href = 'http://localhost:5173'; };

    return (
        <Layout onLogout={handleLogout}>
            <div className="space-y-6 animate-fade-in relative">

                {/* ── New Order Alert ── */}
                <AnimatePresence>
                    {newOrderAlert && (
                        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="fixed top-20 left-0 right-0 z-[100] flex justify-center px-4">
                            <div className="flex items-center gap-4 bg-blue-600 text-white rounded-2xl px-8 py-4 shadow-2xl">
                                <Bell size={24} className="animate-bounce" />
                                <div>
                                    <p className="font-black text-base tracking-tight">New Order Incoming!</p>
                                    <p className="text-[11px] opacity-80 uppercase tracking-widest">Verify the prescription now</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Hero Panel ── */}
                <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Terminal</p>
                        <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic">Live Queue</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-stone-100 text-muted border-stone-200'}`}>
                            {isOnline ? 'Store Open' : 'Store Closed'}
                        </div>
                        <button onClick={toggleOnline} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${isOnline ? 'bg-stone-700 text-white' : 'bg-primary text-white'}`}>
                            {isOnline ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Incoming', val: pending.length, color: 'text-blue-500' },
                        { label: 'Active', val: active.length, color: 'text-amber-500' },
                        { label: 'Transit', val: active.filter(o => o.status === 'IN_TRANSIT').length, color: 'text-primary' },
                        { label: 'Completed Today', val: done.length, color: 'text-emerald-500' },
                    ].map((s, i) => (
                        <div key={i} className="glass-card rounded-xl p-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">{s.label}</p>
                            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
                        </div>
                    ))}
                </div>

                {/* ── Columns ── */}
                <div className="space-y-8">
                    {/* INCOMING */}
                    {pending.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /><h2 className="text-[11px] font-black uppercase tracking-widest text-muted">Incoming Orders</h2></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {pending.map(order => <OrderCard key={order.id} order={order} onAdvance={advanceOrder} acting={acting} />)}
                            </div>
                        </section>
                    )}

                    {/* ACTIVE */}
                    {active.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /><h2 className="text-[11px] font-black uppercase tracking-widest text-muted">Active Fulfillment</h2></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {active.map(order => <OrderCard key={order.id} order={order} onAdvance={advanceOrder} acting={acting} onTrack={() => setTrackingOrder(order.id)} />)}
                            </div>
                        </section>
                    )}
                </div>

                {/* ── Tracking Overlay ── */}
                <AnimatePresence>
                    {trackingOrder && (
                        <LiveTrackingOverlay orderId={trackingOrder} onClose={() => setTrackingOrder(null)} />
                    )}
                </AnimatePresence>

            </div>
        </Layout>
    );
}

function OrderCard({ order, onAdvance, acting, onTrack }: { order: LiveOrder; onAdvance: (o: LiveOrder) => void; acting: string | null; onTrack?: () => void }) {
    const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
    const Icon = cfg.icon;
    const isActing = acting === order.id;
    const canAdvance = !!order.next_action;
    const showTrack = ['RIDER_ASSIGNED', 'IN_TRANSIT'].includes(order.status);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl overflow-hidden border border-border-subtle group hover:border-primary/50 transition-all shadow-sm">
            <div className={`${cfg.color} px-4 py-2 flex items-center justify-between text-white`}>
                <div className="flex items-center gap-2"><Icon size={12} /><span className="text-[9px] font-black uppercase tracking-widest">{cfg.label}</span></div>
                <p className="text-[9px] font-mono opacity-80">#{order.id.substring(4, 10).toUpperCase()}</p>
            </div>
            <div className="p-4 space-y-4">
                <div className="space-y-1.5">
                    {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                            <span className="font-bold text-foreground truncate max-w-[150px]">{item.name}</span>
                            <span className="font-black text-muted">×{item.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="space-y-1 opacity-70">
                    <div className="flex items-start gap-2"><MapPin size={10} className="mt-1 shrink-0" /><p className="text-[10px] font-medium leading-tight">{order.delivery_address}</p></div>
                </div>

                <div className="flex gap-2">
                    {canAdvance && (
                        <button onClick={() => onAdvance(order)} disabled={isActing} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${cfg.next?.includes('Accept') ? 'bg-blue-600 text-white' : 'bg-primary text-white'}`}>
                            {isActing ? '...' : cfg.next}
                        </button>
                    )}
                    {showTrack && (
                        <button onClick={onTrack} className="px-4 py-3 bg-stone-100 dark:bg-stone-800 text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-200 dark:hover:bg-stone-700 transition-all flex items-center gap-2">
                            <Navigation size={12} /> Track
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function LiveTrackingOverlay({ orderId, onClose }: { orderId: string, onClose: () => void }) {
    const [data, setData] = useState<TrackingData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrack = async () => {
            const res = await fetch(`${API}/orders/${orderId}/tracking`);
            if (res.ok) setData(await res.json());
            setLoading(false);
        };
        fetchTrack();
        const interval = setInterval(fetchTrack, 5000);
        return () => clearInterval(interval);
    }, [orderId]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200"><X size={16} /></button>
                
                <div className="h-48 bg-stone-200 dark:bg-stone-800 relative overflow-hidden">
                    {/* Simplified Map Visualization */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.05)_100%)] bg-[size:20px_20px]" style={{ backgroundImage: 'radial-gradient(#00c2cb44 0.5px, transparent 0.5px)' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 animate-spin-slow" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/40 ring-4 ring-white" />
                            <motion.div animate={{ x: [0, 10, -10, 0], y: [0, -10, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-10 -right-10 flex flex-col items-center">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-xl"><Bike size={14} className="text-white" /></div>
                                <div className="w-0.5 h-4 bg-black" />
                            </motion.div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary bg-white/90 dark:bg-stone-900/90 px-3 py-1.5 rounded-full inline-block shadow-md">Live Tracking Alpha</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {loading ? (
                        <div className="text-center py-10"><p className="text-[10px] font-black uppercase tracking-widest text-muted animate-pulse">Establishing Satellite Link...</p></div>
                    ) : data?.rider ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500"><User size={24} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">Rider assigned</p>
                                        <p className="text-xl font-black">{data.rider.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">ETA</p>
                                    <p className="text-xl font-black">{data.estimated_arrival || 'Calculating...'}</p>
                                </div>
                            </div>

                            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 space-y-3 border border-stone-100 dark:border-stone-800">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-muted">Status</span>
                                    <span className="text-primary uppercase tracking-wider">{data.status.replace('_', ' ')}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-muted">Last Update</span>
                                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <a href={`tel:${data.rider.phone}`} className="flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
                                    <Phone size={14} /> Call Rider
                                </a>
                                <button className="flex items-center justify-center gap-3 py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 active:scale-95 transition-all">
                                    <MessageCircle size={14} /> Message
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 space-y-4">
                             <div className="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto text-stone-400"><Bike size={24} /></div>
                             <p className="text-[11px] font-black uppercase tracking-widest text-muted">Waiting for rider pickup...</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
