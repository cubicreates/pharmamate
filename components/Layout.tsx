/**
 * @fileoverview Application Shell Architecture — Multi-Persona
 * The Layout component provides the systemic infrastructure for the PharmaMate
 * ecosystem, including role-based sidebar navigation, persona switching,
 * global hotkeys, state persistence, and aesthetic mode transitions.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardCheck,
  ShoppingBag,
  Package,
  Users,
  Repeat2,
  Truck,
  PhoneCall,
  LogOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Menu,
  Settings,
  TrendingUp,
  LucideIcon,
  ScanLine,
  Building2,
  UserCog,
  ShieldCheck,
  Calculator,
  RefreshCcw,
  Zap,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AIAssistant from './AIAssistant';
import ConnectivityStatus from './ConnectivityStatus';
import { usePersona } from '@/lib/context/PersonaContext';

interface LayoutProps {
  children: React.ReactNode;
  /** Callback to invalidate session and redirect to auth */
  onLogout: () => void;
}

// --- CONFIGURATION ---

type UserRole = 'CHEMIST_ADMIN' | 'STOREKEEPER';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  key: string;
  /** Which roles can see this item. If empty, all roles can see it. */
  roles?: UserRole[];
}

/** Primary application navigation paths */
const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, description: 'Operational Pulse', key: '1' },
  { href: '/counter', label: 'Counter', icon: ClipboardCheck, description: 'Clinical Service', key: '2' },
  { href: '/pos', label: 'POS Mode', icon: ScanLine, description: 'High-Speed Billing', key: 'p', roles: ['CHEMIST_ADMIN', 'STOREKEEPER'] },
  { href: '/orders', label: 'Orders', icon: ShoppingBag, description: 'Fulfillment Feed', key: '3' },
  { href: '/inventory', label: 'Inventory', icon: Package, description: 'Stock Auditor', key: '4', roles: ['CHEMIST_ADMIN'] },
  { href: '/revenue', label: 'Revenue', icon: TrendingUp, description: 'Financial Overview', key: '9', roles: ['CHEMIST_ADMIN'] },
];

/** Specialized utilities for deeper pharmacopeia needs */
const TOOL_ITEMS: NavItem[] = [
  { href: '/queue', label: 'Live Queue', icon: Users, description: 'Counter Waiting List', key: '5' },
  { href: '/substitutes', label: 'Substitutes Finder', icon: Repeat2, description: 'Salt Composition Lookup', key: '6' },
  { href: '/dispatch', label: 'Dispatch Control', icon: Truck, description: 'Delivery Grid', key: '7', roles: ['CHEMIST_ADMIN'] },
  { href: '/clinician-connect', label: 'Clinician Connect', icon: PhoneCall, description: 'Liaison & Consultations', key: '10' },
  { href: '/vendors', label: 'Vendor Portal', icon: Building2, description: 'B2B Supply Chain', key: 'v', roles: ['CHEMIST_ADMIN'] },
  { href: '/staff', label: 'Staff Management', icon: UserCog, description: 'Shifts & HR', key: 'm', roles: ['CHEMIST_ADMIN'] },
  { href: '/settings', label: 'Settings', icon: Settings, description: 'Application Preferences', key: '11' },
];

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/counter': 'Counter Service',
  '/pos': 'POS Mode',
  '/orders': 'Orders',
  '/inventory': 'Inventory',
  '/queue': 'Queue Management',
  '/substitutes': 'Substitutes Finder',
  '/dispatch': 'Dispatch Hub',
  '/clinician-connect': 'Clinician Connect',
  '/settings': 'Settings',
  '/revenue': 'Revenue & Billing',
  '/vendors': 'Vendor Portal',
  '/staff': 'Staff Management',
  '/user/me': 'My Profile',
};

// --- SUB-COMPONENTS (MEMOIZED) ---

/**
 * Sidebar Navigation Item
 * Optimized with React.memo to prevent layout shift during header transitions.
 */
