'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import { InventoryDesktop } from '@/components/dashboard/InventoryDesktop';
import { InventoryMobile } from '@/components/dashboard/InventoryMobile';
import { InventoryItem } from '@/lib/types';

export default function InventoryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'inward' | 'bulk' | 'admin'>('overview');
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = useCallback(() => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    }, [router]);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const data = await apiRequest<InventoryItem[]>('/api/inventory');
                setInventory(data);
            } catch {
                console.error('Failed to fetch inventory');
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const filteredInventory = useMemo(() =>
        inventory.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.salt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.shelf.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        }),
        [inventory, searchTerm]
    );

    const lowStockCount = useMemo(() =>
        inventory.filter(i => i.stock <= i.reorderLevel).length,
        [inventory]
    );

    const expiringSoonCount = useMemo(() =>
        inventory.filter(i => {
            const exp = new Date(i.expiryDate);
            return exp > new Date() && exp < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        }).length,
        [inventory]
    );

    const totalValue = useMemo(() =>
        inventory.reduce((sum, item) => sum + (item.price * item.stock), 0),
        [inventory]
    );

    const handleDownloadCSV = () => {
        console.log('Downloading CSV...');
    };

    return (
        <Layout onLogout={handleLogout}>
            <div className="p-4 md:p-8">
                <InventoryDesktop
                    loading={loading}
                    inventory={inventory}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    searchQuery={searchTerm}
                    setSearchQuery={setSearchTerm}
                    totalValue={totalValue}
                    lowStockCount={lowStockCount}
                    expiringSoonCount={expiringSoonCount}
                    filteredInventory={filteredInventory}
                    handleDownloadCSV={handleDownloadCSV}
                />
                <InventoryMobile
                    searchQuery={searchTerm}
                    setSearchQuery={setSearchTerm}
                    filteredInventory={filteredInventory}
                    lowStockCount={lowStockCount}
                    expiringSoonCount={expiringSoonCount}
                />
            </div>
        </Layout>
    );
}
