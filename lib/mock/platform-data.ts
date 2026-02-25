/**
 * @fileoverview MediAssist Platform Data — University Health Ecosystem
 * 
 * This is the Linked Medical Ecosystem mock database.
 * It simulates:
 *   - University Student Health Records (Patient side)
 *   - Pharmacy Staff & Shift Management (Admin side)
 *   - Vendor/Distributor Relations (B2B side)
 *   - Tax & Revenue Engine Data
 *   - Digital Prescription Wallet
 * 
 * All data follows HIPAA-compliant naming conventions.
 * Student IDs use format: STU-YYYY-XXXX
 * Prescription codes: RX-XXXXX
 */

// ============================================
// 1. USER ROLES & PERSONA SYSTEM
// ============================================

export type UserRole = 'CHEMIST_ADMIN' | 'STOREKEEPER';

export interface PlatformUser {
    _id: string;
    name: string;
    email: string;
    roles: UserRole[];
    activeRole: UserRole;
    /** Pharmacy-specific fields (for CHEMIST_ADMIN / STOREKEEPER) */
    shopName?: string;
    licenseNumber?: string;
    address?: string;
}

/**
 * Platform users with multi-role capabilities.
 */
export const platformUsers: PlatformUser[] = [
    {
        _id: 'usr_001',
        name: 'Vikram Mehta',
        email: 'vikram@medicare.com',
        roles: ['CHEMIST_ADMIN'],
        activeRole: 'CHEMIST_ADMIN',
        shopName: 'MediCare Pharmacy — SRM Campus',
        licenseNumber: 'TN-PH-2024-7891',
        address: 'Health Centre Block, SRM University, Kattankulathur',
    },
    {
        _id: 'usr_002',
        name: 'Arjun Nair',
        email: 'arjun.nair@medicare.com',
        roles: ['STOREKEEPER'],
        activeRole: 'STOREKEEPER',
        shopName: 'MediCare Pharmacy — SRM Campus',
        licenseNumber: 'TN-PH-2024-7892',
        address: 'Health Centre Block, SRM University',
    },
];

// ============================================
// 2. UNIVERSITY STUDENT HEALTH DATABASE (UHD)
// ============================================

export interface StudentHealthRecord {
    studentId: string;
    name: string;
    /** Privacy-masked name for HIPAA display: "P***a S." */
    maskedName: string;
    age: number;
    gender: 'M' | 'F' | 'Other';
    bloodGroup: string;
    department: string;
    hostel: string;
    allergies: string[];
    conditions: string[];
    insurancePlan: string;
    /** Whether the student's ID has been physically verified */
    idVerified: boolean;
    /** Past prescriptions from university clinic */
    prescriptionHistory: string[];
    lastVisit: string;
    emergencyContact: string;
}

