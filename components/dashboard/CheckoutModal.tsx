'use client';

import React from 'react';
import {
    X,
    CreditCard,
    Banknote,
    Smartphone,
    ArrowRight,
    Lock
} from 'lucide-react';

import BottomSheet from '@/components/mobile/BottomSheet';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onSelectPayment: (method: 'CASH' | 'UPI' | 'CARD') => void;
}

export function CheckoutModal({ isOpen, onClose, total, onSelectPayment }: CheckoutModalProps) {
    if (!isOpen) return null;

    const paymentMethods = [
        { id: 'CASH', label: 'Cash Payment', icon: <Banknote size={24} />, desc: 'Physical currency collection', color: 'bg-emerald-500' },
        { id: 'UPI', label: 'UPI / QR Scan', icon: <Smartphone size={24} />, desc: 'Google Pay, PhonePe, Paytm', color: 'bg-blue-500' },
        { id: 'CARD', label: 'Debit/Credit Card', icon: <CreditCard size={24} />, desc: 'POS Terminal processing', color: 'bg-purple-500' }
    ] as const;

    const ModalContent = () => (
        <>
            {/* Desktop Header */}
            <header className="hidden md:flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                        <Lock size={12} /> Secure Checkout
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Select Payment</h2>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>
            </header>

            {/* Mobile Header */}
            <div className="md:hidden text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                    <Lock size={12} /> Secure Checkout
                </div>
                <h2 className="text-3xl font-black tracking-tight">Select Payment</h2>
            </div>

            <div className="mb-8 p-6 bg-stone-50 dark:bg-stone-900/50 rounded-3xl border border-border-subtle flex items-center justify-between">
                <span className="text-sm font-bold text-stone-500 uppercase tracking-widest">Total Payable</span>
                <span className="text-3xl font-black text-primary tabular-nums">₹{total.toFixed(2)}</span>
            </div>

            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => onSelectPayment(method.id)}
                        className="w-full group flex items-center gap-5 p-5 bg-surface border border-border-subtle rounded-3xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all text-left active:scale-[0.98]"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${method.color} text-white flex items-center justify-center shadow-lg shadow-inherit/20`}>
                            {method.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg">{method.label}</h4>
                            <p className="text-xs text-stone-400 font-medium">{method.desc}</p>
                        </div>
                        <ArrowRight className="text-stone-300 group-hover:text-primary transition-colors transform group-hover:translate-x-1" size={20} />
                    </button>
                ))}
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Modal */}
            <div className="hidden md:flex fixed inset-0 z-[100] items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
                <div className="relative bg-surface border border-border-subtle w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-scale-in overflow-hidden flex flex-col">
                    <div className="p-8">
                        <ModalContent />
                    </div>
                    <div className="px-8 py-6 bg-stone-50 dark:bg-stone-900/30 border-t border-border-subtle mt-auto">
                        <p className="text-[10px] text-center font-bold text-stone-400 uppercase tracking-[0.1em]">
                            Ensuring GST Compliance & Real-time Inventory Sync
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Sheet */}
            <BottomSheet isOpen={isOpen} onClose={onClose}>
                <div className="pb-8">
                    <ModalContent />
                </div>
            </BottomSheet>
        </>
    );
}
