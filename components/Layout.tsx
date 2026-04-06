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
  ShoppingBag,
  LucideIcon,
  UserCog,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Navigation,
  FlaskConical
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import ConnectivityStatus from './ConnectivityStatus';
import { usePersona } from '@/lib/context/PersonaContext';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  /** Callback to invalidate session and redirect to auth */
  onLogout: () => void;
}

// --- CONFIGURATION ---

type UserRole = 'PHARMACIST' | 'ADMIN' | 'STOREKEEPER';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  key: string;
  /** Which roles can see this item. If empty, all roles can see it. */
  roles?: string[];
}

/** Primary application navigation paths */
const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, description: 'Operational Pulse', key: '1' },
  { href: '/orders', label: 'Orders', icon: ShoppingBag, description: 'Fulfillment Feed', key: '2' },
  { href: '/tracking', label: 'Fleet Map', icon: Navigation, description: 'Rider Tracking', key: '3' },
  { href: '/substitutes', label: 'Substitutes', icon: FlaskConical, description: 'AI Salt Lookup', key: '4' },
];

/** Specialized utilities */
const TOOL_ITEMS: NavItem[] = [
  { href: '/user/me', label: 'My Profile', icon: UserCog, description: 'Account', key: '5' },
];

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Live Orders',
  '/tracking': 'Live Fleet Map',
  '/substitutes': 'Substitute Lab',
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

const ROLE_LABELS: Record<string, string> = {
  PHARMACIST: 'Pharmacist',
  ADMIN: 'Admin',
  STOREKEEPER: 'Storekeeper',
};

const ROLE_COLORS: Record<string, string> = {
  PHARMACIST: 'bg-emerald-500',
  ADMIN: 'bg-blue-500',
  STOREKEEPER: 'bg-amber-500',
};