export const studentHealthRecords: StudentHealthRecord[] = [
    {
        studentId: 'STU-2024-3312',
        name: 'Priya Singh',
        maskedName: 'P***a S.',
        age: 20,
        gender: 'F',
        bloodGroup: 'A+',
        department: 'Computer Science & Engineering',
        hostel: 'Nelson Mandela Hostel',
        allergies: ['Penicillin', 'Ibuprofen'],
        conditions: ['Mild Asthma'],
        insurancePlan: 'SRM Student Health Cover — Gold',
        idVerified: true,
        prescriptionHistory: ['RX-90021', 'RX-90034', 'RX-90078'],
        lastVisit: '2026-02-20T10:30:00Z',
        emergencyContact: '+91 87654 12345',
    },
    {
        studentId: 'STU-2024-1187',
        name: 'Rahul Sharma',
        maskedName: 'R***l S.',
        age: 21,
        gender: 'M',
        bloodGroup: 'O+',
        department: 'Mechanical Engineering',
        hostel: 'TP Ganesan Hostel',
        allergies: [],
        conditions: [],
        insurancePlan: 'SRM Student Health Cover — Silver',
        idVerified: true,
        prescriptionHistory: ['RX-90015'],
        lastVisit: '2026-02-25T09:00:00Z',
        emergencyContact: '+91 98765 11111',
    },
    {
        studentId: 'STU-2024-2290',
        name: 'Sneha Desai',
        maskedName: 'S***a D.',
        age: 19,
        gender: 'F',
        bloodGroup: 'B-',
        department: 'Biotechnology',
        hostel: 'Java Green Hostel',
        allergies: ['Aspirin'],
        conditions: ['Iron Deficiency Anemia'],
        insurancePlan: 'SRM Student Health Cover — Silver',
        idVerified: false,
        prescriptionHistory: ['RX-90042', 'RX-90055'],
        lastVisit: '2026-02-18T14:00:00Z',
        emergencyContact: '+91 76543 22222',
    },
    {
        studentId: 'STU-2025-0078',
        name: 'Amit Kumar',
        maskedName: 'A***t K.',
        age: 22,
        gender: 'M',
        bloodGroup: 'AB+',
        department: 'Electronics & Communication',
        hostel: 'University Men Hostel',
        allergies: ['Codeine'],
        conditions: ['Type 2 Diabetes (Well-controlled)'],
        insurancePlan: 'SRM Student Health Cover — Platinum',
        idVerified: true,
        prescriptionHistory: ['RX-90003', 'RX-90011', 'RX-90045', 'RX-90067'],
        lastVisit: '2026-02-24T16:45:00Z',
        emergencyContact: '+91 98765 33333',
    },
    {
        studentId: 'STU-2024-4456',
        name: 'Kavya Reddy',
        maskedName: 'K***a R.',
        age: 20,
        gender: 'F',
        bloodGroup: 'A-',
        department: 'Architecture',
        hostel: 'International Hostel',
        allergies: [],
        conditions: ['Seasonal Allergic Rhinitis'],
        insurancePlan: 'SRM Student Health Cover — Gold',
        idVerified: true,
        prescriptionHistory: ['RX-90088'],
        lastVisit: '2026-02-22T11:15:00Z',
        emergencyContact: '+91 65432 44444',
    },
    {
        studentId: 'STU-2023-0912',
        name: 'Rajesh Gupta',
        maskedName: 'R***h G.',
        age: 23,
        gender: 'M',
        bloodGroup: 'O-',
        department: 'Civil Engineering',
        hostel: 'Day Scholar',
        allergies: ['Metoclopramide'],
        conditions: [],
        insurancePlan: 'SRM Student Health Cover — Basic',
        idVerified: true,
        prescriptionHistory: ['RX-90002'],
        lastVisit: '2026-02-10T08:30:00Z',
        emergencyContact: '+91 54321 55555',
    },
];

// ============================================
// 3. DIGITAL PRESCRIPTION WALLET
// ============================================

export interface DigitalPrescription {
    rxCode: string;
    studentId: string;
    patientName: string;
    doctorName: string;
    doctorLicense: string;
    clinic: string;
    date: string;
    status: 'Active' | 'Fulfilled' | 'Expired';
    medicines: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        salt: string;
        /** Whether the medicine has been dispensed by a pharmacy */
        dispensed: boolean;
    }>;
    notes: string;
    /** Which pharmacy fulfilled this (if any) */
    fulfilledBy?: string;
    fulfilledAt?: string;
}

