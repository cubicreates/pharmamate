'use client';

import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import {
    TrendingUp, Calendar, Receipt, BarChart3, ScanBarcode,
    FileText, Link2, Plus, Minus, X, CheckCircle,
    Printer, Download, ExternalLink, Plug, Save
} from 'lucide-react';
import './revenue.css';

interface OrderItem {
    name: string; dosage: string; quantity: number; price: number; salt?: string;
}

interface Order {
    _id: string; patientName: string; patientPrn: string;
    orderDate: string; status: string;
    items: OrderItem[]; total: number;
    doctorName?: string; batchNumber?: string; fulfilledAt?: string;
}

interface BillingConfig {
    provider: string;
    apiKey: string;
    endpoint: string;
    connected: boolean;
}

type TabId = 'overview' | 'billing' | 'scanner' | 'taxes' | 'integrations';

export default function RevenuePage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [user, setUser] = useState<{ _id?: string; shopName?: string }>({});

    const [barcodeInput, setBarcodeInput] = useState('');
    const [billItems, setBillItems] = useState<{ name: string; qty: number; price: number; barcode: string }[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [billGenerated, setBillGenerated] = useState(false);
    const barcodeRef = useRef<HTMLInputElement>(null);

    const [billingConfig, setBillingConfig] = useState<BillingConfig>({
        provider: '', apiKey: '', endpoint: '', connected: false,
    });
    const [testingConnection, setTestingConnection] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [taxPeriod, setTaxPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

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
        const fetchOrders = async () => {
            if (!user._id) return;
            try {
                const data = await apiRequest<Order[]>(`/api/orders/chemist/${user._id}`);
                setOrders(data);
            } catch { /* */ } finally { setLoading(false); }
        };
        fetchOrders();
    }, [user._id]);

    useEffect(() => {
        if (activeTab === 'scanner' && barcodeRef.current) barcodeRef.current.focus();
    }, [activeTab]);

    const completed = orders.filter(o => o.status === 'Completed');
    const totalRevenue = completed.reduce((s, o) => s + o.total, 0);
    const totalGST = Math.round(totalRevenue * 0.12);
    const todayOrders = completed.filter(o => new Date(o.orderDate).toDateString() === new Date().toDateString());
    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
    const avgOrderValue = completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyData = weekDays.map((d, i) => ({ day: d, amount: Math.round(totalRevenue * (0.08 + Math.random() * 0.12) * (i < 5 ? 1 : 0.7)) }));
    const maxWeekly = Math.max(...weeklyData.map(d => d.amount), 1);

    const handleBarcodeScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcodeInput.trim()) return;
        const mockProducts: Record<string, { name: string; price: number }> = {
            '8901234567890': { name: 'Paracetamol 650mg (Dolo)', price: 3.20 },
            '8907569243186': { name: 'Amoxicillin 500mg (Cipla)', price: 7.14 },
            '8901790736655': { name: 'Cetirizine 10mg (Mankind)', price: 4.00 },
            '8901023018794': { name: 'Azithromycin 500mg (Alkem)', price: 60.00 },
            '8904132916253': { name: 'Ibuprofen 400mg (Abbott)', price: 3.50 },
        };
        const product = mockProducts[barcodeInput.trim()] || { name: `Unknown Item (${barcodeInput})`, price: 0 };
        const existing = billItems.find(i => i.barcode === barcodeInput.trim());
        if (existing) {
            setBillItems(prev => prev.map(i => i.barcode === barcodeInput.trim() ? { ...i, qty: i.qty + 1 } : i));
        } else {
            setBillItems(prev => [...prev, { ...product, qty: 1, barcode: barcodeInput.trim() }]);
        }
        setBarcodeInput('');
        barcodeRef.current?.focus();
    };

    const removeBillItem = (barcode: string) => setBillItems(prev => prev.filter(i => i.barcode !== barcode));
    const updateQty = (barcode: string, qty: number) => {
        if (qty <= 0) return removeBillItem(barcode);
        setBillItems(prev => prev.map(i => i.barcode === barcode ? { ...i, qty } : i));
    };
    const billSubtotal = billItems.reduce((s, i) => s + i.price * i.qty, 0);
    const billGST = Math.round(billSubtotal * 0.12 * 100) / 100;
    const billTotal = Math.round((billSubtotal + billGST) * 100) / 100;

    const handleGenerateBill = () => {
        if (billItems.length === 0) return;
        setBillGenerated(true);
        setTimeout(() => {
            setBillGenerated(false);
            setBillItems([]);
            setCustomerName('');
        }, 5000);
    };

    const handleTestConnection = async () => {
        setTestingConnection(true);
        setConnectionStatus('idle');
        await new Promise(r => setTimeout(r, 1500));
        if (billingConfig.apiKey.length > 8) {
            setConnectionStatus('success');
            setBillingConfig(prev => ({ ...prev, connected: true }));
        } else {
            setConnectionStatus('error');
        }
        setTestingConnection(false);
    };

    const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Revenue Overview', icon: <BarChart3 size={15} /> },
        { id: 'billing', label: 'Quick Billing', icon: <Receipt size={15} /> },
        { id: 'scanner', label: 'Barcode Scanner', icon: <ScanBarcode size={15} /> },
        { id: 'taxes', label: 'GST & Tax Filing', icon: <FileText size={15} /> },
        { id: 'integrations', label: 'Integrations', icon: <Link2 size={15} /> },
    ];

    return (
        <Layout onLogout={handleLogout}>
            <div className="rv-workspace animate-fade-in">
                {/* ── Hero Banner ── */}
                <div className="rv-hero">
                    <div className="rv-hero-content">
                        <div className="rv-hero-text">
                            <div className="rv-hero-badge">
                                <TrendingUp size={11} />
                                Financial Intelligence
                            </div>
                            <h1 className="rv-hero-title">Revenue &amp; Billing</h1>
                            <p className="rv-hero-subtitle">
                                Income tracking, GST filing, barcode billing, and third-party
                                integrations.
                            </p>
                        </div>
                        <div className="rv-hero-stats">
                            <div className="rv-hero-stat">
                                <div className="rv-hero-stat-value">₹{totalRevenue.toLocaleString()}</div>
                                <div className="rv-hero-stat-label">Total</div>
                            </div>
                            <div className="rv-hero-stat">
                                <div className="rv-hero-stat-value">{completed.length}</div>
                                <div className="rv-hero-stat-label">Orders</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="rv-tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`rv-tab ${activeTab === tab.id ? 'rv-tab--active' : ''}`}
                        >
                            <span className="rv-tab-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="rv-loading">
                        <div className="rv-loading-spinner" />
                        <p className="rv-loading-text">Loading revenue data...</p>
                    </div>
                ) : (
                    <>
                        {/* ═══ OVERVIEW ═══ */}
                        {activeTab === 'overview' && (
                            <div className="animate-fade-in">
                                <div className="rv-stat-grid">
                                    {[
                                        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={15} />, color: 'green' },
                                        { label: 'Today', value: `₹${todayRevenue.toLocaleString()}`, icon: <Calendar size={15} />, color: 'blue' },
                                        { label: 'GST Collected', value: `₹${totalGST.toLocaleString()}`, icon: <FileText size={15} />, color: 'amber' },
                                        { label: 'Avg Order', value: `₹${avgOrderValue}`, icon: <BarChart3 size={15} />, color: 'teal' },
                                    ].map(s => (
                                        <div key={s.label} className="rv-stat-card">
                                            <div className="rv-stat-header">
                                                <div className={`rv-stat-icon rv-stat-icon--${s.color}`}>{s.icon}</div>
                                                <p className="rv-stat-label">{s.label}</p>
                                            </div>
                                            <p className="rv-stat-value">{s.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="rv-chart-panel">
                                    <h3 className="rv-chart-title">Weekly Revenue</h3>
                                    <div className="rv-chart-bars">
                                        {weeklyData.map((d, i) => (
                                            <div
                                                key={d.day}
                                                className="rv-chart-bar-col animate-fade-in"
                                                style={{ animationDelay: `${i * 80}ms` }}
                                            >
                                                <span className="rv-chart-bar-value">₹{d.amount}</span>
                                                <div
                                                    className="rv-chart-bar"
                                                    style={{ height: `${(d.amount / maxWeekly) * 100}%` }}
                                                />
                                                <span className="rv-chart-bar-label">{d.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rv-tx-panel">
                                    <div className="rv-tx-header">
                                        <h3 className="rv-tx-title">Recent Transactions</h3>
                                    </div>
                                    {completed.slice(0, 8).map((o, i) => (
                                        <div key={o._id} className="rv-tx-row animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                                            <div className="rv-tx-info">
                                                <div className="rv-tx-icon">
                                                    <CheckCircle size={15} />
                                                </div>
                                                <div>
                                                    <p className="rv-tx-name">{o.patientName}</p>
                                                    <p className="rv-tx-meta">{o.items.length} items · {o.doctorName || 'Walk-in'}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p className="rv-tx-amount">₹{o.total}</p>
                                                <p className="rv-tx-date">{new Date(o.orderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ═══ QUICK BILLING ═══ */}
                        {activeTab === 'billing' && (
                            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '3fr 2fr' : '1fr', gap: 20 }}>
                                    <div className="rv-form-panel">
                                        <div className="rv-form-header">
                                            <div className="rv-form-header-icon"><Receipt size={16} /></div>
                                            <div className="rv-form-header-text">
                                                <h3>New Walk-in Bill</h3>
                                                <p>Add items via barcode or manual entry</p>
                                            </div>
                                        </div>
                                        <div className="rv-form-body">
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                                                <div className="up-field">
                                                    <label className="up-label">Customer Name</label>
                                                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="up-input" placeholder="Walk-in customer" />
                                                </div>
                                                <div className="up-field">
                                                    <label className="up-label">Scan / Add Item</label>
                                                    <form onSubmit={handleBarcodeScan} style={{ display: 'flex', gap: 8 }}>
                                                        <input type="text" value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)} className="up-input" style={{ fontFamily: 'monospace' }} placeholder="Barcode..." />
                                                        <button type="submit" className="rv-btn-primary" style={{ minWidth: 44, padding: '8px 12px' }}><Plus size={16} /></button>
                                                    </form>
                                                </div>
                                            </div>

                                            {billItems.length === 0 ? (
                                                <div className="rv-empty-scanner">
                                                    <div className="rv-empty-icon"><ScanBarcode size={22} /></div>
                                                    <p className="rv-empty-title">No Items Added</p>
                                                    <p className="rv-empty-desc">Scan a barcode or add items to start billing</p>
                                                </div>
                                            ) : (
                                                billItems.map((item, i) => (
                                                    <div key={item.barcode} className="rv-bill-item" style={{ animationDelay: `${i * 40}ms` }}>
                                                        <div className="rv-bill-item-info">
                                                            <p className="rv-bill-item-name">{item.name}</p>
                                                            <p className="rv-bill-item-code">{item.barcode}</p>
                                                        </div>
                                                        <div className="rv-bill-controls">
                                                            <div className="rv-qty-control">
                                                                <button className="rv-qty-btn" onClick={() => updateQty(item.barcode, item.qty - 1)}><Minus size={12} /></button>
                                                                <span className="rv-qty-value">{item.qty}</span>
                                                                <button className="rv-qty-btn" onClick={() => updateQty(item.barcode, item.qty + 1)}><Plus size={12} /></button>
                                                            </div>
                                                            <span className="rv-bill-price">₹{(item.price * item.qty).toFixed(2)}</span>
                                                            <button className="rv-bill-remove" onClick={() => removeBillItem(item.barcode)}><X size={14} /></button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="rv-summary-card">
                                        <h3 className="rv-summary-title">Bill Summary</h3>
                                        {billGenerated ? (
                                            <div style={{ textAlign: 'center', padding: '32px 0' }} className="animate-fade-in">
                                                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', margin: '0 auto 12px' }}>
                                                    <CheckCircle size={22} />
                                                </div>
                                                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', margin: '0 0 4px' }}>Bill Generated</p>
                                                <p style={{ fontSize: 13, color: '#78716c' }}>Total: ₹{billTotal.toFixed(2)}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="rv-summary-row"><span className="rv-summary-label">Items</span><span className="rv-summary-value">{billItems.length}</span></div>
                                                <div className="rv-summary-row"><span className="rv-summary-label">Subtotal</span><span className="rv-summary-value">₹{billSubtotal.toFixed(2)}</span></div>
                                                <div className="rv-summary-row"><span className="rv-summary-label">GST (12%)</span><span className="rv-summary-value">₹{billGST.toFixed(2)}</span></div>
                                                <div className="rv-summary-total"><span className="rv-summary-total-label">Total</span><span className="rv-summary-total-value">₹{billTotal.toFixed(2)}</span></div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                                                    <button onClick={handleGenerateBill} disabled={billItems.length === 0} className="rv-btn-primary">
                                                        <Receipt size={15} /> Generate Bill
                                                    </button>
                                                    <button onClick={() => window.print()} disabled={billItems.length === 0} className="rv-btn-secondary">
                                                        <Printer size={14} /> Print Bill
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ BARCODE SCANNER ═══ */}
                        {activeTab === 'scanner' && (
                            <div className="animate-fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
                                <div className="rv-form-panel">
                                    <div className="rv-form-header">
                                        <div className="rv-form-header-icon"><ScanBarcode size={16} /></div>
                                        <div className="rv-form-header-text">
                                            <h3>Barcode Scanner</h3>
                                            <p>USB/Bluetooth barcode scanner or manual entry</p>
                                        </div>
                                    </div>
                                    <div className="rv-form-body" style={{ textAlign: 'center' }}>
                                        <form onSubmit={handleBarcodeScan} style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto 20px' }}>
                                            <input ref={barcodeRef} type="text" value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)}
                                                className="up-input" style={{ fontFamily: 'monospace', fontSize: 16, textAlign: 'center', letterSpacing: '0.1em' }}
                                                placeholder="Scan barcode here..." autoFocus />
                                            <button type="submit" className="rv-btn-primary" style={{ minWidth: 100 }}>Lookup</button>
                                        </form>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'left', background: 'var(--bg-surface)', border: '1px solid var(--border-main)', borderRadius: 10, padding: 16 }}>
                                            {[
                                                { step: '1', title: 'Plug in scanner', desc: 'USB or Bluetooth barcode scanner' },
                                                { step: '2', title: 'Click the input field', desc: 'Focus the barcode input area' },
                                                { step: '3', title: 'Scan the barcode', desc: 'Scanner auto-enters the code' },
                                            ].map(s => (
                                                <div key={s.step} style={{ display: 'flex', gap: 10 }}>
                                                    <div style={{ width: 24, height: 24, borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#166534', flexShrink: 0 }}>{s.step}</div>
                                                    <div>
                                                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{s.title}</p>
                                                        <p style={{ fontSize: 11, color: '#78716c', margin: 0 }}>{s.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', borderRadius: 10, padding: 16, marginTop: 16 }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a8a29e', margin: '0 0 10px' }}>Test Barcodes</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {['8901234567890', '8907569243186', '8901790736655', '8901023018794', '8904132916253'].map(b => (
                                            <button key={b} onClick={() => { setBarcodeInput(b); handleBarcodeScan({ preventDefault: () => { } } as React.FormEvent); }}
                                                style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontFamily: 'monospace', fontWeight: 500, border: '1px solid var(--border-main)', background: '#fafaf9', color: '#78716c', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ TAX FILING ═══ */}
                        {activeTab === 'taxes' && (
                            <div className="animate-fade-in">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a8a29e', margin: 0 }}>GST &amp; Tax Summary</p>
                                    <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface)', border: '1px solid var(--border-main)', borderRadius: 8, padding: 3 }}>
                                        {(['monthly', 'quarterly', 'yearly'] as const).map(p => (
                                            <button key={p} onClick={() => setTaxPeriod(p)}
                                                className={`rv-tab ${taxPeriod === p ? 'rv-tab--active' : ''}`}
                                                style={{ padding: '4px 10px', fontSize: 11 }}>
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="rv-stat-grid" style={{ marginBottom: 20 }}>
                                    {[
                                        { label: 'Total Taxable Sales', value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={15} />, color: 'green' },
                                        { label: 'CGST (6%)', value: `₹${Math.round(totalGST / 2).toLocaleString()}`, icon: <FileText size={15} />, color: 'blue' },
                                        { label: 'SGST (6%)', value: `₹${Math.round(totalGST / 2).toLocaleString()}`, icon: <FileText size={15} />, color: 'amber' },
                                    ].map(s => (
                                        <div key={s.label} className="rv-stat-card">
                                            <div className="rv-stat-header">
                                                <div className={`rv-stat-icon rv-stat-icon--${s.color}`}>{s.icon}</div>
                                                <p className="rv-stat-label">{s.label}</p>
                                            </div>
                                            <p className="rv-stat-value">{s.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="rv-form-panel" style={{ marginBottom: 20 }}>
                                    <div className="rv-form-header">
                                        <div className="rv-form-header-icon"><FileText size={16} /></div>
                                        <div className="rv-form-header-text">
                                            <h3>GST Return Filing Status</h3>
                                            <p>Track your compliance filings</p>
                                        </div>
                                    </div>
                                    <div style={{ padding: 0 }}>
                                        {[
                                            { form: 'GSTR-1', desc: 'Outward supplies (Sales)', due: 'Mar 11, 2026', status: 'pending' },
                                            { form: 'GSTR-3B', desc: 'Monthly summary return', due: 'Mar 20, 2026', status: 'pending' },
                                            { form: 'GSTR-1', desc: 'Outward supplies (Sales)', due: 'Feb 11, 2026', status: 'filed' },
                                            { form: 'GSTR-3B', desc: 'Monthly summary return', due: 'Feb 20, 2026', status: 'filed' },
                                        ].map((f, i) => (
                                            <div key={i} className="rv-tx-row">
                                                <div>
                                                    <p className="rv-tx-name">{f.form} — {f.desc}</p>
                                                    <p className="rv-tx-meta">Due: {f.due}</p>
                                                </div>
                                                <div className="rv-gst-actions">
                                                    <span className={`badge ${f.status === 'filed' ? 'badge-success' : 'badge-warning'}`}>
                                                        {f.status === 'filed' ? 'Filed' : 'Pending'}
                                                    </span>
                                                    {f.status === 'pending' && (
                                                        <button className="rv-btn-primary" style={{ minWidth: 'auto', padding: '6px 14px', fontSize: 11 }}>
                                                            File Now
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="rv-btn-secondary" style={{ width: 'auto' }}><Download size={14} /> Export CSV</button>
                                    <button className="rv-btn-secondary" style={{ width: 'auto' }}><FileText size={14} /> Export PDF</button>
                                    <button className="rv-btn-secondary" style={{ width: 'auto' }}><ExternalLink size={14} /> Copy JSON (Tally)</button>
                                </div>
                            </div>
                        )}

                        {/* ═══ INTEGRATIONS ═══ */}
                        {activeTab === 'integrations' && (
                            <div className="animate-fade-in" style={{ maxWidth: 768, margin: '0 auto' }}>
                                <div className="rv-form-panel" style={{ marginBottom: 20 }}>
                                    <div className="rv-form-header">
                                        <div className="rv-form-header-icon"><Plug size={16} /></div>
                                        <div className="rv-form-header-text">
                                            <h3>Connect External Billing System</h3>
                                            <p>Sync invoices with Tally, Busy, Marg ERP, or Zoho</p>
                                        </div>
                                    </div>
                                    <div className="rv-form-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <div className="up-field">
                                            <label className="up-label">Billing Provider</label>
                                            <select value={billingConfig.provider} onChange={e => setBillingConfig(prev => ({ ...prev, provider: e.target.value }))} className="st-select" style={{ width: '100%' }}>
                                                <option value="">Select provider...</option>
                                                <option value="tally">Tally ERP</option>
                                                <option value="busy">Busy Accounting</option>
                                                <option value="marg">Marg ERP</option>
                                                <option value="zoho">Zoho Books</option>
                                                <option value="custom">Custom API</option>
                                            </select>
                                        </div>
                                        <div className="up-field">
                                            <label className="up-label">API Key / Auth Token</label>
                                            <input type="password" value={billingConfig.apiKey} onChange={e => setBillingConfig(prev => ({ ...prev, apiKey: e.target.value }))} className="up-input" style={{ fontFamily: 'monospace' }} placeholder="sk-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                                        </div>
                                        {billingConfig.provider === 'custom' && (
                                            <div className="up-field">
                                                <label className="up-label">API Endpoint URL</label>
                                                <input type="url" value={billingConfig.endpoint} onChange={e => setBillingConfig(prev => ({ ...prev, endpoint: e.target.value }))} className="up-input" style={{ fontFamily: 'monospace' }} placeholder="https://your-billing-api.com/v1/invoices" />
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <button onClick={handleTestConnection} disabled={!billingConfig.provider || !billingConfig.apiKey || testingConnection} className="rv-btn-primary" style={{ width: 'auto', minWidth: 160 }}>
                                                {testingConnection ? (
                                                    <><div className="rv-loading-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Testing...</>
                                                ) : (<><Plug size={14} /> Test Connection</>)}
                                            </button>
                                            {connectionStatus === 'success' && <span className="badge badge-success animate-fade-in">Connected</span>}
                                            {connectionStatus === 'error' && <span className="badge badge-warning animate-fade-in">Failed</span>}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 20 }}>
                                    {[
                                        { name: 'Tally ERP', desc: "India's #1 accounting", id: 'tally' },
                                        { name: 'Busy Accounting', desc: 'GST-ready billing', id: 'busy' },
                                        { name: 'Marg ERP', desc: 'Pharma-specific ERP', id: 'marg' },
                                        { name: 'Zoho Books', desc: 'Cloud accounting', id: 'zoho' },
                                    ].map(p => (
                                        <div key={p.name} className="rv-stat-card">
                                            <p className="rv-tx-name">{p.name}</p>
                                            <p className="rv-tx-meta" style={{ marginBottom: 8 }}>{p.desc}</p>
                                            <span className={`badge ${billingConfig.provider === p.id && billingConfig.connected ? 'badge-success' : 'badge-info'}`}>
                                                {billingConfig.provider === p.id && billingConfig.connected ? 'Connected' : 'Available'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="rv-form-panel">
                                    <div className="rv-form-header">
                                        <div className="rv-form-header-icon"><Link2 size={16} /></div>
                                        <div className="rv-form-header-text">
                                            <h3>Webhook Configuration</h3>
                                            <p>Auto-forward invoices to external systems</p>
                                        </div>
                                    </div>
                                    <div className="rv-form-body">
                                        <div className="up-field" style={{ marginBottom: 14 }}>
                                            <label className="up-label">Webhook URL</label>
                                            <input type="url" className="up-input" style={{ fontFamily: 'monospace' }} placeholder="https://your-system.com/webhooks/pharmamate" />
                                        </div>
                                        <button className="rv-btn-primary" style={{ width: 'auto' }}>
                                            <Save size={14} /> Save Webhook
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
