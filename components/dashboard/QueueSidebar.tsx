import { Store, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { QueueItem } from '@/lib/types';

interface QueueSidebarProps {
    queue: QueueItem[];
    loading: boolean;
    mounted: boolean;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    verifying: {
        bg: 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/15',
        text: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        label: 'Verifying',
    },
    waiting: {
        bg: 'border-border-subtle hover:border-stone-300 dark:hover:border-stone-600',
        text: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
        label: 'Waiting',
    },
    serving: {
        bg: 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/15 dark:bg-emerald-500/5',
        text: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
        label: 'Serving',
    },
};

export const QueueSidebar = ({ queue, loading, mounted }: QueueSidebarProps) => {
    const minutesAgo = (iso: string) => {
        if (!mounted) return '\u2014';
        const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
        return diff < 1 ? 'Just now' : `${diff}m ago`;
    };

    return (
        <div className="bg-surface border border-border-subtle rounded-xl h-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-semibold text-foreground">Live Queue</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-xs font-medium text-stone-400 tabular-nums">{queue.length} waiting</span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border-subtle">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg skeleton" />
                                <div className="flex-1">
                                    <div className="h-3.5 w-24 skeleton mb-1.5" />
                                    <div className="h-2.5 w-16 skeleton" />
                                </div>
                            </div>
                            <div className="h-2 w-full skeleton" />
                        </div>
                    ))
                ) : queue.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center mb-3">
                            <Store size={24} strokeWidth={1.5} className="text-stone-400" />
                        </div>
                        <p className="text-sm text-stone-500 font-medium">Counter is clear</p>
                        <p className="text-xs text-stone-400 mt-1">Ready for next patient</p>
                    </div>
                ) : (
                    queue.map((q, i) => {
                        const style = STATUS_STYLES[q.status] || STATUS_STYLES.waiting;
                        return (
                            <div key={q._id}
                                className={`p-3.5 rounded-lg border transition-all animate-fade-in ${style.bg}`}
                                style={{ animationDelay: `${i * 80}ms` }}>
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-medium text-foreground truncate">{q.patientName}</p>
                                            {q.status === 'verifying' && (
                                                <ShieldCheck size={13} className="text-amber-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-stone-400 tabular-nums font-mono">#{q.patientPrn.split('-')[1]}</p>
                                            <span className="text-stone-300 dark:text-stone-600">&middot;</span>
                                            <p className="text-xs text-stone-400">{q.itemCount} items</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${style.text}`}>
                                            {style.label}
                                        </span>
                                        <div className="flex items-center gap-1 justify-end mt-1.5">
                                            <Clock size={10} className="text-stone-400" />
                                            <p className="text-xs text-stone-400">{minutesAgo(q.arrivedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border-subtle">
                <a
                    href="/queue"
                    className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
                >
                    View Full Queue
                    <ArrowRight size={14} />
                </a>
            </div>
        </div>
    );
};
