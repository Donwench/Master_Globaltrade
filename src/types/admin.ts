/**
 * Admin Panel Types
 * Defines admin roles, permissions, content moderation, and audit logging
 */

export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'compliance_officer' | 'support_agent';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type PermissionResource = 'users' | 'orders' | 'compliance' | 'content' | 'reports' | 'settings';
export type ModerationAction = 'approve' | 'reject' | 'remove' | 'flag' | 'warn' | 'suspend' | 'ban';
export type ActivityLogLevel = 'info' | 'warning' | 'error' | 'critical';

export interface AdminUser {
  adminId: string;
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: Permission[];
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  twoFactorEnabled: boolean;
  metadata?: Record<string, any>;
}

export interface Permission {
  permissionId: string;
  resource: PermissionResource;
  action: PermissionAction;
  scope?: string; // e.g., 'global', 'region', 'category'
  conditions?: Record<string, any>;
}

export interface RoleDefinition {
  roleId: string;
  name: AdminRole;
  description: string;
  permissions: Permission[];
  maxUsersAllowed?: number;
  currentUsers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentModerationItem {
  itemId: string;
  type: 'listing' | 'review' | 'image' | 'message' | 'profile' | 'comment';
  contentId: string;
  content: string;
  metadata: Record<string, any>;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  flags: ContentFlag[];
  moderationHistory: ModerationAction[];
  currentModerator?: string;
  notes?: string;
}

export interface ContentFlag {
  flagId: string;
  reason: 'spam' | 'offensive' | 'copyright' | 'fraud' | 'violence' | 'illegal' | 'other';
  flaggedBy: string;
  flaggedAt: Date;
  description?: string;
  evidence?: string[];
  resolved: boolean;
  action?: ModerationAction;
  actionDate?: Date;
}

export interface ModerationAction {
  actionId: string;
  itemId: string;
  action: ModerationAction;
  moderatorId: string;
  performedAt: Date;
  reason: string;
  duration?: number; // in days, for temporary suspensions
  notes?: string;
  appealed?: boolean;
  appealStatus?: 'pending' | 'approved' | 'rejected';
}

export interface UserSuspension {
  suspensionId: string;
  userId: string;
  reason: string;
  type: 'temporary' | 'permanent';
  startDate: Date;
  endDate?: Date;
  suspendedBy: string;
  status: 'active' | 'appealed' | 'lifted';
  appealRequest?: {
    submittedAt: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    decision?: string;
  };
  notes?: string;
}

export interface DashboardWidget {
  widgetId: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'alert';
  data: any;
  refreshInterval: number; // seconds
  lastUpdated: Date;
}

export interface AdminDashboard {
  dashboardId: string;
  adminId: string;
  widgets: DashboardWidget[];
  layout?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemAlert {
  alertId: string;
  type: 'security' | 'performance' | 'compliance' | 'operational';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  details?: Record<string, any>;
  createdAt: Date;
  resolvedAt?: Date;
  assignedTo?: string;
  acknowledgements: {
    userId: string;
    acknowledgedAt: Date;
  }[];
}

export interface AuditLog {
  logId: string;
  adminId: string;
  action: string;
  resource: string;
  resourceId: string;
  level: ActivityLogLevel;
  timestamp: Date;
  details: Record<string, any>;
  changesBefore?: Record<string, any>;
  changesAfter?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
}

export interface BulkAction {
  actionId: string;
  type: string;
  targetType: 'users' | 'orders' | 'listings' | 'reviews';
  targetIds: string[];
  action: string;
  parameters?: Record<string, any>;
  initiatedBy: string;
  initiatedAt: Date;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: {
    processed: number;
    total: number;
    failures: number;
  };
  completedAt?: Date;
  results?: Record<string, any>;
}

export interface SystemConfiguration {
  configId: string;
  key: string;
  value: any;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  isPublic: boolean;
  updatedBy: string;
  updatedAt: Date;
  version: number;
}

export interface AdminNotification {
  notificationId: string;
  adminId: string;
  type: 'alert' | 'task' | 'approval_request' | 'escalation';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface AdminFilter {
  role?: AdminRole[];
  status?: 'active' | 'inactive';
  department?: string;
  lastLoginAfter?: Date;
  sortBy?: 'name' | 'createdAt' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