export const digitalPrescriptions: DigitalPrescription[] = [
    {
        rxCode: 'RX-90015',
        studentId: 'STU-2024-1187',
        patientName: 'Rahul Sharma',
        doctorName: 'Dr. Sameer Joshi',
        doctorLicense: 'MC-TN-45632',
        clinic: 'SRM University Health Centre',
        date: '2026-02-25T09:00:00Z',
        status: 'Active',
        medicines: [
            { name: 'Amoxicillin 500mg', dosage: '500mg', frequency: 'TDS (Three times a day)', duration: '7 days', salt: 'Amoxicillin Trihydrate', dispensed: false },
            { name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'SOS (When needed)', duration: '3 days', salt: 'Paracetamol', dispensed: false },
        ],
        notes: 'Upper respiratory tract infection. Complete the full antibiotic course. Return if fever persists beyond 48 hrs.',
    },
    {
        rxCode: 'RX-90021',
        studentId: 'STU-2024-3312',
        patientName: 'Priya Singh',
        doctorName: 'Dr. Ananya Ray',
        doctorLicense: 'MC-TN-78901',
        clinic: 'SRM University Health Centre',
        date: '2026-02-20T10:30:00Z',
        status: 'Fulfilled',
        medicines: [
            { name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'OD (Once daily)', duration: '14 days', salt: 'Cetirizine Hydrochloride', dispensed: true },
            { name: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'SOS', duration: 'As needed', salt: 'Salbutamol Sulphate', dispensed: true },
        ],
        notes: 'Asthma flare-up triggered by seasonal allergens. Avoid dusty environments. Follow-up in 2 weeks.',
        fulfilledBy: 'MediCare Pharmacy — SRM Campus',
        fulfilledAt: '2026-02-20T11:15:00Z',
    },
    {
        rxCode: 'RX-90042',
        studentId: 'STU-2024-2290',
        patientName: 'Sneha Desai',
        doctorName: 'Dr. Ravi Menon',
        doctorLicense: 'MC-TN-34567',
        clinic: 'SRM University Health Centre',
        date: '2026-02-18T14:00:00Z',
        status: 'Fulfilled',
        medicines: [
            { name: 'Ferrous Sulphate 200mg', dosage: '200mg', frequency: 'BD (Twice daily)', duration: '30 days', salt: 'Ferrous Sulphate', dispensed: true },
            { name: 'Vitamin C 500mg', dosage: '500mg', frequency: 'OD', duration: '30 days', salt: 'Ascorbic Acid', dispensed: true },
        ],
        notes: 'Iron deficiency anemia. Take iron supplements with orange juice for better absorption. Avoid with tea/coffee.',
        fulfilledBy: 'MediCare Pharmacy — SRM Campus',
        fulfilledAt: '2026-02-18T15:00:00Z',
    },
    {
        rxCode: 'RX-90067',
        studentId: 'STU-2025-0078',
        patientName: 'Amit Kumar',
        doctorName: 'Dr. Sameer Joshi',
        doctorLicense: 'MC-TN-45632',
        clinic: 'SRM University Health Centre',
        date: '2026-02-24T16:45:00Z',
        status: 'Active',
        medicines: [
            { name: 'Metformin 500mg', dosage: '500mg', frequency: 'BD (Twice daily)', duration: '30 days', salt: 'Metformin Hydrochloride', dispensed: false },
            { name: 'Glimepiride 1mg', dosage: '1mg', frequency: 'OD (Before breakfast)', duration: '30 days', salt: 'Glimepiride', dispensed: false },
        ],
        notes: 'Diabetes management refill. Monitor HbA1c every 3 months. Report any hypoglycemic symptoms immediately.',
    },
    {
        rxCode: 'RX-90088',
        studentId: 'STU-2024-4456',
        patientName: 'Kavya Reddy',
        doctorName: 'Dr. Ananya Ray',
        doctorLicense: 'MC-TN-78901',
        clinic: 'SRM University Health Centre',
        date: '2026-02-22T11:15:00Z',
        status: 'Active',
        medicines: [
            { name: 'Montelukast 10mg', dosage: '10mg', frequency: 'OD (At bedtime)', duration: '30 days', salt: 'Montelukast Sodium', dispensed: false },
            { name: 'Fluticasone Nasal Spray', dosage: '50mcg', frequency: 'BD', duration: '30 days', salt: 'Fluticasone Propionate', dispensed: false },
        ],
        notes: 'Persistent allergic rhinitis affecting academic performance. Use nasal spray 15 min before outdoor exposure.',
    },
];

// ============================================
// 4. PHARMACY STAFF & SHIFT MANAGEMENT
// ============================================

export interface StaffMember {
    _id: string;
    name: string;
    role: 'Pharmacist' | 'Technician' | 'Intern' | 'Cashier';
    tillAssignment: string;
    shiftStart: string;
    shiftEnd: string;
    status: 'On Duty' | 'On Break' | 'Off Duty';
    salesAccuracy: number;
    transactionsToday: number;
    avatar: string;
}

