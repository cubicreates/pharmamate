'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Save, Calculator } from 'lucide-react';

interface EntryRow {
    id: string;
    name: string;
    batch: string;
    expiry: string;
    qty: number;
    purchase: number;
    mrp: number;
    shelf: string;
    hsn: string;
    gst: number;
}

export default function MassEntryGrid() {
    const [rows, setRows] = useState<EntryRow[]>([
        { id: '1', name: '', batch: '', expiry: '', qty: 0, purchase: 0, mrp: 0, shelf: '', hsn: '', gst: 12 }
    ]);

    const addRow = () => {
        setRows([...rows, { id: Date.now().toString(), name: '', batch: '', expiry: '', qty: 0, purchase: 0, mrp: 0, shelf: '', hsn: '', gst: 12 }]);
    };

    const removeRow = (id: string) => {
        if (rows.length > 1) {
            setRows(rows.filter(r => r.id !== id));
        }
    };

    const updateRow = (id: string, field: keyof EntryRow, value: string | number) => {
        setRows(rows.map(r => {
            if (r.id === id) {
                const updated = { ...r, [field]: value };
                // Integrated HSN Auto-suggestion
                if (field === 'name' && typeof value === 'string' && value.length > 3) {
                    if (value.toLowerCase().includes('pill') || value.toLowerCase().includes('tab')) updated.hsn = '3004';
                    if (value.toLowerCase().includes('syrup')) updated.hsn = '3003';
                    if (value.toLowerCase().includes('inj')) updated.hsn = '3006';
                }
                return updated;
            }
            return r;
        }));
    };

    const totalPurchase = rows.reduce((sum, r) => sum + (r.purchase * r.qty), 0);
    const totalMrp = rows.reduce((sum, r) => sum + (r.mrp * r.qty), 0);
    const potentialProfit = totalMrp - totalPurchase;

    return (
        <div className="inv-section-enter space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calculator className="text-primary" size={20} />
                        Bulk Inwarding Console
                    </h3>
                    <p className="text-xs text-muted">High-speed spreadsheet entry for large consignments.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">Total Investment</p>
                        <p className="text-lg font-black text-foreground">₹{totalPurchase.toLocaleString()}</p>
                    </div>
                    <div className="text-right border-l border-border-subtle pl-4">
                        <p className="text-[10px] font-bold text-success uppercase tracking-widest leading-none">Est. Profit</p>
                        <p className="text-lg font-black text-success">₹{potentialProfit.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-border-subtle">
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest w-1/4">Medicine Name</th>
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest">HSN</th>
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest">GST %</th>
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest">Batch</th>
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest">Expiry</th>
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest">Qty</th>
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest">Purchase</th>
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest">MRP</th>
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest">Shelf</th>
                            <th className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id} className="border-b border-border-subtle last:border-0 hover:bg-stone-50/50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-2">
                                    <input
                                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 py-1.5 text-sm font-medium"
                                        placeholder="Medicine Name..."
                                        value={row.name}
                                        onChange={e => updateRow(row.id, 'name', e.target.value)}
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 py-1.5 text-sm font-mono text-muted"
                                        placeholder="HSN"
                                        value={row.hsn}
                                        onChange={e => updateRow(row.id, 'hsn', e.target.value)}
                                    />
                                </td>
                                <td className="p-2">
                                    <select
                                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-1 py-1.5 text-xs font-bold"
                                        value={row.gst}
                                        onChange={e => updateRow(row.id, 'gst', parseInt(e.target.value))}
                                    >
                                        <option value={5}>5%</option>
                                        <option value={12}>12%</option>
                                        <option value={18}>18%</option>
                                    </select>
                                </td>
                                <td className="p-2">
                                    <input
                                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 py-1.5 text-sm uppercase font-mono"
                                        placeholder="B-000"
                                        value={row.batch}
                                        onChange={e => updateRow(row.id, 'batch', e.target.value)}
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="month"
                                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 py-1.5 text-sm"
                                        value={row.expiry}
                                        onChange={e => updateRow(row.id, 'expiry', e.target.value)}
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="number"
                                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 py-1.5 text-sm font-bold text-primary"
                                        value={row.qty}
                                        onChange={e => updateRow(row.id, 'qty', parseInt(e.target.value) || 0)}
                                    />
                                </td>
                                <td className="p-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-muted">₹</span>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-1 py-1.5 text-sm"
                                            value={row.purchase}
                                            onChange={e => updateRow(row.id, 'purchase', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </td>
                                <td className="p-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-muted">₹</span>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-1 py-1.5 text-sm"
                                            value={row.mrp}
                                            onChange={e => updateRow(row.id, 'mrp', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </td>
                                <td className="p-2">
                                    <input
                                        className="w-full bg-transparent border-0 focus:ring-1 focus:ring-primary rounded px-2 py-1.5 text-sm"
                                        placeholder="e.g. A2"
                                        value={row.shelf}
                                        onChange={e => updateRow(row.id, 'shelf', e.target.value)}
                                    />
                                </td>
                                <td className="p-2 text-center">
                                    <button
                                        onClick={() => removeRow(row.id)}
                                        className="text-stone-300 hover:text-danger p-1 rounded transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={addRow}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-stone-200 dark:border-stone-800 text-stone-400 hover:text-primary hover:border-primary transition-all font-bold text-xs uppercase tracking-widest flex-1"
                >
                    <Plus size={16} /> Add Row
                </button>
                <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary-light transition-all shadow-lg shadow-primary/20">
                    <Save size={16} /> Process Batch
                </button>
            </div>
        </div>
    );
}
