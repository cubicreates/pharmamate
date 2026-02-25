'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import { Search, ArrowRight, MapPin, AlertTriangle, Package } from 'lucide-react';
import './substitutes.css';

interface SubstituteItem {
    _id: string;
    name: string;
    manufacturer: string;
    stock: number;
    price: number;
    shelf: string;
    salt: string;
    batchNo: string;
}

export default function SubstitutesFinderPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SubstituteItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const data = await apiRequest<SubstituteItem[]>(`/api/inventory/substitutes/${encodeURIComponent(searchTerm.trim())}`);
            setResults(data);
            setRecentSearches(prev => {
                const updated = [searchTerm.trim(), ...prev.filter(s => s !== searchTerm.trim())].slice(0, 5);
                return updated;
            });
        } catch { setResults([]); } finally { setLoading(false); }
    };

    const handleQuickSearch = (term: string) => {
        setSearchTerm(term);
        setLoading(true);
        setSearched(true);
        apiRequest<SubstituteItem[]>(`/api/inventory/substitutes/${encodeURIComponent(term)}`)
            .then(data => setResults(data))
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    };

    const commonSalts = [
        'Paracetamol', 'Amoxicillin Trihydrate', 'Metformin Hydrochloride',
        'Ibuprofen', 'Cetirizine Dihydrochloride', 'Azithromycin Dihydrate',
    ];

    const groupedByManufacturer = results.reduce((acc, item) => {
        if (!acc[item.manufacturer]) acc[item.manufacturer] = [];
        acc[item.manufacturer].push(item);
        return acc;
    }, {} as Record<string, SubstituteItem[]>);

    return (
        <Layout onLogout={handleLogout}>
            <div className="sub-workspace">

                {/* ── Hero Banner ── */}
                <div className="sub-hero">
                    <img
                        src="/images/substitutes-hero.png"
                        alt="Pharmaceutical laboratory with organized medicine shelving"
                        className="sub-hero-img"
                    />
                    <div className="sub-hero-overlay">
                        <div className="sub-hero-content">
                            <div className="sub-hero-text">
                                <div className="sub-hero-badge">
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                                    Salt Composition Lookup
                                </div>
                                <h1 className="sub-hero-title">Substitutes Finder</h1>
                                <p className="sub-hero-subtitle">
                                    Identify bioequivalent generic alternatives by active salt composition.
                                    Cross-reference in-stock inventory with shelf locations and pricing.
                                </p>
                            </div>
                            {results.length > 0 && (
                                <div className="sub-hero-stats">
                                    <div className="sub-hero-stat">
                                        <div className="sub-hero-stat-value">{results.length}</div>
                                        <div className="sub-hero-stat-label">Matches</div>
                                    </div>
                                    <div className="sub-hero-stat">
                                        <div className="sub-hero-stat-value">{Object.keys(groupedByManufacturer).length}</div>
                                        <div className="sub-hero-stat-label">Brands</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Search Section ── */}
                <div className="sub-search-section">
                    <form onSubmit={handleSearch} className="sub-search-form">
                        <div className="sub-search-input-wrap">
                            <Search size={18} className="sub-search-icon" />
                            <input
                                type="text"
                                data-search-global
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by salt or molecule name — e.g. Paracetamol, Amoxicillin Trihydrate"
                                className="sub-search-input"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !searchTerm.trim()}
                            className="sub-search-btn"
                        >
                            {loading ? (
                                <><div className="sub-search-spinner" /> Searching...</>
                            ) : (
                                <>Find Substitutes <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    {/* Quick search tags */}
                    <div className="sub-tags-row">
                        <span className="sub-tags-label">Common Salts</span>
                        {commonSalts.map(salt => (
                            <button
                                key={salt}
                                onClick={() => handleQuickSearch(salt)}
                                className="sub-tag"
                            >
                                {salt}
                            </button>
                        ))}
                    </div>

                    {/* Recent searches */}
                    {recentSearches.length > 0 && (
                        <div className="sub-tags-row" style={{ borderTop: 'none', paddingTop: 8, marginTop: 8 }}>
                            <span className="sub-tags-label">Recent</span>
                            {recentSearches.map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleQuickSearch(s)}
                                    className="sub-tag sub-tag--recent"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Results ── */}
                {loading ? (
                    <div className="sub-loading">
                        <div className="sub-loading-spinner" />
                        <p className="sub-loading-text">Searching inventory for matching molecules...</p>
                    </div>
                ) : searched && results.length === 0 ? (
                    <div className="sub-empty">
                        <div className="sub-empty-icon">
                            <Package size={24} />
                        </div>
                        <h3 className="sub-empty-title">No matches found</h3>
                        <p className="sub-empty-desc">
                            No in-stock medicines match &ldquo;{searchTerm}&rdquo;. Try a different salt or molecule name.
                        </p>
                    </div>
                ) : results.length > 0 ? (
                    <>
                        {/* Results header */}
                        <div className="sub-results-header">
                            <h2 className="sub-results-title">
                                {results.length} Alternative{results.length !== 1 ? 's' : ''} Found
                            </h2>
                            <span className="sub-results-meta">
                                Matching: <strong>{searchTerm}</strong>
                            </span>
                        </div>

                        {/* Results table */}
                        <div className="sub-table-wrap">
                            <div className="sub-table-scroll">
                                <table className="sub-table">
                                    <thead>
                                        <tr>
                                            <th>Medicine</th>
                                            <th>Manufacturer</th>
                                            <th>Salt Composition</th>
                                            <th>Shelf</th>
                                            <th>Stock</th>
                                            <th>Batch</th>
                                            <th style={{ textAlign: 'right' }}>Price / Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((item, i) => (
                                            <tr
                                                key={item._id}
                                                className="sub-table-row-enter"
                                                style={{ animationDelay: `${i * 40}ms` }}
                                            >
                                                <td>
                                                    <span className="sub-cell-name">{item.name}</span>
                                                </td>
                                                <td>
                                                    <span className="sub-cell-mfg">{item.manufacturer}</span>
                                                </td>
                                                <td>
                                                    <span className="sub-cell-salt" title={item.salt}>{item.salt}</span>
                                                </td>
                                                <td>
                                                    <span className="sub-cell-shelf">
                                                        <MapPin size={12} />
                                                        {item.shelf}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`sub-cell-stock ${item.stock <= 20 ? 'sub-cell-stock--low' : ''}`}>
                                                        {item.stock <= 20 && <AlertTriangle size={12} style={{ marginRight: 4, display: 'inline' }} />}
                                                        {item.stock}
                                                        <span className="sub-cell-stock-unit">units</span>
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="sub-cell-batch">{item.batchNo}</span>
                                                </td>
                                                <td>
                                                    <span className="sub-cell-price">&#x20B9;{item.price.toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Manufacturer summary */}
                        {Object.keys(groupedByManufacturer).length > 1 && (
                            <div className="sub-mfg-section">
                                <h3 className="sub-mfg-title">By Manufacturer</h3>
                                <div className="sub-mfg-grid">
                                    {Object.entries(groupedByManufacturer).map(([mfg, items]) => (
                                        <div key={mfg} className="sub-mfg-card">
                                            <p className="sub-mfg-name">{mfg}</p>
                                            <p className="sub-mfg-count">
                                                {items.length} product{items.length > 1 ? 's' : ''} available
                                            </p>
                                            <p className="sub-mfg-price">
                                                From &#x20B9;{Math.min(...items.map(i => i.price)).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </Layout>
    );
}
