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
    CheckCircle2,
    Printer,
    Zap
} from 'lucide-react';
import { apiRequest } from '@/lib/utils/api';
import type { UniversityInventoryItem } from '@/lib/mock/platform-data';
import { POSDesktop } from '@/components/dashboard/POSDesktop';
import { POSMobile } from '@/components/dashboard/POSMobile';
import { CheckoutModal } from '@/components/dashboard/CheckoutModal';
import Layout from '@/components/Layout';

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
        <Layout onLogout={() => router.push('/')}>
            <POSDesktop
                cart={cart}
                barcodeInput={barcodeInput}
                setBarcodeInput={setBarcodeInput}
                lastScanned={lastScanned}
                scanError={scanError}
                setShowCheckout={setShowCheckout}
                barcodeRef={barcodeRef}
                handleBarcodeScan={handleBarcodeScan}
                updateQuantity={updateQuantity}
                removeFromCart={removeItem}
                handleNewTransaction={handleNewTransaction}
                total={total}
                subtotal={subtotal}
                tax={gst}
            />
            <POSMobile
                cart={cart}
                barcodeInput={barcodeInput}
                setBarcodeInput={setBarcodeInput}
                lastScanned={lastScanned}
                scanError={scanError}
                total={total}
                barcodeRef={barcodeRef}
                handleBarcodeScan={handleBarcodeScan}
                updateQuantity={updateQuantity}
                removeFromCart={removeItem}
                setShowCheckout={setShowCheckout}
                handleNewTransaction={handleNewTransaction}
            />

            <CheckoutModal
                isOpen={showCheckout}
                onClose={() => setShowCheckout(false)}
                total={total}
                onSelectPayment={handleCheckout}
            />
        </Layout>
    );
}
