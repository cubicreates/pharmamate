/**
 * @fileoverview POS Mode — High-Speed Point of Sale for Storekeepers
 * 
 * Zero-friction barcode-first billing interface:
 * - Auto-focus on barcode input
 * - F2 to checkout, Esc to cancel
 * - Real-time cart with quantity controls
 * - GST-compliant billing
 * - Touch-ready for tablet deployment
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    ScanLine,
    ShoppingCart,
    IndianRupee,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    Banknote,
    Smartphone,
    Printer,
    CheckCircle2,
    ArrowLeft,
    Keyboard,
    Package,
    AlertTriangle,
    Zap,
} from 'lucide-react';
import { apiRequest } from '@/lib/utils/api';
import type { UniversityInventoryItem } from '@/lib/mock/platform-data';

interface CartItem {
    product: UniversityInventoryItem;
    quantity: number;
}

export default function POSPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | null>(null);
    const [billGenerated, setBillGenerated] = useState(false);
    const barcodeRef = useRef<HTMLInputElement>(null);

    // Auto-focus on mount
    useEffect(() => {
        barcodeRef.current?.focus();
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'F2') {
                e.preventDefault();
                if (cart.length > 0) setShowCheckout(true);
            }
            if (e.key === 'Escape') {
                if (showCheckout) setShowCheckout(false);
                else if (billGenerated) handleNewTransaction();
                else barcodeRef.current?.focus();
            }
            if (e.key === 'F4') {
                e.preventDefault();
                handleNewTransaction();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [cart, showCheckout, billGenerated]);

    const handleBarcodeScan = useCallback(async (e?: React.FormEvent, manualBarcode?: string) => {
        if (e) e.preventDefault();
        const barcode = manualBarcode || barcodeInput;
        if (!barcode.trim()) return;

        setScanError(null);
        try {
            const product = await apiRequest<UniversityInventoryItem | null>(`/api/university-inventory/barcode/${barcode}`);

            if (product) {
                setCart(prev => {
                    const existing = prev.find(item => item.product._id === product._id);
                    if (existing) {
                        return prev.map(item =>
                            item.product._id === product._id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        );
                    }
                    return [...prev, { product, quantity: 1 }];
                });
                setLastScanned(product.name);
                setBarcodeInput('');
                setTimeout(() => setLastScanned(null), 2000);
            } else {
                setScanError(`Product not found: ${barcode}`);
                setBarcodeInput('');
            }
        } catch (error) {
            setScanError('Scanner connectivity failure');
            console.error(error);
        }
    }, [barcodeInput]);

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev =>
            prev
                .map(c => c.product._id === productId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c)
                .filter(c => c.quantity > 0)
        );
    };

    const removeItem = (productId: string) => {
        setCart(prev => prev.filter(c => c.product._id !== productId));
    };

    const subtotal = cart.reduce((sum, c) => sum + c.product.mrp * c.quantity, 0);
    const gst = cart.reduce((sum, c) => {
        const base = c.product.price * c.quantity;
        return sum + (base * c.product.gstRate / 100);
    }, 0);
    const total = subtotal;

    const handleCheckout = (method: 'CASH' | 'UPI' | 'CARD') => {
        setPaymentMethod(method);
        setBillGenerated(true);
        setShowCheckout(false);
    };

    const handleNewTransaction = () => {
        setCart([]);
        setBillGenerated(false);
        setPaymentMethod(null);
        setShowCheckout(false);
        setScanError(null);
        setBarcodeInput('');
        setTimeout(() => barcodeRef.current?.focus(), 100);
    };

    // Bill Generated State
    if (billGenerated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-surface border border-border-subtle rounded-2xl p-10 max-w-md w-full text-center animate-scale-in shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 mx-auto flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Transaction Complete</h2>
                    <p className="text-sm text-stone-500 mt-2">Bill #{Date.now().toString(36).toUpperCase()}</p>

                    <div className="mt-6 bg-stone-50 dark:bg-stone-800/50 rounded-xl p-5 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">Items</span>
                            <span className="font-semibold text-foreground">{cart.reduce((s, c) => s + c.quantity, 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">Subtotal</span>
                            <span className="font-semibold text-foreground">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">GST (Incl.)</span>
                            <span className="font-semibold text-foreground">₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-border-subtle pt-3 flex justify-between text-lg">
                            <span className="font-semibold text-foreground">Total</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">Payment</span>
                            <span className="font-semibold text-foreground">{paymentMethod}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border-subtle text-sm font-semibold text-foreground hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                        >
                            <Printer size={16} /> Print
                        </button>
                        <button
                            onClick={handleNewTransaction}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-colors"
                            style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)' }}
                        >
                            <Zap size={16} /> New Sale (Esc)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Minimal Header */}
            <header className="h-12 flex items-center justify-between px-5 bg-surface border-b border-border-subtle flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/')}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: '#166534' }}>✚</div>
                        <span className="text-sm font-semibold text-foreground">POS Mode</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-stone-400">
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">F2</span>
                        <span>Checkout</span>
                        <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 ml-2">F4</span>
                        <span>New Sale</span>
                        <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 ml-2">Esc</span>
                        <span>Cancel</span>
                    </div>
                    <Keyboard size={16} />
                </div>
            </header>

            {/* Main Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Scanner + Cart */}
                <div className="flex-1 flex flex-col p-5 overflow-hidden">
                    {/* Barcode Scanner */}
                    <form onSubmit={handleBarcodeScan} className="mb-4">
                        <div className="relative">
                            <ScanLine size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                            <input
                                ref={barcodeRef}
                                type="text"
                                value={barcodeInput}
                                onChange={e => setBarcodeInput(e.target.value)}
                                placeholder="Scan barcode or type product code..."
                                className="w-full pl-12 pr-4 py-4 text-lg font-mono bg-stone-50 dark:bg-stone-800/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-stone-300 dark:placeholder:text-stone-600"
                                autoComplete="off"
                            />
                            {lastScanned && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-emerald-600 animate-fade-in">
                                    <CheckCircle2 size={16} />
                                    <span className="text-xs font-semibold">Added: {lastScanned}</span>
                                </div>
                            )}
                        </div>
                        {scanError && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-red-500 font-semibold animate-fade-in">
                                <AlertTriangle size={12} />
                                {scanError}
                            </div>
                        )}
                    </form>

                    {/* Quick Barcodes (for demo) */}
                    <div className="mb-4 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Demo Scan:</span>
                        {['8901234567001', '8901234567002', '8901234567006', '8901234567014', '8901234567012'].map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => handleBarcodeScan(undefined, c)}
                                className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors"
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Cart */}
                    <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-stone-400">
                                <Package size={48} className="mb-4 opacity-30" />
                                <p className="text-sm font-medium">Scan a barcode to start</p>
                                <p className="text-xs mt-1">Items will appear here</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product._id} className="bg-surface border border-border-subtle rounded-xl p-4 flex items-center justify-between animate-fade-in">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-500 flex-shrink-0">
                                            {item.product.shelf}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{item.product.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-stone-500">{item.product.manufacturer}</span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-semibold">{item.product.schedule}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, -1)}
                                                className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center text-sm font-bold text-foreground tabular-nums">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, 1)}
                                                className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="w-20 text-right">
                                            <p className="text-sm font-semibold text-foreground">₹{(item.product.mrp * item.quantity).toFixed(2)}</p>
                                            <p className="text-[10px] text-stone-400">₹{item.product.mrp} ea</p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.product._id)}
                                            className="p-2 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Bill Summary */}
                <div className="w-80 xl:w-96 bg-surface border-l border-border-subtle flex flex-col flex-shrink-0 hidden lg:flex">
                    <div className="p-5 border-b border-border-subtle">
                        <div className="flex items-center gap-2">
                            <ShoppingCart size={16} className="text-emerald-600" />
                            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Bill Summary</h3>
                        </div>
                    </div>

                    <div className="flex-1 p-5 space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Items</span>
                                <span className="font-semibold text-foreground">{cart.reduce((s, c) => s + c.quantity, 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Subtotal (MRP)</span>
                                <span className="font-semibold text-foreground">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">GST (Included)</span>
                                <span className="font-semibold text-foreground">₹{gst.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t border-border-subtle pt-4">
                            <div className="flex justify-between text-xl">
                                <span className="font-semibold text-foreground">Total</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border-t border-border-subtle space-y-3">
                        {!showCheckout ? (
                            <button
                                onClick={() => cart.length > 0 && setShowCheckout(true)}
                                disabled={cart.length === 0}
                                className="w-full py-4 rounded-xl text-white font-bold text-sm uppercase tracking-wider disabled:opacity-30 disabled:grayscale transition-all hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2"
                                style={{ background: cart.length > 0 ? 'linear-gradient(135deg, #064e3b, #065f46)' : '#6b7280' }}
                            >
                                <IndianRupee size={16} />
                                Checkout (F2)
                            </button>
                        ) : (
                            <div className="space-y-2 animate-scale-in">
                                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider text-center mb-3">Select Payment Method</p>
                                <button onClick={() => handleCheckout('CASH')} className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                                    <Banknote size={18} /> Cash
                                </button>
                                <button onClick={() => handleCheckout('UPI')} className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                                    <Smartphone size={18} /> UPI
                                </button>
                                <button onClick={() => handleCheckout('CARD')} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                                    <CreditCard size={18} /> Card
                                </button>
                                <button onClick={() => setShowCheckout(false)} className="w-full py-2.5 rounded-xl text-stone-500 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                                    Cancel (Esc)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bill Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-subtle p-4 flex items-center justify-between z-50">
                <div>
                    <p className="text-xs text-stone-500">{cart.reduce((s, c) => s + c.quantity, 0)} items</p>
                    <p className="text-lg font-bold text-foreground">₹{total.toFixed(2)}</p>
                </div>
                <button
                    onClick={() => cart.length > 0 && setShowCheckout(true)}
                    disabled={cart.length === 0}
                    className="px-8 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-30 transition-all"
                    style={{ background: cart.length > 0 ? 'linear-gradient(135deg, #064e3b, #065f46)' : '#6b7280' }}
                >
                    Checkout
                </button>
            </div>
        </div >
    );
}
