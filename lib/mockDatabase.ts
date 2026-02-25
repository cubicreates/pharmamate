/**
 * @fileoverview Centralized Virtual Database (Mock RDBMS)
 * This file serves as the Single Source of Truth for all dummy data.
 * Designed to simulate a relational database structure for frontend development.
 */

import { Order, InventoryItem, QueueItem, User, Prescription } from './types';

// ==========================================
// 1. CHEMIST/USER DATABASE
// ==========================================

/**
 * Registered Pharmacists who can access the dashboard.
 * Supports simulation of multi-user and multi-shop scenarios.
 */
export const dummyChemists: User[] = [
    {
        _id: 'chem_001',
        name: 'Vikram Mehta',
        shopName: 'MediCare Pharmacy',
        email: 'vikram@medicare.com',
        licenseNumber: 'MH-MZ2-123456',
        address: '123 Health Avenue, Pharma City',
    },
    {
        _id: 'chem_002',
        name: 'Jane Smith',
        shopName: 'Green Cross Meds',
        email: 'jane@pharmacy.com',
        licenseNumber: 'DL-RX-987654',
        address: '45 Green Street, Metroville',
    }
];

// ==========================================
// 2. ORDER HISTORY & QUEUE
// ==========================================

/**
 * Comprehensive Order List simulating real-world medical transactions.
 * Includes pending, ready for pickup, and fulfilled orders.
 */
export const dummyOrders: Order[] = [
    {
        _id: 'ord_001',
        patientName: 'Rahul Sharma',
        patientPrn: 'PRN-1001',
        orderDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        status: 'Pending',
        items: [
            { name: 'Amoxicillin 500mg', dosage: '500mg', quantity: 21, price: 150, salt: 'Amoxicillin Trihydrate' },
            { name: 'Paracetamol 650mg', dosage: '650mg', quantity: 10, price: 50, salt: 'Paracetamol' }
        ],
        chemistName: 'MediCare Pharmacy',
        total: 200,
        doctorName: 'Dr. Sameer Joshi',
        doctorPhone: '+91 98765 11111'
    },
    {
        _id: 'ord_002',
        patientName: 'Priya Patel',
        patientPrn: 'PRN-1002',
        orderDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        status: 'Ready',
        items: [
            { name: 'Metformin 500mg', dosage: '500mg', quantity: 60, price: 120, salt: 'Metformin Hydrochloride' }
        ],
        chemistName: 'MediCare Pharmacy',
        total: 120,
        doctorName: 'Dr. Ananya Ray',
        doctorPhone: '+91 98765 22222'
    },
    {
        _id: 'ord_003',
        patientName: 'Amit Kumar',
        patientPrn: 'PRN-1003',
        orderDate: '2026-02-23T14:00:00Z',
        status: 'Completed',
        items: [
            { name: 'Atorvastatin 10mg', dosage: '10mg', quantity: 30, price: 200, salt: 'Atorvastatin Calcium' },
            { name: 'Aspirin 75mg', dosage: '75mg', quantity: 30, price: 80, salt: 'Acetylsalicylic Acid' }
        ],
        chemistName: 'MediCare Pharmacy',
        total: 280,
        doctorName: 'Dr. Ravi Menon',
        doctorPhone: '+91 98765 33333',
        batchNumber: 'BN-ATR-2026-04',
        fulfilledAt: '2026-02-23T15:30:00Z'
    }
];

// ==========================================
// 3. INVENTORY MANAGEMENT (STOCKS)
// ==========================================

/**
 * Inventory data with active stock levels and metadata.
 * Salt/Molecule data is used for the Substitute matching algorithm.
 */
export const dummyInventory: InventoryItem[] = [
    {
        _id: 'inv_001', name: 'Amoxicillin 500mg', category: 'Antibiotics',
        stock: 250, reorderLevel: 50, price: 7.14,
        expiryDate: '2027-06-15', manufacturer: 'Cipla',
        shelf: 'A-2', batchNo: 'BN-AMX-2026-06',
        salt: 'Amoxicillin Trihydrate'
    },
    {
        _id: 'inv_002', name: 'Paracetamol 650mg', category: 'Pain Relief',
        stock: 500, reorderLevel: 100, price: 5.00,
        expiryDate: '2027-12-01', manufacturer: 'GSK',
        shelf: 'B-1', batchNo: 'BN-PCM-2026-12',
        salt: 'Paracetamol'
    },
    {
        _id: 'inv_003', name: 'Metformin 500mg', category: 'Diabetes',
        stock: 180, reorderLevel: 60, price: 2.00,
        expiryDate: '2027-08-20', manufacturer: 'Sun Pharma',
        shelf: 'C-3', batchNo: 'BN-MET-2026-08',
        salt: 'Metformin Hydrochloride'
    },
    {
        _id: 'inv_004', name: 'Atorvastatin 10mg', category: 'Cholesterol',
        stock: 12, reorderLevel: 40, price: 6.67,
        expiryDate: '2027-04-10', manufacturer: 'Ranbaxy',
        shelf: 'C-1', batchNo: 'BN-ATR-2026-04',
        salt: 'Atorvastatin Calcium'
    },
    {
        _id: 'inv_005', name: 'Ibuprofen 400mg', category: 'Pain Relief',
        stock: 120, reorderLevel: 30, price: 4.50,
        expiryDate: '2027-09-12', manufacturer: 'Abbott',
        shelf: 'B-2', batchNo: 'BN-IBU-2026-09',
        salt: 'Ibuprofen'
    }
];

