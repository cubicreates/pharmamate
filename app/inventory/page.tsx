'use client';

import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import './inventory.css';
import {
    LayoutGrid,
    Download,
    ShieldCheck,
    Search,
    MapPin,
    Tag,
    PlusCircle,
    AlertCircle,
    Info,
    Package,
    TrendingUp,
    AlertTriangle,
    Clock,
    Settings,
    History,
    RefreshCcw,
    Truck,
    ChevronRight,
    Pill,
    IndianRupee,
    Boxes,
    ClipboardList
} from 'lucide-react';

type TabId = 'overview' | 'stock' | 'inward' | 'admin';

interface InventoryItem {
    _id: string; name: string; category: string;
    stock: number; reorderLevel: number; price: number;
    expiryDate: string; manufacturer: string;
    shelf: string; batchNo: string; salt: string;
}

// Mock audit data
const AUDIT_LOG = [
    { id: 1, action: 'Stock Added', detail: 'Amoxicillin 500mg — 200 units from Cipla', user: 'Pharmacist Ravi', time: '2 hours ago', type: 'add' },
    { id: 2, action: 'Manual Adjustment', detail: 'Paracetamol 650mg — -12 units (Breakage)', user: 'Admin', time: '5 hours ago', type: 'adjust' },
    { id: 3, action: 'Stock Removed', detail: 'Cough Syrup Benadryl — 5 units expired, moved to disposal', user: 'System', time: '1 day ago', type: 'remove' },
    { id: 4, action: 'Stock Added', detail: 'Metformin 500mg — 500 units from GSK', user: 'Pharmacist Ravi', time: '2 days ago', type: 'add' },
    { id: 5, action: 'Reorder Level Updated', detail: 'Azithromycin 250mg — Reorder level → 50 units', user: 'Admin', time: '3 days ago', type: 'adjust' },
];

// Mock supplier data
const SUPPLIERS = [
    { id: 1, name: 'Cipla Pharma Ltd.', contact: '+91 98765 43210', status: 'reliable', initials: 'CP' },
    { id: 2, name: 'GSK India', contact: '+91 87654 32100', status: 'reliable', initials: 'GS' },
    { id: 3, name: 'Sun Pharmaceutical', contact: '+91 76543 21000', status: 'avg', initials: 'SP' },
    { id: 4, name: 'Lupin Limited', contact: '+91 65432 10987', status: 'reliable', initials: 'LL' },
];

// --- SUB-COMPONENTS (MEMOIZED) ---

interface InventoryOverviewProps {
    loading: boolean;
    inventory: InventoryItem[];
    totalValue: number;
    lowStockCount: number;
    expiringSoonCount: number;
    setActiveTab: (tab: TabId) => void;
}

