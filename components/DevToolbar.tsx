'use client';

/**
 * @fileoverview DevToolbar — Persona Simulator
 *
 * A floating developer overlay that lets you instantly switch between
 * mock users to test how each role sees the application. Only renders
 * in development mode (NODE_ENV !== 'production').
 */

import React, { useState } from 'react';
import { usePersona } from '@/lib/context/PersonaContext';
import { ChevronUp, FlaskConical, X, User, Check, ShieldCheck } from 'lucide-react';

const ROLE_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    PHARMACIST: {
        label: 'Pharmacist',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
        dot: '#10b981',
    },
    ADMIN: {
        label: 'Admin',
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.12)',
        dot: '#3b82f6',
    },
    STOREKEEPER: {
        label: 'Storekeeper',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.12)',
        dot: '#f59e0b',
    },
    CHEMIST_ADMIN: {
        label: 'Chemist Admin',
        color: '#8b5cf6',
        bg: 'rgba(139,92,246,0.12)',
        dot: '#8b5cf6',
    }
};

const DEFAULT_META = {
    label: 'Standard User',
    color: '#a8a29e',
    bg: 'rgba(168,162,158,0.12)',
    dot: '#a8a29e',
};

export default function DevToolbar() {
    const [open, setOpen] = useState(false);
    const { user, activeRole } = usePersona();

    // Only render in development
    if (process.env.NODE_ENV === 'production') return null;

    const activeMeta = ROLE_META[activeRole] || DEFAULT_META;

    return (
        <div style={{
            position: 'fixed',
            bottom: 110,
            right: 20,
            zIndex: 9999,
            fontFamily: "'Inter', system-ui, sans-serif",
        }}>
            {/* ── Expanded Panel ── */}
            {open && (
                <div style={{
                    marginBottom: 8,
                    background: '#1c1917',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14,
                    padding: '14px',
                    width: 280,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    animation: 'devToolbarSlide 0.18s ease-out',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <FlaskConical size={13} color="#a8a29e" />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Clinical Session
                            </span>
                        </div>
                        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#57534e' }}>
                            <X size={13} />
                        </button>
                    </div>

                    <div style={{
                        background: activeMeta.bg,
                        border: `1px solid ${activeMeta.color}30`,
                        borderRadius: 8,
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={20} color={activeMeta.color} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.full_name || user?.name || 'Authorized Session'}
                            </p>
                            <p style={{ margin: 0, fontSize: 10, color: activeMeta.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {activeMeta.label}
                            </p>
                        </div>
                    </div>

                    <p style={{ margin: '12px 0 0', fontSize: 9, color: '#44403c', textAlign: 'center', fontStyle: 'italic' }}>
                        Connected via MediAuth SSO · Environment: Dev
                    </p>
                </div>
            )}

            {/* ── Trigger Button ── */}
            <button
                onClick={() => setOpen(prev => !prev)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#1c1917',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 99,
                    padding: '8px 16px 8px 10px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    transition: 'all 0.2s',
                    color: '#fff',
                }}
            >
                <div style={{
                    width: 24, height: 24, borderRadius: 8,
                    background: activeMeta.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <FlaskConical size={12} color={activeMeta.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#d6d3d1', letterSpacing: '0.02em' }}>
                    {(user?.full_name || user?.name || 'Local').split(' ')[0]}
                </span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeMeta.dot }} />
                <ChevronUp
                    size={11}
                    color="#57534e"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                />
            </button>

            <style>{`
                @keyframes devToolbarSlide {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0);   }
                }
            `}</style>
        </div>
    );
}
