'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import {
    Truck,
    Building2,
    Clock,
    IndianRupee,
    Star,
    Package,
    FileText,
    ChevronRight,
    ArrowRight,
    Phone,
    Mail,
} from 'lucide-react';
import { apiRequest } from '@/lib/utils/api';
import type { Vendor, PurchaseOrder } from '@/lib/mock/platform-data';

export default function VendorPortalPage() {
    const router = useRouter();
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'vendors' | 'orders'>('vendors');
    const [vendorList, setVendorList] = useState<Vendor[]>([]);
    const [orderList, setOrderList] = useState<PurchaseOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vData, oData] = await Promise.all([
                    apiRequest<Vendor[]>('/api/vendors'),
                    apiRequest<PurchaseOrder[]>('/api/purchase-orders')
                ]);
                setVendorList(vData || []);
                setOrderList(oData || []);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        router.push('/');
    };

    const reliabilityColor = (r: string) => {
        switch (r) {
            case 'Excellent': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'Good': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Average': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
            default: return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
        }
    };

    const orderStatusColor = (s: string) => {
        switch (s) {
            case 'Delivered': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'In Transit': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Ordered': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
            default: return 'text-stone-600 bg-stone-50 dark:bg-stone-800 dark:text-stone-400';
        }
    };

    const totalOutstanding = vendorList.reduce((sum, v) => sum + v.outstandingAmount, 0);

    if (loading) {
        return (
            <Layout onLogout={handleLogout}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout onLogout={handleLogout}>
            <div className="space-y-6 pb-8 animate-fade-in">
                {/* Hero */}
                <div className="relative rounded-xl overflow-hidden" style={{ minHeight: '180px' }}>
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"
                        alt="Supply chain"
                        className="w-full h-48 object-cover"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-transparent flex items-center px-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Truck size={18} className="text-blue-400" />
                                <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">B2B Supply Chain</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Vendor Portal</h1>
                            <p className="text-sm text-stone-300/60 mt-1 max-w-md">
                                Manage distributor relations, track purchase orders, and monitor supply reliability.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-surface border border-border-subtle rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 size={15} className="text-stone-400" />
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Vendors</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">{vendorList.length}</p>
                    </div>
                    <div className="bg-surface border border-border-subtle rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Package size={15} className="text-stone-400" />
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Orders</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">
                            {orderList.filter(o => o.status !== 'Delivered').length}
                        </p>
                    </div>
                    <div className="bg-surface border border-border-subtle rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <IndianRupee size={15} className="text-stone-400" />
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Outstanding</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">₹{totalOutstanding.toLocaleString()}</p>
                    </div>
                    <div className="bg-surface border border-border-subtle rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Star size={15} className="text-stone-400" />
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Avg Delivery</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">
                            {vendorList.length > 0 ? Math.round(vendorList.reduce((s, v) => s + v.avgDeliveryDays, 0) / vendorList.length) : 0}d
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
                    {(['vendors', 'orders'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === tab
                                ? 'bg-white dark:bg-stone-700 text-foreground shadow-sm'
                                : 'text-stone-500 hover:text-foreground'
                                }`}
                        >
                            {tab === 'vendors' ? 'Distributors' : 'Purchase Orders'}
                        </button>
                    ))}
                </div>

                {/* Vendor List */}
                {activeTab === 'vendors' && (
                    <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
                        <div className="divide-y divide-border-subtle">
                            {vendorList.map(vendor => {
                                const isExpanded = selectedVendor === vendor._id;
                                const vendorOrders = orderList.filter(o => o.vendorId === vendor._id);

                                return (
                                    <button
                                        key={vendor._id}
                                        onClick={() => setSelectedVendor(isExpanded ? null : vendor._id)}
                                        className="w-full text-left px-5 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-400">
                                                    {vendor.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
                                                    <p className="text-xs text-stone-500">{vendor.contactPerson} • {vendor.categories.slice(0, 2).join(', ')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${reliabilityColor(vendor.reliability)}`}>
                                                    {vendor.reliability}
                                                </span>
                                                <ChevronRight size={14} className={`text-stone-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="mt-4 ml-15 space-y-4 animate-fade-in" onClick={e => e.stopPropagation()}>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
                                                        <p className="text-[10px] text-stone-400 uppercase">Avg Delivery</p>
                                                        <p className="text-sm font-semibold text-foreground">{vendor.avgDeliveryDays} days</p>
                                                    </div>
                                                    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
                                                        <p className="text-[10px] text-stone-400 uppercase">Outstanding</p>
                                                        <p className="text-sm font-semibold text-foreground">₹{vendor.outstandingAmount.toLocaleString()}</p>
                                                    </div>
                                                    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
                                                        <p className="text-[10px] text-stone-400 uppercase">GSTIN</p>
                                                        <p className="text-xs font-mono font-semibold text-foreground">{vendor.gstIn.slice(0, 10)}...</p>
                                                    </div>
                                                    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
                                                        <p className="text-[10px] text-stone-400 uppercase">Last Order</p>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {new Date(vendor.lastOrderDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                        <Phone size={12} /> {vendor.phone}
                                                    </a>
                                                    <a href={`mailto:${vendor.email}`} className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                        <Mail size={12} /> {vendor.email}
                                                    </a>
                                                </div>

                                                {vendorOrders.length > 0 && (
                                                    <div className="border-t border-border-subtle pt-3">
                                                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Recent Orders</p>
                                                        {vendorOrders.map(o => (
                                                            <div key={o._id} className="flex items-center justify-between py-2">
                                                                <div className="flex items-center gap-2">
                                                                    <FileText size={12} className="text-stone-400" />
                                                                    <span className="text-xs font-mono text-stone-600 dark:text-stone-300">{o.invoiceNo}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-semibold text-foreground">₹{o.totalAmount.toLocaleString()}</span>
                                                                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${orderStatusColor(o.status)}`}>
                                                                        {o.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Purchase Orders */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {orderList.map(order => (
                            <div key={order._id} className="bg-surface border border-border-subtle rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-foreground">{order.vendorName}</p>
                                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${orderStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-mono text-stone-500 mt-1">{order.invoiceNo}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-foreground">₹{order.totalAmount.toLocaleString()}</p>
                                        <p className="text-[10px] text-stone-400">+ ₹{order.gstAmount.toLocaleString()} GST</p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/50 rounded-lg px-4 py-2.5">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{item.name}</p>
                                                <p className="text-xs text-stone-500">{item.quantity} units × ₹{item.unitCost}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-foreground">₹{item.totalCost.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Timeline */}
                                <div className="flex items-center gap-4 text-xs text-stone-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        <span>Ordered: {new Date(order.orderDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                    <ArrowRight size={12} className="text-stone-300" />
                                    <div className="flex items-center gap-1.5">
                                        <Truck size={12} />
                                        <span>ETA: {new Date(order.expectedDelivery).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
