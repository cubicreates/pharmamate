'use client';

import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import {
    Lock,
    Search,
    CheckCircle2,
    RefreshCw,
    Fingerprint,
    PhoneCall,
    Dna,
    MapPin,
    Send,
    ShieldCheck,
    User,
    Stethoscope,
    FileText,
    ArrowRight,
    X,
    Clock,
    Pill,
    ChevronRight,
    ScanLine,
    Printer,
} from 'lucide-react';
import './counter.css';

interface Medicine {
    name: string; dosage: string; frequency: string; duration: string; salt: string;
}

interface Prescription {
    patientName: string; patientPrn: string;
    doctorName: string; doctorPhone: string; doctorClinic: string;
    date: string; medicines: Medicine[]; notes: string;
}

interface SubstituteItem {
    _id: string; name: string; manufacturer: string; stock: number; price: number; shelf: string; salt: string; batchNo: string;
}

export default function CounterPage() {
    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialPrn = searchParams?.get('prn') || '';

    const [patientPrn, setPatientPrn] = useState(initialPrn);
    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [otpStatus, setOtpStatus] = useState<'idle' | 'requesting' | 'waiting' | 'verifying' | 'granted'>('idle');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestId, setRequestId] = useState('');
    const [substitutes, setSubstitutes] = useState<{ [salt: string]: SubstituteItem[] }>({});
    const [showSubstitutes, setShowSubstitutes] = useState<string | null>(null);
    const [showDoctorQuery, setShowDoctorQuery] = useState(false);
    const [doctorQueryMessage, setDoctorQueryMessage] = useState('');
    const [queryStatus, setQueryStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Credit'>('Cash');
    const [isFulfilled, setIsFulfilled] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.key === '/' && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const handleRequestAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientPrn.trim()) return;
        setOtpStatus('requesting');
        setShowModal(true);
        try {
            const data = await apiRequest<{ requestId: string }>('/api/access/request', {
                method: 'POST', body: JSON.stringify({ patientPrn: patientPrn.trim() }),
            });
            setRequestId(data.requestId);
            setOtpStatus('waiting');
            setTimeout(async () => {
                const status = await apiRequest<{ granted: boolean; accessToken: string }>(`/api/access/check-status/${data.requestId}`);
                if (status.granted) {
                    setOtpStatus('granted');
                    await fetchPrescription(status.accessToken, patientPrn.trim());
                    setShowModal(false);
                }
            }, 2000);
        } catch { setOtpStatus('idle'); }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) return;
        setOtpStatus('verifying');
        try {
            const data = await apiRequest<{ accessToken: string }>('/api/access/verify-otp', {
                method: 'POST', body: JSON.stringify({ requestId, otp }),
            });
            setOtpStatus('granted');
            await fetchPrescription(data.accessToken, patientPrn.trim());
            setShowModal(false);
        } catch { setOtpStatus('waiting'); }
    };

    const fetchPrescription = async (token: string, prn: string) => {
        setLoading(true);
        try {
            const data = await apiRequest<Prescription>(`/api/prescriptions/latest/${prn}`);
            setPrescription(data);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const handleFindSubstitutes = async (salt: string) => {
        if (showSubstitutes === salt) { setShowSubstitutes(null); return; }
        setShowSubstitutes(salt);
        if (substitutes[salt]) return;
        try {
            const data = await apiRequest<SubstituteItem[]>(`/api/inventory/substitutes/${encodeURIComponent(salt)}`);
            setSubstitutes(prev => ({ ...prev, [salt]: data }));
        } catch { /* ignore */ }
    };

    const handleDoctorQuery = async () => {
        if (!doctorQueryMessage.trim() || !prescription) return;
        setQueryStatus('sending');
        try {
            await apiRequest('/api/doctor/query', {
                method: 'POST',
                body: JSON.stringify({
                    doctorName: prescription.doctorName, doctorPhone: prescription.doctorPhone,
                    patientPrn: prescription.patientPrn, message: doctorQueryMessage,
                }),
            });
            setQueryStatus('sent');
            setTimeout(() => { setShowDoctorQuery(false); setQueryStatus('idle'); setDoctorQueryMessage(''); }, 2500);
        } catch { setQueryStatus('idle'); }
    };

    const handlePrintLabels = () => {
        window.print();
    };

    const handleCloseSession = () => {
        setPrescription(null); setPatientPrn(''); setOtp('');
        setOtpStatus('idle'); setShowSubstitutes(null); setSubstitutes({});
        setIsFulfilled(false);
    };

    const handleShareWhatsApp = () => {
        if (!prescription) return;
        const total = prescription.medicines.length * 150; // Mock calculation
        const text = `Hi ${prescription.patientName}, your order from MediCare Pharmacy is ready. Total: ₹${total}. Track here: https://pharmamate.app/track/${prescription.patientPrn}`;
        window.open(`https://wa.me/${prescription.doctorPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleFulfill = async () => {
        setIsFulfilled(true);
        // In a real app, this would call /api/orders/fulfill
    };

    return (
        <Layout onLogout={handleLogout}>
            <div className="counter-workspace">

                {/* ============================================ */}
                {/* IDLE STATE — No prescription loaded yet       */}
                {/* ============================================ */}
                {!prescription && !loading && (
                    <div className="animate-fade-in">

                        {/* Hero Banner */}
                        <div className="counter-hero">
                            <img
                                src="https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&q=80"
                                alt="Professional pharmacy workspace"
                                className="counter-hero-img"
                                loading="eager"
                            />
                            <div className="counter-hero-overlay">
                                <div className="counter-hero-content">
                                    <div className="counter-hero-badge">
                                        <ShieldCheck size={14} />
                                        <span>Secure Verification</span>
                                    </div>
                                    <h1 className="counter-hero-title">
                                        Prescription Counter
                                    </h1>
                                    <p className="counter-hero-subtitle">
                                        Verify patient identity, review prescriptions, and dispense with confidence.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PRN Search Card */}
                        <div className="counter-search-section">
                            <div className="counter-search-card">
                                <div className="counter-search-header">
                                    <div className="counter-search-icon-wrap">
                                        <ScanLine size={20} />
                                    </div>
                                    <div>
                                        <h2 className="counter-search-title">Patient Lookup</h2>
                                        <p className="counter-search-desc">Scan barcode or enter Patient Registration Number to begin</p>
                                    </div>
                                </div>

                                <form onSubmit={handleRequestAccess} className="counter-search-form">
                                    <div className="counter-search-input-wrap">
                                        <Search size={18} className="counter-search-input-icon" />
                                        <input
                                            ref={searchRef}
                                            type="text"
                                            data-search-global
                                            placeholder="Enter PRN (e.g. PRN-1001)"
                                            value={patientPrn}
                                            onChange={(e) => setPatientPrn(e.target.value)}
                                            className="counter-search-input"
                                        />
                                        <kbd className="counter-search-kbd">/</kbd>
                                    </div>
                                    <button type="submit" className="counter-search-btn" disabled={!patientPrn.trim()}>
                                        Verify & Continue
                                        <ArrowRight size={16} />
                                    </button>
                                </form>

                                <div className="counter-search-footer">
                                    <span className="counter-status-item">
                                        <span className="counter-status-dot counter-status-dot--online" />
                                        Scanner Active
                                    </span>
                                    <span className="counter-status-item">
                                        <span className="counter-status-dot" />
                                        Bluetooth Standby
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Guide */}
                        <div className="counter-guide">
                            <div className="counter-guide-item">
                                <div className="counter-guide-step">1</div>
                                <div>
                                    <p className="counter-guide-label">Identify</p>
                                    <p className="counter-guide-desc">Scan or enter patient PRN</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="counter-guide-arrow" />
                            <div className="counter-guide-item">
                                <div className="counter-guide-step">2</div>
                                <div>
                                    <p className="counter-guide-label">Verify</p>
                                    <p className="counter-guide-desc">OTP or patient approval</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="counter-guide-arrow" />
                            <div className="counter-guide-item">
                                <div className="counter-guide-step">3</div>
                                <div>
                                    <p className="counter-guide-label">Dispense</p>
                                    <p className="counter-guide-desc">Review & fulfil prescription</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* ============================================ */}
                {/* OTP VERIFICATION MODAL                        */}
                {/* ============================================ */}
                {showModal && (
                    <div className="counter-modal-backdrop" onClick={() => { setShowModal(false); setOtpStatus('idle'); }}>
                        <div className="counter-modal" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => { setShowModal(false); setOtpStatus('idle'); }}
                                className="counter-modal-close"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>

                            <div className="counter-modal-icon">
                                {otpStatus === 'granted'
                                    ? <CheckCircle2 size={28} />
                                    : otpStatus === 'verifying'
                                        ? <RefreshCw size={28} className="animate-spin" />
                                        : <Fingerprint size={28} />
                                }
                            </div>

                            <h3 className="counter-modal-title">
                                {otpStatus === 'granted' ? 'Access Granted' : 'Identity Verification'}
                            </h3>
                            <p className="counter-modal-subtitle">
                                Patient <strong>{patientPrn}</strong>
                            </p>

                            {otpStatus === 'requesting' && (
                                <div className="counter-modal-status">
                                    <div className="counter-spinner" />
                                    <span>Requesting access…</span>
                                </div>
                            )}

                            {otpStatus === 'waiting' && (
                                <div className="counter-modal-otp-section">
                                    <div className="counter-modal-waiting">
                                        <Clock size={14} />
                                        <span>Waiting for patient approval…</span>
                                    </div>
                                    <div className="counter-modal-divider">
                                        <span>or enter OTP manually</span>
                                    </div>
                                    <div className="counter-modal-otp-row">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="counter-otp-input"
                                            placeholder="000000"
                                            maxLength={6}
                                        />
                                        <button onClick={handleVerifyOtp} className="counter-otp-btn">
                                            Verify
                                        </button>
                                    </div>
                                </div>
                            )}

                            {otpStatus === 'granted' && (
                                <div className="counter-modal-granted">
                                    <CheckCircle2 size={16} />
                                    <span>Loading prescription data…</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* ============================================ */}
                {/* LOADING STATE                                 */}
                {/* ============================================ */}
                {loading && (
                    <div className="counter-loading">
                        <div className="counter-spinner counter-spinner--lg" />
                        <p>Retrieving prescription…</p>
                    </div>
                )}


                {/* ============================================ */}
                {/* PRESCRIPTION VIEW — Active Session             */}
                {/* ============================================ */}
                {prescription && !loading && (
                    <div className="animate-fade-in">

                        {/* Session Header Bar */}
                        <div className="counter-session-bar">
                            <div className="counter-session-info">
                                <div className="counter-session-badge">
                                    <ShieldCheck size={14} />
                                    <span>Secure Session</span>
                                </div>
                                <span className="counter-session-prn">{prescription.patientPrn}</span>
                                <span className="counter-session-separator">•</span>
                                <span className="counter-session-date">
                                    {mounted ? new Date(prescription.date).toLocaleDateString(undefined, {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    }) : ''}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={handlePrintLabels} className="counter-session-btn counter-session-btn--print">
                                    <Printer size={14} />
                                    Print Labels
                                </button>
                                <button onClick={handleCloseSession} className="counter-session-close">
                                    <Lock size={14} />
                                    End Session
                                </button>
                            </div>
                        </div>

                        {/* --- Hidden Printable Area (Stage 2 Architecture) --- */}
                        <div className="printable-area hidden print:block">
                            <div className="flex flex-wrap gap-4 p-8">
                                {prescription.medicines.map((med, i) => (
                                    <div key={i} className="print-label">
                                        <div className="print-label-header">{med.name}</div>
                                        <div className="print-label-dosage">
                                            {med.dosage} — {med.frequency}<br />
                                            {med.duration}
                                        </div>
                                        <div className="print-label-footer">
                                            <span>PRN: {prescription.patientPrn}</span>
                                            <span>{mounted ? new Date().toLocaleDateString() : ''}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Cards Row */}
                        <div className="counter-info-grid">
                            {/* Patient Card */}
                            <div className="counter-info-card">
                                <div className="counter-info-card-header">
                                    <User size={16} />
                                    <span>Patient</span>
                                </div>
                                <p className="counter-info-card-name">{prescription.patientName}</p>
                                <p className="counter-info-card-detail">{prescription.patientPrn}</p>
                            </div>

                            {/* Doctor Card */}
                            <div className="counter-info-card">
                                <div className="counter-info-card-header">
                                    <Stethoscope size={16} />
                                    <span>Prescribing Doctor</span>
                                </div>
                                <p className="counter-info-card-name">{prescription.doctorName}</p>
                                <p className="counter-info-card-detail">{prescription.doctorClinic}</p>
                                <p className="counter-info-card-detail">{prescription.doctorPhone}</p>
                                <button
                                    onClick={() => setShowDoctorQuery(!showDoctorQuery)}
                                    className="counter-clarify-btn"
                                >
                                    <PhoneCall size={13} />
                                    Clarify with Doctor
                                </button>
                            </div>

                            {/* Notes Card */}
                            {prescription.notes && (
                                <div className="counter-info-card">
                                    <div className="counter-info-card-header">
                                        <FileText size={16} />
                                        <span>Clinical Notes</span>
                                    </div>
                                    <p className="counter-info-card-notes">{prescription.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Medicines Table */}
                        <div className="counter-medicines-section">
                            <div className="counter-medicines-header">
                                <div className="counter-medicines-title-row">
                                    <Pill size={18} />
                                    <h3>Prescribed Medicines</h3>
                                </div>
                                <span className="counter-medicines-count">
                                    {prescription.medicines.length} item{prescription.medicines.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="counter-table-wrap">
                                <table className="counter-table">
                                    <thead>
                                        <tr>
                                            <th>Medicine</th>
                                            <th>Salt / Molecule</th>
                                            <th>Dosage</th>
                                            <th>Frequency</th>
                                            <th>Duration</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescription.medicines.map((med, i) => (
                                            <React.Fragment key={i}>
                                                <tr>
                                                    <td>
                                                        <span className="counter-med-name">{med.name}</span>
                                                    </td>
                                                    <td>
                                                        <span className="counter-med-salt">{med.salt}</span>
                                                    </td>
                                                    <td>
                                                        <span className="counter-med-dosage">{med.dosage}</span>
                                                    </td>
                                                    <td className="counter-med-text">{med.frequency}</td>
                                                    <td className="counter-med-text">{med.duration}</td>
                                                    <td className="text-right">
                                                        <button
                                                            onClick={() => handleFindSubstitutes(med.salt)}
                                                            className={`counter-sub-btn ${showSubstitutes === med.salt ? 'counter-sub-btn--active' : ''}`}
                                                        >
                                                            <Dna size={13} />
                                                            Substitutes
                                                        </button>
                                                    </td>
                                                </tr>
                                                {showSubstitutes === med.salt && substitutes[med.salt] && (
                                                    <tr className="counter-sub-row animate-fade-in">
                                                        <td colSpan={6}>
                                                            <div className="counter-sub-panel">
                                                                <p className="counter-sub-panel-title">
                                                                    <Dna size={12} />
                                                                    Generic Alternatives — {med.salt}
                                                                </p>
                                                                {substitutes[med.salt].length === 0 ? (
                                                                    <p className="counter-sub-empty">No matching alternatives currently in stock.</p>
                                                                ) : (
                                                                    <div className="counter-sub-grid">
                                                                        {substitutes[med.salt].map(sub => (
                                                                            <div key={sub._id} className="counter-sub-card">
                                                                                <div>
                                                                                    <p className="counter-sub-card-name">{sub.name}</p>
                                                                                    <p className="counter-sub-card-meta">{sub.manufacturer} · Batch {sub.batchNo}</p>
                                                                                </div>
                                                                                <div className="counter-sub-card-right">
                                                                                    <p className="counter-sub-card-price">₹{sub.price.toFixed(2)}</p>
                                                                                    <p className="counter-sub-card-stock">
                                                                                        <MapPin size={10} /> {sub.shelf} · {sub.stock} units
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* --- Checkout / Fulfillment Section --- */}
                        <div className="mt-8 flex flex-col lg:flex-row gap-6 pb-12">
                            <div className="flex-1 bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-primary" />
                                    Review & Verify
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-border-subtle">
                                        <div>
                                            <p className="text-sm font-bold">Cold Chain Drugs</p>
                                            <p className="text-xs text-muted">Requires refrigerated storage</p>
                                        </div>
                                        <span className="badge badge-info uppercase text-[10px] bg-stone-100 dark:bg-stone-800 text-muted px-2 py-0.5 rounded">None Detected</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-border-subtle">
                                        <div>
                                            <p className="text-sm font-bold">Schedule H1 Compliance</p>
                                            <p className="text-xs text-muted">Narcotics/Restricted protocols</p>
                                        </div>
                                        <span className="badge badge-success uppercase text-[10px] bg-success/10 text-success px-2 py-0.5 rounded font-bold">Verified</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-96 bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl relative overflow-hidden">
                                {isFulfilled && (
                                    <div className="absolute inset-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fade-in text-center p-6">
                                        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <h4 className="text-xl font-black mb-2">Order Fulfilled</h4>
                                        <p className="text-sm text-muted mb-6 font-mono tracking-tighter">Invoice #PH-INV-{Date.now().toString(36).toUpperCase()}</p>
                                        <div className="flex flex-col gap-2 w-full">
                                            <button onClick={handleShareWhatsApp} className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                                <Send size={16} /> Share on WhatsApp
                                            </button>
                                            <button onClick={handlePrintLabels} className="w-full py-3 bg-stone-100 dark:bg-stone-800 rounded-xl font-bold text-sm">
                                                Print Paper Copy
                                            </button>
                                            <button onClick={handleCloseSession} className="w-full py-3 text-primary font-bold text-sm mt-4 hover:underline">
                                                Prepare Next Patient Look-up
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-black italic tracking-tight">Checkout</h3>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded">GST READY</span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted">Subtotal</span>
                                        <span className="font-medium">₹{(prescription.medicines.length * 150).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted">GST (12%)</span>
                                        <span className="font-medium">₹{(prescription.medicines.length * 150 * 0.12).toFixed(2)}</span>
                                    </div>
                                    <div className="pt-3 border-t border-border-subtle flex justify-between items-center">
                                        <span className="font-bold">Grand Total</span>
                                        <span className="text-2xl font-black text-primary">₹{(prescription.medicines.length * 150 * 1.12).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Payment Method</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['Cash', 'UPI', 'Credit'] as const).map(method => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${paymentMethod === method ? 'bg-primary/5 border-primary text-primary' : 'bg-stone-50 dark:bg-stone-900 border-border-subtle text-muted'}`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={handleFulfill} className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/30 hover:bg-primary-light transition-all flex items-center justify-center gap-2">
                                    Complete Dispensing <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* ============================================ */}
                {/* DOCTOR QUERY MODAL                             */}
                {/* ============================================ */}
                {showDoctorQuery && prescription && (
                    <div className="counter-modal-backdrop" onClick={() => { setShowDoctorQuery(false); setDoctorQueryMessage(''); }}>
                        <div className="counter-modal counter-modal--wide" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => { setShowDoctorQuery(false); setDoctorQueryMessage(''); }}
                                className="counter-modal-close"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>

                            <div className="counter-modal-header-row">
                                <div className="counter-modal-icon counter-modal-icon--blue">
                                    <PhoneCall size={22} />
                                </div>
                                <div>
                                    <h3 className="counter-modal-title" style={{ marginBottom: '2px' }}>
                                        Clarify with Doctor
                                    </h3>
                                    <p className="counter-modal-subtitle" style={{ marginBottom: 0 }}>
                                        {prescription.doctorName} · {prescription.doctorClinic}
                                    </p>
                                </div>
                            </div>

                            {queryStatus === 'sent' ? (
                                <div className="counter-modal-sent">
                                    <CheckCircle2 size={36} />
                                    <p className="counter-modal-sent-title">Query Sent</p>
                                    <p className="counter-modal-sent-desc">
                                        The doctor will be notified via ClinicXpert.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="counter-query-context">
                                        <p className="counter-query-context-label">
                                            Re: Patient {prescription.patientPrn}
                                        </p>
                                        <p className="counter-query-context-meds">
                                            Prescribed: {prescription.medicines.map(m => m.name).join(', ')}
                                        </p>
                                    </div>
                                    <textarea
                                        className="counter-query-textarea"
                                        placeholder="Describe your query or concern…"
                                        value={doctorQueryMessage}
                                        onChange={(e) => setDoctorQueryMessage(e.target.value)}
                                    />
                                    <div className="counter-query-actions">
                                        <button
                                            onClick={() => { setShowDoctorQuery(false); setDoctorQueryMessage(''); }}
                                            className="counter-query-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDoctorQuery}
                                            disabled={queryStatus === 'sending' || !doctorQueryMessage.trim()}
                                            className="counter-query-send"
                                        >
                                            <Send size={14} />
                                            {queryStatus === 'sending' ? 'Sending…' : 'Send to Doctor'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
}
