'use client';

import React, { useState, useEffect, use } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { CheckCircle2, FileText, ArrowLeft, Package, Bike, Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:8000';

interface OrderItem {
    name: string; dosage?: string; quantity: number;
}

interface Order {
    id: string;
    patient_id: string;
    status: string;
    items: OrderItem[];
    delivery_address: string;
    requires_signature: boolean;
    created_at: string;
    rider_id?: string;
}

const CHECKLIST_STEPS = [
    { id: 'prescription', label: 'Prescription Verified', description: 'Confirmed the prescription matches the order', icon: '📋' },
    { id: 'dosage', label: 'Dosage Cross-Checked', description: "Dosage matches the doctor's prescription exactly", icon: '💊' },
    { id: 'expiry', label: 'Expiry Dates Checked', description: 'All dispensed medicines are within validity period', icon: '📅' },
    { id: 'batch', label: 'Batch Number Recorded', description: 'Batch numbers logged for traceability', icon: '🔖' },
];

export default function FulfillmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: orderId } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkedSteps, setCheckedSteps] = useState<string[]>([]);
    const [batchInput, setBatchInput] = useState('');
    const [fulfilling, setFulfilling] = useState(false);
    const [fulfilled, setFulfilled] = useState(false);
    const [user, setUser] = useState<any>({});

    const [dispatchMethod, setDispatchMethod] = useState<'pickup' | 'delivery'>('delivery');
    const [isColdChain, setIsColdChain] = useState(false);
    const [riderAssigned, setRiderAssigned] = useState<string | null>(null);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        router.push('/');
    };

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('chemUser') || '{}');
        setUser(u);
    }, []);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API}/orders/${orderId}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                
                if (data.status === 'DELIVERED' || data.status === 'CANCELLED') {
                    router.replace('/orders');
                    return;
                }
                setOrder(data);
                if (data.status === 'RIDER_ASSIGNED' || data.status === 'PACKED') {
                    setFulfilled(true);
                    setRiderAssigned(data.rider_id);
                }
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetchOrder();
    }, [orderId, router]);

    const toggleStep = (id: string) => setCheckedSteps(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    const allChecked = CHECKLIST_STEPS.every(s => checkedSteps.includes(s.id));
    const progress = Math.round((checkedSteps.length / CHECKLIST_STEPS.length) * 100);

    const handleFulfill = async () => {
        if (!allChecked || !order) return;
        setFulfilling(true);
        try {
            const res = await fetch(`${API}/orders/${order.id}/fulfill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    batchNumber: batchInput,
                    dispatchMethod,
                    deliveryInfo: { isColdChain }
                }),
            });
            const data = await res.json();
            setRiderAssigned(data.rider_id);
            setFulfilled(true);
        } catch { /* ignore */ } finally { setFulfilling(false); }
    };

    return (
        <Layout onLogout={handleLogout}>
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Order Fulfillment</h1>
                        <p className="text-sm text-muted">Verify items and prepare for dispatch</p>
                    </div>
                    <button onClick={() => router.push('/orders')} className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-foreground transition-colors">
                        <ArrowLeft size={14} /> Back to Queue
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <p className="text-xs font-black uppercase tracking-widest text-muted">Fetching Order Details...</p>
                    </div>
                ) : !order ? (
                    <div className="text-center py-20 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800">
                        <p className="font-black uppercase tracking-widest text-muted">Order not found</p>
                    </div>
                ) : fulfilled ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-3xl p-10 text-center space-y-6">
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                            <Package size={32} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">Order Ready & Dispatched</h2>
                            <p className="text-sm text-emerald-600/80 dark:text-emerald-500/60 font-medium max-w-sm mx-auto">
                                The safety checklist is complete. {riderAssigned ? `Rider (ID: ${riderAssigned.substring(6, 12)}) has been assigned and is on the way.` : 'Waiting for an available rider to pick up.'}
                            </p>
                        </div>
                        <div className="flex justify-center gap-4 pt-4">
                            <button onClick={() => router.push('/orders')} className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                                Return to Terminal
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Summary & Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
                                <div className="bg-stone-50 dark:bg-stone-800/50 px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted">Prescription Details</h3>
                                    <span className="text-[10px] font-bold font-mono text-muted">ID: {order.id.toUpperCase()}</span>
                                </div>
                                <div className="p-6 space-y-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                                                    <Package size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{item.name}</p>
                                                    <p className="text-xs text-muted font-medium">{item.dosage || 'Standard Dosage'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-lg">×{item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
                                        <div className="flex items-start gap-3">
                                            <MapPin size={16} className="text-primary mt-1 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Delivery Address</p>
                                                <p className="text-sm font-medium text-foreground leading-relaxed">{order.delivery_address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
                                <div className="bg-stone-50 dark:bg-stone-800/50 px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted">Safety Checklist</h3>
                                    <span className="text-[10px] font-bold text-primary">{checkedSteps.length} / {CHECKLIST_STEPS.length} Completed</span>
                                </div>
                                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                                    {CHECKLIST_STEPS.map((step) => {
                                        const done = checkedSteps.includes(step.id);
                                        return (
                                            <button key={step.id} onClick={() => toggleStep(step.id)} className={`w-full flex items-center gap-4 p-5 text-left transition-colors ${done ? 'bg-emerald-50/30 dark:bg-emerald-950/5' : 'hover:bg-stone-50 dark:hover:bg-stone-800/30'}`}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${done ? 'bg-emerald-500 text-white scale-110' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                                                    {done ? '✓' : step.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`text-sm font-bold ${done ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>{step.label}</h4>
                                                    <p className="text-[11px] text-muted font-medium mt-0.5">{step.description}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Dispatch Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-6 shadow-sm sticky top-24">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">Logistics Strategy</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setDispatchMethod('pickup')} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${dispatchMethod === 'pickup' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-stone-200 dark:border-stone-800 text-muted hover:bg-stone-50 dark:hover:bg-stone-800'}`}>
                                            Pickup
                                        </button>
                                        <button onClick={() => setDispatchMethod('delivery')} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${dispatchMethod === 'delivery' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-stone-200 dark:border-stone-800 text-muted hover:bg-stone-50 dark:hover:bg-stone-800'}`}>
                                            Delivery
                                        </button>
                                    </div>
                                </div>

                                {dispatchMethod === 'delivery' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <label className="flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                                            <input type="checkbox" checked={isColdChain} onChange={(e) => setIsColdChain(e.target.checked)} className="w-5 h-5 accent-primary" />
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Cold Chain Required</p>
                                                <p className="text-[9px] text-muted font-medium italic">Pack with insulated box + gel</p>
                                            </div>
                                            {isColdChain && <span className="ml-auto text-lg">❄️</span>}
                                        </label>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted pl-1">Internal Batch Reference</label>
                                    <input type="text" className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="BX-000-000" value={batchInput} onChange={(e) => setBatchInput(e.target.value)} />
                                </div>

                                <div className="pt-2">
                                    <div className="mb-4 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Progress</p>
                                            <p className="text-2xl font-black tracking-tighter">{progress}%</p>
                                        </div>
                                        <p className="text-[10px] font-bold text-muted pb-1">{checkedSteps.length} of 4 tasks</p>
                                    </div>
                                    <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-primary" />
                                    </div>
                                </div>

                                <button onClick={handleFulfill} disabled={!allChecked || fulfilling} className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${!allChecked ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:bg-primary-light shadow-primary/30 active:scale-[0.98]'}`}>
                                    {fulfilling ? <Loader2 className="animate-spin" size={16} /> : <Package size={16} />}
                                    {fulfilling ? 'Dispatching...' : 'Complete & Dispatch'}
                                </button>
                                
                                <p className="text-[9px] text-center text-muted font-medium italic">
                                    {allChecked ? 'Protocol verified. Ready for logistics.' : 'Verify all safety protocols to proceed.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
