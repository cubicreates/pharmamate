/**
 * @fileoverview Persona Context — Multi-Role State Management
 * 
 * Manages the authenticated user's roles (Admin / Storekeeper).
 * The active role determines sidebar visibility and page access.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { UserRole, PlatformUser } from '@/lib/mock/platform-data';
import { platformUsers } from '@/lib/mock/platform-data';

interface PersonaContextType {
    /** The full user profile with all roles */
    user: PlatformUser | null;
    /** Currently active role determining UI display */
    activeRole: UserRole;
    /** All roles the user has */
    availableRoles: UserRole[];
    /** Switch to a different role */
    switchRole: (role: UserRole) => void;
    /** Whether the user is in admin mode */
    isAdmin: boolean;
    /** Whether the user is in storekeeper mode */
    isStorekeeper: boolean;
    /** Login with a specific user (by index in mock) */
    loginAs: (userId: string) => void;
    /** Logout */
    logout: () => void;
    /** Whether context is ready */
    mounted: boolean;
}

const PersonaContext = createContext<PersonaContextType | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<PlatformUser | null>(null);
    const [activeRole, setActiveRole] = useState<UserRole>('CHEMIST_ADMIN');
    const [mounted, setMounted] = useState(false);

    // Load persisted persona on mount
    useEffect(() => {
        setMounted(true);
        const savedUserId = localStorage.getItem('platformUserId') || sessionStorage.getItem('platformUserId');
        const savedRole = localStorage.getItem('activeRole') as UserRole | null;

        if (savedUserId) {
            const found = platformUsers.find(u => u._id === savedUserId);
            if (found) {
                setUser(found);
                setActiveRole(savedRole && found.roles.includes(savedRole) ? savedRole : found.activeRole);
                return;
            }
        }

        // Fallback: Check legacy chemUser for backward compat
        const legacyUser = localStorage.getItem('chemUser') || sessionStorage.getItem('chemUser');
        if (legacyUser) {
            try {
                const parsed = JSON.parse(legacyUser);
                // Map legacy chemist to platform user
                const mapped = platformUsers.find(u => u.email === parsed.email) || platformUsers[0];
                setUser(mapped);
                setActiveRole(savedRole && mapped.roles.includes(savedRole) ? savedRole : mapped.activeRole);
                localStorage.setItem('platformUserId', mapped._id);
            } catch {
                // No valid legacy data
            }
        }
    }, []);

    const switchRole = useCallback((role: UserRole) => {
        if (!user || !user.roles.includes(role)) return;
        setActiveRole(role);
        localStorage.setItem('activeRole', role);
    }, [user]);

    const loginAs = useCallback((userId: string) => {
        const found = platformUsers.find(u => u._id === userId);
        if (found) {
            setUser(found);
            setActiveRole(found.activeRole);
            localStorage.setItem('platformUserId', found._id);
            localStorage.setItem('activeRole', found.activeRole);
            // Also set legacy keys for backward compat
            localStorage.setItem('chemUser', JSON.stringify({
                _id: found._id,
                name: found.name,
                email: found.email,
                shopName: found.shopName,
                licenseNumber: found.licenseNumber,
                address: found.address,
            }));
            localStorage.setItem('chemToken', 'platform-jwt-token-clinical');
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setActiveRole('CHEMIST_ADMIN');
        localStorage.clear();
        sessionStorage.clear();
    }, []);

    const value = useMemo<PersonaContextType>(() => ({
        user,
        activeRole,
        availableRoles: user?.roles || [],
        switchRole,
        isAdmin: activeRole === 'CHEMIST_ADMIN',
        isStorekeeper: activeRole === 'STOREKEEPER',
        loginAs,
        logout,
        mounted,
    }), [user, activeRole, switchRole, loginAs, logout, mounted]);

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
