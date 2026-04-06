(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/pharmamate/lib/mock/platform-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ // ============================================
// 1. USER ROLES & PERSONA SYSTEM
// ============================================
__turbopack_context__.s([
    "aiAssistantKnowledge",
    ()=>aiAssistantKnowledge,
    "barcodeLookup",
    ()=>barcodeLookup,
    "dailyRevenueData",
    ()=>dailyRevenueData,
    "digitalPrescriptions",
    ()=>digitalPrescriptions,
    "dummyOrders",
    ()=>dummyOrders,
    "dummyQueue",
    ()=>dummyQueue,
    "getActivePrescriptions",
    ()=>getActivePrescriptions,
    "getExpiringItems",
    ()=>getExpiringItems,
    "getInventoryByBarcode",
    ()=>getInventoryByBarcode,
    "getLowStockItems",
    ()=>getLowStockItems,
    "getStaffOnDuty",
    ()=>getStaffOnDuty,
    "getStudentPrescriptions",
    ()=>getStudentPrescriptions,
    "lookupPrescription",
    ()=>lookupPrescription,
    "lookupStudent",
    ()=>lookupStudent,
    "pharmacyStaff",
    ()=>pharmacyStaff,
    "platformUsers",
    ()=>platformUsers,
    "purchaseOrders",
    ()=>purchaseOrders,
    "studentHealthRecords",
    ()=>studentHealthRecords,
    "universityInventory",
    ()=>universityInventory,
    "vendors",
    ()=>vendors
]);
const platformUsers = [
    {
        _id: 'usr_001',
        name: 'Vikram Mehta',
        email: 'vikram@medicare.com',
        roles: [
            'CHEMIST_ADMIN',
            'STOREKEEPER'
        ],
        activeRole: 'CHEMIST_ADMIN',
        shopName: 'MediCare Pharmacy — SRM Campus',
        licenseNumber: 'TN-PH-2024-7891',
        address: 'Health Centre Block, SRM University, Kattankulathur'
    },
    {
        _id: 'usr_002',
        name: 'Arjun Nair',
        email: 'arjun.nair@medicare.com',
        roles: [
            'STOREKEEPER'
        ],
        activeRole: 'STOREKEEPER',
        shopName: 'MediCare Pharmacy — SRM Campus',
        licenseNumber: 'TN-PH-2024-7892',
        address: 'Health Centre Block, SRM University'
    }
];
const studentHealthRecords = [
    {
        studentId: 'STU-2024-3312',
        name: 'Priya Singh',
        maskedName: 'P***a S.',
        age: 20,
        gender: 'F',
        bloodGroup: 'A+',
        department: 'Computer Science & Engineering',
        hostel: 'Nelson Mandela Hostel',
        allergies: [
            'Penicillin',
            'Ibuprofen'
        ],
        conditions: [
            'Mild Asthma'
        ],
        insurancePlan: 'SRM Student Health Cover — Gold',
        idVerified: true,
        prescriptionHistory: [
            'RX-90021',
            'RX-90034',
            'RX-90078'
        ],
        lastVisit: '2026-02-20T10:30:00Z',
        emergencyContact: '+91 87654 12345'
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
        prescriptionHistory: [
            'RX-90015'
        ],
        lastVisit: '2026-02-25T09:00:00Z',
        emergencyContact: '+91 98765 11111'
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
        allergies: [
            'Aspirin'
        ],
        conditions: [
            'Iron Deficiency Anemia'
        ],
        insurancePlan: 'SRM Student Health Cover — Silver',
        idVerified: false,
        prescriptionHistory: [
            'RX-90042',
            'RX-90055'
        ],
        lastVisit: '2026-02-18T14:00:00Z',
        emergencyContact: '+91 76543 22222'
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
        allergies: [
            'Codeine'
        ],
        conditions: [
            'Type 2 Diabetes (Well-controlled)'
        ],
        insurancePlan: 'SRM Student Health Cover — Platinum',
        idVerified: true,
        prescriptionHistory: [
            'RX-90003',
            'RX-90011',
            'RX-90045',
            'RX-90067'
        ],
        lastVisit: '2026-02-24T16:45:00Z',
        emergencyContact: '+91 98765 33333'
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
        conditions: [
            'Seasonal Allergic Rhinitis'
        ],
        insurancePlan: 'SRM Student Health Cover — Gold',
        idVerified: true,
        prescriptionHistory: [
            'RX-90088'
        ],
        lastVisit: '2026-02-22T11:15:00Z',
        emergencyContact: '+91 65432 44444'
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
        allergies: [
            'Metoclopramide'
        ],
        conditions: [],
        insurancePlan: 'SRM Student Health Cover — Basic',
        idVerified: true,
        prescriptionHistory: [
            'RX-90002'
        ],
        lastVisit: '2026-02-10T08:30:00Z',
        emergencyContact: '+91 54321 55555'
    }
];
const digitalPrescriptions = [
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
            {
                name: 'Amoxicillin 500mg',
                dosage: '500mg',
                frequency: 'TDS (Three times a day)',
                duration: '7 days',
                salt: 'Amoxicillin Trihydrate',
                dispensed: false
            },
            {
                name: 'Paracetamol 650mg',
                dosage: '650mg',
                frequency: 'SOS (When needed)',
                duration: '3 days',
                salt: 'Paracetamol',
                dispensed: false
            }
        ],
        notes: 'Upper respiratory tract infection. Complete the full antibiotic course. Return if fever persists beyond 48 hrs.'
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
            {
                name: 'Cetirizine 10mg',
                dosage: '10mg',
                frequency: 'OD (Once daily)',
                duration: '14 days',
                salt: 'Cetirizine Hydrochloride',
                dispensed: true
            },
            {
                name: 'Salbutamol Inhaler',
                dosage: '100mcg',
                frequency: 'SOS',
                duration: 'As needed',
                salt: 'Salbutamol Sulphate',
                dispensed: true
            }
        ],
        notes: 'Asthma flare-up triggered by seasonal allergens. Avoid dusty environments. Follow-up in 2 weeks.',
        fulfilledBy: 'MediCare Pharmacy — SRM Campus',
        fulfilledAt: '2026-02-20T11:15:00Z'
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
            {
                name: 'Ferrous Sulphate 200mg',
                dosage: '200mg',
                frequency: 'BD (Twice daily)',
                duration: '30 days',
                salt: 'Ferrous Sulphate',
                dispensed: true
            },
            {
                name: 'Vitamin C 500mg',
                dosage: '500mg',
                frequency: 'OD',
                duration: '30 days',
                salt: 'Ascorbic Acid',
                dispensed: true
            }
        ],
        notes: 'Iron deficiency anemia. Take iron supplements with orange juice for better absorption. Avoid with tea/coffee.',
        fulfilledBy: 'MediCare Pharmacy — SRM Campus',
        fulfilledAt: '2026-02-18T15:00:00Z'
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
            {
                name: 'Metformin 500mg',
                dosage: '500mg',
                frequency: 'BD (Twice daily)',
                duration: '30 days',
                salt: 'Metformin Hydrochloride',
                dispensed: false
            },
            {
                name: 'Glimepiride 1mg',
                dosage: '1mg',
                frequency: 'OD (Before breakfast)',
                duration: '30 days',
                salt: 'Glimepiride',
                dispensed: false
            }
        ],
        notes: 'Diabetes management refill. Monitor HbA1c every 3 months. Report any hypoglycemic symptoms immediately.'
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
            {
                name: 'Montelukast 10mg',
                dosage: '10mg',
                frequency: 'OD (At bedtime)',
                duration: '30 days',
                salt: 'Montelukast Sodium',
                dispensed: false
            },
            {
                name: 'Fluticasone Nasal Spray',
                dosage: '50mcg',
                frequency: 'BD',
                duration: '30 days',
                salt: 'Fluticasone Propionate',
                dispensed: false
            }
        ],
        notes: 'Persistent allergic rhinitis affecting academic performance. Use nasal spray 15 min before outdoor exposure.'
    }
];
const pharmacyStaff = [
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
        avatar: 'AN'
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
        avatar: 'MK'
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
        avatar: 'RD'
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
        avatar: 'AS'
    }
];
const vendors = [
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
        categories: [
            'Antibiotics',
            'Respiratory',
            'Pain Relief'
        ]
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
        categories: [
            'Diabetes',
            'Cardiology',
            'Dermatology'
        ]
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
        categories: [
            'Pain Relief',
            'Vitamins',
            'Vaccines'
        ]
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
        categories: [
            'Cardiology',
            'Neurology',
            'Diabetes'
        ]
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
        categories: [
            'Pain Relief',
            'GI',
            'Nutrition'
        ]
    }
];
const dailyRevenueData = [
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
        topSellingMedicine: 'Paracetamol 650mg'
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
        topSellingMedicine: 'Amoxicillin 500mg'
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
        topSellingMedicine: 'Cetirizine 10mg'
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
        topSellingMedicine: 'Metformin 500mg'
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
        topSellingMedicine: 'Ibuprofen 400mg'
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
        topSellingMedicine: 'Montelukast 10mg'
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
        topSellingMedicine: 'Atorvastatin 10mg'
    }
];
const universityInventory = [
    {
        _id: 'uinv_001',
        name: 'Amoxicillin 500mg',
        barcode: '8901234567001',
        category: 'Antibiotics',
        salt: 'Amoxicillin Trihydrate',
        stock: 250,
        reorderLevel: 50,
        price: 7.14,
        mrp: 8.50,
        gstRate: 12,
        expiryDate: '2027-06-15',
        manufacturer: 'Cipla',
        vendorId: 'vnd_001',
        shelf: 'A-2',
        batchNo: 'BN-AMX-2026-06',
        schedule: 'H',
        hsnCode: '3004',
        monthlySales: 120
    },
    {
        _id: 'uinv_002',
        name: 'Paracetamol 650mg',
        barcode: '8901234567002',
        category: 'Pain Relief',
        salt: 'Paracetamol',
        stock: 500,
        reorderLevel: 100,
        price: 5.00,
        mrp: 6.00,
        gstRate: 12,
        expiryDate: '2027-12-01',
        manufacturer: 'GSK',
        vendorId: 'vnd_003',
        shelf: 'B-1',
        batchNo: 'BN-PCM-2026-12',
        schedule: 'OTC',
        hsnCode: '3004',
        monthlySales: 340
    },
    {
        _id: 'uinv_003',
        name: 'Metformin 500mg',
        barcode: '8901234567003',
        category: 'Diabetes',
        salt: 'Metformin Hydrochloride',
        stock: 180,
        reorderLevel: 60,
        price: 2.00,
        mrp: 3.50,
        gstRate: 5,
        expiryDate: '2027-08-20',
        manufacturer: 'Sun Pharma',
        vendorId: 'vnd_002',
        shelf: 'C-3',
        batchNo: 'BN-MET-2026-08',
        schedule: 'H',
        hsnCode: '3004',
        monthlySales: 95
    },
    {
        _id: 'uinv_004',
        name: 'Atorvastatin 10mg',
        barcode: '8901234567004',
        category: 'Cardiology',
        salt: 'Atorvastatin Calcium',
        stock: 12,
        reorderLevel: 40,
        price: 6.67,
        mrp: 8.00,
        gstRate: 12,
        expiryDate: '2027-04-10',
        manufacturer: 'Lupin Limited',
        vendorId: 'vnd_004',
        shelf: 'C-1',
        batchNo: 'BN-ATR-2026-04',
        schedule: 'H',
        hsnCode: '3004',
        monthlySales: 45
    },
    {
        _id: 'uinv_005',
        name: 'Ibuprofen 400mg',
        barcode: '8901234567005',
        category: 'Pain Relief',
        salt: 'Ibuprofen',
        stock: 120,
        reorderLevel: 30,
        price: 4.50,
        mrp: 5.50,
        gstRate: 12,
        expiryDate: '2027-09-12',
        manufacturer: 'Abbott',
        vendorId: 'vnd_005',
        shelf: 'B-2',
        batchNo: 'BN-IBU-2026-09',
        schedule: 'OTC',
        hsnCode: '3004',
        monthlySales: 180
    },
    {
        _id: 'uinv_006',
        name: 'Cetirizine 10mg',
        barcode: '8901234567006',
        category: 'Antihistamine',
        salt: 'Cetirizine Hydrochloride',
        stock: 300,
        reorderLevel: 80,
        price: 2.50,
        mrp: 4.00,
        gstRate: 12,
        expiryDate: '2027-11-30',
        manufacturer: 'Cipla',
        vendorId: 'vnd_001',
        shelf: 'A-3',
        batchNo: 'BN-CET-2026-11',
        schedule: 'OTC',
        hsnCode: '3004',
        monthlySales: 275
    },
    {
        _id: 'uinv_007',
        name: 'Montelukast 10mg',
        barcode: '8901234567007',
        category: 'Respiratory',
        salt: 'Montelukast Sodium',
        stock: 90,
        reorderLevel: 25,
        price: 8.00,
        mrp: 10.00,
        gstRate: 12,
        expiryDate: '2027-07-20',
        manufacturer: 'Sun Pharma',
        vendorId: 'vnd_002',
        shelf: 'A-4',
        batchNo: 'BN-MNK-2026-07',
        schedule: 'H',
        hsnCode: '3004',
        monthlySales: 55
    },
    {
        _id: 'uinv_008',
        name: 'Ferrous Sulphate 200mg',
        barcode: '8901234567008',
        category: 'Supplements',
        salt: 'Ferrous Sulphate',
        stock: 200,
        reorderLevel: 50,
        price: 3.00,
        mrp: 4.50,
        gstRate: 5,
        expiryDate: '2027-10-15',
        manufacturer: 'GSK',
        vendorId: 'vnd_003',
        shelf: 'D-1',
        batchNo: 'BN-FES-2026-10',
        schedule: 'OTC',
        hsnCode: '3004',
        monthlySales: 150
    },
    {
        _id: 'uinv_009',
        name: 'Salbutamol Inhaler 100mcg',
        barcode: '8901234567009',
        category: 'Respiratory',
        salt: 'Salbutamol Sulphate',
        stock: 35,
        reorderLevel: 15,
        price: 95.00,
        mrp: 120.00,
        gstRate: 12,
        expiryDate: '2027-05-01',
        manufacturer: 'Cipla',
        vendorId: 'vnd_001',
        shelf: 'E-1',
        batchNo: 'BN-SAL-2026-05',
        schedule: 'H',
        hsnCode: '3004',
        monthlySales: 22
    },
    {
        _id: 'uinv_010',
        name: 'Fluticasone Nasal Spray',
        barcode: '8901234567010',
        category: 'Respiratory',
        salt: 'Fluticasone Propionate',
        stock: 8,
        reorderLevel: 10,
        price: 145.00,
        mrp: 180.00,
        gstRate: 12,
        expiryDate: '2026-08-30',
        manufacturer: 'GSK',
        vendorId: 'vnd_003',
        shelf: 'E-2',
        batchNo: 'BN-FLU-2026-08',
        schedule: 'H',
        hsnCode: '3004',
        monthlySales: 12
    },
    {
        _id: 'uinv_011',
        name: 'Glimepiride 1mg',
        barcode: '8901234567011',
        category: 'Diabetes',
        salt: 'Glimepiride',
        stock: 60,
        reorderLevel: 20,
        price: 4.20,
        mrp: 5.80,
        gstRate: 5,
        expiryDate: '2027-09-01',
        manufacturer: 'Sun Pharma',
        vendorId: 'vnd_002',
        shelf: 'C-4',
        batchNo: 'BN-GLM-2026-09',
        schedule: 'H',
        hsnCode: '3004',
        monthlySales: 38
    },
    {
        _id: 'uinv_012',
        name: 'Vitamin C 500mg',
        barcode: '8901234567012',
        category: 'Supplements',
        salt: 'Ascorbic Acid',
        stock: 400,
        reorderLevel: 100,
        price: 2.00,
        mrp: 3.00,
        gstRate: 5,
        expiryDate: '2028-01-15',
        manufacturer: 'Abbott',
        vendorId: 'vnd_005',
        shelf: 'D-2',
        batchNo: 'BN-VTC-2028-01',
        schedule: 'OTC',
        hsnCode: '3004',
        monthlySales: 220
    },
    {
        _id: 'uinv_013',
        name: 'Aspirin 75mg',
        barcode: '8901234567013',
        category: 'Cardiology',
        salt: 'Acetylsalicylic Acid',
        stock: 3,
        reorderLevel: 30,
        price: 2.67,
        mrp: 3.50,
        gstRate: 12,
        expiryDate: '2026-04-01',
        manufacturer: 'Abbott',
        vendorId: 'vnd_005',
        shelf: 'C-2',
        batchNo: 'BN-ASP-2026-04',
        schedule: 'OTC',
        hsnCode: '3004',
        monthlySales: 65
    },
    {
        _id: 'uinv_014',
        name: 'ORS Sachets (Electral)',
        barcode: '8901234567014',
        category: 'GI',
        salt: 'Oral Rehydration Salts',
        stock: 350,
        reorderLevel: 80,
        price: 18.00,
        mrp: 22.00,
        gstRate: 5,
        expiryDate: '2027-12-30',
        manufacturer: 'Abbott',
        vendorId: 'vnd_005',
        shelf: 'B-3',
        batchNo: 'BN-ORS-2027-12',
        schedule: 'OTC',
        hsnCode: '3004',
        monthlySales: 310
    },
    {
        _id: 'uinv_015',
        name: 'Azithromycin 250mg',
        barcode: '8901234567015',
        category: 'Antibiotics',
        salt: 'Azithromycin Dihydrate',
        stock: 75,
        reorderLevel: 20,
        price: 12.00,
        mrp: 15.00,
        gstRate: 12,
        expiryDate: '2027-06-30',
        manufacturer: 'Cipla',
        vendorId: 'vnd_001',
        shelf: 'A-5',
        batchNo: 'BN-AZM-2027-06',
        schedule: 'H1',
        hsnCode: '3004',
        monthlySales: 42
    }
];
const purchaseOrders = [
    {
        _id: 'po_001',
        vendorId: 'vnd_001',
        vendorName: 'Cipla Ltd.',
        orderDate: '2026-02-23T10:00:00Z',
        expectedDelivery: '2026-02-25T18:00:00Z',
        status: 'In Transit',
        items: [
            {
                name: 'Amoxicillin 500mg',
                quantity: 500,
                unitCost: 5.50,
                totalCost: 2750
            },
            {
                name: 'Azithromycin 250mg',
                quantity: 200,
                unitCost: 9.00,
                totalCost: 1800
            },
            {
                name: 'Cetirizine 10mg',
                quantity: 300,
                unitCost: 1.80,
                totalCost: 540
            }
        ],
        totalAmount: 5090,
        gstAmount: 610.8,
        invoiceNo: 'CIPLA-INV-2026-4521'
    },
    {
        _id: 'po_002',
        vendorId: 'vnd_002',
        vendorName: 'Sun Pharmaceutical',
        orderDate: '2026-02-21T14:30:00Z',
        expectedDelivery: '2026-02-24T12:00:00Z',
        status: 'Delivered',
        items: [
            {
                name: 'Metformin 500mg',
                quantity: 400,
                unitCost: 1.50,
                totalCost: 600
            },
            {
                name: 'Glimepiride 1mg',
                quantity: 100,
                unitCost: 3.20,
                totalCost: 320
            }
        ],
        totalAmount: 920,
        gstAmount: 46,
        invoiceNo: 'SUN-INV-2026-8934'
    },
    {
        _id: 'po_003',
        vendorId: 'vnd_005',
        vendorName: 'Abbott India',
        orderDate: '2026-02-24T09:00:00Z',
        expectedDelivery: '2026-02-28T10:00:00Z',
        status: 'Ordered',
        items: [
            {
                name: 'Aspirin 75mg',
                quantity: 300,
                unitCost: 2.00,
                totalCost: 600
            },
            {
                name: 'ORS Sachets (Electral)',
                quantity: 500,
                unitCost: 14.00,
                totalCost: 7000
            },
            {
                name: 'Vitamin C 500mg',
                quantity: 400,
                unitCost: 1.50,
                totalCost: 600
            }
        ],
        totalAmount: 8200,
        gstAmount: 492,
        invoiceNo: 'ABT-INV-2026-1122'
    }
];
const barcodeLookup = {};
universityInventory.forEach((item)=>{
    barcodeLookup[item.barcode] = item._id;
});
function lookupStudent(studentId) {
    return studentHealthRecords.find((s)=>s.studentId === studentId);
}
function lookupPrescription(rxCode) {
    return digitalPrescriptions.find((rx)=>rx.rxCode === rxCode);
}
function getStudentPrescriptions(studentId) {
    return digitalPrescriptions.filter((rx)=>rx.studentId === studentId);
}
function getActivePrescriptions() {
    return digitalPrescriptions.filter((rx)=>rx.status === 'Active');
}
function getStaffOnDuty() {
    return pharmacyStaff.filter((s)=>s.status === 'On Duty');
}
function getInventoryByBarcode(barcode) {
    return universityInventory.find((i)=>i.barcode === barcode);
}
function getLowStockItems() {
    return universityInventory.filter((i)=>i.stock <= i.reorderLevel);
}
function getExpiringItems(daysThreshold = 90) {
    const threshold = Date.now() + daysThreshold * 24 * 60 * 60 * 1000;
    return universityInventory.filter((i)=>{
        const exp = new Date(i.expiryDate).getTime();
        return exp > Date.now() && exp < threshold;
    });
}
const dummyOrders = [
    {
        _id: 'ord_001',
        patientName: 'Rahul Sharma',
        patientPrn: 'PRN-1001',
        orderDate: new Date(Date.now() - 3600000).toISOString(),
        status: 'Pending',
        items: [
            {
                name: 'Amoxicillin 500mg',
                dosage: '500mg',
                quantity: 21,
                price: 150,
                salt: 'Amoxicillin Trihydrate'
            },
            {
                name: 'Paracetamol 650mg',
                dosage: '650mg',
                quantity: 10,
                price: 50,
                salt: 'Paracetamol'
            }
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
            {
                name: 'Metformin 500mg',
                dosage: '500mg',
                quantity: 60,
                price: 120,
                salt: 'Metformin Hydrochloride'
            }
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
            {
                name: 'Atorvastatin 10mg',
                dosage: '10mg',
                quantity: 30,
                price: 200,
                salt: 'Atorvastatin Calcium'
            },
            {
                name: 'Aspirin 75mg',
                dosage: '75mg',
                quantity: 30,
                price: 80,
                salt: 'Acetylsalicylic Acid'
            }
        ],
        chemistName: 'MediCare Pharmacy',
        total: 280,
        doctorName: 'Dr. Ravi Menon',
        doctorPhone: '+91 98765 33333',
        batchNumber: 'BN-ATR-2026-04',
        fulfilledAt: '2026-02-23T15:30:00Z'
    }
];
const dummyQueue = [
    {
        _id: 'q_001',
        patientName: 'Rahul Sharma',
        patientPrn: 'PRN-1001',
        arrivedAt: new Date(Date.now() - 720000).toISOString(),
        status: 'verifying',
        itemCount: 2
    },
    {
        _id: 'q_002',
        patientName: 'Sneha Desai',
        patientPrn: 'PRN-1004',
        arrivedAt: new Date(Date.now() - 300000).toISOString(),
        status: 'waiting',
        itemCount: 1
    },
    {
        _id: 'q_003',
        patientName: 'Rajesh Gupta',
        patientPrn: 'PRN-1005',
        arrivedAt: new Date(Date.now() - 120000).toISOString(),
        status: 'waiting',
        itemCount: 1
    }
];
const aiAssistantKnowledge = {
    responses: {
        interaction: {
            type: 'interaction',
            content: "Just a heads up: I found a high-risk clinical interaction. It's best if patients on blood thinners avoid combining multiple NSAIDs like Aspirin and Ibuprofen, as it increases gastric bleeding risks.",
            metadata: {
                severity: 'High',
                action: 'Review Pharmacopeia'
            }
        },
        regulation: {
            type: 'regulation',
            content: "Regulatory Alert: This is a Schedule H1 therapeutic. You are required to maintain a separate register with name/address of the prescriber, patient info, and name/quantity of drug for 3 years."
        },
        default: {
            content: "I've cross-referenced this with our medical database. The dosage and duration match the standard clinical protocols for this patient demographic."
        }
    },
    menuItems: [
        {
            id: 'interactions',
            label: 'Safety Check',
            desc: 'Real-time drug interaction audit'
        },
        {
            id: 'regulations',
            label: 'Compliance',
            desc: 'Schedules and legal guidelines'
        },
        {
            id: 'inventory',
            label: 'Stock Helper',
            desc: 'Predictive stock analytics'
        },
        {
            id: 'general',
            label: 'Clinical Query',
            desc: 'Ask about any drug or protocol'
        }
    ]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pharmamate/lib/context/PersonaContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PersonaProvider",
    ()=>PersonaProvider,
    "usePersona",
    ()=>usePersona
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$mock$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/lib/mock/platform-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
/**
 * @fileoverview Persona Context — Multi-Role State Management
 * 
 * Manages the authenticated user's roles (Admin / Storekeeper).
 * The active role determines sidebar visibility and page access.
 */ 'use client';
;
;
const PersonaContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function PersonaProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeRole, setActiveRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('CHEMIST_ADMIN');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const loginAs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PersonaProvider.useCallback[loginAs]": (userId)=>{
            const found = __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$mock$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformUsers"].find({
                "PersonaProvider.useCallback[loginAs].found": (u)=>u._id === userId
            }["PersonaProvider.useCallback[loginAs].found"]);
            if (found) {
                setUser(found);
                setActiveRole(found.activeRole);
                localStorage.setItem('platformUserId', found._id);
                localStorage.setItem('activeRole', found.activeRole);
                // Also set legacy keys for backward compat
                localStorage.setItem('chemUser', JSON.stringify({
                    _id: found._id,
                    name: found.name,
                    email: found.email,
                    shopName: found.shopName,
                    licenseNumber: found.licenseNumber,
                    address: found.address
                }));
                localStorage.setItem('chemToken', 'platform-jwt-token-clinical');
            }
        }
    }["PersonaProvider.useCallback[loginAs]"], []);
    // Load persisted persona on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PersonaProvider.useEffect": ()=>{
            setMounted(true);
            const savedUserId = localStorage.getItem('platformUserId') || sessionStorage.getItem('platformUserId');
            const savedRole = localStorage.getItem('activeRole');
            if (savedUserId) {
                const found = __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$mock$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformUsers"].find({
                    "PersonaProvider.useEffect.found": (u)=>u._id === savedUserId
                }["PersonaProvider.useEffect.found"]);
                if (found) {
                    setUser(found);
                    setActiveRole(savedRole && found.roles.includes(savedRole) ? savedRole : found.activeRole);
                    return;
                }
            }
            // Fallback: Check legacy chemUser for backward compat
            const legacyUser = localStorage.getItem('chemUser') || sessionStorage.getItem('chemUser');
            if (legacyUser) {
                try {
                    const parsed = JSON.parse(legacyUser);
                    // Map legacy chemist to platform user
                    const mapped = __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$mock$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformUsers"].find({
                        "PersonaProvider.useEffect": (u)=>u.email === parsed.email
                    }["PersonaProvider.useEffect"]) || __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$mock$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformUsers"][0];
                    setUser(mapped);
                    setActiveRole(savedRole && mapped.roles.includes(savedRole) ? savedRole : mapped.activeRole);
                    localStorage.setItem('platformUserId', mapped._id);
                } catch  {
                    // If legacy JSON is invalid, default to the first user
                    loginAs(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$mock$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformUsers"][0]._id);
                }
            } else {
                // No saved session found (like on a fresh Vercel deployment)
                // Default to the primary admin active persona
                loginAs(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$mock$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformUsers"][0]._id);
            }
        }
    }["PersonaProvider.useEffect"], [
        loginAs
    ]);
    const switchRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PersonaProvider.useCallback[switchRole]": (role)=>{
            if (!user || !user.roles.includes(role)) return;
            setActiveRole(role);
            localStorage.setItem('activeRole', role);
        }
    }["PersonaProvider.useCallback[switchRole]"], [
        user
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PersonaProvider.useCallback[logout]": ()=>{
            setUser(null);
            setActiveRole('CHEMIST_ADMIN');
            localStorage.clear();
            sessionStorage.clear();
        }
    }["PersonaProvider.useCallback[logout]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PersonaProvider.useMemo[value]": ()=>({
                user,
                activeRole,
                availableRoles: user?.roles || [],
                switchRole,
                isAdmin: activeRole === 'CHEMIST_ADMIN',
                isStorekeeper: activeRole === 'STOREKEEPER',
                loginAs,
                logout,
                mounted
            })
    }["PersonaProvider.useMemo[value]"], [
        user,
        activeRole,
        switchRole,
        loginAs,
        logout,
        mounted
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PersonaContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/pharmamate/lib/context/PersonaContext.tsx",
        lineNumber: 125,
        columnNumber: 9
    }, this);
}
_s(PersonaProvider, "aaY0KKQhB4OmRZQJDYqgZeM4tPo=");
_c = PersonaProvider;
function usePersona() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PersonaContext);
    if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
    return ctx;
}
_s1(usePersona, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "PersonaProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pharmamate/components/PharmaClientWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PharmaClientWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$context$2f$PersonaContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/lib/context/PersonaContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// Seed dummy user data for development
const DUMMY_USER = {
    _id: 'usr_001',
    name: 'Vikram Mehta',
    email: 'vikram@medicare.com',
    shopName: 'MediCare Pharmacy — SRM Campus',
    licenseNumber: 'TN-PH-2024-7891',
    address: 'Health Centre Block, SRM University, Kattankulathur'
};
function seedDummyAuth() {
    if ("TURBOPACK compile-time truthy", 1) {
        if (!localStorage.getItem('chemToken')) {
            localStorage.setItem('chemToken', 'platform-jwt-token-clinical');
            localStorage.setItem('chemUser', JSON.stringify(DUMMY_USER));
            localStorage.setItem('platformUserId', 'usr_001');
            localStorage.setItem('activeRole', 'CHEMIST_ADMIN');
        }
    }
}
function PharmaClientWrapper({ children }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PharmaClientWrapper.useEffect": ()=>{
            seedDummyAuth();
        }
    }["PharmaClientWrapper.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$context$2f$PersonaContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PersonaProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/pharmamate/components/PharmaClientWrapper.tsx",
        lineNumber: 34,
        columnNumber: 9
    }, this);
}
_s(PharmaClientWrapper, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = PharmaClientWrapper;
var _c;
__turbopack_context__.k.register(_c, "PharmaClientWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pharmamate/components/DevToolbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DevToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * @fileoverview DevToolbar — Persona Simulator
 *
 * A floating developer overlay that lets you instantly switch between
 * mock users to test how each role sees the application. Only renders
 * in development mode (NODE_ENV !== 'production').
 *
 * Usage: Drop <DevToolbar /> inside app/layout.tsx (inside PharmaClientWrapper).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$context$2f$PersonaContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/lib/context/PersonaContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$mock$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/lib/mock/platform-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/flask-conical.js [app-client] (ecmascript) <export default as FlaskConical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$cog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCog$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/user-cog.js [app-client] (ecmascript) <export default as UserCog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const ROLE_META = {
    CHEMIST_ADMIN: {
        label: 'Admin',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
        dot: '#10b981'
    },
    STOREKEEPER: {
        label: 'Storekeeper',
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.12)',
        dot: '#3b82f6'
    }
};
const USER_ICONS = {
    usr_001: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$cog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCog$3e$__["UserCog"], {
        size: 14
    }, void 0, false, {
        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
        lineNumber: 35,
        columnNumber: 14
    }, ("TURBOPACK compile-time value", void 0)),
    usr_002: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
        size: 14
    }, void 0, false, {
        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
        lineNumber: 36,
        columnNumber: 14
    }, ("TURBOPACK compile-time value", void 0))
};
function DevToolbar() {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { user, activeRole, loginAs, switchRole } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$context$2f$PersonaContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersona"])();
    // Only render in development
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const activeMeta = ROLE_META[activeRole];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            bottom: 110,
            right: 20,
            zIndex: 9999,
            fontFamily: "'Inter', system-ui, sans-serif"
        },
        children: [
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 8,
                    background: '#1c1917',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14,
                    padding: '14px',
                    width: 280,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    animation: 'devToolbarSlide 0.18s ease-out'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 7
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"], {
                                        size: 13,
                                        color: "#a8a29e"
                                    }, void 0, false, {
                                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                        lineNumber: 71,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: '#a8a29e',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em'
                                        },
                                        children: "Persona Simulator"
                                    }, void 0, false, {
                                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                        lineNumber: 72,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                lineNumber: 70,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setOpen(false),
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#57534e',
                                    padding: 2,
                                    lineHeight: 1
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                    lineNumber: 80,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                lineNumber: 76,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                        lineNumber: 69,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: activeMeta.bg,
                            border: `1px solid ${activeMeta.color}30`,
                            borderRadius: 8,
                            padding: '8px 10px',
                            marginBottom: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    background: activeMeta.dot,
                                    flexShrink: 0
                                }
                            }, void 0, false, {
                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                lineNumber: 95,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    minWidth: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            margin: 0,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: '#fff',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        },
                                        children: user?.name ?? '—'
                                    }, void 0, false, {
                                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                        lineNumber: 97,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            margin: 0,
                                            fontSize: 10,
                                            color: activeMeta.color,
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em'
                                        },
                                        children: activeMeta.label
                                    }, void 0, false, {
                                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                        lineNumber: 100,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                lineNumber: 96,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                        lineNumber: 85,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            margin: '0 0 6px',
                            fontSize: 10,
                            fontWeight: 700,
                            color: '#57534e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em'
                        },
                        children: "Switch User"
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                        lineNumber: 107,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            marginBottom: 12
                        },
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$mock$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformUsers"].map((u)=>{
                            const isActive = user?._id === u._id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>loginAs(u._id),
                                style: {
                                    background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                                    borderRadius: 8,
                                    padding: '8px 10px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 9,
                                    transition: 'all 0.15s',
                                    textAlign: 'left'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 28,
                                            height: 28,
                                            borderRadius: 8,
                                            background: isActive ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isActive ? '#10b981' : '#78716c',
                                            flexShrink: 0
                                        },
                                        children: USER_ICONS[u._id] ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                            lineNumber: 138,
                                            columnNumber: 63
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                        lineNumber: 131,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            minWidth: 0,
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: isActive ? '#fff' : '#a8a29e',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                },
                                                children: u.name
                                            }, void 0, false, {
                                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                                lineNumber: 141,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: 10,
                                                    color: '#57534e',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                },
                                                children: u.roles.join(', ')
                                            }, void 0, false, {
                                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                                lineNumber: 144,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                        lineNumber: 140,
                                        columnNumber: 37
                                    }, this),
                                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        size: 12,
                                        color: "#10b981",
                                        style: {
                                            flexShrink: 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                        lineNumber: 148,
                                        columnNumber: 50
                                    }, this)
                                ]
                            }, u._id, true, {
                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                lineNumber: 114,
                                columnNumber: 33
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                        lineNumber: 110,
                        columnNumber: 21
                    }, this),
                    (user?.roles?.length ?? 0) > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: '0 0 6px',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: '#57534e',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em'
                                },
                                children: "Switch Role"
                            }, void 0, false, {
                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                lineNumber: 157,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 4
                                },
                                children: (user?.roles ?? []).map((role)=>{
                                    const meta = ROLE_META[role];
                                    const isCurrent = activeRole === role;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>switchRole(role),
                                        style: {
                                            flex: 1,
                                            background: isCurrent ? meta.bg : 'rgba(255,255,255,0.04)',
                                            border: `1px solid ${isCurrent ? meta.color + '40' : 'rgba(255,255,255,0.06)'}`,
                                            borderRadius: 7,
                                            padding: '7px 8px',
                                            cursor: 'pointer',
                                            color: isCurrent ? meta.color : '#78716c',
                                            fontSize: 10,
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 5,
                                            transition: 'all 0.15s'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 5,
                                                    height: 5,
                                                    borderRadius: '50%',
                                                    background: isCurrent ? meta.dot : '#57534e'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                                lineNumber: 187,
                                                columnNumber: 45
                                            }, this),
                                            meta.label
                                        ]
                                    }, role, true, {
                                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                        lineNumber: 165,
                                        columnNumber: 41
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                                lineNumber: 160,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            margin: '12px 0 0',
                            fontSize: 10,
                            color: '#44403c',
                            textAlign: 'center'
                        },
                        children: "Dev only · hidden in production"
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                        lineNumber: 197,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                lineNumber: 58,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setOpen((prev)=>!prev),
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#1c1917',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 99,
                    padding: '8px 14px 8px 10px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    transition: 'all 0.2s',
                    color: '#fff',
                    userSelect: 'none'
                },
                title: "Open persona simulator",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: activeMeta.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"], {
                            size: 12,
                            color: activeMeta.color
                        }, void 0, false, {
                            fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                            lineNumber: 227,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                        lineNumber: 222,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#d6d3d1'
                        },
                        children: user?.name?.split(' ')[0] ?? 'DevMode'
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                        lineNumber: 229,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: activeMeta.dot
                        }
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                        lineNumber: 232,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                        size: 11,
                        color: "#78716c",
                        style: {
                            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                        }
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                        lineNumber: 233,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                lineNumber: 204,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
                @keyframes devToolbarSlide {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0);   }
                }
            `
            }, void 0, false, {
                fileName: "[project]/pharmamate/components/DevToolbar.tsx",
                lineNumber: 240,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pharmamate/components/DevToolbar.tsx",
        lineNumber: 49,
        columnNumber: 9
    }, this);
}
_s(DevToolbar, "o80wxzSIAj+VPWkk4mqENr/XHxk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$lib$2f$context$2f$PersonaContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersona"]
    ];
});
_c = DevToolbar;
var _c;
__turbopack_context__.k.register(_c, "DevToolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pharmamate/components/TitleBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TitleBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function TitleBar() {
    _s();
    const [isMaximized, setIsMaximized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDesktop, setIsDesktop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TitleBar.useEffect": ()=>{
            setIsDesktop(/Electron/.test(navigator.userAgent));
        }
    }["TitleBar.useEffect"], []);
    if (!isDesktop) return null;
    const handleMinimize = ()=>{
        window.electron?.windowControls?.minimize();
    };
    const handleMaximize = ()=>{
        window.electron?.windowControls?.maximize();
        setIsMaximized(!isMaximized);
    };
    const handleClose = ()=>{
        window.electron?.windowControls?.close();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-10 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between select-none fixed top-0 left-0 right-0 z-[9999]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 h-full flex items-center px-4 gap-2",
                style: {
                    WebkitAppRegion: 'drag'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                        className: "w-4 h-4 text-emerald-600 dark:text-emerald-400"
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/TitleBar.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[11px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400",
                        children: "PharmaMate — Pharmacy Management"
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/TitleBar.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pharmamate/components/TitleBar.tsx",
                lineNumber: 41,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center h-full",
                style: {
                    WebkitAppRegion: 'no-drag'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleMinimize,
                        className: "h-full px-4 flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                            className: "w-3.5 h-3.5"
                        }, void 0, false, {
                            fileName: "[project]/pharmamate/components/TitleBar.tsx",
                            lineNumber: 53,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/TitleBar.tsx",
                        lineNumber: 49,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleMaximize,
                        className: "h-full px-4 flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                            className: "w-3 h-3"
                        }, void 0, false, {
                            fileName: "[project]/pharmamate/components/TitleBar.tsx",
                            lineNumber: 59,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/TitleBar.tsx",
                        lineNumber: 55,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleClose,
                        className: "h-full px-4 flex items-center justify-center text-stone-500 hover:bg-red-500 hover:text-white transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "w-3.5 h-3.5"
                        }, void 0, false, {
                            fileName: "[project]/pharmamate/components/TitleBar.tsx",
                            lineNumber: 65,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pharmamate/components/TitleBar.tsx",
                        lineNumber: 61,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pharmamate/components/TitleBar.tsx",
                lineNumber: 48,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pharmamate/components/TitleBar.tsx",
        lineNumber: 40,
        columnNumber: 9
    }, this);
}
_s(TitleBar, "iVKjebrvA86Db0t6k90s1N1kBLc=");
_c = TitleBar;
var _c;
__turbopack_context__.k.register(_c, "TitleBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/client/request-idle-callback.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cancelIdleCallback: null,
    requestIdleCallback: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cancelIdleCallback: function() {
        return cancelIdleCallback;
    },
    requestIdleCallback: function() {
        return requestIdleCallback;
    }
});
const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
    let start = Date.now();
    return self.setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=request-idle-callback.js.map
}),
"[project]/node_modules/next/dist/client/script.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    handleClientScriptLoad: null,
    initScriptLoader: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    handleClientScriptLoad: function() {
        return handleClientScriptLoad;
    },
    initScriptLoader: function() {
        return initScriptLoader;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _reactdom = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)"));
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _headmanagercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/head-manager-context.shared-runtime.js [app-client] (ecmascript)");
const _setattributesfromprops = __turbopack_context__.r("[project]/node_modules/next/dist/client/set-attributes-from-props.js [app-client] (ecmascript)");
const _requestidlecallback = __turbopack_context__.r("[project]/node_modules/next/dist/client/request-idle-callback.js [app-client] (ecmascript)");
const ScriptCache = new Map();
const LoadCache = new Set();
const insertStylesheets = (stylesheets)=>{
    // Case 1: Styles for afterInteractive/lazyOnload with appDir injected via handleClientScriptLoad
    //
    // Using ReactDOM.preinit to feature detect appDir and inject styles
    // Stylesheets might have already been loaded if initialized with Script component
    // Re-inject styles here to handle scripts loaded via handleClientScriptLoad
    // ReactDOM.preinit handles dedup and ensures the styles are loaded only once
    if (_reactdom.default.preinit) {
        stylesheets.forEach((stylesheet)=>{
            _reactdom.default.preinit(stylesheet, {
                as: 'style'
            });
        });
        return;
    }
    // Case 2: Styles for afterInteractive/lazyOnload with pages injected via handleClientScriptLoad
    //
    // We use this function to load styles when appdir is not detected
    // TODO: Use React float APIs to load styles once available for pages dir
    if (typeof window !== 'undefined') {
        let head = document.head;
        stylesheets.forEach((stylesheet)=>{
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = stylesheet;
            head.appendChild(link);
        });
    }
};
const loadScript = (props)=>{
    const { src, id, onLoad = ()=>{}, onReady = null, dangerouslySetInnerHTML, children = '', strategy = 'afterInteractive', onError, stylesheets } = props;
    const cacheKey = id || src;
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
        // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    /** Execute after the script first loaded */ const afterLoad = ()=>{
        // Run onReady for the first time after load event
        if (onReady) {
            onReady();
        }
        // add cacheKey to LoadCache when load successfully
        LoadCache.add(cacheKey);
    };
    const el = document.createElement('script');
    const loadPromise = new Promise((resolve, reject)=>{
        el.addEventListener('load', function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
            afterLoad();
        });
        el.addEventListener('error', function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (dangerouslySetInnerHTML) {
        // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
        afterLoad();
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        afterLoad();
    } else if (src) {
        el.src = src;
        // do not add cacheKey into LoadCache for remote script here
        // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
        ScriptCache.set(src, loadPromise);
    }
    (0, _setattributesfromprops.setAttributesFromProps)(el, props);
    if (strategy === 'worker') {
        el.setAttribute('type', 'text/partytown');
    }
    el.setAttribute('data-nscript', strategy);
    // Load styles associated with this script
    if (stylesheets) {
        insertStylesheets(stylesheets);
    }
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    const { strategy = 'afterInteractive' } = props;
    if (strategy === 'lazyOnload') {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === 'complete') {
        (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
    } else {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    }
}
function addBeforeInteractiveToCache() {
    const scripts = [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]')
    ];
    scripts.forEach((script)=>{
        const cacheKey = script.id || script.getAttribute('src');
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
}
/**
 * Load a third-party scripts in an optimized way.
 *
 * Read more: [Next.js Docs: `next/script`](https://nextjs.org/docs/app/api-reference/components/script)
 */ function Script(props) {
    const { id, src = '', onLoad = ()=>{}, onReady = null, strategy = 'afterInteractive', onError, stylesheets, ...restProps } = props;
    // Context is available only during SSR
    let { updateScripts, scripts, getIsSsr, appDir, nonce } = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
    // if a nonce is explicitly passed to the script tag, favor that over the automatic handling
    nonce = restProps.nonce || nonce;
    /**
   * - First mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script hasn't loaded yet (not in LoadCache)
   *      onReady is skipped, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. hasLoadScriptEffectCalled.current is false, loadScript executes
   *      Once the script is loaded, the onLoad and onReady will be called by then
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   *
   * - Second mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script has already loaded (found in LoadCache)
   *      onReady is called, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. The script is already loaded, loadScript bails out
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   */ const hasOnReadyEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        const cacheKey = id || src;
        if (!hasOnReadyEffectCalled.current) {
            // Run onReady if script has loaded before but component is re-mounted
            if (onReady && cacheKey && LoadCache.has(cacheKey)) {
                onReady();
            }
            hasOnReadyEffectCalled.current = true;
        }
    }, [
        onReady,
        id,
        src
    ]);
    const hasLoadScriptEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        if (!hasLoadScriptEffectCalled.current) {
            if (strategy === 'afterInteractive') {
                loadScript(props);
            } else if (strategy === 'lazyOnload') {
                loadLazyScript(props);
            }
            hasLoadScriptEffectCalled.current = true;
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === 'beforeInteractive' || strategy === 'worker') {
        if (updateScripts) {
            scripts[strategy] = (scripts[strategy] || []).concat([
                {
                    id,
                    src,
                    onLoad,
                    onReady,
                    onError,
                    ...restProps,
                    nonce
                }
            ]);
            updateScripts(scripts);
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript({
                ...props,
                nonce
            });
        }
    }
    // For the app directory, we need React Float to preload these scripts.
    if (appDir) {
        // Injecting stylesheets here handles beforeInteractive and worker scripts correctly
        // For other strategies injecting here ensures correct stylesheet order
        // ReactDOM.preinit handles loading the styles in the correct order,
        // also ensures the stylesheet is loaded only once and in a consistent manner
        //
        // Case 1: Styles for beforeInteractive/worker with appDir - handled here
        // Case 2: Styles for beforeInteractive/worker with pages dir - Not handled yet
        // Case 3: Styles for afterInteractive/lazyOnload with appDir - handled here
        // Case 4: Styles for afterInteractive/lazyOnload with pages dir - handled in insertStylesheets function
        if (stylesheets) {
            stylesheets.forEach((styleSrc)=>{
                _reactdom.default.preinit(styleSrc, {
                    as: 'style'
                });
            });
        }
        // Before interactive scripts need to be loaded by Next.js' runtime instead
        // of native <script> tags, because they no longer have `defer`.
        if (strategy === 'beforeInteractive') {
            if (!src) {
                // For inlined scripts, we put the content in `children`.
                if (restProps.dangerouslySetInnerHTML) {
                    // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
                    restProps.children = restProps.dangerouslySetInnerHTML.__html;
                    delete restProps.dangerouslySetInnerHTML;
                }
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                            0,
                            {
                                ...restProps,
                                id
                            }
                        ])})`
                    }
                });
            } else {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                            src,
                            {
                                ...restProps,
                                id
                            }
                        ])})`
                    }
                });
            }
        } else if (strategy === 'afterInteractive') {
            if (src) {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
            }
        }
    }
    return null;
}
Object.defineProperty(Script, '__nextScript', {
    value: true
});
const _default = Script;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=script.js.map
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeClasses",
    ()=>mergeClasses
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
;
 //# sourceMappingURL=mergeClasses.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toKebabCase",
    ()=>toKebabCase
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
;
 //# sourceMappingURL=toKebabCase.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toCamelCase",
    ()=>toCamelCase
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toCamelCase = (string)=>string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2)=>p2 ? p2.toUpperCase() : p1.toLowerCase());
;
 //# sourceMappingURL=toCamelCase.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toPascalCase",
    ()=>toPascalCase
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.js [app-client] (ecmascript)");
;
const toPascalCase = (string)=>{
    const camelCase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCamelCase"])(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
;
 //# sourceMappingURL=toPascalCase.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
 //# sourceMappingURL=defaultAttributes.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasA11yProp",
    ()=>hasA11yProp
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
    return false;
};
;
 //# sourceMappingURL=hasA11yProp.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icon
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js [app-client] (ecmascript)");
;
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", className),
        ...!children && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasA11yProp"])(rest) && {
            "aria-hidden": "true"
        },
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]));
;
 //# sourceMappingURL=Icon.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)");
;
;
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(`lucide-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName))}`, `lucide-${iconName}`, className),
            ...props
        }));
    Component.displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName);
    return Component;
};
;
 //# sourceMappingURL=createLucideIcon.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronUp
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m18 15-6-6-6 6",
            key: "153udz"
        }
    ]
];
const ChevronUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-up", __iconNode);
;
 //# sourceMappingURL=chevron-up.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronUp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript)");
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/flask-conical.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>FlaskConical
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
            key: "18mbvz"
        }
    ],
    [
        "path",
        {
            d: "M6.453 15h11.094",
            key: "3shlmq"
        }
    ],
    [
        "path",
        {
            d: "M8.5 2h7",
            key: "csnxdl"
        }
    ]
];
const FlaskConical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flask-conical", __iconNode);
;
 //# sourceMappingURL=flask-conical.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/flask-conical.js [app-client] (ecmascript) <export default as FlaskConical>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlaskConical",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/flask-conical.js [app-client] (ecmascript)");
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>X
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }
    ],
    [
        "path",
        {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }
    ]
];
const X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("x", __iconNode);
;
 //# sourceMappingURL=x.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "X",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)");
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/user-cog.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>UserCog
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M10 15H6a4 4 0 0 0-4 4v2",
            key: "1nfge6"
        }
    ],
    [
        "path",
        {
            d: "m14.305 16.53.923-.382",
            key: "1itpsq"
        }
    ],
    [
        "path",
        {
            d: "m15.228 13.852-.923-.383",
            key: "eplpkm"
        }
    ],
    [
        "path",
        {
            d: "m16.852 12.228-.383-.923",
            key: "13v3q0"
        }
    ],
    [
        "path",
        {
            d: "m16.852 17.772-.383.924",
            key: "1i8mnm"
        }
    ],
    [
        "path",
        {
            d: "m19.148 12.228.383-.923",
            key: "1q8j1v"
        }
    ],
    [
        "path",
        {
            d: "m19.53 18.696-.382-.924",
            key: "vk1qj3"
        }
    ],
    [
        "path",
        {
            d: "m20.772 13.852.924-.383",
            key: "n880s0"
        }
    ],
    [
        "path",
        {
            d: "m20.772 16.148.924.383",
            key: "1g6xey"
        }
    ],
    [
        "circle",
        {
            cx: "18",
            cy: "15",
            r: "3",
            key: "gjjjvw"
        }
    ],
    [
        "circle",
        {
            cx: "9",
            cy: "7",
            r: "4",
            key: "nufk8"
        }
    ]
];
const UserCog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("user-cog", __iconNode);
;
 //# sourceMappingURL=user-cog.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/user-cog.js [app-client] (ecmascript) <export default as UserCog>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserCog",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$cog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$cog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/user-cog.js [app-client] (ecmascript)");
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>User
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
            key: "975kel"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "7",
            r: "4",
            key: "17ys0d"
        }
    ]
];
const User = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("user", __iconNode);
;
 //# sourceMappingURL=user.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "User",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript)");
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Check
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
];
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("check", __iconNode);
;
 //# sourceMappingURL=check.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)");
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Minus
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M5 12h14",
            key: "1ays0h"
        }
    ]
];
const Minus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("minus", __iconNode);
;
 //# sourceMappingURL=minus.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Minus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript)");
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Square
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            key: "afitv7"
        }
    ]
];
const Square = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("square", __iconNode);
;
 //# sourceMappingURL=square.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Square",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript)");
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Shield
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }
    ]
];
const Shield = (0, __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("shield", __iconNode);
;
 //# sourceMappingURL=shield.js.map
}),
"[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Shield",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$pharmamate$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pharmamate/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_0a866c70._.js.map