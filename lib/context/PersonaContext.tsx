/**
 * @fileoverview Persona Context — Unified Auth Integration
 * 
 * Manages the authenticated user's session by reading from the common
 * MediAssist Auth (SSO) storage keys.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Use standard User type as defined in auth
interface AuthUser {
    internal_id: string;
    full_name: string;
    username: string;
    email: string;
    phone: string;
    prn: string;
    type: string; 
    shopName?: string;
}

interface PersonaContextType {
    user: AuthUser | null;
    activeRole: string;
    availableRoles: string[];
    switchRole: (role: string) => void;
    isAdmin: boolean;
    logout: () => void;
    mounted: boolean;
}

const PersonaContext = createContext<PersonaContextType | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [activeRole, setActiveRole] = useState<string>('PHARMACIST');
    const [mounted, setMounted] = useState(false);

    // Common Auth Keys (Shared with Auth Portal)
    const AUTH_USER_KEY = 'ma_user';
    const AUTH_TOKEN_KEY = 'ma_token';

    const logout = useCallback(() => {
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'http://localhost:5173'; // Redirect to Auth Portal
    }, []);

    // Load persisted session on mount
    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
        
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser({
                    ...parsed,
                    name: parsed.full_name, // Map for layout compatibility
                    shopName: parsed.type_id || 'Pharmacy Store'
                });
                setActiveRole(parsed.type.toUpperCase());
            } catch (e) {
                console.error('Failed to parse stored user', e);
            }
        }
    }, []);

    const switchRole = useCallback((role: string) => {
        setActiveRole(role);
    }, []);

    const value = useMemo<PersonaContextType>(() => ({
        user: user as any, // Cast to any to handle slightly different property names in Layout
        activeRole,
        availableRoles: [activeRole],
        switchRole,
        isAdmin: true,
        logout,
        mounted,
    }), [user, activeRole, switchRole, logout, mounted]);

    return (
        <PersonaContext.Provider value={value}>
            {children}
        </PersonaContext.Provider>
    );
}

export function usePersona(): PersonaContextType {
    const ctx = useContext(PersonaContext);
    if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
    return ctx;
}