export const pharmacyStaff: StaffMember[] = [
    {
        _id: 'staff_001',
        name: 'Arjun Nair',
        role: 'Pharmacist',
        tillAssignment: 'Till 1',
        shiftStart: '2026-02-25T09:00:00+05:30',
        shiftEnd: '2026-02-25T17:00:00+05:30',
        status: 'On Duty',
        salesAccuracy: 98.5,
        transactionsToday: 34,
        avatar: 'AN',
    },
    {
        _id: 'staff_002',
        name: 'Meera Krishnan',
        role: 'Pharmacist',
        tillAssignment: 'Till 2',
        shiftStart: '2026-02-25T13:00:00+05:30',
        shiftEnd: '2026-02-25T21:00:00+05:30',
        status: 'On Duty',
        salesAccuracy: 97.2,
        transactionsToday: 18,
        avatar: 'MK',
    },
    {
        _id: 'staff_003',
        name: 'Rohan Das',
        role: 'Technician',
        tillAssignment: 'Stock Room',
        shiftStart: '2026-02-25T08:00:00+05:30',
        shiftEnd: '2026-02-25T16:00:00+05:30',
        status: 'On Break',
        salesAccuracy: 0,
        transactionsToday: 0,
        avatar: 'RD',
    },
    {
        _id: 'staff_004',
        name: 'Anita Sharma',
        role: 'Intern',
        tillAssignment: 'Counter Assist',
        shiftStart: '2026-02-25T10:00:00+05:30',
        shiftEnd: '2026-02-25T18:00:00+05:30',
        status: 'On Duty',
        salesAccuracy: 94.8,
        transactionsToday: 12,
        avatar: 'AS',
    },
];

// ============================================
// 5. VENDOR / DISTRIBUTOR DATABASE (B2B)
// ============================================

export interface Vendor {
    _id: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    gstIn: string;
    reliability: 'Excellent' | 'Good' | 'Average' | 'Poor';
    avgDeliveryDays: number;
    outstandingAmount: number;
    lastOrderDate: string;
    categories: string[];
}

export const vendors: Vendor[] = [
    {
        _id: 'vnd_001',
        name: 'Cipla Ltd.',
        contactPerson: 'Rajiv Kapoor',
        phone: '+91 22 2482 6000',
        email: 'orders@cipla.com',
        gstIn: '27AAACH1234F1ZV',
        reliability: 'Excellent',
        avgDeliveryDays: 2,
        outstandingAmount: 14500,
        lastOrderDate: '2026-02-23T10:00:00Z',
        categories: ['Antibiotics', 'Respiratory', 'Pain Relief'],
    },
    {
        _id: 'vnd_002',
        name: 'Sun Pharmaceutical',
        contactPerson: 'Neha Gupta',
        phone: '+91 22 4324 4324',
        email: 'supply@sunpharma.com',
        gstIn: '27AABCS1234G1ZX',
        reliability: 'Good',
        avgDeliveryDays: 3,
        outstandingAmount: 8200,
        lastOrderDate: '2026-02-21T14:30:00Z',
        categories: ['Diabetes', 'Cardiology', 'Dermatology'],
    },
    {
        _id: 'vnd_003',
        name: 'GSK India',
        contactPerson: 'Amit Verma',
        phone: '+91 80 2505 4500',
        email: 'pharma.orders@gsk.com',
        gstIn: '29AABCG1234H1ZW',
        reliability: 'Excellent',
        avgDeliveryDays: 2,
        outstandingAmount: 0,
        lastOrderDate: '2026-02-20T09:00:00Z',
        categories: ['Pain Relief', 'Vitamins', 'Vaccines'],
    },
    {
        _id: 'vnd_004',
        name: 'Lupin Limited',
        contactPerson: 'Suresh Patel',
        phone: '+91 22 6640 2323',
        email: 'distribution@lupin.com',
        gstIn: '27AAACL1234I1ZY',
        reliability: 'Good',
        avgDeliveryDays: 4,
        outstandingAmount: 22000,
        lastOrderDate: '2026-02-19T16:00:00Z',
        categories: ['Cardiology', 'Neurology', 'Diabetes'],
    },
    {
        _id: 'vnd_005',
        name: 'Abbott India',
        contactPerson: 'Kavitha Menon',
        phone: '+91 22 6797 0100',
        email: 'orders.in@abbott.com',
        gstIn: '27AAACA1234J1ZZ',
        reliability: 'Average',
        avgDeliveryDays: 5,
        outstandingAmount: 5800,
        lastOrderDate: '2026-02-17T11:30:00Z',
        categories: ['Pain Relief', 'GI', 'Nutrition'],
    },
];

// ============================================
// 6. TAX & REVENUE ENGINE
// ============================================

