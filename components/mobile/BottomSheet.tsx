'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-subtle rounded-t-[2.5rem] z-[120] md:hidden max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Pull Bar */}
                        <div className="flex justify-center p-3" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
                        </div>

                        {/* Header */}
                        {title && (
                            <div className="px-6 py-2 flex items-center justify-between">
                                <h3 className="text-xl font-black text-foreground">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full text-muted hover:text-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 pb-safe-offset-10 pt-2">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
