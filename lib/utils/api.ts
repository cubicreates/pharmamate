/**
 * @fileoverview Robust API Client with Intelligent Mocking
 * This layer abstracts all network communication and provides a seamless
 * transition between local development (dummy data) and production APIs.
 */

// type imports removed as they were unused
import {
    dummyOrders,
    universityInventory as dummyInventory,
    digitalPrescriptions as dummyPrescriptions,
    dummyQueue,
    platformUsers as dummyChemists,
    aiAssistantKnowledge,
    lookupStudent,
    getStudentPrescriptions,
    pharmacyStaff,
    vendors,
    purchaseOrders,
    dailyRevenueData,
    getInventoryByBarcode,
    universityInventory
} from '../mock/platform-data';

// =============================
// API BASE CONFIGURATION
// =============================

/**
 * Resolves the backend URL based on environment variables.
 * Falls back to localhost for development stability.
 */
const getBackendUrl = () => process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

/**
 * Retrieves the session token from persistent storage (local or session).
 * Crucial for maintainig auth state across reloads.
 */
const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('chemToken') || sessionStorage.getItem('chemToken');
};

/**
 * Generates standard headers for clinical data exchange.
 * Includes Bearer token and JSON content-type by default.
 */
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
});

// ===========================
// CORE API HANDLER (MOCKED)
// ===========================

interface RequestOptions {
    /** HTTP Verb */
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
    /** Request payload for mutations */
    body?: unknown;
    /** Custom overrides for standard headers */
    headers?: Record<string, string>;
}

/**
 * Robust API Client with Generic Typing and Integrated Virtual RDBMS.
 * @template T - The expected return type of the API call.
 * @param {string} endpoint - The target resource path.
 * @param {RequestOptions} options - Method, Body, and Header configuration.
 * @returns {Promise<T>} - A typed promise resolving to the API response.
 */
