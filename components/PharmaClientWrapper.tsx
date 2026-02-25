'use client';

import React, { useEffect } from 'react';

import { PersonaProvider } from '@/lib/context/PersonaContext';

// Seed dummy user data for development
const DUMMY_USER = {
    _id: 'usr_001',
    name: 'Vikram Mehta',
    email: 'vikram@medicare.com',
    shopName: 'MediCare Pharmacy — SRM Campus',
    licenseNumber: 'TN-PH-2024-7891',
    address: 'Health Centre Block, SRM University, Kattankulathur',
};

function seedDummyAuth() {
    if (typeof window !== 'undefined') {
        if (!localStorage.getItem('chemToken')) {
            localStorage.setItem('chemToken', 'platform-jwt-token-clinical');
            localStorage.setItem('chemUser', JSON.stringify(DUMMY_USER));
            localStorage.setItem('platformUserId', 'usr_001');
            localStorage.setItem('activeRole', 'CHEMIST_ADMIN');
        }
    }
}

export default function PharmaClientWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        seedDummyAuth();
    }, []);

    return (
        <PersonaProvider>
            {children}
        </PersonaProvider>
    );
}