const InventoryOverview = memo(({
    loading, inventory, totalValue, lowStockCount, expiringSoonCount, setActiveTab
}: InventoryOverviewProps) => (
    <div className="inv-section-enter">
        <div className="inv-stats-grid">
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
                {loading ? (
                    <div className="inv-loading">
                        <div className="inv-spinner" />
                        <span>Loading overview...</span>
                    </div>
                ) : (
                    <table className="inv-table">
                        <thead>
                            <tr>
                                <th>Medicine</th>
                                <th>Status</th>
                                <th>Stock</th>
                                <th>Expiry</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory
                                .filter(i => i.stock <= i.reorderLevel || new Date(i.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
                                .slice(0, 8)
                                .map(item => {
                                    const isLow = item.stock <= item.reorderLevel;
                                    const isExpired = new Date(item.expiryDate) < new Date();
                                    return (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="inv-med-cell">
                                                    <div className={`inv-stock-indicator ${isLow ? 'inv-stock-indicator--low' : 'inv-stock-indicator--ok'}`} />
                                                    <div>
                                                        <p className="inv-med-name">{item.name}</p>
                                                        <p className="inv-med-mfr">{item.manufacturer}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {isExpired ? (
                                                    <span className="inv-expiry-badge inv-expiry-badge--expired">Expired</span>
                                                ) : isLow ? (
                                                    <span className="inv-expiry-badge inv-expiry-badge--soon">Low Stock</span>
                                                ) : (
                                                    <span className="inv-expiry-badge inv-expiry-badge--soon">Expiring Soon</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`inv-stock-val ${isLow ? 'inv-stock-val--low' : ''}`}>{item.stock}</span>
                                                <span className="inv-stock-unit">units</span>
                                            </td>
                                            <td>
                                                <span className={`inv-expiry-badge ${isExpired ? 'inv-expiry-badge--expired' : 'inv-expiry-badge--soon'}`}>
                                                    {isExpired ? 'EXPIRED' : new Date(item.expiryDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td>
                                                <button type="button" className="inv-action-btn" onClick={() => setActiveTab('inward')}>
                                                    {isLow ? 'Reorder' : 'Review'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            {!loading && inventory.filter(i => i.stock <= i.reorderLevel || new Date(i.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="inv-empty-state">
                                            <div className="inv-empty-icon"><ShieldCheck size={24} /></div>
                                            <p className="inv-empty-title">All Clear</p>
                                            <p className="inv-empty-desc">No items require immediate attention. All stock levels and expiry dates are healthy.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    </div>
));
InventoryOverview.displayName = 'InventoryOverview';

interface StockGridProps {
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    categoryFilter: string;
    setCategoryFilter: (v: string) => void;
    categories: string[];
    filteredInventory: InventoryItem[];
}

const StockGrid = memo(({
    loading, searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, categories, filteredInventory
}: StockGridProps) => (
    <div className="inv-section-enter">
        <div className="inv-toolbar">
            <div className="inv-search-wrap">
                <span className="inv-search-icon"><Search size={16} /></span>
                <input
                    type="text"
                    placeholder="Search medicines, salts, manufacturers..."
                    className="inv-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-search-global
                />
                <span className="inv-search-kbd">/</span>
            </div>
            <div className="inv-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`inv-filter-chip ${categoryFilter === cat ? 'inv-filter-chip--active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="inv-table-card">
            <div className="inv-table-header">
                <div className="inv-table-title-row">
                    <Package size={16} />
                    <h3>Stock Inventory</h3>
                    <span className="inv-table-count">{filteredInventory.length}</span>
                </div>
                <div className="inv-table-actions">
                    <button type="button" className="inv-action-btn"><Download size={14} /> Export</button>
                </div>
            </div>

            {loading ? (
                <div className="inv-loading">
                    <div className="inv-spinner" />
                    <span>Loading inventory data...</span>
                </div>
            ) : filteredInventory.length === 0 ? (
                <div className="inv-empty-state">
                    <div className="inv-empty-icon"><Search size={24} /></div>
                    <p className="inv-empty-title">No results found</p>
                    <p className="inv-empty-desc">Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <div className="inv-table-wrap">
                    <table className="inv-table">
                        <thead>
                            <tr>
                                <th>Medicine</th>
                                <th>Salt / Molecule</th>
                                <th>Shelf</th>
                                <th>Stock</th>
                                <th>Batch No.</th>
                                <th>Unit Price</th>
                                <th>Expiry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map(item => {
                                const isLowStock = item.stock <= item.reorderLevel;
                                const isExpired = new Date(item.expiryDate) < new Date();
                                const isExpiringSoon = !isExpired && new Date(item.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                                return (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="inv-med-cell">
                                                <div className={`inv-stock-indicator ${isLowStock ? 'inv-stock-indicator--low' : item.stock === 0 ? 'inv-stock-indicator--out' : 'inv-stock-indicator--ok'}`} />
                                                <div>
                                                    <p className="inv-med-name">{item.name}</p>
                                                    <p className="inv-med-mfr">{item.manufacturer}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="inv-salt-text">{item.salt}</span></td>
                                        <td>
                                            <span className="inv-shelf-badge">
                                                <MapPin size={10} />
                                                {item.shelf}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`inv-stock-val ${isLowStock ? 'inv-stock-val--low' : ''}`}>
                                                {item.stock}
                                            </span>
                                            <span className="inv-stock-unit">u</span>
                                        </td>
                                        <td><span className="inv-batch-text">{item.batchNo}</span></td>
                                        <td><span className="inv-price-text">₹{item.price.toFixed(2)}</span></td>
                                        <td>
                                            <span className={`inv-expiry-badge ${isExpired ? 'inv-expiry-badge--expired' : isExpiringSoon ? 'inv-expiry-badge--soon' : 'inv-expiry-badge--ok'}`}>
                                                {isExpired ? 'EXPIRED' : new Date(item.expiryDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
));
StockGrid.displayName = 'StockGrid';

interface InwardEntryProps {
    purchaseForm: {
        name: string; manufacturer: string; category: string;
        batchNo: string; expiryDate: string; stock: number;
        purchasePrice: number; sellingPrice: number; shelf: string;
        distributor: string; salt: string;
    };
    setPurchaseForm: React.Dispatch<React.SetStateAction<InwardEntryProps['purchaseForm']>>;
    onSubmit: (e: React.FormEvent) => void;
    setActiveTab: (tabId: TabId) => void;
}

const InwardEntry = memo(({
    purchaseForm, setPurchaseForm, onSubmit, setActiveTab
}: InwardEntryProps) => (
    <div className="inv-section-enter">
        <div className="inv-form-layout">
            <div className="inv-form-card">
                <div className="inv-form-header">
                    <div className="inv-form-header-left">
                        <div className="inv-form-header-icon"><PlusCircle size={18} /></div>
                        <div>
                            <h2 className="inv-form-title">Stock Inward / Purchase Entry</h2>
                            <p className="inv-form-desc">Record new stock received from distributors</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="inv-form-body">
                        <div className="inv-form-section">
                            <p className="inv-form-section-title"><Pill size={13} /> Medicine Details</p>
                            <div className="inv-form-grid">
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Medicine Name</label>
                                    <input
                                        type="text" required
                                        placeholder="Search or Enter Medicine Name"
                                        className="inv-form-input"
                                        value={purchaseForm.name}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Manufacturer</label>
                                    <input
                                        type="text" required
                                        placeholder="e.g. Cipla, GSK"
                                        className="inv-form-input"
                                        value={purchaseForm.manufacturer}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, manufacturer: e.target.value })}
                                    />
                                </div>
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Salt Composition</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Paracetamol 500mg"
                                        className="inv-form-input"
                                        value={purchaseForm.salt}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, salt: e.target.value })}
                                    />
                                </div>
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Category</label>
                                    <select
                                        className="inv-form-select"
                                        value={purchaseForm.category}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Antibiotics</option>
                                        <option>Cold &amp; Flu</option>
                                        <option>Chronic</option>
                                        <option>Scheduled Drug</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="inv-form-section">
                            <p className="inv-form-section-title"><ClipboardList size={13} /> Batch &amp; Logistics</p>
                            <div className="inv-form-grid inv-form-grid--3col">
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Batch Number</label>
                                    <input
                                        type="text" required
                                        className="inv-form-input inv-form-input--mono"
                                        value={purchaseForm.batchNo}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, batchNo: e.target.value })}
                                    />
                                </div>
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Expiry Date</label>
                                    <input
                                        type="month" required
                                        className="inv-form-input"
                                        value={purchaseForm.expiryDate}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, expiryDate: e.target.value })}
                                    />
                                </div>
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Shelf Location</label>
                                    <input
                                        type="text" required
                                        className="inv-form-input"
                                        value={purchaseForm.shelf}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, shelf: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="inv-form-section">
                            <p className="inv-form-section-title"><IndianRupee size={13} /> Financials</p>
                            <div className="inv-form-grid inv-form-grid--3col">
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Quantity</label>
                                    <input
                                        type="number" required
                                        className="inv-form-input"
                                        value={purchaseForm.stock || ''}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, stock: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Purchase Price</label>
                                    <input
                                        type="number" required
                                        className="inv-form-input"
                                        value={purchaseForm.purchasePrice || ''}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, purchasePrice: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="inv-form-group">
                                    <label className="inv-form-label">Selling MRP</label>
                                    <input
                                        type="number" required
                                        className="inv-form-input"
                                        value={purchaseForm.sellingPrice || ''}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, sellingPrice: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="inv-form-footer">
                        <button type="button" className="inv-btn-cancel" onClick={() => setActiveTab('stock')}>Cancel</button>
                        <button type="submit" className="inv-btn-primary">Save Purchase Entry</button>
                    </div>
                </form>
            </div>

            <div className="inv-side-panel">
                <div className="inv-preview-card">
                    <p className="inv-preview-title">Stock Preview</p>
                    <div className="inv-preview-row">
                        <span className="inv-preview-label">Profit / Unit</span>
                        <span className="inv-preview-value inv-preview-value--success">
                            ₹{(purchaseForm.sellingPrice - purchaseForm.purchasePrice).toFixed(2)}
                        </span>
                    </div>
                    <div className="inv-preview-row">
                        <span className="inv-preview-label">Stock Value</span>
                        <span className="inv-preview-value">
                            ₹{(purchaseForm.sellingPrice * purchaseForm.stock).toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="inv-tip-card">
                    <Info size={16} className="inv-tip-icon" />
                    <p className="inv-tip-text">
                        Entering purchase price helps in accurate profit margin analysis in the revenue dashboard.
                    </p>
                </div>
            </div>
        </div>
    </div>
));
InwardEntry.displayName = 'InwardEntry';

interface AdminHubProps {
    loading: boolean;
    expiredCount: number;
    expiringSoonCount: number;
    reconcileReason: string;
    setReconcileReason: (v: string) => void;
}

const AdminHub = memo(({
    loading, expiredCount, expiringSoonCount, reconcileReason, setReconcileReason
}: AdminHubProps) => (
    <div className="inv-section-enter">
        <div className="inv-compliance-grid">
            <div className="inv-compliance-card inv-compliance-card--expired">
                <p className="inv-compliance-label">Stock Expired</p>
                <p className="inv-compliance-value">{loading ? '—' : expiredCount}</p>
                <p className="inv-compliance-desc">Move to disposal vault immediately.</p>
            </div>
            <div className="inv-compliance-card inv-compliance-card--near">
                <p className="inv-compliance-label">Near Expiry (90d)</p>
                <p className="inv-compliance-value">{loading ? '—' : expiringSoonCount}</p>
                <p className="inv-compliance-desc">Return to distributor for credit.</p>
            </div>
            <div className="inv-compliance-card inv-compliance-card--h1">
                <p className="inv-compliance-label">Schedule H1 Logs</p>
                <p className="inv-compliance-value">82</p>
                <p className="inv-compliance-desc">Narcotics billing audit trails.</p>
            </div>
        </div>

        <div className="inv-admin-layout">
            <div className="inv-admin-card">
                <div className="inv-admin-header">
                    <div className="inv-admin-header-left">
                        <div className="inv-admin-icon inv-admin-icon--audit"><History size={16} /></div>
                        <div>
                            <h3 className="inv-admin-title">Audit Trail</h3>
                            <p className="inv-admin-desc">Recent change history</p>
                        </div>
                    </div>
                </div>
                <div className="inv-admin-body">
                    <div className="inv-audit-timeline">
                        {AUDIT_LOG.map(log => (
                            <div key={log.id} className={`inv-audit-item inv-audit-item--${log.type}`}>
                                <p className="inv-audit-action">{log.action}</p>
                                <p className="inv-audit-meta">{log.detail} · {log.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="inv-admin-card">
                <div className="inv-admin-header">
                    <div className="inv-admin-header-left">
                        <div className="inv-admin-icon inv-admin-icon--reconcile"><RefreshCcw size={16} /></div>
                        <div>
                            <h3 className="inv-admin-title">Stock Reconciliation</h3>
                            <p className="inv-admin-desc">Manual inventory adjustments</p>
                        </div>
                    </div>
                </div>
                <div className="inv-admin-body">
                    <div className="inv-reconcile-form">
                        <div className="inv-form-group">
                            <label className="inv-form-label">Reason</label>
                            <div className="inv-reconcile-reasons">
                                {['Breakage', 'Expired', 'Return', 'Theft', 'Error'].map(reason => (
                                    <button
                                        key={reason}
                                        type="button"
                                        className={`inv-reason-chip ${reconcileReason === reason ? 'inv-reason-chip--active' : ''}`}
                                        onClick={() => setReconcileReason(reason)}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="button" className="inv-btn-primary">Record Adjustment</button>
                    </div>
                </div>
            </div>

            <div className="inv-admin-card">
                <div className="inv-admin-header">
                    <div className="inv-admin-header-left">
                        <div className="inv-admin-icon inv-admin-icon--supplier"><Truck size={16} /></div>
                        <div>
                            <h3 className="inv-admin-title">Supplier Directory</h3>
                            <p className="inv-admin-desc">Distributor contacts</p>
                        </div>
                    </div>
                </div>
                <div className="inv-admin-body">
                    <div className="inv-supplier-list">
                        {SUPPLIERS.map(s => (
                            <div key={s.id} className="inv-supplier-item">
                                <div className="inv-supplier-info">
                                    <div className="inv-supplier-avatar">{s.initials}</div>
                                    <div>
                                        <p className="inv-supplier-name">{s.name}</p>
                                        <p className="inv-supplier-contact">{s.contact}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
));
AdminHub.displayName = 'AdminHub';

export default function InventoryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [reconcileReason, setReconcileReason] = useState('');

    // Purchase Form State
    const [purchaseForm, setPurchaseForm] = useState({
        name: '', manufacturer: '', category: 'General',
        batchNo: '', expiryDate: '', stock: 0,
        purchasePrice: 0, sellingPrice: 0, shelf: '',
        distributor: '', salt: ''
    });

    const handlePurchaseSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        alert('Stock Inward recorded successfully! Inventory updated.');
        setPurchaseForm({
            name: '', manufacturer: '', category: 'General',
            batchNo: '', expiryDate: '', stock: 0,
            purchasePrice: 0, sellingPrice: 0, shelf: '',
            distributor: '', salt: ''
        });
    }, []);

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
            } catch { console.error('Failed to fetch inventory'); } finally { setLoading(false); }
        };
        fetchInventory();
    }, []);

    const categories = useMemo(() =>
        ['All', ...Array.from(new Set(inventory.map(item => item.category)))],
        [inventory]
    );

    const filteredInventory = useMemo(() =>
        inventory.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.salt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.shelf.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        }),
        [inventory, searchTerm, categoryFilter]
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

    const expiredCount = useMemo(() =>
        inventory.filter(i => new Date(i.expiryDate) < new Date()).length,
        [inventory]
    );

    const totalValue = useMemo(() =>
        inventory.reduce((sum, item) => sum + (item.price * item.stock), 0),
        [inventory]
    );

    const tabs: { id: TabId; label: string; icon: React.ReactNode; count?: number }[] = [
        { id: 'overview', label: 'Overview', icon: <TrendingUp size={15} /> },
        { id: 'stock', label: 'Stock Grid', icon: <LayoutGrid size={15} />, count: inventory.length },
        { id: 'inward', label: 'Inward Entry', icon: <PlusCircle size={15} /> },
        { id: 'admin', label: 'Admin Hub', icon: <Settings size={15} /> },
    ];

    return (
        <Layout onLogout={handleLogout}>
            <div className="inv-workspace">
                {/* Hero Banner */}
                <header className="inv-hero">
                    <img
                        src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1400&h=400&fit=crop&crop=center&auto=format&q=80"
                        alt="Professional pharmacy inventory shelving"
                        className="inv-hero-img"
                    />
                    <div className="inv-hero-overlay">
                        <div className="inv-hero-content">
                            <div className="inv-hero-badge">
                                <Package size={12} />
                                <span>Verified Stock Inventory</span>
                            </div>
                            <h1 className="inv-hero-title">Nexus Inventory Vault</h1>
                            <p className="inv-hero-subtitle">Industrial-grade precision for pharmaceutical stock management and compliance.</p>
                        </div>
                    </div>
                </header>

                {/* Navigation Tabs */}
                <nav className="inv-tab-bar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`inv-tab ${activeTab === tab.id ? 'inv-tab--active' : ''}`}
                        >
                            <span className="inv-tab-icon">{tab.icon}</span>
                            <span className="inv-tab-label">{tab.label}</span>
                            {tab.count !== undefined && !loading && <span className="inv-tab-count">{tab.count}</span>}
                        </button>
                    ))}
                </nav>

                {/* Sub-interface Router */}
                <div className="inv-content-area">
                    {activeTab === 'overview' && (
                        <InventoryOverview
                            loading={loading}
                            inventory={inventory}
                            totalValue={totalValue}
                            lowStockCount={lowStockCount}
                            expiringSoonCount={expiringSoonCount}
                            setActiveTab={setActiveTab}
                        />
                    )}

                    {activeTab === 'stock' && (
                        <StockGrid
                            loading={loading}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            categories={categories}
                            filteredInventory={filteredInventory}
                        />
                    )}

                    {activeTab === 'inward' && (
                        <InwardEntry
                            purchaseForm={purchaseForm}
                            setPurchaseForm={setPurchaseForm}
                            onSubmit={handlePurchaseSubmit}
                            setActiveTab={setActiveTab}
                        />
                    )}

                    {activeTab === 'admin' && (
                        <AdminHub
                            loading={loading}
                            expiredCount={expiredCount}
                            expiringSoonCount={expiringSoonCount}
                            reconcileReason={reconcileReason}
                            setReconcileReason={setReconcileReason}
                        />
                    )}
                </div>

                {/* Global Controls Section (Persistent in Admin Hub context) */}
                {activeTab === 'admin' && (
                    <div className="inv-admin-card inv-admin-card--global">
                        <div className="inv-admin-header">
                            <div className="inv-admin-header-left">
                                <div className="inv-admin-icon inv-admin-icon--settings"><Settings size={16} /></div>
                                <div>
                                    <h3 className="inv-admin-title">Global Controls</h3>
                                    <p className="inv-admin-desc">System-wide inventory settings</p>
                                </div>
                            </div>
                        </div>
                        <div className="inv-admin-body">
                            <div className="inv-settings-list">
                                <div className="inv-setting-row">
                                    <div>
                                        <p className="inv-setting-label">Mass Update Reorder Levels</p>
                                        <p className="inv-setting-desc">Set minimum thresholds for all categories</p>
                                    </div>
                                    <button type="button" className="inv-setting-action"><Settings size={13} /> Configure</button>
                                </div>
                                <div className="inv-setting-row">
                                    <div>
                                        <p className="inv-setting-label">Manage Categories</p>
                                        <p className="inv-setting-desc">Add, rename, or archive medicine categories</p>
                                    </div>
                                    <button type="button" className="inv-setting-action"><Tag size={13} /> Edit</button>
                                </div>
                                <div className="inv-setting-row">
                                    <div>
                                        <p className="inv-setting-label">Download Compliance Report</p>
                                        <p className="inv-setting-desc">Generate PDF/CSV of expiry and Schedule H1 data</p>
                                    </div>
                                    <button type="button" className="inv-setting-action"><Download size={13} /> Export</button>
                                </div>
                                <div className="inv-setting-row">
                                    <div>
                                        <p className="inv-setting-label">Expiry Guardian Alert Settings</p>
                                        <p className="inv-setting-desc">Configure notification thresholds (30/60/90 days)</p>
                                    </div>
                                    <button type="button" className="inv-setting-action"><AlertTriangle size={13} /> Manage</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