export default function Layout({ children, onLogout }: LayoutProps) {
  const { user: personaUser, activeRole, switchRole: contextSwitchRole, mounted: contextMounted, availableRoles } = usePersona();

  // --- UI STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPersonaSwitcher, setShowPersonaSwitcher] = useState(false);

  // Use fallback values if user not yet loaded from context
  const user = personaUser || { full_name: 'Pharmacist', shopName: 'Pharmacy Store', name: 'User' };
  const mounted = contextMounted;

  const pathname = usePathname();
  const router = useRouter();

  // --- PERSISTENCE & THEMING ---
  useEffect(() => {
    // Tablet Mode: Default to collapsed if width is between 768px and 1024px
    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  }, []);

  const switchRole = useCallback((role: string) => {
    contextSwitchRole(role);
    setShowPersonaSwitcher(false);
  }, [contextSwitchRole]);

  /** Filter nav items based on active role */
  const filterByRole = useCallback((items: NavItem[]) => {
    return items.filter(item => !item.roles || item.roles.includes(activeRole));
  }, [activeRole]);

  // --- SYSTEM HOTKEYS & BARCODE PROXY ---
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSidebarOpen(false);
    }

    // Command Center: Alt+[Key]
    if (e.altKey) {
      if (e.key === 'o') { e.preventDefault(); router.push('/orders'); }
    }
  }, [router]);

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
    if (window.innerWidth >= 768) setIsCollapsed(prev => !prev);
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
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-md animate-fade-in" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ===== SIDEBAR (Clinical Dashboard Left Rail) ===== */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        hidden md:flex md:relative md:translate-x-0 border-r border-white/5 shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'md:w-[5.5rem]' : 'md:w-[17.5rem]'}
        w-[17.5rem]
      `}
        style={{ background: 'linear-gradient(180deg, #0f3d2e 0%, #134e3a 50%, #166534 100%)' }}
      >
        {/* Branding Header */}
        <div className={`h-14 flex items-center border-b border-white/10 transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white flex-shrink-0 text-lg">
              ✚
            </div>
            <span className="text-sm font-semibold text-white tracking-tight text-foreground uppercase">PharmaMate</span>
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
                  <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[activeRole] || 'bg-emerald-500'}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{ROLE_LABELS[activeRole] || activeRole}</span>
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
                      <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[role] || 'bg-emerald-500'}`} />
                      {ROLE_LABELS[role] || role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div onClick={() => handleNavClick('/user/me')} className={`cursor-pointer flex items-center gap-3 rounded-lg hover:bg-white/10 transition-colors duration-200 ${isCollapsed ? 'justify-center p-2.5' : 'p-2.5'}`}>
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center font-semibold text-sm text-white flex-shrink-0 relative">
              {(user as any).full_name ? (user as any).full_name[0].toUpperCase() : 'P'}
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-emerald-900 ${ROLE_COLORS[activeRole] || 'bg-emerald-500'}`} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{(user as any).full_name || 'Pharmacist'}</p>
                <p className="text-xs text-white/40 truncate">{user.shopName || 'Pharmacy Store'}</p>
              </div>
            )}
          </div>

          <button onClick={onLogout}
            className={`w-full mt-1 flex items-center justify-center gap-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-xs font-medium ${isCollapsed ? 'py-2.5' : 'py-2.5 px-3'}`}>
            <LogOut size={14} />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ===== CENTRAL WORKSPACE ===== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <header className="h-16 flex items-center justify-between px-2 sm:px-6 md:px-8 bg-surface border-b border-border-subtle flex-shrink-0 z-30 shadow-sm gap-1 sm:gap-0">
          <div className="flex items-center gap-1.5 sm:gap-4 min-w-0 flex-1">
            {/* Mobile Branding */}
            <div className="md:hidden flex items-center gap-1 sm:gap-2 shrink-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-emerald-600 flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-sm">
                ✚
              </div>
              <span className="inline-block text-[12px] sm:text-[15px] font-black tracking-tight text-foreground">PharmaMate</span>
            </div>

            <div className="hidden md:hidden md:border-none border-l border-border-subtle shrink-0 h-4 min-[360px]:block mx-1" />

            <h2 className="text-[10px] sm:text-[13px] md:text-[15px] font-black tracking-tighter md:tracking-tight text-stone-500 md:text-foreground uppercase truncate shrink">
              {PAGE_TITLES[pathname] || 'Workspace'}
            </h2>
          </div>

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <ConnectivityStatus />

            {/* Mobile Persona Switcher */}
            {availableRoles.length > 1 && (
              <div className="md:hidden relative">
                <button
                  onClick={() => setShowPersonaSwitcher(!showPersonaSwitcher)}
                  className="w-[26px] h-[26px] sm:w-[32px] sm:h-[32px] rounded-full bg-emerald-600/10 border border-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-sm"
                >
                  {(user as any).full_name ? (user as any).full_name[0].toUpperCase() : 'P'}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-surface ${ROLE_COLORS[activeRole] || 'bg-emerald-500'}`} />
                </button>

                {showPersonaSwitcher && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border-subtle rounded-xl shadow-2xl overflow-hidden py-1 z-[100] animate-fade-in">
                    <div className="px-3 py-2 border-b border-border-subtle bg-black/5 dark:bg-white/5">
                      <p className="text-[9px] uppercase font-black tracking-widest text-stone-500 mb-0.5">Switch Persona</p>
                      <p className="text-sm font-bold truncate text-foreground">{(user as any).full_name}</p>
                    </div>
                    <div className="py-1">
                      {availableRoles.map(role => (
                        <button
                          key={role}
                          onClick={() => switchRole(role)}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-colors ${activeRole === role
                            ? 'bg-primary/10 text-primary'
                            : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-foreground'
                            }`}
                        >
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ROLE_COLORS[role] || 'bg-emerald-500'}`} />
                          {ROLE_LABELS[role] || role}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <ThemeToggle />
            {mounted && (
              <div className="text-xs font-medium px-3 py-2 rounded-lg text-stone-500 dark:text-stone-400 border border-border-subtle hidden sm:block">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 md:p-8 pb-32 md:pb-12 w-full bg-background transition-colors duration-500 relative scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
