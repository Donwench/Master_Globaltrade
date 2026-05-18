/**
 * Analytics Types
 * Defines marketplace metrics, reports, and performance analytics
 */

export type MetricType = 'gmv' | 'transaction_count' | 'aov' | 'conversion_rate' | 'user_growth';
export type TimeGranularity = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ReportType = 'sales' | 'user' | 'supplier' | 'market' | 'trend' | 'compliance';

export interface MarketplaceMetrics {
  metricsId: string;
  date: Date;
  period: TimeGranularity;
  gmv: number; // Gross Merchandise Value
  transactionCount: number;
  averageOrderValue: number;
  conversionRate: number;
  userAcquisition: number;
  activeUsers: number;
  newListings: number;
  completedOrders: number;
  cancelledOrders: number;
  currency: string;
}

export interface TransactionAnalytics {
  transactionId: string;
  orderId: string;
  buyerId: string;
  supplierId: string;
  value: number;
  currency: string;
  category: string;
  status: 'completed' | 'failed' | 'pending' | 'refunded';
  paymentMethod: string;
  timestamp: Date;
  duration: number; // seconds from order to delivery
  satisfaction?: number; // 1-5 rating
}

export interface SupplierAnalytics {
  supplierId: string;
  name: string;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  responseTime: number; // hours
  completionRate: number; // percentage
  returnRate: number; // percentage
  accountAge: number; // days
  verificationTier: string;
  marketShare: number; // percentage
  growth: {
    monthOverMonth: number;
    quarterOverQuarter: number;
    yearOverYear: number;
  };
}

export interface UserAnalytics {
  userId: string;
  email: string;
  role: 'buyer' | 'supplier';
  accountAge: number; // days
  totalOrders?: number;
  totalSpent?: number;
  totalRevenue?: number;
  averageOrderValue?: number;
  lastActivity: Date;
  activityScore: number;
  engagementLevel: 'low' | 'medium' | 'high' | 'very_high';
  churnRisk: 'low' | 'medium' | 'high';
}

export interface MarketTrend {
  trendId: string;
  category: string;
  period: TimeGranularity;
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  change: number; // percentage
  forecastedTrend?: 'increasing' | 'decreasing' | 'stable';
  confidence: number; // 0-100
  relatedCategories: string[];
  insights: string[];
}

export interface CompetitiveAnalysis {
  analysisId: string;
  supplierId: string;
  competitors: CompetitorData[];
  marketPosition: {
    rank: number;
    percentile: number;
  };
  priceComparison: {
    average: number;
    lowPrice: number;
    highPrice: number;
    supplierPrice: number;
  };
}

export interface CompetitorData {
  competitorId: string;
  name: string;
  rating: number;
  orderCount: number;
  priceRange: [number, number];
  responseTime: number;
  productQuality: number;
}

export interface AnalyticsReport {
  reportId: string;
  type: ReportType;
  generatedAt: Date;
  generatedBy: string;
  period: {
    from: Date;
    to: Date;
  };
  title: string;
  summary: string;
  metrics: Record<string, any>;
  charts: ChartData[];
  insights: string[];
  recommendations: string[];
  fileUrl?: string;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }[];
  };
}

export interface DashboardWidget {
  widgetId: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'map';
  data: Record<string, any>;
  refreshInterval: number; // seconds
  lastUpdated: Date;
}

export interface AnalyticsFilter {
  dateRange?: { from: Date; to: Date };
  category?: string;
  supplierId?: string;
  buyerId?: string;
  granularity?: TimeGranularity;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CustomReport {
  reportId: string;
  name: string;
  type: ReportType;
  metrics: MetricType[];
  filters: AnalyticsFilter;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    enabled: boolean;
  };
  createdAt: Date;
  lastGenerated?: Date;
}