// ==========================================
// 4. PRESCRIPTION ENGINE
// ==========================================

/**
 * Map of PRN to extracted digital prescriptions.
 * Simulates data retrieved from the MediAssist Doctor Portal.
 */
export const dummyPrescriptions: Record<string, Prescription> = {
    'PRN-1001': {
        patientName: 'Rahul Sharma', patientPrn: 'PRN-1001',
        doctorName: 'Dr. Sameer Joshi', doctorPhone: '+91 98765 11111', doctorClinic: 'Joshi Clinic, Andheri West',
        date: new Date().toISOString(),
        medicines: [
            { name: 'Amoxicillin', dosage: '500mg', frequency: 'TDS (Three times a day)', duration: '7 days', salt: 'Amoxicillin Trihydrate' },
            { name: 'Paracetamol', dosage: '650mg', frequency: 'SOS (When needed)', duration: '3 days', salt: 'Paracetamol' }
        ],
        notes: 'Take Amoxicillin after meals. Complete the full course.'
    },
    'PRN-1002': {
        patientName: 'Priya Patel', patientPrn: 'PRN-1002',
        doctorName: 'Dr. Ananya Ray', doctorPhone: '+91 98765 22222', doctorClinic: 'Ray Diagnostics, Bandra',
        date: new Date(Date.now() - 86400000).toISOString(),
        medicines: [
            { name: 'Metformin', dosage: '500mg', frequency: 'BD (Twice a day)', duration: '30 days', salt: 'Metformin Hydrochloride' }
        ],
        notes: 'Monitor blood sugar levels weekly.'
    },
    'PRN-9999': {
        patientName: 'John Doe',
        patientPrn: 'PRN-9999',
        doctorName: 'Dr. Sarah Wilson',
        doctorPhone: '+91 99999 00000',
        doctorClinic: 'City Health Clinic',
        date: new Date().toISOString(),
        medicines: [
            { name: 'Ibuprofen', dosage: '400mg', frequency: '1-0-1', duration: '5 days', salt: 'Ibuprofen' },
            { name: 'Aspirin', dosage: '75mg', frequency: '1-1-1', duration: '3 days', salt: 'Acetylsalicylic Acid' }
        ],
        notes: 'Take after meals. AI Extracted from handwritten image.'
    }
};

// ==========================================
// 5. LIVE SHOP FLOOR QUEUE
// ==========================================

/**
 * Current patients waiting at the physical pharmacy counter.
 * ArrivedAt is relative to current time for realistic "m ago" calculation.
 */
export const dummyQueue: QueueItem[] = [
    { _id: 'q_001', patientName: 'Rahul Sharma', patientPrn: 'PRN-1001', arrivedAt: new Date(Date.now() - 720000).toISOString(), status: 'verifying', itemCount: 2 },
    { _id: 'q_002', patientName: 'Sneha Desai', patientPrn: 'PRN-1004', arrivedAt: new Date(Date.now() - 300000).toISOString(), status: 'waiting', itemCount: 1 },
    { _id: 'q_003', patientName: 'Rajesh Gupta', patientPrn: 'PRN-1005', arrivedAt: new Date(Date.now() - 120000).toISOString(), status: 'waiting', itemCount: 1 },
];

// ==========================================
// 6. AI AGENT KNOWLEDGE BASE
// ==========================================

/**
 * Structured knowledge for the AI Assistant component.
 * Contains both static labels and simulated contextual responses.
 */
export const aiAssistantKnowledge = {
    responses: {
        interaction: {
            type: 'interaction',
            content: "Just a heads up: I found a high-risk clinical interaction. It's best if patients on blood thinners avoid combining multiple NSAIDs like Aspirin and Ibuprofen, as it increases gastric bleeding risks.",
            metadata: { severity: 'High', action: 'Review Pharmacopeia' }
        },
        regulation: {
            type: 'regulation',
            content: "Regulatory Alert: This is a Schedule H1 therapeutic. You are required to maintain a separate register with name/address of the prescriber, patient info, and name/quantity of drug for 3 years.",
        },
        default: {
            content: "I've cross-referenced this with our medical database. The dosage and duration match the standard clinical protocols for this patient demographic.",
        }
    },
    menuItems: [
        { id: 'interactions', label: 'Safety Check', desc: 'Real-time drug interaction audit' },
        { id: 'regulations', label: 'Compliance', desc: 'Schedules and legal guidelines' },
        { id: 'inventory', label: 'Stock Helper', desc: 'Predictive stock analytics' },
        { id: 'general', label: 'Clinical Query', desc: 'Ask about any drug or protocol' },
    ]
};
