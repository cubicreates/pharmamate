'use client';

import React, { useState, useEffect, use } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import { CheckCircle2, FileText, ArrowLeft, Package } from 'lucide-react';

interface OrderItem {
    name: string; dosage: string; quantity: number; price: number; salt?: string;
}

interface Order {
    _id: string; patientName: string; patientPrn: string;
    orderDate: string; status: string;
    items: OrderItem[]; total: number;
    doctorName?: string; doctorPhone?: string;
}

const CHECKLIST_STEPS = [
    { id: 'prescription', label: 'Prescription Verified', description: 'Confirmed the prescription matches the order', icon: '📋' },
    { id: 'dosage', label: 'Dosage Cross-Checked', description: "Dosage matches the doctor's prescription exactly", icon: '💊' },
    { id: 'expiry', label: 'Expiry Dates Checked', description: 'All dispensed medicines are within validity period', icon: '📅' },
    { id: 'batch', label: 'Batch Number Recorded', description: 'Batch numbers logged for traceability and recall tracking', icon: '🔖' },
    { id: 'interactions', label: 'Drug Interactions Reviewed', description: 'No harmful interactions between prescribed medicines', icon: '⚠️' },
    { id: 'advised', label: 'Patient Counselled', description: 'Usage instructions, side effects, and storage advice conveyed', icon: '🗣️' },
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
    const [user, setUser] = useState<{ _id?: string }>({});

    const [dispatchMethod, setDispatchMethod] = useState<'pickup' | 'delivery'>('pickup');
    const [riderName, setRiderName] = useState('');
    const [riderPhone, setRiderPhone] = useState('');
    const [isColdChain, setIsColdChain] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    };

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('chemUser') || '{}'));
    }, []);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!user._id) return;
            try {
                const orders = await apiRequest<Order[]>(`/api/orders/chemist/${user._id}`);
                const found = orders.find((o: Order) => o._id === orderId);
                if (found && found.status === 'Completed') {
                    router.replace(`/orders/${orderId}/invoice`);
                    return;
                }
                setOrder(found || null);
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetchOrder();
    }, [user._id, orderId, router]);

    const toggleStep = (id: string) => setCheckedSteps(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    const allChecked = CHECKLIST_STEPS.every(s => checkedSteps.includes(s.id));
    const progress = Math.round((checkedSteps.length / CHECKLIST_STEPS.length) * 100);

    const handleFulfill = async () => {
        if (!allChecked || !order) return;
        setFulfilling(true);
        try {
            await apiRequest(`/api/orders/${order._id}/fulfill`, {
                method: 'POST',
                body: JSON.stringify({
                    batchNumber: batchInput,
                    dispatchMethod,
                    deliveryInfo: dispatchMethod === 'delivery' ? { riderName, riderPhone, isColdChain } : null
                }),
            });
            setFulfilled(true);
        } catch { /* ignore */ } finally { setFulfilling(false); }
    };

    return (
        <Layout onLogout={handleLogout}>
            <div className="orders-animate-in" style={{ maxWidth: 780, margin: '0 auto' }}>

                {/* Header */}
                <div className="fulfill-header">
                    <div className="fulfill-header-left">
                        <h1>Fulfillment & Dispatch</h1>
                        <p>Safety verification and logistics management</p>
                    </div>
                    <button onClick={() => router.push('/orders')} className="fulfill-back-btn">
                        <ArrowLeft size={14} /> Back to Orders
                    </button>
                </div>

                {loading ? (
                    <div className="orders-loading">
                        <div className="skeleton" style={{ width: '100%', height: 60, borderRadius: 10 }} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%' }}>
                            <div className="skeleton" style={{ height: 300, borderRadius: 10 }} />
                            <div className="skeleton" style={{ height: 300, borderRadius: 10 }} />
                        </div>
                    </div>
                ) : !order ? (
                    <div className="fulfill-not-found">
                        <p>Order not found</p>
                    </div>
                ) : fulfilled ? (
                    <div className="fulfill-success orders-animate-in">
                        <div className="fulfill-success-icon">
                            <Package size={28} />
                        </div>
                        <h2>Order Dispatched Successfully</h2>
                        <p>
                            {dispatchMethod === 'delivery'
                                ? `Rider ${riderName} is on the way to the patient.`
                                : 'Patient will collect from the counter.'}
                        </p>
                        <div className="fulfill-success-actions">
                            <button onClick={() => router.push(`/orders/${orderId}/invoice`)} className="fulfill-success-primary">
                                <FileText size={14} /> Generate Invoice
                            </button>
                            <button onClick={() => router.push('/orders')} className="fulfill-success-secondary">
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Summary Bar */}
                        <div className="fulfill-summary">
                            <div className="fulfill-summary-left">
                                <p>{order.patientName}</p>
                                <p>{order.patientPrn} · {order.items.length} items · ₹{order.total}</p>
                            </div>
                            <div className="fulfill-progress-block">
                                <p className="fulfill-progress-value">{progress}%</p>
                                <p className="fulfill-progress-label">{checkedSteps.length}/{CHECKLIST_STEPS.length} steps</p>
                            </div>
                        </div>

                        <div className="fulfill-grid">
                            {/* Checklist */}
                            <div className="fulfill-card">
                                <h3 className="fulfill-card-title">
                                    <span className="fulfill-card-title-icon"><CheckCircle2 size={13} /></span>
                                    Safety Checklist
                                </h3>
                                <div className="fulfill-checklist">
                                    {CHECKLIST_STEPS.map((step) => {
                                        const done = checkedSteps.includes(step.id);
                                        return (
                                            <div key={step.id} onClick={() => toggleStep(step.id)}
                                                className={`fulfill-check-item ${done ? 'fulfill-check-item--done' : ''}`}>
                                                <div className="fulfill-check-icon">{step.icon}</div>
                                                <div className="fulfill-check-text">
                                                    <h4>{step.label}</h4>
                                                    <p>{step.description}</p>
                                                </div>
                                                {done && <div className="fulfill-check-tick">✓</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {/* Dispatch Method */}
                                <div className="fulfill-card">
                                    <h3 className="fulfill-card-title">Logistics & Dispatch</h3>
                                    <div className="fulfill-dispatch-toggle">
                                        <button onClick={() => setDispatchMethod('pickup')}
                                            className={dispatchMethod === 'pickup' ? 'active' : ''}>
                                            Counter Pickup
                                        </button>
                                        <button onClick={() => setDispatchMethod('delivery')}
                                            className={dispatchMethod === 'delivery' ? 'active' : ''}>
                                            Home Delivery
                                        </button>
                                    </div>

                                    {dispatchMethod === 'delivery' && (
                                        <div className="orders-animate-in">
                                            <div className="fulfill-field">
                                                <label className="fulfill-label">Rider Name</label>
                                                <input type="text" className="fulfill-input" placeholder="e.g. Rahul Kumar"
                                                    value={riderName} onChange={(e) => setRiderName(e.target.value)} />
                                            </div>
                                            <div className="fulfill-field">
                                                <label className="fulfill-label">Rider Contact</label>
                                                <input type="text" className="fulfill-input" placeholder="+91 91XXX XXXXX"
                                                    value={riderPhone} onChange={(e) => setRiderPhone(e.target.value)} />
                                            </div>
                                            <label className="fulfill-cold-chain">
                                                <input type="checkbox" checked={isColdChain}
                                                    onChange={(e) => setIsColdChain(e.target.checked)}
                                                    style={{ width: 16, height: 16, accentColor: '#166534' }} />
                                                <div className="fulfill-cold-chain-text">
                                                    <h4>Requires Cold Chain</h4>
                                                    <p>Dispatch with gel-pack / insulated box</p>
                                                </div>
                                                {isColdChain && <span style={{ marginLeft: 'auto', fontSize: 18 }}>❄️</span>}
                                            </label>
                                        </div>
                                    )}

                                    <div className="fulfill-field">
                                        <label className="fulfill-label">Internal Batch Code</label>
                                        <input type="text" className="fulfill-input fulfill-input--mono" placeholder="BX-000-000"
                                            value={batchInput} onChange={(e) => setBatchInput(e.target.value)} />
                                    </div>
                                </div>

                                {/* Order Preview */}
                                <div className="fulfill-card">
                                    <h3 className="fulfill-card-title">Dispensing Summary</h3>
                                    {order.items.slice(0, 4).map((item, i) => (
                                        <div key={i} className="fulfill-preview-item">
                                            <span className="fulfill-preview-name">{item.name}</span>
                                            <span className="fulfill-preview-qty">×{item.quantity}</span>
                                        </div>
                                    ))}
                                    {order.items.length > 4 && (
                                        <p className="fulfill-preview-more">+{order.items.length - 4} more items</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="fulfill-actions">
                            <div className="fulfill-status-indicator">
                                <span className={`fulfill-status-dot ${allChecked ? 'fulfill-status-dot--ready' : ''}`} />
                                {allChecked ? 'Protocols Verified' : `${CHECKLIST_STEPS.length - checkedSteps.length} Protocols Pending`}
                            </div>
                            <div className="fulfill-actions-right">
                                <button onClick={() => router.push('/orders')} className="fulfill-cancel-btn">Exit</button>
                                <button onClick={handleFulfill} disabled={!allChecked || fulfilling} className="fulfill-submit-btn">
                                    {fulfilling ? 'Dispatching...' : 'Complete & Dispatch'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
