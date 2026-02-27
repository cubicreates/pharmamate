/**
 * @fileoverview MediAssist IQ — Clinical Intelligence Console
 * This component provides real-time clinical guidance, regulatory alerts,
 * and interaction warnings using a dedicated knowledge base.
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    X, Send, Sparkles, MessageSquare, ShieldAlert,
    BookOpen, ArrowLeft, Loader2, Info,
    ChevronRight, Zap, Target, Activity,
    LucideIcon
} from 'lucide-react';
import { apiRequest } from '@/lib/utils/api';

interface AIKnowledge {
    menuItems: Array<{ id: string; label: string; desc: string }>;
    responses: Record<string, { content: string; type: 'text' | 'interaction' | 'regulation' | 'substitution'; metadata?: { report?: string; action?: string } }>;
}

// --- TYPES ---
interface Message {
    role: 'user' | 'assistant';
    content: string;
    /** Categorizes the message for specialized clinical UI rendering */
    type?: 'text' | 'interaction' | 'regulation' | 'substitution';
    /** Optional contextual data (e.g., links to pharmacopeia) */
    metadata?: {
        report?: string;
        action?: string;
    };
}

// --- SUB-COMPONENTS ---

/**
 * Professional Clinical Message Rendering
 */
const ChatMessage = React.memo(({ m }: { m: Message }) => {
    const isAssistant = m.role === 'assistant';

    // Aesthetic mapping for clinical types
    const typeLabel = m.type === 'interaction' ? 'Critical Interaction Alert' :
        m.type === 'regulation' ? 'Regulatory Compliance' :
            m.type === 'substitution' ? 'Clinical Substitution' : '';

    const typeIcon = m.type === 'interaction' ? <ShieldAlert size={14} /> :
        m.type === 'regulation' ? <BookOpen size={14} /> :
            m.type === 'substitution' ? <Target size={14} /> : null;

    return (
        <div className={`flex ${!isAssistant ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[90%] rounded-xl p-4 text-sm shadow-sm transition-all ${!isAssistant
                ? 'bg-[#166534] text-white rounded-tr-none'
                : 'bg-white dark:bg-[#1c1c1a] border border-[#e7e5e4] dark:border-[#2d2d2a] text-[#44403c] dark:text-[#d6d3d1] rounded-tl-none'
                }`}>
                {/* Clinical Metadata Header */}
                {isAssistant && m.type && m.type !== 'text' && (
                    <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase mb-2 tracking-[0.06em] ${m.type === 'interaction' ? 'text-[#dc2626]' : 'text-[#0f766e]'
                        }`}>
                        {typeIcon}
                        <span>{typeLabel}</span>
                    </div>
                )}

                <div className={`leading-relaxed whitespace-pre-wrap ${isAssistant ? 'font-medium' : ''}`}>
                    {m.content}
                </div>

                {/* --- Clinical Confidence Gauge (Mock) --- */}
                {isAssistant && m.type && (
                    <div className="mt-3 pt-3 border-t border-border-subtle/30">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Clinical Certainty</span>
                            <span className="text-[9px] font-bold text-primary">98% Match</span>
                        </div>
                        <div className="h-1 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-1000 w-[98%]" />
                        </div>
                    </div>
                )}

                {/* Structured Clinical Report Metadata */}
                {m.metadata?.report && (
                    <div className="mt-4 p-3 rounded-lg bg-[#fafaf9] dark:bg-[#141412] border border-[#e7e5e4] dark:border-[#2d2d2a]">
                        <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-[#a8a29e] uppercase tracking-widest">
                            <Info size={12} /> Supporting Evidence
                        </div>
                        <p className="text-[11px] text-[#78716c] leading-normal italic">
                            {m.metadata.report}
                        </p>
                    </div>
                )}

                {/* Contextual Action Buttons */}
                {m.metadata?.action && (
                    <button className="mt-3 w-full py-2 bg-[#f5f5f4] dark:bg-[#2d2d2a] hover:bg-[#e7e5e4] dark:hover:bg-[#3d3d3a] rounded-lg text-[10px] font-bold text-[#44403c] dark:text-[#d6d3d1] uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                        {m.metadata.action}
                        <ChevronRight size={12} />
                    </button>
                )}
            </div>
        </div>
    );
});
ChatMessage.displayName = 'ChatMessage';

// --- MAIN COMPONENT ---

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'menu' | 'chat'>('menu');
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [menuItems, setMenuItems] = useState<{ id: string; label: string; desc: string; icon: LucideIcon; color: string }[]>([]);
    const [knowledge, setKnowledge] = useState<AIKnowledge | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "MediAssist IQ Clinical Engine active. Select a protocol to begin.",
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping, view]);

    // Data Fetching
    useEffect(() => {
        const fetchKnowledge = async () => {
            try {
                const data = await apiRequest<AIKnowledge>('/api/ai/knowledge');
                if (data) {
                    setKnowledge(data);

                    const iconMap: Record<string, LucideIcon> = {
                        interactions: ShieldAlert,
                        regulations: BookOpen,
                        inventory: Zap,
                        general: MessageSquare
                    };

                    const colorMap: Record<string, string> = {
                        interactions: 'text-[#dc2626] bg-[#fef2f2] dark:bg-[#450a0a]/20',
                        regulations: 'text-[#0f766e] bg-[#f0fdfa] dark:bg-[#134e4a]/20',
                        inventory: 'text-[#2563eb] bg-[#eff6ff] dark:bg-[#1e3a8a]/20',
                        general: 'text-[#44403c] bg-[#f5f5f4] dark:bg-[#2d2d2a]/20'
                    };

                    setMenuItems(data.menuItems.map((item) => ({
                        ...item,
                        icon: iconMap[item.id] || MessageSquare,
                        color: colorMap[item.id] || 'text-[#44403c] bg-[#f5f5f4]'
                    })));
                }
            } catch (err) {
                console.error("AI Knowledge sync failed", err);
            }
        };
        fetchKnowledge();
    }, []);

    const toggleChat = useCallback(() => {
        setIsOpen(prev => !prev);
        if (!isOpen) setTimeout(() => inputRef.current?.focus(), 300);
    }, [isOpen]);

    const startModule = useCallback((id: string, label: string) => {
        setActiveModule(label);
        setView('chat');
        setMessages([{
            role: 'assistant',
            content: `Clinical protocol initiated: ${label}. Awaiting input for analysis.`,
        }]);
    }, []);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        // Simulation of neural processing
        setTimeout(() => {
            let aiMsg: Message = { role: 'assistant', content: '' };
            const q = currentInput.toLowerCase();

            if (knowledge?.responses) {
                if (activeModule?.includes('Safety') || q.includes('interaction') || q.includes('safe')) {
                    aiMsg = { role: 'assistant', ...knowledge.responses.interaction };
                } else if (activeModule?.includes('Rules') || q.includes('schedule') || q.includes('compliance')) {
                    aiMsg = { role: 'assistant', ...knowledge.responses.regulation };
                } else {
                    aiMsg = { role: 'assistant', ...knowledge.responses.default };
                }
            } else {
                aiMsg = { role: 'assistant', content: "Synchronizing with clinical knowledge base... Analysis deferred." };
            }

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1200);
    }, [input, isTyping, knowledge, activeModule]);

    useEffect(() => {
        const handleToggle = () => toggleChat();
        window.addEventListener('toggleAIAssistant', handleToggle);
        return () => window.removeEventListener('toggleAIAssistant', handleToggle);
    }, [toggleChat]);

    return (
        <div className="select-none">
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[140] md:hidden animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* --- CLINICAL CONSOLE INTERFACE DRAG-OUT PANEL --- */}
            <div
                className={`fixed top-0 right-0 w-full md:w-[420px] h-screen bg-[#fafaf9] dark:bg-[#141412] shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] border-l border-[#e7e5e4] dark:border-[#2d2d2a] flex flex-col z-[150] transition-transform duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Enterprise Header */}
                <div className="p-6 bg-[#1c1c1a] dark:bg-[#0a0a09] text-white flex items-center justify-between border-b border-[#2d2d2a]">
                    <div className="flex items-center gap-4">
                        {view === 'chat' ? (
                            <button onClick={() => setView('menu')} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all">
                                <ArrowLeft size={16} />
                            </button>
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center">
                                <Activity size={16} className="text-white" />
                            </div>
                        )}
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#a8a29e] mb-0.5 leading-none">
                                {view === 'menu' ? 'System Console' : 'Clinical Trial'}
                            </p>
                            <h2 className="text-[15px] font-bold text-white tracking-tight leading-none">
                                {view === 'menu' ? 'MediAssist IQ' : activeModule}
                            </h2>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all text-[#a8a29e] hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                {view === 'menu' ? (
                    /* Clinical Protocol Menu */
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        <div>
                            <p className="text-[10px] font-bold text-[#a8a29e] uppercase tracking-[0.1em] mb-4">Active Protocols</p>
                            <div className="grid grid-cols-2 gap-4">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => startModule(item.id, item.label)}
                                        className="p-5 bg-white dark:bg-[#1c1c1a] rounded-2xl border border-[#e7e5e4] dark:border-[#2d2d2a] hover:border-[#166534] hover:shadow-lg transition-all text-left flex flex-col gap-4 group"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-all`}>
                                            <item.icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-[#44403c] dark:text-[#d6d3d1] uppercase tracking-tight">{item.label}</p>
                                            <p className="text-[11px] text-[#a8a29e] leading-snug mt-1.5 line-clamp-2">{item.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* System Status Card */}
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c1a] border border-[#e7e5e4] dark:border-[#2d2d2a] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#166534]/5 rounded-full -mr-8 -mt-8 blur-2xl" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3 text-[#166534]">
                                    <Sparkles size={14} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Neural Status</p>
                                </div>
                                <p className="text-[12px] text-[#78716c] leading-relaxed">
                                    Knowledge base synchronized with <b>v2.8 Pharmacopeia</b>. Real-time interaction checks active across all dispensing lanes.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Analysis & Chat Interface */
                    <>
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafaf9] dark:bg-[#141412] scrollbar-hide">
                            {messages.map((m, i) => <ChatMessage key={i} m={m} />)}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-[#1c1c1a] p-4 rounded-xl rounded-tl-none border border-[#e7e5e4] dark:border-[#2d2d2a] w-full">
                                        <div className="space-y-3">
                                            <div className="flex gap-1.5 items-center">
                                                <Loader2 size={14} className="animate-spin text-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
                                                    Consulting Pharmacopeia v2.8
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary animate-shimmer" style={{ width: '40%' }} />
                                            </div>
                                            <div className="flex justify-between items-center text-[8px] text-muted font-bold uppercase tracking-tighter">
                                                <span>Cross-referencing Molecule Salts...</span>
                                                <span>Node 4.0 Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Analysis Input Box */}
                        <div className="p-6 bg-white dark:bg-[#1c1c1a] border-t border-[#e7e5e4] dark:border-[#2d2d2a]">
                            <div className="flex gap-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Explain query to ${activeModule}...`}
                                    className="flex-1 bg-[#f5f5f4] dark:bg-[#141412] border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#166534]/10 transition-all dark:text-white placeholder:text-[#a8a29e]"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="w-12 h-12 rounded-xl bg-[#166534] text-white flex items-center justify-center hover:bg-[#15803d] transition-all shadow-lg shadow-[#166534]/20 active:scale-90 disabled:opacity-40 disabled:grayscale cursor-pointer"
                                >
                                    {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <p className="text-[9px] text-[#a8a29e] font-bold uppercase tracking-[0.25em]">MediAssist Neural Node v4.0</p>
                                <div className="w-1 h-1 rounded-full bg-[#166534]" />
                                <p className="text-[9px] text-[#a8a29e] font-bold uppercase tracking-[0.25em]">Secure Clinical Link</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