export interface DailyRevenue {
    date: string;
    totalSales: number;
    totalOrders: number;
    gstCollected: number;
    discountsGiven: number;
    insuranceClaims: number;
    studentSubsidy: number;
    netRevenue: number;
    peakHour: string;
    topSellingMedicine: string;
}

export const dailyRevenueData: DailyRevenue[] = [
    {
        date: '2026-02-25',
        totalSales: 28450,
        totalOrders: 67,
        gstCollected: 3414,
        discountsGiven: 1200,
        insuranceClaims: 4500,
        studentSubsidy: 2100,
        netRevenue: 23236,
        peakHour: '11:00 AM — 1:00 PM',
        topSellingMedicine: 'Paracetamol 650mg',
    },
    {
        date: '2026-02-24',
        totalSales: 32100,
        totalOrders: 78,
        gstCollected: 3852,
        discountsGiven: 900,
        insuranceClaims: 5200,
        studentSubsidy: 2800,
        netRevenue: 26548,
        peakHour: '10:00 AM — 12:00 PM',
        topSellingMedicine: 'Amoxicillin 500mg',
    },
    {
        date: '2026-02-23',
        totalSales: 19800,
        totalOrders: 45,
        gstCollected: 2376,
        discountsGiven: 600,
        insuranceClaims: 3100,
        studentSubsidy: 1500,
        netRevenue: 16524,
        peakHour: '2:00 PM — 4:00 PM',
        topSellingMedicine: 'Cetirizine 10mg',
    },
    {
        date: '2026-02-22',
        totalSales: 25600,
        totalOrders: 58,
        gstCollected: 3072,
        discountsGiven: 1100,
        insuranceClaims: 3800,
        studentSubsidy: 1900,
        netRevenue: 21528,
        peakHour: '11:00 AM — 1:00 PM',
        topSellingMedicine: 'Metformin 500mg',
    },
    {
        date: '2026-02-21',
        totalSales: 22300,
        totalOrders: 52,
        gstCollected: 2676,
        discountsGiven: 800,
        insuranceClaims: 4100,
        studentSubsidy: 2200,
        netRevenue: 18424,
        peakHour: '3:00 PM — 5:00 PM',
        topSellingMedicine: 'Ibuprofen 400mg',
    },
    {
        date: '2026-02-20',
        totalSales: 30200,
        totalOrders: 71,
        gstCollected: 3624,
        discountsGiven: 1400,
        insuranceClaims: 5600,
        studentSubsidy: 3000,
        netRevenue: 24176,
        peakHour: '10:00 AM — 12:00 PM',
        topSellingMedicine: 'Montelukast 10mg',
    },
    {
        date: '2026-02-19',
        totalSales: 18900,
        totalOrders: 42,
        gstCollected: 2268,
        discountsGiven: 500,
        insuranceClaims: 2800,
        studentSubsidy: 1200,
        netRevenue: 16132,
        peakHour: '11:00 AM — 1:00 PM',
        topSellingMedicine: 'Atorvastatin 10mg',
    },
];

// ============================================
// 7. EXPANDED INVENTORY (University Stock)
// ============================================

export interface UniversityInventoryItem {
    _id: string;
    name: string;
    barcode: string;
    category: string;
    salt: string;
    stock: number;
    reorderLevel: number;
    price: number;
    mrp: number;
    gstRate: number;
    expiryDate: string;
    manufacturer: string;
    vendorId: string;
    shelf: string;
    batchNo: string;
    schedule: 'OTC' | 'H' | 'H1' | 'X';
    /** Number of times sold this month */
    monthlySales: number;
}

