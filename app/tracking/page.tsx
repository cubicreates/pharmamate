'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
    Navigation, Bike, MapPin, Phone, MessageCircle, 
    Clock, Loader2, ShieldAlert, Package, Search 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:8000';

interface ActiveTrip {
    order_id: string;
    status: string;
    delivery_address: string;
    rider_name: string;
    lat: number | null;
    lng: number | null;
    last_seen: string | null;
}

export default function FleetTrackingPage() {
    const [trips, setTrips] = useState<ActiveTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTrip, setSelectedTrip] = useState<ActiveTrip | null>(null);

    const fetchTrips = async () => {
        try {
            const res = await fetch(`${API}/rider/active_trips`);
            if (res.ok) setTrips(await res.json());
        } catch (e) { console.error('Fleet fetch error', e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchTrips();
        const interval = setInterval(fetchTrips, 10000); // 10s fleet sync
        return () => clearInterval(interval);
    }, []);

    const filteredTrips = trips.filter(t => 
        t.rider_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.order_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLogout = () => { localStorage.clear(); sessionStorage.clear(); window.location.href = 'http://localhost:5173'; };

    return (
        <Layout onLogout={handleLogout}>
            <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in text-foreground">
                
                {/* ── Fleet List Sidebar ── */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                    <div className="glass-card p-4 rounded-2xl flex items-center gap-3 border border-border-subtle focus-within:border-primary/50 transition-all">
                        <Search size={18} className="text-muted" />
                        <input 
                            type="text" 
                            placeholder="Find Trip or Rider..." 
                            className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                <Loader2 className="animate-spin mb-4 text-primary" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Scanning Fleet...</p>
                            </div>
                        ) : filteredTrips.length === 0 ? (
                            <div className="text-center py-20 opacity-30">
                                <Bike size={40} className="mx-auto mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest tracking-tighter">No Active Trips</p>
                            </div>
                        ) : (
                            filteredTrips.map((trip) => (
                                <motion.button
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={trip.order_id}
                                    onClick={() => setSelectedTrip(trip)}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedTrip?.order_id === trip.order_id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-stone-900 border-border-subtle hover:border-primary/30 shadow-sm'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${selectedTrip?.order_id === trip.order_id ? 'text-white/80' : 'text-muted'}`}>
                                            #{trip.order_id.substring(4, 10).toUpperCase()}
                                        </p>
                                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${trip.status === 'IN_TRANSIT' ? 'bg-emerald-400 text-emerald-950' : 'bg-blue-400 text-blue-950'}`}>
                                            {trip.status.replace('_', ' ')}
                                        </div>
                                    </div>
                                    <p className="font-bold text-sm truncate">{trip.rider_name}</p>
                                    <div className="flex items-center gap-2 mt-2 opacity-70">
                                        <MapPin size={10} />
                                        <p className="text-[10px] truncate font-medium">{trip.delivery_address}</p>
                                    </div>
                                </motion.button>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Global Fleet Map ── */}
                <div className="flex-1 glass-card rounded-3xl overflow-hidden relative shadow-2xl border border-border-subtle">
                    <div className="absolute inset-0 bg-stone-100 dark:bg-stone-950/20 bg-[size:30px_30px]" style={{ backgroundImage: 'radial-gradient(#00c2cb22 1px, transparent 1px)' }}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)]" />
                    </div>

                    <AnimatePresence>
                    {trips.map((trip) => (
                        <motion.div 
                            key={trip.order_id}
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            style={{ 
                                left: (trip.lng ? (trip.lng - 72.8) * 1000 : Math.random() * 80 + 10) + '%', 
                                top: (trip.lat ? (19.1 - trip.lat) * 1000 : Math.random() * 80 + 10) + '%' 
                            }}
                            className="absolute cursor-pointer group"
                            onClick={() => setSelectedTrip(trip)}
                        >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xl transition-all ${selectedTrip?.order_id === trip.order_id ? 'bg-primary text-white scale-125 ring-4 ring-primary/20' : 'bg-stone-900 text-white hover:scale-110'}`}>
                                <Bike size={16} className={trip.status === 'IN_TRANSIT' ? 'animate-bounce' : ''} />
                            </div>
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-border-subtle shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                <p className="text-[10px] font-black uppercase text-primary">{trip.rider_name}</p>
                                <p className="text-[8px] font-bold text-muted">{trip.status}</p>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>

                    {/* Stats Overlay */}
                    <div className="absolute top-6 left-6 flex gap-4">
                        <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur px-4 py-2 rounded-2xl shadow-xl border border-border-subtle flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <Navigation size={16} />
                            </div>
                            <div>
                                <p className="text-[18px] font-black leading-none text-foreground">{trips.length}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted">Total Fleet trips</p>
                            </div>
                        </div>
                    </div>

                    {/* Selection Details Card */}
                    <AnimatePresence>
                    {selectedTrip && (
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-96 bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-border-subtle"
                        >
                            <button onClick={() => setSelectedTrip(null)} className="absolute top-4 right-4 p-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 transition-colors">
                                <Clock size={14} />
                            </button>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-primary">
                                    <Package size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Active Trip Info</p>
                                    <h3 className="text-xl font-black italic text-foreground">{selectedTrip.rider_name}</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 opacity-80">
                                    <MapPin size={16} className="mt-0.5 text-primary" />
                                    <p className="text-sm font-medium leading-relaxed text-foreground">{selectedTrip.delivery_address}</p>
                                </div>
                                <div className="flex items-center gap-3 opacity-80">
                                    <ShieldAlert size={16} className="text-amber-500" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-foreground">Priority Courier Service</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button className="flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-500/30">
                                    <Phone size={14} /> Call Rider
                                </button>
                                <button className="flex items-center justify-center gap-3 py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 active:scale-95 transition-all">
                                    <MessageCircle size={14} /> Chat
                                </button>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

            </div>
        </Layout>
    );
}
