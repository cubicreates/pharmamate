'use client';

import React, { useState, useEffect, use } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/utils/api';
import { Printer, MessageCircle, ArrowLeft, AlertTriangle, Inbox } from 'lucide-react';
import '../../orders.css';

interface OrderItem {
    name: string; dosage: string; quantity: number; price: number; salt?: string;
}

interface Order {
    _id: string; patientName: string; patientPrn: string;
    status: string; items: OrderItem[]; total: number;
    doctorName?: string; batchNumber?: string;
}

interface InvoiceData {
    invoiceId: string; date: string;
    pharmacyName: string; pharmacyLicense: string; pharmacyAddress: string; pharmacyGST: string;
    patientName: string; patientPrn: string; doctorName: string;
    items: OrderItem[]; subtotal: number; gst: number; total: number;
    batchNumber?: string;
}

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: orderId } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [notFulfilled, setNotFulfilled] = useState(false);
    const [user, setUser] = useState<{ _id?: string }>({});

    const handleLogout = () => {
        localStorage.removeItem('chemToken');
        localStorage.removeItem('chemUser');
        sessionStorage.removeItem('chemToken');
        sessionStorage.removeItem('chemUser');
        router.push('/');
    };

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('chemUser') || '{}'));
    }, []);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!user._id) return;
            try {
                const orders = (await apiRequest(`/api/orders/chemist/${user._id}`)) as Order[];
                const found = orders.find((o: Order) => o._id === orderId);
                if (found && found.status !== 'Completed') {
                    setNotFulfilled(true);
                    setLoading(false);
                    return;
                }
                setOrder(found || null);
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetchOrder();
    }, [user._id, orderId]);

    useEffect(() => {
        const generate = async () => {
            if (!order || invoiceData || generating) return;
            setGenerating(true);
            try {
                const data = (await apiRequest('/api/invoice/generate', {
                    method: 'POST',
                    body: JSON.stringify({
                        orderId: order._id, patientName: order.patientName, patientPrn: order.patientPrn,
                        doctorName: order.doctorName, items: order.items,
                        subtotal: order.total, batchNumber: order.batchNumber,
                    }),
                })) as InvoiceData;
                setInvoiceData(data);
            } catch { /* ignore */ } finally { setGenerating(false); }
        };
        generate();
    }, [order, invoiceData, generating]);

    return (
        <Layout onLogout={handleLogout}>
            <div className="orders-animate-in invoice-page">

                {/* Header */}
                <div className="invoice-header">
                    <div className="invoice-header-left">
                        <h1>Tax Invoice</h1>
                        <p>GST-compliant tax invoice for fulfilled order</p>
                    </div>
                    <div className="invoice-header-actions no-print">
                        {invoiceData && (
                            <>
                                <button onClick={() => alert(`Invoice ${invoiceData.invoiceId} sent to WhatsApp ✅`)}
                                    className="invoice-btn-whatsapp">
                                    <MessageCircle size={14} /> WhatsApp
                                </button>
                                <button onClick={() => window.print()} className="invoice-btn-print">
                                    <Printer size={14} /> Print
                                </button>
                            </>
                        )}
                        <button onClick={() => router.push('/orders')} className="invoice-back-btn">
                            <ArrowLeft size={14} /> Orders
                        </button>
                    </div>
                </div>

                {loading || generating ? (
                    <div className="orders-loading">
                        <div className="skeleton" style={{ width: '100%', height: 500, borderRadius: 10 }} />
                        <span>{loading ? 'Loading order...' : 'Generating invoice...'}</span>
                    </div>
                ) : notFulfilled ? (
                    <div className="invoice-state-card orders-animate-in">
                        <div className="invoice-state-icon invoice-state-icon--warning">
                            <AlertTriangle size={24} />
                        </div>
                        <h3>Fulfillment Required</h3>
                        <p>This order must be fulfilled before an invoice can be generated.</p>
                        <button onClick={() => router.push(`/orders/${orderId}/fulfillment`)} className="invoice-state-btn">
                            Go to Fulfillment
                        </button>
                    </div>
                ) : !order ? (
                    <div className="invoice-state-card">
                        <div className="invoice-state-icon invoice-state-icon--empty">
                            <Inbox size={24} />
                        </div>
                        <h3>Order not found</h3>
                        <p>The requested order could not be located.</p>
                        <button onClick={() => router.push('/orders')} className="invoice-state-btn">
                            Go to Orders
                        </button>
                    </div>
                ) : invoiceData ? (
                    <div className="invoice-document">
                        <div className="invoice-document-inner">
                            {/* Invoice Header */}
                            <div className="invoice-doc-header">
                                <div>
                                    <p className="invoice-pharmacy-name">{invoiceData.pharmacyName}</p>
                                    <p className="invoice-pharmacy-detail">{invoiceData.pharmacyAddress}</p>
                                    <p className="invoice-pharmacy-detail">License: {invoiceData.pharmacyLicense}</p>
                                    <p className="invoice-pharmacy-detail">GSTIN: {invoiceData.pharmacyGST}</p>
                                </div>
                                <div>
                                    <p className="invoice-doc-label">TAX INVOICE</p>
                                    <p className="invoice-doc-id">{invoiceData.invoiceId}</p>
                                    <p className="invoice-doc-date">
                                        {new Date(invoiceData.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Patient & Doctor */}
                            <div className="invoice-info-grid">
                                <div className="invoice-info-block">
                                    <p className="invoice-info-label">Patient</p>
                                    <p className="invoice-info-name">{invoiceData.patientName}</p>
                                    <p className="invoice-info-sub">{invoiceData.patientPrn}</p>
                                </div>
                                <div className="invoice-info-block">
                                    <p className="invoice-info-label">Prescribed By</p>
                                    <p className="invoice-info-name">{invoiceData.doctorName || 'N/A'}</p>
                                    {invoiceData.batchNumber && <p className="invoice-info-sub">Batch: {invoiceData.batchNumber}</p>}
                                </div>
                            </div>

                            {/* Items Table */}
                            <table className="invoice-items-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Medicine</th>
                                        <th>Dosage</th>
                                        <th>Qty</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceData.items.map((item, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.dosage}</td>
                                            <td>{item.quantity}</td>
                                            <td>₹{item.price.toFixed(2)}</td>
                                            <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="invoice-totals">
                                <div className="invoice-total-row">
                                    <span>Subtotal</span>
                                    <span>₹{invoiceData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="invoice-total-row">
                                    <span>GST (12%)</span>
                                    <span>₹{invoiceData.gst.toFixed(2)}</span>
                                </div>
                                <div className="invoice-grand-total">
                                    <span>Grand Total</span>
                                    <span>₹{invoiceData.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="invoice-footer">
                                <p>This is a computer-generated invoice. No signature required.</p>
                                <p>PharmaMate — A MediAssist Product</p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </Layout>
    );
}
