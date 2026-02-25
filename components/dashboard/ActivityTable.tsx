import { ClipboardList, CheckCircle2, Package } from 'lucide-react';
import { Order } from '@/lib/types';

interface ActivityTableProps {
    orders: Order[];
    loading: boolean;
}

export const ActivityTable = ({ orders, loading }: ActivityTableProps) => {
    return (
        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
                <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                <button className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
                    View all
                </button>
            </div>

            <div className="divide-y divide-border-subtle">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="px-5 py-4 flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 skeleton rounded-lg" />
                                <div className="space-y-2">
                                    <div className="w-32 h-3 skeleton" />
                                    <div className="w-20 h-2 skeleton" />
                                </div>
                            </div>
                            <div className="w-16 h-5 skeleton rounded-full" />
                        </div>
                    ))
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="flex justify-center text-stone-300 dark:text-stone-700 mb-4">
                            <ClipboardList size={40} strokeWidth={1.5} />
                        </div>
                        <p className="text-sm text-stone-500 font-medium">No recent orders</p>
                        <p className="text-xs text-stone-400 mt-1">Orders will appear here as they come in.</p>
                    </div>
                ) : (
                    orders.slice(0, 6).map((order) => (
                        <div key={order._id}
                            className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0">
                                    {order.status === 'Completed'
                                        ? <CheckCircle2 size={16} className="text-emerald-500" />
                                        : <Package size={16} className="text-blue-500" />
                                    }
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{order.patientName}</p>
                                    <p className="text-xs text-stone-400 truncate mt-0.5">
                                        {order.items?.length || 0} items &middot; {order.items?.[0]?.name || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed'
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                        : order.status === 'Ready'
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                    }`}>{order.status}</span>
                                <p className="text-xs text-stone-400 mt-1.5 tabular-nums">
                                    {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {orders.length > 6 && (
                <div className="px-5 py-3 bg-stone-50/50 dark:bg-white/[0.02] text-center border-t border-border-subtle">
                    <p className="text-xs text-stone-400 font-medium">
                        +{orders.length - 6} more orders today
                    </p>
                </div>
            )}
        </div>
    );
};
