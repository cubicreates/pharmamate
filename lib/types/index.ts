/**
 * @fileoverview Core Type Definitions for PharmaMate
 * This file contains the domain model types used across the application.
 * All interfaces are strictly typed to ensure clinical data integrity.
 */

/**
 * Standard status lifecycle for a pharmacy order.
 * - Pending: Order received but not yet processed.
 * - Ready: Medicines picked and verified, awaiting fulfillment.
 * - Completed: Order dispensed and payment processed.
 * - Transit: (Phase 2) Order is being delivered to the patient.
 */
export type OrderStatus = 'Pending' | 'Ready' | 'Completed' | 'Transit';

/**
 * Real-time queue status for the physical pharmacy counter.
 * - waiting: Patient in queue, but session not started.
 * - verifying: Patient at counter, OTP/Bio verification in progress.
 * - serving: Active dispensing session.
 */
export type QueueStatus = 'waiting' | 'verifying' | 'serving';

/**
 * Represents a single medicine item within an order.
 */
export interface DrugItem {
    /** Brand name of the medicine */
    name: string;
    /** Strength/Format (e.g. '500mg', '10ml') */
    dosage: string;
    /** Number of units requested */
    quantity: number;
    /** Price per unit/strip */
    price: number;
    /** Core chemical composition for substitute matching */
    salt: string;
}

/**
 * Represents a full prescription order placed via the app.
 */
export interface Order {
    /** Unique database identifier */
    _id: string;
    /** Name of the patient receiving the treatment */
    patientName: string;
    /** Patient Registration Number (Unique ID) */
    patientPrn: string;
    /** ISO 8601 Timestamp of order creation */
    orderDate: string;
    /** Current state in the fulfillment lifecycle */
    status: OrderStatus;
    /** Array of medicines included in this order */
    items: DrugItem[];
    /** Name of the pharmacy handling the order */
    chemistName: string;
    /** Final payable amount (including taxes) */
    total: number;
    /** Name of the physician who wrote the prescription */
    doctorName: string;
    /** Contact detail for doctor clarification */
    doctorPhone: string;
    /** Regulatory requirement: Batch tracking number for the box dispensed */
    batchNumber?: string;
    /** ISO 8601 Timestamp of final dispense */
    fulfilledAt?: string;
}

/**
 * Represents a physical medicine in the pharmacy inventory.
 */
export interface InventoryItem {
    /** SKU/Stock Identifier */
    _id: string;
    /** Brand name */
    name: string;
    /** Therapeutic class (e.g. 'Antibiotics') */
    category: string;
    /** Current available units */
    stock: number;
    /** Threshold that triggers an AI reorder alert */
    reorderLevel: number;
    /** Selling price per unit */
    price: number;
    /** Date of expiration; used for AI-driven shelf audits */
    expiryDate: string;
    /** Pharmaceutical company name */
    manufacturer: string;
    /** Location in the physical shop (e.g. 'Shelf A-1') */
    shelf: string;
    /** Regulatory Batch Number */
    batchNo: string;
    /** Active pharmaceutical ingredient */
    salt: string;
}

/**
 * Represents a patient waiting at the physical counter.
 */
export interface QueueItem {
    /** Unique session identifier */
    _id: string;
    /** Display name of the patient */
    patientName: string;
    /** PRN for verification lookup */
    patientPrn: string;
    /** Entry timestamp for SLA tracking */
    arrivedAt: string;
    /** Current verification/service state */
    status: QueueStatus | string;
    /** Number of items in their bag/prescription */
    itemCount: number;
}

/**
 * Represents the logged-in Pharmacist user.
 */
export interface User {
    /** User ID */
    _id?: string;
    /** Full name of the pharmacist */
    name?: string;
    /** Registered name of the pharmacy shop */
    shopName?: string;
    /** Work email */
    email?: string;
    /** State/National Pharmacy Council License ID */
    licenseNumber?: string;
    /** Physical address of the pharmacy */
    address?: string;
    /** All roles assigned to this user */
    roles?: string[];
    /** The currently active role */
    activeRole?: string;
}

/**
 * Represents the digital extraction of a physical prescription.
 */
export interface Prescription {
    patientName: string;
    patientPrn: string;
    doctorName: string;
    doctorPhone: string;
    doctorClinic: string;
    date: string;
    /** List of medicines as written by the doctor */
    medicines: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        salt: string;
    }>;
    /** Dosage instructions or doctor's advice */
    notes: string;
}
