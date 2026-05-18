/**
 * Order Management Types
 * Defines order lifecycle, items, shipping, and payment tracking
 */

export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'disputed' | 'returned';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'disputed';
export type ShipmentStatus = 'pending' | 'picked' | 'packaged' | 'shipped' | 'in_transit' | 'delivered' | 'failed' | 'returned';
export type ShipmentCarrier = 'dhl' | 'fedex' | 'ups' | 'local' | 'custom';
export type OrderType = 'purchase' | 'sample' | 'trial';

export interface Order {
  orderId: string;
  purchaseOrderNumber: string;
  buyerId: string;
  supplierId: string;
  orderDate: Date;
  orderType: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  totalQuantity: number;
  currency: string;
  shippingAddress: Address;
  billingAddress?: Address;
  payment: PaymentInfo;
  shipment?: ShipmentInfo;
  terms: {
    paymentTerms: string;
    incoterms: string;
    leadTime: number; // days
    deliveryDate: Date;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  deliveredAt?: Date;
  disputedAt?: Date;
  timeline: OrderTimeline[];
  attachments?: OrderAttachment[];
  metadata?: Record<string, any>;
}

export interface OrderItem {
  itemId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  description?: string;
  specifications?: Record<string, any>;
  unitOfMeasure: string;
  hsCode?: string;
  countryOfOrigin?: string;
  customsValue?: number;
}

export interface Address {
  addressId: string;
  name: string;
  streetAddress: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  email?: string;
  coordinates?: { latitude: number; longitude: number };
  isDefault: boolean;
}

export interface PaymentInfo {
  paymentId: string;
  method: 'credit_card' | 'bank_transfer' | 'letter_of_credit' | 'escrow' | 'other';
  status: PaymentStatus;
  amount: number;
  currency: string;
  dueDate: Date;
  paidDate?: Date;
  paymentReference?: string;
  invoiceNumber?: string;
  invoiceDate?: Date;
  gatewayResponse?: Record<string, any>;
  disputes?: PaymentDispute[];
}

export interface PaymentDispute {
  disputeId: string;
  reason: string;
  amount: number;
  status: 'filed' | 'investigating' | 'resolved' | 'resolved_buyer' | 'resolved_seller';
  filedDate: Date;
  resolvedDate?: Date;
  resolution?: string;
  evidence: string[];
}

export interface ShipmentInfo {
  shipmentId: string;
  status: ShipmentStatus;
  carrier: ShipmentCarrier;
  trackingNumber: string;
  trackingUrl?: string;
  shippingDate: Date;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  origin: Address;
  destination: Address;
  weight?: number; // kg
  volume?: number; // cubic meters
  packages?: Package[];
  customs?: CustomsInfo;
  insuranceInfo?: InsuranceInfo;
  events: ShipmentEvent[];
}

export interface Package {
  packageId: string;
  trackingNumber: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };
  contents: string;
  seals?: string[];
}

export interface CustomsInfo {
  customsId: string;
  declaredValue: number;
  hsCode: string;
  description: string;
  originCountry: string;
  destinationCountry: string;
  status: 'pending' | 'cleared' | 'held' | 'rejected';
  clearanceDate?: Date;
  documents: CustomsDocument[];
  duties?: {
    amount: number;
    paidDate?: Date;
    payer: 'buyer' | 'seller';
  };
}

export interface CustomsDocument {
  documentId: string;
  type: 'invoice' | 'packing_list' | 'certificate' | 'license' | 'permit';
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface InsuranceInfo {
  insuranceId: string;
  provider: string;
  policyNumber: string;
  amount: number;
  currency: string;
  coverage: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'claimed';
  claims?: InsuranceClaim[];
}

export interface InsuranceClaim {
  claimId: string;
  description: string;
  amount: number;
  filedDate: Date;
  status: 'filed' | 'approved' | 'rejected' | 'paid';
  evidence: string[];
}

export interface ShipmentEvent {
  eventId: string;
  status: ShipmentStatus;
  timestamp: Date;
  location?: string;
  description: string;
  eventCode?: string;
  details?: Record<string, any>;
}

export interface OrderTimeline {
  timelineId: string;
  event: string;
  timestamp: Date;
  actor: string;
  changes?: Record<string, any>;
  notes?: string;
}

export interface OrderAttachment {
  attachmentId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: Date;
  category: string;
}

export interface OrderStatistics {
  supplierId: string;
  period: { from: Date; to: Date };
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
  cancellationRate: number;
  returnRate: number;
  averageDeliveryTime: number;
  paymentOnTimeRate: number;
  disputeRate: number;
  topBuyers: { buyerId: string; orderCount: number; revenue: number }[];
  topProducts: { productId: string; quantity: number; revenue: number }[];
}

export interface OrderFilter {
  status?: OrderStatus[];
  supplierId?: string;
  buyerId?: string;
  dateRange?: { from: Date; to: Date };
  amountRange?: [number, number];
  paymentStatus?: PaymentStatus[];
  shipmentStatus?: ShipmentStatus[];
  country?: string;
  sortBy?: 'date' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderNotification {
  notificationId: string;
  orderId: string;
  userId: string;
  type: 'order_confirmed' | 'payment_received' | 'shipment_updated' | 'delivery_complete' | 'order_cancelled' | 'payment_failed' | 'dispute_filed';
  title: string;
  message: string;
  actionUrl?: string;
  createdAt: Date;
  read: boolean;
  readAt?: Date;
}