export const universityInventory: UniversityInventoryItem[] = [
    {
        _id: 'uinv_001', name: 'Amoxicillin 500mg', barcode: '8901234567001',
        category: 'Antibiotics', salt: 'Amoxicillin Trihydrate',
        stock: 250, reorderLevel: 50, price: 7.14, mrp: 8.50, gstRate: 12,
        expiryDate: '2027-06-15', manufacturer: 'Cipla', vendorId: 'vnd_001',
        shelf: 'A-2', batchNo: 'BN-AMX-2026-06', schedule: 'H', monthlySales: 120,
    },
    {
        _id: 'uinv_002', name: 'Paracetamol 650mg', barcode: '8901234567002',
        category: 'Pain Relief', salt: 'Paracetamol',
        stock: 500, reorderLevel: 100, price: 5.00, mrp: 6.00, gstRate: 12,
        expiryDate: '2027-12-01', manufacturer: 'GSK', vendorId: 'vnd_003',
        shelf: 'B-1', batchNo: 'BN-PCM-2026-12', schedule: 'OTC', monthlySales: 340,
    },
    {
        _id: 'uinv_003', name: 'Metformin 500mg', barcode: '8901234567003',
        category: 'Diabetes', salt: 'Metformin Hydrochloride',
        stock: 180, reorderLevel: 60, price: 2.00, mrp: 3.50, gstRate: 5,
        expiryDate: '2027-08-20', manufacturer: 'Sun Pharma', vendorId: 'vnd_002',
        shelf: 'C-3', batchNo: 'BN-MET-2026-08', schedule: 'H', monthlySales: 95,
    },
    {
        _id: 'uinv_004', name: 'Atorvastatin 10mg', barcode: '8901234567004',
        category: 'Cardiology', salt: 'Atorvastatin Calcium',
        stock: 12, reorderLevel: 40, price: 6.67, mrp: 8.00, gstRate: 12,
        expiryDate: '2027-04-10', manufacturer: 'Lupin Limited', vendorId: 'vnd_004',
        shelf: 'C-1', batchNo: 'BN-ATR-2026-04', schedule: 'H', monthlySales: 45,
    },
    {
        _id: 'uinv_005', name: 'Ibuprofen 400mg', barcode: '8901234567005',
        category: 'Pain Relief', salt: 'Ibuprofen',
        stock: 120, reorderLevel: 30, price: 4.50, mrp: 5.50, gstRate: 12,
        expiryDate: '2027-09-12', manufacturer: 'Abbott', vendorId: 'vnd_005',
        shelf: 'B-2', batchNo: 'BN-IBU-2026-09', schedule: 'OTC', monthlySales: 180,
    },
    {
        _id: 'uinv_006', name: 'Cetirizine 10mg', barcode: '8901234567006',
        category: 'Antihistamine', salt: 'Cetirizine Hydrochloride',
        stock: 300, reorderLevel: 80, price: 2.50, mrp: 4.00, gstRate: 12,
        expiryDate: '2027-11-30', manufacturer: 'Cipla', vendorId: 'vnd_001',
        shelf: 'A-3', batchNo: 'BN-CET-2026-11', schedule: 'OTC', monthlySales: 275,
    },
    {
        _id: 'uinv_007', name: 'Montelukast 10mg', barcode: '8901234567007',
        category: 'Respiratory', salt: 'Montelukast Sodium',
        stock: 90, reorderLevel: 25, price: 8.00, mrp: 10.00, gstRate: 12,
        expiryDate: '2027-07-20', manufacturer: 'Sun Pharma', vendorId: 'vnd_002',
        shelf: 'A-4', batchNo: 'BN-MNK-2026-07', schedule: 'H', monthlySales: 55,
    },
    {
        _id: 'uinv_008', name: 'Ferrous Sulphate 200mg', barcode: '8901234567008',
        category: 'Supplements', salt: 'Ferrous Sulphate',
        stock: 200, reorderLevel: 50, price: 3.00, mrp: 4.50, gstRate: 5,
        expiryDate: '2027-10-15', manufacturer: 'GSK', vendorId: 'vnd_003',
        shelf: 'D-1', batchNo: 'BN-FES-2026-10', schedule: 'OTC', monthlySales: 150,
    },
    {
        _id: 'uinv_009', name: 'Salbutamol Inhaler 100mcg', barcode: '8901234567009',
        category: 'Respiratory', salt: 'Salbutamol Sulphate',
        stock: 35, reorderLevel: 15, price: 95.00, mrp: 120.00, gstRate: 12,
        expiryDate: '2027-05-01', manufacturer: 'Cipla', vendorId: 'vnd_001',
        shelf: 'E-1', batchNo: 'BN-SAL-2026-05', schedule: 'H', monthlySales: 22,
    },
    {
        _id: 'uinv_010', name: 'Fluticasone Nasal Spray', barcode: '8901234567010',
        category: 'Respiratory', salt: 'Fluticasone Propionate',
        stock: 8, reorderLevel: 10, price: 145.00, mrp: 180.00, gstRate: 12,
        expiryDate: '2026-08-30', manufacturer: 'GSK', vendorId: 'vnd_003',
        shelf: 'E-2', batchNo: 'BN-FLU-2026-08', schedule: 'H', monthlySales: 12,
    },
    {
        _id: 'uinv_011', name: 'Glimepiride 1mg', barcode: '8901234567011',
        category: 'Diabetes', salt: 'Glimepiride',
        stock: 60, reorderLevel: 20, price: 4.20, mrp: 5.80, gstRate: 5,
        expiryDate: '2027-09-01', manufacturer: 'Sun Pharma', vendorId: 'vnd_002',
        shelf: 'C-4', batchNo: 'BN-GLM-2026-09', schedule: 'H', monthlySales: 38,
    },
    {
        _id: 'uinv_012', name: 'Vitamin C 500mg', barcode: '8901234567012',
        category: 'Supplements', salt: 'Ascorbic Acid',
        stock: 400, reorderLevel: 100, price: 2.00, mrp: 3.00, gstRate: 5,
        expiryDate: '2028-01-15', manufacturer: 'Abbott', vendorId: 'vnd_005',
        shelf: 'D-2', batchNo: 'BN-VTC-2028-01', schedule: 'OTC', monthlySales: 220,
    },
    {
        _id: 'uinv_013', name: 'Aspirin 75mg', barcode: '8901234567013',
        category: 'Cardiology', salt: 'Acetylsalicylic Acid',
        stock: 3, reorderLevel: 30, price: 2.67, mrp: 3.50, gstRate: 12,
        expiryDate: '2026-04-01', manufacturer: 'Abbott', vendorId: 'vnd_005',
        shelf: 'C-2', batchNo: 'BN-ASP-2026-04', schedule: 'OTC', monthlySales: 65,
    },
    {
        _id: 'uinv_014', name: 'ORS Sachets (Electral)', barcode: '8901234567014',
        category: 'GI', salt: 'Oral Rehydration Salts',
        stock: 350, reorderLevel: 80, price: 18.00, mrp: 22.00, gstRate: 5,
        expiryDate: '2027-12-30', manufacturer: 'Abbott', vendorId: 'vnd_005',
        shelf: 'B-3', batchNo: 'BN-ORS-2027-12', schedule: 'OTC', monthlySales: 310,
    },
    {
        _id: 'uinv_015', name: 'Azithromycin 250mg', barcode: '8901234567015',
        category: 'Antibiotics', salt: 'Azithromycin Dihydrate',
        stock: 75, reorderLevel: 20, price: 12.00, mrp: 15.00, gstRate: 12,
        expiryDate: '2027-06-30', manufacturer: 'Cipla', vendorId: 'vnd_001',
        shelf: 'A-5', batchNo: 'BN-AZM-2027-06', schedule: 'H1', monthlySales: 42,
    },
];

