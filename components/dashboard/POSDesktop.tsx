'use client';

import React from 'react';
import {
    ScanLine,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    Keyboard,
    Package,
    AlertTriangle,
    Zap,
} from 'lucide-react';

import { UniversityInventoryItem } from '@/lib/mock/platform-data';

interface CartItem {
    product: UniversityInventoryItem;
    quantity: number;
}

interface POSDesktopProps {
    cart: CartItem[];
    barcodeInput: string;
    setBarcodeInput: (v: string) => void;
    lastScanned: string | null;
    scanError: string | null;
    setShowCheckout: (v: boolean) => void;
    barcodeRef: React.RefObject<HTMLInputElement | null>;
    handleBarcodeScan: (e?: React.FormEvent, manualBarcode?: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    removeFromCart: (id: string) => void;
    handleNewTransaction: () => void;
    total: number;
    subtotal: number;
    tax: number;
}

export function POSDesktop({
    cart,
    barcodeInput,
    setBarcodeInput,
    lastScanned,
    scanError,
    setShowCheckout,
    barcodeRef,
    handleBarcodeScan,
    updateQuantity,
    removeFromCart,
    handleNewTransaction,
    total,
    subtotal,
    tax
}: POSDesktopProps) {
    return (
        <div className="hidden md:flex flex-col h-full bg-stone-50 dark:bg-background transition-colors duration-500 overflow-hidden rounded-2xl border border-border-subtle">
            {/* Desktop POS UI implementation... Basically the current POS code */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left side: Cart */}
                <div className="flex-1 flex flex-col bg-background border-r border-border-subtle overflow-hidden">
                    <header className="p-6 border-b border-border-subtle flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <ShoppingCart size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Active Cart</h1>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                                    {cart.length} ITEMS SCANNED
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-stone-400 uppercase">Current Bill</p>
                                <p className="text-xl font-black text-primary tabular-nums">₹{total.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={handleNewTransaction}
                                className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-xl hover:bg-stone-200 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-32 h-32 bg-stone-100 dark:bg-stone-800/50 rounded-full flex items-center justify-center text-stone-300 mb-8 border-4 border-dashed border-stone-200 dark:border-stone-800">
                                    <ScanLine size={48} strokeWidth={1.5} />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Waiting for scans...</h2>
                                <p className="text-stone-400 text-sm mt-2 max-w-xs">Scan any medicine barcode to begin the checkout process automatically.</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.product._id} className="flex items-center justify-between p-4 bg-surface border border-border-subtle rounded-2xl shadow-sm animate-fade-in">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 rounded-xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 flex-shrink-0 border border-border-subtle">
                                            <Package size={22} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm truncate">{item.product.name}</h3>
                                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{item.product.category} · Shelf {item.product.shelf}</p>
                                            <p className="text-sm font-bold text-primary mt-1">₹{item.product.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-border-subtle">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, -1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-stone-700 transition-colors text-stone-500"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center font-black text-sm tabular-nums">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-stone-700 transition-colors text-stone-500"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <p className="text-sm font-black tabular-nums">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product._id)}
                                            className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right side: Sidebar & Scanner */}
                <aside className="w-[420px] bg-stone-50 dark:bg-surface border-l border-border-subtle flex flex-col overflow-hidden">
                    {/* Scanner Input Area */}
                    <div className="p-6 border-b border-border-subtle bg-white dark:bg-background/20">
                        <form onSubmit={handleBarcodeScan} className="relative group">
                            <ScanLine className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${scanError ? 'text-red-500' : 'text-stone-400 group-focus-within:text-primary'}`} size={22} />
                            <input
                                ref={barcodeRef}
                                type="text"
                                placeholder="Scan Barcode... (Alt+B)"
                                className={`w-full bg-stone-100 dark:bg-stone-800 border-2 rounded-2xl pl-14 pr-6 py-5 text-lg font-bold outline-none transition-all ${scanError ? 'border-red-500/50' : 'border-transparent focus:border-primary/50'}`}
                                value={barcodeInput}
                                onChange={(e) => setBarcodeInput(e.target.value)}
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-stone-100 dark:bg-stone-700 px-2 py-1 rounded text-[9px] font-black uppercase text-stone-400 tracking-tighter">
                                FOCUS AUTO
                            </div>
                        </form>
                        {scanError && (
                            <div className="mt-3 flex items-center gap-2 text-red-500 animate-pulse">
                                <AlertTriangle size={14} />
                                <p className="text-[10px] font-black uppercase">{scanError}</p>
                            </div>
                        )}
                        {lastScanned && !scanError && (
                            <div className="mt-3 flex items-center gap-2 text-emerald-500">
                                <Zap size={14} fill="currentColor" />
                                <p className="text-[10px] font-black uppercase">Added: {lastScanned}</p>
                            </div>
                        )}
                    </div>

                    {/* Summary & Checkout */}
                    <div className="flex-1 p-8 flex flex-col">
                        <div className="space-y-4 mb-auto">
                            <div className="flex justify-between text-stone-500 text-sm font-medium">
                                <span>Subtotal</span>
                                <span className="tabular-nums">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-stone-500 text-sm font-medium">
                                <span>GST (Central + State)</span>
                                <span className="tabular-nums">₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-stone-500 text-sm font-medium">
                                <span>Total Adjustments</span>
                                <span className="tabular-nums">₹0.00</span>
                            </div>
                            <div className="pt-4 border-t border-border-subtle flex justify-between items-end">
                                <span className="text-xl font-bold">Total Bill</span>
                                <span className="text-3xl font-black text-primary tabular-nums">₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-4 mt-8">
                            <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-widest text-stone-400">
                                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-3 rounded-xl border border-border-subtle">
                                    <Keyboard size={14} /> F2 Checkout
                                </div>
                                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-3 rounded-xl border border-border-subtle">
                                    <Trash2 size={14} /> F4 Void
                                </div>
                            </div>

                            <button
                                onClick={() => cart.length > 0 && setShowCheckout(true)}
                                disabled={cart.length === 0}
                                className={`w-full py-6 rounded-3xl font-black text-lg shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${cart.length === 0 ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-primary text-white shadow-primary/20 hover:shadow-primary/40'}`}
                            >
                                <CreditCard size={24} />
                                COLLECT PAYMENT
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
