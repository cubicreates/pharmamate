'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import { Send, CheckCircle, Clock, MessageCircle, Info } from 'lucide-react';
import './clinician-connect.css';

interface QueryLog {
    id: string;
    doctorName: string;
    patientPrn: string;
    message: string;
    sentAt: string;
    status: 'sent' | 'replied' | 'pending';
}

export default function ClinicianConnectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefillDoctor = searchParams.get('doctor') || '';
    const prefillPrn = searchParams.get('prn') || '';
    const prefillClinic = searchParams.get('clinic') || '';

    const [doctorName, setDoctorName] = useState(prefillDoctor);
    const [doctorPhone, setDoctorPhone] = useState('');
    const [patientPrn, setPatientPrn] = useState(prefillPrn);
    const [clinic, setClinic] = useState(prefillClinic);
    const [message, setMessage] = useState('');
    const [queryStatus, setQueryStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [queryLogs, setQueryLogs] = useState<QueryLog[]>([]);

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    };

    useEffect(() => {
        setQueryLogs([
            {
                id: 'dq_001',
                doctorName: 'Dr. Sameer Joshi',
                patientPrn: 'PRN-1001',
                message: 'Please confirm Amoxicillin dosage for 7-day course — patient reports mild allergy history.',
                sentAt: new Date(Date.now() - 3600000).toISOString(),
                status: 'replied',
            },
            {
                id: 'dq_002',
                doctorName: 'Dr. Ananya Ray',
                patientPrn: 'PRN-1002',
                message: 'Is Glycomet GP 2 an acceptable substitute for plain Metformin 500mg?',
                sentAt: new Date(Date.now() - 7200000).toISOString(),
                status: 'sent',
            },
        ]);
    }, []);

    const handleSendQuery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!doctorName.trim() || !message.trim() || !patientPrn.trim()) return;
        setQueryStatus('sending');
        try {
            const data = (await apiRequest('/api/doctor/query', {
                method: 'POST',
                body: JSON.stringify({ doctorName, doctorPhone, patientPrn, message }),
            })) as { queryId?: string };
            setQueryStatus('sent');
            setQueryLogs((prev) => [
                {
                    id: data.queryId || 'dq_' + Date.now(),
                    doctorName,
                    patientPrn,
                    message,
                    sentAt: new Date().toISOString(),
                    status: 'pending',
                },
                ...prev,
            ]);
            setTimeout(() => {
                setQueryStatus('idle');
                setMessage('');
            }, 3000);
        } catch {
            setQueryStatus('idle');
        }
    };

    return (
        <Layout onLogout={handleLogout}>
            <div className="cc-workspace animate-fade-in">
                {/* ── Hero Banner ── */}
                <div className="cc-hero">
                    <img
                        src="/clinician-connect-hero.png"
                        alt="Pharmacy consultation workspace"
                        className="cc-hero-img"
                    />
                    <div className="cc-hero-overlay">
                        <div className="cc-hero-content">
                            <div className="cc-hero-text">
                                <div className="cc-hero-badge">
                                    <MessageCircle size={11} />
                                    Clinician Liaison
                                </div>
                                <h1 className="cc-hero-title">Clinician Connect</h1>
                                <p className="cc-hero-subtitle">
                                    Query prescribing doctors via ClinicXpert for dosage
                                    clarifications, substitution approvals, and clinical guidance.
                                </p>
                            </div>
                            <div className="cc-hero-stats">
                                <div className="cc-hero-stat">
                                    <div className="cc-hero-stat-value">{queryLogs.length}</div>
                                    <div className="cc-hero-stat-label">Queries</div>
                                </div>
                                <div className="cc-hero-stat">
                                    <div className="cc-hero-stat-value">
                                        {queryLogs.filter((q) => q.status === 'replied').length}
                                    </div>
                                    <div className="cc-hero-stat-label">Resolved</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Info Bar ── */}
                <div className="cc-info-bar">
                    <div className="cc-info-icon">
                        <Info size={16} />
                    </div>
                    <p className="cc-info-text">
                        Queries are sent via <strong>ClinicXpert</strong> to the prescribing
                        doctor&apos;s portal. Average response time is under 30 minutes during
                        clinic hours.
                    </p>
                </div>

                {/* ── Main Grid ── */}
                <div className="cc-grid">
                    {/* ── New Query Form ── */}
                    <div>
                        <div className="cc-form-panel">
                            <div className="cc-form-header">
                                <div className="cc-form-header-icon">
                                    <Send size={16} />
                                </div>
                                <div className="cc-form-header-text">
                                    <h3>New Consultation Query</h3>
                                    <p>Routed to the doctor via ClinicXpert</p>
                                </div>
                            </div>

                            {queryStatus === 'sent' ? (
                                <div className="cc-success">
                                    <div className="cc-success-icon">
                                        <CheckCircle size={24} />
                                    </div>
                                    <h3 className="cc-success-title">Query Sent Successfully</h3>
                                    <p className="cc-success-desc">
                                        The prescribing doctor will be notified via ClinicXpert and
                                        can respond directly to this consultation.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSendQuery} className="cc-form-body">
                                    <div className="cc-form-row">
                                        <div className="cc-field">
                                            <label className="cc-label">Doctor Name *</label>
                                            <input
                                                type="text"
                                                value={doctorName}
                                                onChange={(e) => setDoctorName(e.target.value)}
                                                placeholder="e.g. Dr. Sameer Joshi"
                                                className="cc-input"
                                                required
                                            />
                                        </div>
                                        <div className="cc-field">
                                            <label className="cc-label">Doctor Phone</label>
                                            <input
                                                type="text"
                                                value={doctorPhone}
                                                onChange={(e) => setDoctorPhone(e.target.value)}
                                                placeholder="e.g. +91 98765 11111"
                                                className="cc-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="cc-form-row">
                                        <div className="cc-field">
                                            <label className="cc-label">Patient PRN *</label>
                                            <input
                                                type="text"
                                                value={patientPrn}
                                                onChange={(e) => setPatientPrn(e.target.value)}
                                                placeholder="e.g. PRN-1001"
                                                className="cc-input cc-input--mono"
                                                required
                                            />
                                        </div>
                                        <div className="cc-field">
                                            <label className="cc-label">Clinic</label>
                                            <input
                                                type="text"
                                                value={clinic}
                                                onChange={(e) => setClinic(e.target.value)}
                                                placeholder="e.g. Joshi Clinic, Andheri West"
                                                className="cc-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="cc-form-row">
                                        <div className="cc-field cc-field--full">
                                            <label className="cc-label">Query Message *</label>
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Describe your query — dosage clarification, substitution approval, allergy concern, interaction check, etc."
                                                className="cc-textarea"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="cc-form-actions">
                                        <button
                                            type="submit"
                                            disabled={queryStatus === 'sending'}
                                            className="cc-submit-btn"
                                        >
                                            {queryStatus === 'sending' ? (
                                                <>
                                                    <div className="cc-submit-spinner" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={15} />
                                                    Send via ClinicXpert
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* ── Consultation Log ── */}
                    <div>
                        <div className="cc-history-panel">
                            <div className="cc-history-header">
                                <h3 className="cc-history-title">Consultation Log</h3>
                                <span className="cc-history-count">
                                    {queryLogs.length} {queryLogs.length === 1 ? 'entry' : 'entries'}
                                </span>
                            </div>

                            {queryLogs.length === 0 ? (
                                <div className="cc-empty">
                                    <div className="cc-empty-icon">
                                        <Clock size={20} />
                                    </div>
                                    <h4 className="cc-empty-title">No Consultations Yet</h4>
                                    <p className="cc-empty-desc">
                                        Sent queries will appear here with real-time status tracking.
                                    </p>
                                </div>
                            ) : (
                                <div className="cc-history-list">
                                    {queryLogs.map((log, i) => (
                                        <div
                                            key={log.id}
                                            className="cc-query-card"
                                            style={{ animationDelay: `${i * 60}ms` }}
                                        >
                                            <div className="cc-query-top">
                                                <div>
                                                    <p className="cc-query-doctor">{log.doctorName}</p>
                                                    <p className="cc-query-prn">{log.patientPrn}</p>
                                                </div>
                                                <span className={`cc-status cc-status--${log.status}`}>
                                                    <span className="cc-status-dot" />
                                                    {log.status}
                                                </span>
                                            </div>
                                            <p className="cc-query-message">{log.message}</p>
                                            <p className="cc-query-time">
                                                {new Date(log.sentAt).toLocaleTimeString(undefined, {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                                <span className="cc-query-time-sep">·</span>
                                                {new Date(log.sentAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