// ============================================
// 8. B2B PURCHASE ORDERS (INWARD)
// ============================================

export interface PurchaseOrder {
    _id: string;
    vendorId: string;
    vendorName: string;
    orderDate: string;
    expectedDelivery: string;
    status: 'Ordered' | 'In Transit' | 'Delivered' | 'Partially Delivered';
    items: Array<{
        name: string;
        quantity: number;
        unitCost: number;
        totalCost: number;
    }>;
    totalAmount: number;
    gstAmount: number;
    invoiceNo: string;
}

export const purchaseOrders: PurchaseOrder[] = [
    {
        _id: 'po_001',
        vendorId: 'vnd_001',
        vendorName: 'Cipla Ltd.',
        orderDate: '2026-02-23T10:00:00Z',
        expectedDelivery: '2026-02-25T18:00:00Z',
        status: 'In Transit',
        items: [
            { name: 'Amoxicillin 500mg', quantity: 500, unitCost: 5.50, totalCost: 2750 },
            { name: 'Azithromycin 250mg', quantity: 200, unitCost: 9.00, totalCost: 1800 },
            { name: 'Cetirizine 10mg', quantity: 300, unitCost: 1.80, totalCost: 540 },
        ],
        totalAmount: 5090,
        gstAmount: 610.8,
        invoiceNo: 'CIPLA-INV-2026-4521',
    },
    {
        _id: 'po_002',
        vendorId: 'vnd_002',
        vendorName: 'Sun Pharmaceutical',
        orderDate: '2026-02-21T14:30:00Z',
        expectedDelivery: '2026-02-24T12:00:00Z',
        status: 'Delivered',
        items: [
            { name: 'Metformin 500mg', quantity: 400, unitCost: 1.50, totalCost: 600 },
            { name: 'Glimepiride 1mg', quantity: 100, unitCost: 3.20, totalCost: 320 },
        ],
        totalAmount: 920,
        gstAmount: 46,
        invoiceNo: 'SUN-INV-2026-8934',
    },
    {
        _id: 'po_003',
        vendorId: 'vnd_005',
        vendorName: 'Abbott India',
        orderDate: '2026-02-24T09:00:00Z',
        expectedDelivery: '2026-02-28T10:00:00Z',
        status: 'Ordered',
        items: [
            { name: 'Aspirin 75mg', quantity: 300, unitCost: 2.00, totalCost: 600 },
            { name: 'ORS Sachets (Electral)', quantity: 500, unitCost: 14.00, totalCost: 7000 },
            { name: 'Vitamin C 500mg', quantity: 400, unitCost: 1.50, totalCost: 600 },
        ],
        totalAmount: 8200,
        gstAmount: 492,
        invoiceNo: 'ABT-INV-2026-1122',
    },
];

