// ===== USER ROLES =====
export const USER_ROLES = {
  BUYER: 'buyer',
  SUPPLIER: 'supplier',
  MANUFACTURER: 'manufacturer',
  FREIGHT_FORWARDER: 'freight_forwarder',
  CUSTOMS_BROKER: 'customs_broker',
  SALES_AGENT: 'sales_agent',
  ADMIN: 'admin',
} as const;

// ===== STATUSES =====
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
} as const;

export const RFQ_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

export const QUOTATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  CONVERTED_TO_ORDER: 'converted_to_order',
} as const;

export const ORDER_STATUS = {
  CONFIRMED: 'confirmed',
  PRODUCTION: 'production',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded',
} as const;

// ===== CURRENCIES =====
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CNY: 'CNY',
  RUB: 'RUB',
  INR: 'INR',
  AED: 'AED',
} as const;

// ===== INCOTERMS =====
export const INCOTERMS = [
  'EXW', // Ex Works
  'FCA', // Free Carrier
  'FAS', // Free Alongside Ship
  'FOB', // Free on Board
  'CFR', // Cost and Freight
  'CIF', // Cost, Insurance and Freight
  'CPT', // Carriage Paid To
  'CIP', // Carriage and Insurance Paid To
  'DAP', // Delivered at Place
  'DPU', // Delivered at Place Unloaded
  'DDP', // Delivered Duty Paid
] as const;

// ===== VERIFICATION BADGES =====
export const VERIFICATION_BADGES = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;

// ===== SUBSCRIPTION TIERS =====
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

// ===== LANGUAGES =====
export const LANGUAGES = {
  EN: 'en',
  RU: 'ru',
  ZH: 'zh',
  AR: 'ar',
} as const;

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
  zh: '中文',
  ar: 'العربية',
};

// ===== PAGINATION =====
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ===== FILE UPLOAD =====
export const ALLOWED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS: 'application/vnd.ms-excel',
  PNG: 'image/png',
  JPG: 'image/jpeg',
  JPEG: 'image/jpeg',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ===== VALIDATION =====
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  MIN_PASSWORD_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 255,
};

// ===== API CONFIG =====
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// ===== ROUTES =====
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/dashboard/products',
  RFQ: '/dashboard/rfq',
  ORDERS: '/dashboard/orders',
  SUPPLIERS: '/dashboard/suppliers',
  MESSAGES: '/dashboard/messages',
  SETTINGS: '/dashboard/settings',
  ADMIN: '/admin',
} as const;

// ===== COMPANY TYPES =====
export const COMPANY_TYPES = [
  'Manufacturer',
  'Exporter',
  'Importer',
  'Trader',
  'Freight Forwarder',
  'Customs Broker',
  'Distribution',
  'Other',
];

// ===== INDUSTRIES =====
export const INDUSTRIES = [
  'Electronics',
  'Textiles',
  'Chemicals',
  'Machinery',
  'Automotive',
  'Food & Beverage',
  'Furniture',
  'Construction',
  'Agriculture',
  'Other',
];
