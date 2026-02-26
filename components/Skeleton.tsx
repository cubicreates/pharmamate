'use client';

import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

export default function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
    const variantClasses = {
        text: 'h-4 w-3/4',
        rect: 'h-24 w-full',
        circle: 'h-12 w-12 rounded-full'
    }[variant];

    return (
        <div className={`skeleton ${variantClasses} ${className}`} />
    );
}

export function CardSkeleton() {
    return (
        <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton variant="circle" />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-1/2" />
                    <Skeleton variant="text" className="w-1/4" />
                </div>
            </div>
            <Skeleton variant="rect" className="h-20" />
            <div className="flex justify-between">
                <Skeleton variant="text" className="w-20" />
                <Skeleton variant="text" className="w-20" />
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-stone-50 dark:bg-stone-900/50">
                <Skeleton variant="text" className="w-48 h-6" />
            </div>
            <div className="p-0">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-b border-border-subtle last:border-0">
                        <Skeleton variant="text" className="w-1/3" />
                        <Skeleton variant="text" className="w-1/6" />
                        <Skeleton variant="text" className="w-1/6" />
                        <Skeleton variant="text" className="w-1/6" />
                    </div>
                ))}
            </div>
        </div>
    );
}
