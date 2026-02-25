import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { Order, QueueItem, InventoryItem, User } from '../types';

export function useDashboard() {
    const [user, setUser] = useState<User>({});
    const [orders, setOrders] = useState<Order[]>([]);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [expiringSoonCount, setExpiringSoonCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedUser = JSON.parse(
            localStorage.getItem('chemUser') ||
            sessionStorage.getItem('chemUser') ||
            '{}'
        );
        setUser(savedUser);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!mounted || !user._id) return;

            setLoading(true);
            try {
                const [ordersData, queueData, inventoryData] = await Promise.all([
                    apiRequest<Order[]>(`/api/orders/chemist/${user._id}`),
                    apiRequest<QueueItem[]>('/api/queue'),
                    apiRequest<InventoryItem[]>('/api/inventory'),
                ]);

                setOrders(ordersData);
                setQueue(queueData);

                // Professional logic: Expiring in next 90 days
                const ninetyDays = 90 * 24 * 60 * 60 * 1000;
                const soon = inventoryData.filter(item => {
                    const exp = new Date(item.expiryDate);
                    return exp > new Date() && exp < new Date(Date.now() + ninetyDays);
                }).length;

                setExpiringSoonCount(soon);
            } catch (error) {
                console.error('[Dashboard Hook] Fetch failed', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [mounted, user._id]);

    const stats = {
        pending: orders.filter(o => o.status === 'Pending').length,
        ready: orders.filter(o => o.status === 'Ready').length,
        completed: orders.filter(o => o.status === 'Completed').length,
        revenue: orders
            .filter(o => o.status === 'Completed')
            .reduce((sum, o) => sum + (o.total || 0), 0),
        expiring: expiringSoonCount
    };

    return {
        user,
        orders,
        queue,
        stats,
        loading,
        mounted
    };
}