interface SidebarItemProps {
  item: { label: string; icon: LucideIcon; key: string; href: string; description: string };
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const SidebarItem = React.memo(({ item, isActive, isCollapsed, onClick }: SidebarItemProps) => {
  const Icon = item.icon;
  return (
    <div
      onClick={onClick}
      title={`${item.label} (Alt+${item.key})`}
      className={`
        cursor-pointer group flex items-center gap-3 rounded-lg transition-colors duration-200 relative
        ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5'}
        ${isActive
          ? 'bg-white/15 text-white'
          : 'text-white/60 hover:bg-white/10 hover:text-white/90'}
      `}>
      <Icon size={isCollapsed ? 20 : 18} className="flex-shrink-0" />
      {!isCollapsed && (
        <span className="text-sm font-medium">{item.label}</span>
      )}
    </div>
  );
});
SidebarItem.displayName = 'SidebarItem';

// --- MAIN LAYOUT ENGINE ---

const ROLE_LABELS: Record<UserRole, string> = {
  CHEMIST_ADMIN: 'Admin',
  STOREKEEPER: 'Storekeeper',
};

const ROLE_COLORS: Record<UserRole, string> = {
  CHEMIST_ADMIN: 'bg-emerald-500',
  STOREKEEPER: 'bg-blue-500',
};

export default function Layout({ children, onLogout }: LayoutProps) {
  const { user: personaUser, activeRole, switchRole: contextSwitchRole, mounted: contextMounted, availableRoles } = usePersona();

  // --- UI STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrecision, setIsPrecision] = useState(false);
  const [showPersonaSwitcher, setShowPersonaSwitcher] = useState(false);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const [showShortcutCheatSheet, setShowShortcutCheatSheet] = useState(false);
  const [showZReport, setShowZReport] = useState(false);

  // Use fallback values if user not yet loaded from context
  const user = personaUser || { name: 'User', shopName: 'Pharmacy' };
  const mounted = contextMounted;

  const pathname = usePathname();
  const router = useRouter();

  // --- PERSISTENCE & THEMING ---
  useEffect(() => {
    // Aesthetic Preference: Precision View
    const savedPrecision = localStorage.getItem('precisionView') === 'true';
    setIsPrecision(savedPrecision);
    if (savedPrecision) document.documentElement.classList.add('precision-view');
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    contextSwitchRole(role);
    setShowPersonaSwitcher(false);
  }, [contextSwitchRole]);

  /** Filter nav items based on active role */
  const filterByRole = useCallback((items: NavItem[]) => {
    return items.filter(item => !item.roles || item.roles.includes(activeRole));
  }, [activeRole]);

  const togglePrecision = useCallback(() => {
    const next = !isPrecision;
    setIsPrecision(next);
    localStorage.setItem('precisionView', String(next));
    if (next) document.documentElement.classList.add('precision-view');
    else document.documentElement.classList.remove('precision-view');
  }, [isPrecision]);

  // --- SYSTEM HOTKEYS & BARCODE PROXY ---
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

    if (e.key === 'Escape') {
      setIsSidebarOpen(false);
      setShowShortcutCheatSheet(false);
    }

    // Command Center: Alt+[Key]
    if (e.altKey) {
      if (e.key === 's') { e.preventDefault(); router.push('/inventory'); }
      if (e.key === 'n') { e.preventDefault(); router.push('/counter'); }
      if (e.key === 'q') { e.preventDefault(); router.push('/queue'); }
      if (e.key === 'p') { e.preventDefault(); togglePrecision(); }
    }

    // Help Helper
    if (e.key === '?' && !isInput) {
      e.preventDefault();
      setShowShortcutCheatSheet(prev => !prev);
    }

    // Global Search Focus
    if (e.key === '/' && !e.ctrlKey && !e.altKey && !isInput) {
      const searchInput = document.querySelector<HTMLInputElement>('[data-search-global]');
      if (searchInput) { e.preventDefault(); searchInput.focus(); }
    }

    // --- BARCODE SCANNER PROXY ---
    // Physical scanners often act as keyboards ending with 'Enter'
    if (!isInput) {
      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 5) {
          console.log('Barcode Scanned:', barcodeBuffer);
          // Potential logic: toast notification or redirect
          setBarcodeBuffer('');
        }
      } else if (e.key.length === 1) {
        setBarcodeBuffer(prev => prev + e.key);
        // Clear buffer if no input for 500ms (to distinguish from manual typing)
        setTimeout(() => setBarcodeBuffer(''), 500);
      }
    }
  }, [router, togglePrecision, barcodeBuffer]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // --- UTILITIES ---
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth >= 1024) setIsCollapsed(prev => !prev);
    else setIsSidebarOpen(prev => !prev);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    router.push(href);
    setIsSidebarOpen(false);
  }, [router]);

  return (
    <div className="h-screen w-full flex overflow-hidden font-sans transition-all duration-500 bg-background text-foreground">

      {/* Mobile Interaction Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md animate-fade-in" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Shortcut Cheat Sheet */}
      {showShortcutCheatSheet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm" onClick={() => setShowShortcutCheatSheet(false)}>
          <div className="bg-surface border border-border-subtle rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">?</span>
              Command Center Shortcuts
            </h3>
            <div className="space-y-4">
              {[
                { key: 'Alt + N', desc: 'New Transaction / Counter' },
                { key: 'Alt + S', desc: 'Stock Inventory Search' },
                { key: 'Alt + Q', desc: 'View Live Patient Queue' },
                { key: 'Alt + P', desc: 'Toggle Precision/Aesthetic' },
                { key: '/', desc: 'Focus Global Search' },
                { key: 'Esc', desc: 'Close Modals / Sidebar' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <span className="text-sm text-stone-500 font-medium">{item.desc}</span>
                  <kbd className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 text-xs font-bold font-mono">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowShortcutCheatSheet(false)}
              className="mt-8 w-full py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl font-bold text-sm transition-all"
            >
              Close Manual
            </button>
          </div>
        </div>
      )}

      {/* ===== SIDEBAR (Clinical Dashboard Left Rail) ===== */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        lg:relative lg:translate-x-0 border-r border-white/5 shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-[88px]' : 'lg:w-[280px]'}
        w-[280px]
      `}
        style={{ background: 'linear-gradient(180deg, #0f3d2e 0%, #134e3a 50%, #166534 100%)' }}
      >
        {/* Branding Header */}
        <div className={`h-14 flex items-center border-b border-white/10 transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white flex-shrink-0 text-lg">
              ✚
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">PharmaMate</span>
          </div>

          <button onClick={toggleSidebar} className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none">
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Dynamic Navigation Rails */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-hide">
          {filterByRole(NAV_ITEMS).map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              isCollapsed={isCollapsed}
              onClick={() => handleNavClick(item.href)}
            />
          ))}

          {/* Tools Grid Separator */}
          <div className="pt-5 mt-5 border-t border-white/10 px-1">
            {!isCollapsed && (
              <p className="px-3 pb-2 text-xs font-medium text-white/30">Tools</p>
            )}
            <div className="space-y-1">
              {filterByRole(TOOL_ITEMS).map((item) => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  isCollapsed={isCollapsed}
                  onClick={() => handleNavClick(item.href)}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Global Action Footer */}
        <div className="p-3 border-t border-white/10">
          {/* Persona Switcher (Only if multi-role) */}
          {!isCollapsed && availableRoles.length > 1 && (
            <div className="mb-2 relative">
              <button
                onClick={() => setShowPersonaSwitcher(!showPersonaSwitcher)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[activeRole]}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{ROLE_LABELS[activeRole]}</span>
                </div>
                <ChevronRight size={12} className={`transition-transform ${showPersonaSwitcher ? 'rotate-90' : ''}`} />
              </button>
              {showPersonaSwitcher && (
                <div className="mt-1 bg-white/10 rounded-lg overflow-hidden backdrop-blur-xl animate-fade-in">
                  {availableRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => switchRole(role)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${activeRole === role
                        ? 'bg-white/15 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[role]}`} />
                      {ROLE_LABELS[role]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div onClick={() => handleNavClick('/user/me')} className={`cursor-pointer flex items-center gap-3 rounded-lg hover:bg-white/10 transition-colors duration-200 ${isCollapsed ? 'justify-center p-2.5' : 'p-2.5'}`}>
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center font-semibold text-sm text-white flex-shrink-0 relative">
              {user.name ? user.name[0].toUpperCase() : 'U'}
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-emerald-900 ${ROLE_COLORS[activeRole]}`} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
                <p className="text-xs text-white/40 truncate">{user.shopName || 'Pharmacy'}</p>
              </div>
            )}
          </div>

          <button onClick={() => setShowZReport(true)}
            className={`w-full mt-2 flex items-center justify-center gap-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200 text-xs font-bold ${isCollapsed ? 'py-2.5' : 'py-2.5 px-3'}`}>
            <Calculator size={14} />
            {!isCollapsed && <span>Daily Closing</span>}
          </button>

          <button onClick={onLogout}
            className={`w-full mt-1 flex items-center justify-center gap-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-xs font-medium ${isCollapsed ? 'py-2.5' : 'py-2.5 px-3'}`}>
            <LogOut size={14} />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ===== CENTRAL WORKSPACE ===== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <header className="h-14 flex items-center justify-between px-5 lg:px-8 bg-surface border-b border-border-subtle flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="lg:hidden text-foreground p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 transition-colors focus:outline-none">
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-semibold text-foreground">
              {PAGE_TITLES[pathname] || 'PharmaMate'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <ConnectivityStatus />

            <button onClick={togglePrecision}
              className={`p-2 rounded-lg transition-colors duration-200 border flex items-center gap-2 ${isPrecision
                ? 'bg-primary/5 text-primary border-primary/20'
                : 'text-stone-400 border-border-subtle hover:bg-stone-50 dark:hover:bg-white/5'
                }`}>
              <Maximize2 size={15} />
              <span className="text-xs font-medium hidden md:inline">{isPrecision ? 'Aesthetic' : 'Precision'}</span>
            </button>
            <ThemeToggle />
            {mounted && (
              <div className="text-xs font-medium px-3 py-2 rounded-lg text-stone-500 dark:text-stone-400 border border-border-subtle hidden sm:block">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 w-full bg-background transition-colors duration-500 relative scrollbar-hide">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Global Intelligence Overlay */}
        <AIAssistant />

        {/* ===== Z-REPORT / DAILY CLOSING MODAL ===== */}
        {showZReport && (
          <div className="zreport-backdrop" onClick={() => setShowZReport(false)}>
            <div className="zreport-modal" onClick={e => e.stopPropagation()}>
              <div className="zreport-header">
                <div>
                  <h3 className="zreport-title">
                    <Zap className="text-primary fill-primary" size={24} /> Day Closing Report
                  </h3>
                  <p className="zreport-subtitle">Shift Reconciliation · {new Date().toLocaleDateString()}</p>
                </div>
                <button onClick={() => setShowZReport(false)} className="text-muted hover:text-foreground transition-colors p-2 bg-stone-100 dark:bg-stone-800 rounded-full">
                  <RefreshCcw size={16} />
                </button>
              </div>

              <div className="zreport-grid">
                <div className="zreport-stat-card">
                  <p className="zreport-stat-label">Total Sales</p>
                  <p className="zreport-stat-value zreport-stat-value--primary">₹1,42,560.00</p>
                </div>
                <div className="zreport-stat-card">
                  <p className="zreport-stat-label">Cash In Drawer</p>
                  <p className="zreport-stat-value">₹24,800.00</p>
                </div>
                <div className="zreport-stat-card col-span-2">
                  <p className="zreport-stat-label">GST Collected (Central + State)</p>
                  <p className="zreport-stat-value zreport-stat-value--success">₹17,107.20</p>
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <div className="zreport-row">
                  <span className="zreport-row-label">UPI Transactions (42)</span>
                  <span>₹98,400.00</span>
                </div>
                <div className="zreport-row">
                  <span className="zreport-row-label">Credit / B2B Outs</span>
                  <span>₹19,360.00</span>
                </div>
              </div>

              <div className="zreport-alert">
                <ShieldCheck className="text-yellow-600 flex-shrink-0" size={20} />
                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-400">
                  Daily stock audit shows 2 discrepancies in Antibiotics section. Please verify Batch #S992 before closing.
                </p>
              </div>

              <div className="zreport-actions">
                <button onClick={() => setShowZReport(false)} className="zreport-btn-secondary">
                  Save Draft
                </button>
                <button onClick={() => { alert('End of Day Report (Z-Report) generated and sent to Cloud.'); setShowZReport(false); }} className="zreport-btn-primary">
                  Generate Z-Report & Logout <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