// ============================================
// 9. HELPER: BARCODE → PRODUCT LOOKUP
// ============================================

export const barcodeLookup: Record<string, string> = {};
universityInventory.forEach(item => {
    barcodeLookup[item.barcode] = item._id;
});

// ============================================
// 10. HELPER: STUDENT LOOKUP BY ID
// ============================================

export function lookupStudent(studentId: string): StudentHealthRecord | undefined {
    return studentHealthRecords.find(s => s.studentId === studentId);
}

export function lookupPrescription(rxCode: string): DigitalPrescription | undefined {
    return digitalPrescriptions.find(rx => rx.rxCode === rxCode);
}

export function getStudentPrescriptions(studentId: string): DigitalPrescription[] {
    return digitalPrescriptions.filter(rx => rx.studentId === studentId);
}

export function getActivePrescriptions(): DigitalPrescription[] {
    return digitalPrescriptions.filter(rx => rx.status === 'Active');
}

export function getStaffOnDuty(): StaffMember[] {
    return pharmacyStaff.filter(s => s.status === 'On Duty');
}

export function getInventoryByBarcode(barcode: string): UniversityInventoryItem | undefined {
    return universityInventory.find(i => i.barcode === barcode);
}

export function getLowStockItems(): UniversityInventoryItem[] {
    return universityInventory.filter(i => i.stock <= i.reorderLevel);
}

export function getExpiringItems(daysThreshold: number = 90): UniversityInventoryItem[] {
    const threshold = Date.now() + daysThreshold * 24 * 60 * 60 * 1000;
    return universityInventory.filter(i => {
        const exp = new Date(i.expiryDate).getTime();
        return exp > Date.now() && exp < threshold;
    });
}
// ============================================
// 11. LEGACY / SHARED MOCK DATA
// ============================================

export const dummyOrders = [
    {
        _id: 'ord_001',
        patientName: 'Rahul Sharma',
        patientPrn: 'PRN-1001',
        orderDate: new Date(Date.now() - 3600000).toISOString(),
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
        orderDate: new Date(Date.now() - 7200000).toISOString(),
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

export const dummyQueue = [
    { _id: 'q_001', patientName: 'Rahul Sharma', patientPrn: 'PRN-1001', arrivedAt: new Date(Date.now() - 720000).toISOString(), status: 'verifying', itemCount: 2 },
    { _id: 'q_002', patientName: 'Sneha Desai', patientPrn: 'PRN-1004', arrivedAt: new Date(Date.now() - 300000).toISOString(), status: 'waiting', itemCount: 1 },
    { _id: 'q_003', patientName: 'Rajesh Gupta', patientPrn: 'PRN-1005', arrivedAt: new Date(Date.now() - 120000).toISOString(), status: 'waiting', itemCount: 1 },
];

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
