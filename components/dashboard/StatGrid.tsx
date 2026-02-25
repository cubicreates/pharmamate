import { LucideIcon, Clock, Package, ShieldCheck, IndianRupee } from 'lucide-react';

const StatCardSkeleton = () => (
    <div className="bg-surface border border-border-subtle rounded-xl p-5 animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
                <div className="w-20 h-3 skeleton" />
                <div className="w-12 h-7 skeleton" />
            </div>
            <div className="w-10 h-10 skeleton rounded-lg" />
        </div>
        <div className="w-28 h-2 skeleton" />
    </div>
);

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    accentColor: string;
    iconBg: string;
    sub: string;
    loading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, accentColor, iconBg, sub, loading }: StatCardProps) => (
    <div className="bg-surface border border-border-subtle rounded-xl p-5 transition-colors duration-200 hover:border-stone-300 dark:hover:border-stone-600">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">{title}</p>
                <p className={`text-2xl font-semibold tracking-tight tabular-nums ${accentColor}`}>
                    {loading ? '\u2014' : value}
                </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon size={18} className={accentColor} />
            </div>
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">{sub}</p>
    </div>
);

interface StatGridProps {
    stats: {
        pending: number;
        ready: number;
        revenue: number;
        expiring: number;
    };
    loading: boolean;
}

export const StatGrid = ({ stats, loading }: StatGridProps) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            <StatCard title="Pending Orders" value={stats.pending} icon={Clock}
                accentColor="text-amber-600 dark:text-amber-400" iconBg="bg-amber-50 dark:bg-amber-500/10"
                sub="Require action" />
            <StatCard title="Ready for Pickup" value={stats.ready} icon={Package}
                accentColor="text-blue-600 dark:text-blue-400" iconBg="bg-blue-50 dark:bg-blue-500/10"
                sub="Awaiting collection" />
            <StatCard title="Expiring Soon" value={stats.expiring} icon={ShieldCheck}
                accentColor="text-red-600 dark:text-red-400" iconBg="bg-red-50 dark:bg-red-500/10"
                sub="Within 90 days" />
            <StatCard title="Today's Revenue" value={`\u20B9${stats.revenue.toLocaleString()}`} icon={IndianRupee}
                accentColor="text-emerald-600 dark:text-emerald-400" iconBg="bg-emerald-50 dark:bg-emerald-500/10"
                sub="Completed orders" />
        </div>
    );
};
