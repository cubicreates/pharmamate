'use client';

import React from 'react';
import {
    ScanLine,
    Trash2,
    Plus,
    Minus,
    X,
    ChevronRight,
    Package
} from 'lucide-react';

import { UniversityInventoryItem } from '@/lib/mock/platform-data';
import MobileModeSwitcher from '../MobileModeSwitcher';
import { MOBILE_CATEGORIES } from '@/lib/constants/navigation';

interface CartItem {
    product: UniversityInventoryItem;
    quantity: number;
}

interface POSMobileProps {
    cart: CartItem[];
    barcodeInput: string;
    setBarcodeInput: (v: string) => void;
    lastScanned: string | null;
    scanError: string | null;
    total: number;
    barcodeRef: React.RefObject<HTMLInputElement | null>;
    handleBarcodeScan: (e?: React.FormEvent, manualBarcode?: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    removeFromCart: (id: string) => void;
    setShowCheckout: (v: boolean) => void;
    handleNewTransaction: () => void;
}

export function POSMobile({
    cart,
    barcodeInput,
    setBarcodeInput,
    lastScanned,
    scanError,
    total,
    barcodeRef,
    handleBarcodeScan,
    updateQuantity,
    removeFromCart,
    setShowCheckout,
    handleNewTransaction
}: POSMobileProps) {
    return (
        <div className="md:hidden flex flex-col h-full animate-fade-in pb-32">
            <MobileModeSwitcher options={MOBILE_CATEGORIES.SALES} />

            {/* Mobile Header */}
            <header className="flex items-center justify-between mt-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black tracking-tight leading-none">Checkout</h1>
                    <div className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        Quick Bill · POS Mode
                    </div>
                </div>
                <button
                    onClick={handleNewTransaction}
                    className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center active:scale-90 transition-transform"
                >
                    <Trash2 size={20} />
                </button>
            </header>

            {/* Mobile Scanner Interface (Active Bar) */}
            <div className="mb-6">
                <form onSubmit={handleBarcodeScan} className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                        <ScanLine size={20} />
                    </div>
                    <input
                        ref={barcodeRef}
                        type="text"
                        placeholder="Scan or Enter Barcode..."
                        className={`w-full bg-surface border-2 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all ${scanError ? 'border-red-500/50' : 'border-border-subtle focus:border-primary/30'}`}
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                        <Plus size={20} />
                    </button>
                </form>
                {scanError && <p className="text-[10px] text-red-500 font-black uppercase mt-2 ml-2 tracking-widest">{scanError}</p>}
                {lastScanned && !scanError && <p className="text-[10px] text-emerald-500 font-black uppercase mt-2 ml-2 tracking-widest">Scanned: {lastScanned}</p>}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 space-y-3 overflow-y-auto min-h-0 scrollbar-hide">
                {cart.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                        <ScanLine size={48} className="mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">Ready to scan</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.product._id} className="p-4 bg-surface border border-border-subtle rounded-2xl shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 flex-shrink-0">
                                <Package size={22} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm truncate">{item.product.name}</h3>
                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">₹{item.product.price} / unit</p>

                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5 border border-border-subtle">
                                        <button
                                            onClick={() => updateQuantity(item.product._id, -1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-stone-700 transition-colors text-stone-500"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className="w-8 text-center font-black text-xs">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product._id, 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-stone-700 transition-colors text-stone-500"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                    <p className="font-black text-sm tabular-nums text-primary">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.product._id)}
                                className="p-2 text-stone-300 active:text-red-500 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Floating Bill Bar (Mobile specific) */}
            <div className="fixed bottom-28 left-4 right-4 bg-primary text-white p-6 rounded-3xl shadow-2xl shadow-primary/40 flex items-center justify-between animate-slide-up z-40">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Payable</p>
                    <p className="text-2xl font-black tabular-nums">₹{total.toFixed(2)}</p>
                </div>
                <button
                    onClick={() => cart.length > 0 && setShowCheckout(true)}
                    disabled={cart.length === 0}
                    className={`h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${cart.length === 0 ? 'bg-white/10 text-white/40' : 'bg-white text-primary'}`}
                >
                    Pay Now <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
