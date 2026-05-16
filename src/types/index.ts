// ===== AUTH & USER =====
export type UserRole = 'buyer' | 'supplier' | 'manufacturer' | 'freight_forwarder' | 'customs_broker' | 'sales_agent' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'banned';
export type Language = 'en' | 'ru' | 'zh' | 'ar';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  language: Language;
  timezone: string;
  companyId?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  state?: string;
  postalCode?: string;
  address?: string;
  companyType: string;
  industry?: string;
  employeeCount?: string;
  revenue?: string;
  foundingYear?: number;
  taxId?: string;
  verified: boolean;
  verificationBadge?: 'bronze' | 'silver' | 'gold' | 'platinum';
  complianceScore: number;
  rating: number;
  totalTrades: number;
  stripeCustomerId?: string;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  company?: Company;
  tokens: AuthToken;
}

// ===== MARKETPLACE =====
export type OrderStatus = 'confirmed' | 'production' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
export type RFQStatus = 'open' | 'closed' | 'expired' | 'cancelled';
export type QuotationStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'converted_to_order';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  parentId?: string;
}

export interface HSCode {
  id: string;
  code: string;
  description: string;
  categoryId?: string;
  importRestrictions?: Record<string, any>;
  exportRestrictions?: Record<string, any>;
  complianceRequirements?: string;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  description: string;
  categoryId?: string;
  hsCodeId?: string;
  unitPrice: number;
  currency: string;
  minOrderQuantity: number;
  unitOfMeasure: string;
  images: string[];
  specifications: Record<string, any>;
  certificates: string[];
  moqPrice?: number;
  leadTimeDays: number;
  stockStatus: string;
  stockQuantity?: number;
  originCountry: string;
  packagingType?: string;
  shelfLife?: string;
  qualityGrade?: string;
  rating: number;
  totalInquiries: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RFQ {
  id: string;
  buyerId: string;
  companyId: string;
  title: string;
  description: string;
  categoryId?: string;
  quantity: number;
  unitOfMeasure: string;
  targetPrice?: number;
  currency: string;
  deliveryLocation: string;
  deliveryCountry: string;
  incoterm: string;
  preferredShippingMethod?: string;
  requiredCertifications: string[];
  complianceRequirements?: Record<string, any>;
  attachments: string[];
  status: RFQStatus;
  expireAt?: Date;
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface Quotation {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierCompanyId: string;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  deliveryTimeDays: number;
  incoterm: string;
  paymentTerms: string;
  validityDays: number;
  validityExpiresAt: Date;
  notes?: string;
  attachments: string[];
  status: QuotationStatus;
  ratingByBuyer?: number;
  reviewByBuyer?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  quotationId?: string;
  buyerId: string;
  buyerCompanyId: string;
  supplierId: string;
  supplierCompanyId: string;
  productId?: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  incoterm: string;
  paymentTerms: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  orderStatus: OrderStatus;
  deliveryAddress: string;
  deliveryCountry: string;
  shippingMethod?: string;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  trackingNumber?: string;
  forwarderId?: string;
  customsBrokerId?: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ===== CRM =====
export interface Lead {
  id: string;
  ownerId: string;
  companyId: string;
  leadType: 'buyer' | 'supplier' | 'manufacturer';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName: string;
  jobTitle?: string;
  industry?: string;
  leadSource?: string;
  status: 'new' | 'qualified' | 'negotiating' | 'won' | 'lost';
  value?: number;
  currency: string;
  expectedCloseDate?: Date;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface Contact {
  id: string;
  companyId: string;
  leadId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  language: Language;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  assignedTo: string;
  companyId: string;
  relatedToType?: 'lead' | 'contact' | 'rfq' | 'order';
  relatedToId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ===== MESSAGES =====
export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  type: 'direct' | 'group';
  name?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments: string[];
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  editedAt?: Date;
}

// ===== DOCUMENTS =====
export interface Document {
  id: string;
  uploadedBy: string;
  companyId: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  relatedToType?: string;
  relatedToId?: string;
  extractedData: Record<string, any>;
  storageStatus: string;
  createdAt: Date;
  deletedAt?: Date;
}

// ===== SUPPLIER VERIFICATION =====
export interface SupplierVerification {
  id: string;
  companyId: string;
  businessRegistrationVerified: boolean;
  taxIdVerified: boolean;
  exportLicenseVerified: boolean;
  qualityCertifications: string[];
  tradeHistoryScore: number;
  onTimeDeliveryRate: number;
  productQualityRating: number;
  paymentReliabilityScore: number;
  complianceViolationsCount: number;
  sanctionsCheckStatus: 'pending' | 'clean' | 'flagged';
  verifiedBadgeLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
  verificationExpiryDate?: Date;
  verifiedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== NOTIFICATIONS =====
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedToType?: string;
  relatedToId?: string;
  actionUrl?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

// ===== API RESPONSES =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: Record<string, any>;
}
