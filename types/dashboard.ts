export interface InventoryItem {
    _id: string;
    name: string;
    category: string;
    stock: number;
    reorderLevel: number;
    price: number;
    mrp?: number;
    expiryDate: string;
    manufacturer: string;
    shelf: string;
    batchNo: string;
    salt: string;
    hsnCode: string;
    gstRate: number;
    schedule: string;
}

export interface OrderItem {
    id: string;
    patient: string;
    items: string;
    amount: string;
    status: 'PENDING' | 'READY' | 'DISPATCHED' | 'DELIVERED';
    time: string;
}

export interface QueueItem {
    id: string;
    patient: string;
    token: string;
    status: 'WAITING' | 'SERVICING' | 'COMPLETED';
    type: 'PRN' | 'OTC' | 'INSURANCE';
}

export interface DashboardStats {
    totalSales: string;
    ordersCount: number;
    activeQueue: number;
    lowStock: number;
}

export interface User {
    name: string;
    role: string;
    email?: string;
}
