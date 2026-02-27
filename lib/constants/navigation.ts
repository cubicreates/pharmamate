import {
    LayoutDashboard,
    ScanLine,
    ClipboardCheck,
    Repeat2,
    Users,
    ShoppingBag,
    Truck,
    Package,
    Building2,
    TrendingUp,
    UserCog,
    PhoneCall,
    Settings
} from 'lucide-react';

export const MOBILE_CATEGORIES = {
    HOME: [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
        { label: 'Revenue', href: '/revenue', icon: TrendingUp },
        { label: 'Settings', href: '/settings', icon: Settings },
    ],
    SALES: [
        { label: 'POS Scanner', href: '/pos', icon: ScanLine },
        { label: 'Manual Counter', href: '/counter', icon: ClipboardCheck },
        { label: 'Substitutes', href: '/substitutes', icon: Repeat2 },
    ],
    FLOW: [
        { label: 'Patient Queue', href: '/queue', icon: Users },
        { label: 'Orders Hub', href: '/orders', icon: ShoppingBag },
        { label: 'Dispatch Hub', href: '/dispatch', icon: Truck },
    ],
    STOCK: [
        { label: 'Inventory', href: '/inventory', icon: Package },
        { label: 'Vendor Portal', href: '/vendors', icon: Building2 },
    ],
    ADMIN: [
        { label: 'Staff Management', href: '/staff', icon: UserCog },
        { label: 'Clinician Connect', href: '/clinician-connect', icon: PhoneCall },
        { label: 'Global Settings', href: '/settings', icon: Settings },
    ]
};
