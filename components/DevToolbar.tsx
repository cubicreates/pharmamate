'use client';

/**
 * @fileoverview DevToolbar — Persona Simulator
 *
 * A floating developer overlay that lets you instantly switch between
 * mock users to test how each role sees the application. Only renders
 * in development mode (NODE_ENV !== 'production').
 *
 * Usage: Drop <DevToolbar /> inside app/layout.tsx (inside PharmaClientWrapper).
 */

import React, { useState } from 'react';
import { usePersona } from '@/lib/context/PersonaContext';
import { platformUsers } from '@/lib/mock/platform-data';
import type { UserRole } from '@/lib/mock/platform-data';
import { ChevronUp, FlaskConical, X, UserCog, User, Check } from 'lucide-react';

const ROLE_META: Record<UserRole, { label: string; color: string; bg: string; dot: string }> = {
    CHEMIST_ADMIN: {
        label: 'Admin',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
        dot: '#10b981',
    },
    STOREKEEPER: {
        label: 'Storekeeper',
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.12)',
        dot: '#3b82f6',
    },
};

const USER_ICONS: Record<string, React.ReactNode> = {
    usr_001: <UserCog size={14} />,
    usr_002: <User size={14} />,
};

export default function DevToolbar() {
    const [open, setOpen] = useState(false);
    const { user, activeRole, loginAs, switchRole } = usePersona();

    // Only render in development
    if (process.env.NODE_ENV === 'production') return null;

    const activeMeta = ROLE_META[activeRole];

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
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <FlaskConical size={13} color="#a8a29e" />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Persona Simulator
                            </span>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#57534e', padding: 2, lineHeight: 1 }}
                        >
                            <X size={13} />
                        </button>
                    </div>

                    {/* Active badge */}
                    <div style={{
                        background: activeMeta.bg,
                        border: `1px solid ${activeMeta.color}30`,
                        borderRadius: 8,
                        padding: '8px 10px',
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: activeMeta.dot, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name ?? '—'}
                            </p>
                            <p style={{ margin: 0, fontSize: 10, color: activeMeta.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                {activeMeta.label}
                            </p>
                        </div>
                    </div>

                    {/* Users section */}
                    <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Switch User
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                        {platformUsers.map(u => {
                            const isActive = user?._id === u._id;
                            return (
                                <button
                                    key={u._id}
                                    onClick={() => loginAs(u._id)}
                                    style={{
                                        background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                                        borderRadius: 8,
                                        padding: '8px 10px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 9,
                                        transition: 'all 0.15s',
                                        textAlign: 'left',
                                    }}
                                >
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 8,
                                        background: isActive ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isActive ? '#10b981' : '#78716c',
                                        flexShrink: 0,
                                    }}>
                                        {USER_ICONS[u._id] ?? <User size={14} />}
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: isActive ? '#fff' : '#a8a29e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {u.name}
                                        </p>
                                        <p style={{ margin: 0, fontSize: 10, color: '#57534e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {u.roles.join(', ')}
                                        </p>
                                    </div>
                                    {isActive && <Check size={12} color="#10b981" style={{ flexShrink: 0 }} />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Role switcher (only for multi-role users) */}
                    {(user?.roles?.length ?? 0) > 1 && (
                        <>
                            <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Switch Role
                            </p>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {(user?.roles ?? []).map((role: UserRole) => {
                                    const meta = ROLE_META[role];
                                    const isCurrent = activeRole === role;
                                    return (
                                        <button
                                            key={role}
                                            onClick={() => switchRole(role)}
                                            style={{
                                                flex: 1,
                                                background: isCurrent ? meta.bg : 'rgba(255,255,255,0.04)',
                                                border: `1px solid ${isCurrent ? meta.color + '40' : 'rgba(255,255,255,0.06)'}`,
                                                borderRadius: 7,
                                                padding: '7px 8px',
                                                cursor: 'pointer',
                                                color: isCurrent ? meta.color : '#78716c',
                                                fontSize: 10,
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 5,
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: isCurrent ? meta.dot : '#57534e' }} />
                                            {meta.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Footer note */}
                    <p style={{ margin: '12px 0 0', fontSize: 10, color: '#44403c', textAlign: 'center' }}>
                        Dev only · hidden in production
                    </p>
                </div>
            )}

            {/* ── Trigger Button ── */}
            <button
                onClick={() => setOpen(prev => !prev)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#1c1917',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 99,
                    padding: '8px 14px 8px 10px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    transition: 'all 0.2s',
                    color: '#fff',
                    userSelect: 'none',
                }}
                title="Open persona simulator"
            >
                <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: activeMeta.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <FlaskConical size={12} color={activeMeta.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#d6d3d1' }}>
                    {user?.name?.split(' ')[0] ?? 'DevMode'}
                </span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeMeta.dot }} />
                <ChevronUp
                    size={11}
                    color="#78716c"
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
