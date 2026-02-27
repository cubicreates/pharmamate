'use client';

import React from 'react';
import {
    Download,
    Search,
    PlusCircle,
    AlertCircle,
    Package,
    AlertTriangle,
    Clock,
    History,
    ChevronRight,
    IndianRupee,
    Boxes
} from 'lucide-react';
import MassEntryGrid from '@/components/inventory/MassEntryGrid';

import { InventoryItem } from '@/lib/types';

interface InventoryDesktopProps {
    loading: boolean;
    inventory: InventoryItem[];
    activeTab: 'overview' | 'stock' | 'inward' | 'bulk' | 'admin';
    setActiveTab: (tab: 'overview' | 'stock' | 'inward' | 'bulk' | 'admin') => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    totalValue: number;
    lowStockCount: number;
    expiringSoonCount: number;
    filteredInventory: InventoryItem[];
    handleDownloadCSV: () => void;
}

export function InventoryDesktop({
    loading,
    inventory,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    totalValue,
    lowStockCount,
    expiringSoonCount,
    filteredInventory,
    handleDownloadCSV
}: InventoryDesktopProps) {
    return (
        <div className="hidden md:block">
            {/* Desktop Hero Section */}
            <div className="inv-hero rounded-2xl mb-8 relative overflow-hidden h-40">
                <img
                    src="https://images.unsplash.com/photo-1576602976047-174ef57a404b?auto=format&fit=crop&w=1200"
                    className="w-full h-full object-cover"
                    alt="Inventory"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 to-emerald-900/40 flex items-center p-8">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                            <Package size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Global Logistics Hub</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Inventory Auditor</h2>
                        <p className="text-emerald-100/60 text-sm mt-1">Manage stock availability, track expiry, and optimize procurement.</p>
                    </div>
                </div>
            </div>

            {/* Quick Action Tabs */}
            <div className="flex items-center gap-2 mb-8 bg-stone-100 dark:bg-stone-900/50 p-1.5 rounded-2xl w-fit border border-border-subtle">
                {(['overview', 'stock', 'inward', 'bulk', 'admin'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab
                            ? 'bg-surface text-primary shadow-sm border border-border-subtle'
                            : 'text-stone-400 hover:text-stone-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Rendering based on Tab */}
            {activeTab === 'overview' && (
                <div className="inv-section-enter space-y-6">
                    <div className="inv-stats-grid">
                        {/* Stats items... */}
                        <div className="inv-stat-card inv-stat-card--total">
                            <div className="inv-stat-label">
                                <div className="inv-stat-icon"><Boxes size={15} /></div>
                                Total SKUs
                            </div>
                            <div className="inv-stat-value">{loading ? '—' : inventory.length}</div>
                            <div className="inv-stat-sub">Active medicine entries</div>
                        </div>
                        <div className="inv-stat-card inv-stat-card--value">
                            <div className="inv-stat-label">
                                <div className="inv-stat-icon"><IndianRupee size={15} /></div>
                                Stock Value
                            </div>
                            <div className="inv-stat-value">₹{loading ? '—' : totalValue.toLocaleString()}</div>
                            <div className="inv-stat-sub">Total inventory valuation</div>
                        </div>
                        <div className="inv-stat-card inv-stat-card--low">
                            <div className="inv-stat-label">
                                <div className="inv-stat-icon"><AlertTriangle size={15} /></div>
                                Low Stock
                            </div>
                            <div className="inv-stat-value">{loading ? '—' : lowStockCount}</div>
                            <div className="inv-stat-sub">Below reorder threshold</div>
                        </div>
                        <div className="inv-stat-card inv-stat-card--expiry">
                            <div className="inv-stat-label">
                                <div className="inv-stat-icon"><Clock size={15} /></div>
                                Expiring (90d)
                            </div>
                            <div className="inv-stat-value">{loading ? '—' : expiringSoonCount}</div>
                            <div className="inv-stat-sub">Approaching expiry date</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="inv-table-card">
                            <div className="inv-table-header">
                                <div className="inv-table-title-row">
                                    <AlertCircle size={16} />
                                    <h3>Items Requiring Attention</h3>
                                </div>
                                <div className="inv-table-actions">
                                    <button type="button" className="inv-action-btn" onClick={() => setActiveTab('stock')}>
                                        View All <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="inv-table-wrap">
                                <table className="inv-table">
                                    {/* Table contents... */}
                                    <thead>
                                        <tr>
                                            <th>Medicine</th>
                                            <th>Status</th>
                                            <th>Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventory.filter(i => i.stock <= i.reorderLevel).slice(0, 5).map(item => (
                                            <tr key={item._id}>
                                                <td className="font-bold text-sm">{item.name}</td>
                                                <td><span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold">LOW STOCK</span></td>
                                                <td className="font-mono text-xs">{item.stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Audit Log Card */}
                        <div className="inv-table-card">
                            <div className="inv-table-header">
                                <div className="inv-table-title-row">
                                    <History size={16} />
                                    <h3>Recent Audit Activity</h3>
                                </div>
                            </div>
                            <div className="p-2 space-y-1">
                                {/* Audit log items... */}
                                <div className="p-3 text-xs text-stone-400 italic font-medium">No recent changes detected.</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'stock' && (
                <div className="inv-section-enter space-y-6">
                    <div className="inv-table-card">
                        <div className="inv-table-header flex items-center justify-between p-6">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search medicine, salt, or code..."
                                    className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="inv-toolbar-btn" onClick={handleDownloadCSV}>
                                    <Download size={16} /> Export CSV
                                </button>
                                <button className="inv-toolbar-btn inv-toolbar-btn--primary">
                                    <PlusCircle size={16} /> Add Item
                                </button>
                            </div>
                        </div>
                        <div className="inv-table-wrap overflow-x-auto">
                            <table className="inv-table w-full">
                                <thead>
                                    <tr>
                                        <th>Medicine Name</th>
                                        <th>Stock</th>
                                        <th>Price</th>
                                        <th>Batch</th>
                                        <th>Expiry</th>
                                        <th>Shelf</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInventory.map(item => (
                                        <tr key={item._id}>
                                            <td className="font-bold">{item.name}</td>
                                            <td className="font-mono">{item.stock}</td>
                                            <td className="font-mono text-primary">₹{item.price}</td>
                                            <td className="text-xs">{item.batchNo}</td>
                                            <td className="text-xs">{new Date(item.expiryDate).toLocaleDateString()}</td>
                                            <td><span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-bold uppercase">{item.shelf}</span></td>
                                            <td className="text-right"><button className="text-primary hover:underline text-xs font-bold">Edit</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Other tabs integration... Inward, Bulk, Admin */}
            {activeTab === 'bulk' && <MassEntryGrid />}
        </div>
    );
}