const apiRequest = async <T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    /**
     * Artificial Latency Layer:
     * Simulates real-world network conditions (200-600ms) to ensure
     * frontend UX covers all loading states (Skeletons, Spinners).
     */
    const delay = Math.random() * 400 + 200;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Logging for Developer Experience (DX) and Audit Trail
    console.debug(`[PharmaMate API] ${options.method || 'GET'} ${endpoint}`, options.body || '');

    // --- MOCK VIRTUAL ROUTING ---
    // In production, these if-else blocks are replaced by a standard fetch() to getBackendUrl().

    try {
        // --- 1. AUTHENTICATION & PROFILE ---
        if (endpoint.includes('/api/chemists/login')) {
            const user = dummyChemists[0]; // Simulate primary test user login
            return { token: 'dummy-jwt-token-clinical', user } as T;
        }
        if (endpoint.includes('/api/chemists/profile')) {
            if (typeof window === 'undefined') return {} as T;
            return JSON.parse(localStorage.getItem('chemUser') || '{}') as T;
        }

        // --- 2. ORDER MANAGEMENT ---
        if (endpoint.includes('/api/orders/chemist/')) {
            // Returns full history for the pharmacy
            return [...dummyOrders] as T;
        }
        if (endpoint.includes('/api/orders/patient/')) {
            // Filter orders by Patient PRN
            const prn = endpoint.split('/').pop();
            return dummyOrders.filter(o => o.patientPrn === prn) as T;
        }
        if (endpoint.includes('/api/orders') && endpoint.includes('/fulfill')) {
            // Simulates fulfillment mutation
            return {
                message: 'Clinical Verification Passed',
                invoiceId: 'INV-' + Date.now().toString(36).toUpperCase()
            } as T;
        }

        // --- 3. INVENTORY & PHARMACOPEIA ---
        if (endpoint.includes('/api/inventory/substitutes/')) {
            // Intelligent Search: Match by Molecule/Salt
            const salt = decodeURIComponent(endpoint.split('/substitutes/')[1] || '').toLowerCase();
            return dummyInventory.filter(i => i.salt.toLowerCase().includes(salt)) as T;
        }
        if (endpoint.includes('/api/inventory')) {
            return [...dummyInventory] as T;
        }

        // --- 4. QUEUE & CLINICAL ACCESS ---
        if (endpoint.includes('/api/queue')) {
            return [...dummyQueue] as T;
        }
        if (endpoint.includes('/api/access/request')) {
            return { requestId: 'REQ-' + Math.random().toString(36).slice(2, 9).toUpperCase() } as T;
        }
        if (endpoint.includes('/api/access/check-status/')) {
            // Always grant for demo purposes
            return { granted: true, accessToken: 'secure_clinical_token_123' } as T;
        }
        if (endpoint.includes('/api/access/verify-otp')) {
            return { accessToken: 'secure_clinical_token_123' } as T;
        }

        // --- 5. PRESCRIPTION ENGINE & OCR ---
        if (endpoint.includes('/api/prescriptions/latest/')) {
            const prn = endpoint.split('/').pop() || '';
            const rx = dummyPrescriptions.find(r => r.studentId === prn) || dummyPrescriptions[0];
            return rx as T;
        }

        // --- 6. AI KNOWLEDGE BASE ---
        if (endpoint.includes('/api/ai/knowledge')) {
            return aiAssistantKnowledge as T;
        }

        // --- 7. DOC & INVOICE GENERATION ---
        if (endpoint.includes('/api/invoice/generate')) {
            interface InvoiceBody {
                patientName?: string;
                items?: unknown[];
                subtotal?: number;
                batchNumber?: string;
            }
            const body = (options.body as InvoiceBody) || {};
            return {
                invoiceId: 'INV-' + Date.now().toString(36).toUpperCase(),
                date: new Date().toISOString(),
                pharmacyName: 'MediCare Pharmacy',
                patientName: body.patientName || 'Unknown Patient',
                items: body.items || [],
                subtotal: body.subtotal || 0,
                gst: Math.round((body.subtotal || 0) * 0.12),
                total: Math.round((body.subtotal || 0) * 1.12),
                batchNumber: body.batchNumber
            } as T;
        }

        if (endpoint.includes('/api/doctor/query')) {
            return { success: true, message: 'Priority Alert sent to Physician' } as T;
        }

        // --- 8. PLATFORM DATA (University Health Ecosystem) ---
        // --- 8. PLATFORM DATA (University Health Ecosystem) ---
        if (endpoint.includes('/api/students/lookup/')) {
            const studentId = endpoint.split('/lookup/')[1];
            const student = lookupStudent(studentId);
            if (student) return student as T;
            return { error: 'Student not found' } as T;
        }
        if (endpoint.includes('/api/students/prescriptions/')) {
            const studentId = endpoint.split('/prescriptions/')[1];
            return getStudentPrescriptions(studentId) as T;
        }
        if (endpoint.includes('/api/staff')) {
            return [...pharmacyStaff] as T;
        }
        if (endpoint.includes('/api/vendors')) {
            return [...vendors] as T;
        }
        if (endpoint.includes('/api/purchase-orders')) {
            return [...purchaseOrders] as T;
        }
        if (endpoint.includes('/api/revenue/daily')) {
            return [...dailyRevenueData] as T;
        }
        if (endpoint.includes('/api/university-inventory/barcode/')) {
            const barcode = endpoint.split('/barcode/')[1];
            return getInventoryByBarcode(barcode) as T;
        }
        if (endpoint.includes('/api/university-inventory')) {
            return [...universityInventory] as T;
        }

        // Fallback for unhandled mock routes
        return { success: true, timestamp: new Date().toISOString() } as T;

    } catch (error) {
        console.error('[API Error]', error);
        throw new Error('Clinical API Connectivity Failure');
    }
};

// =============================
// UTILITY SERVICES
// =============================

/**
 * MOCK: Translates GPS coordinates to a physical address.
 * Critical for emergency delivery location services.
 */
const reverseGeocode = async (lat: number, lng: number) => ({
    success: true,
    address: `${lat.toFixed(4)}, ${lng.toFixed(4)} - MediAssist Pharma Park, Mumbai 400012`,
    location: { lat, lng }
});

/**
 * Robust Location Service with fallback to Mumbai Tech Center.
 * Handles user permissions and browser limitations gracefully.
 */
const getCurrentLocation = (): Promise<{ lat: number; lng: number; accuracy: number }> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            resolve({ lat: 19.0760, lng: 72.8777, accuracy: 100 });
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy
            }),
            () => resolve({ lat: 19.0760, lng: 72.8777, accuracy: 100 }), // Default fallback
            { enableHighAccuracy: true, timeout: 5000 }
        );
    });
};

export {
    getBackendUrl,
    getAuthToken,
    getAuthHeaders,
    apiRequest,
    reverseGeocode,
    getCurrentLocation
};
