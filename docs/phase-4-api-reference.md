# Phase 4: Complete API Reference

## API Endpoints Overview

This document provides comprehensive API endpoint specifications for Phase 4 Advanced Features.

---

## 1. Order Management API

### 1.1 Create Order
```
POST /api/orders
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "buyerId": "uuid",
  "supplierId": "uuid",
  "orderType": "purchase",
  "items": [
    {
      "productId": "uuid",
      "quantity": 100,
      "unitPrice": 10.50,
      "sku": "PROD-001"
    }
  ],
  "shippingAddress": {
    "name": "Company Name",
    "streetAddress": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US",
    "phoneNumber": "+1-555-0123"
  },
  "incoterms": "FOB",
  "leadTime": 30,
  "paymentTerms": "Net 30",
  "notes": "Special handling required"
}

Response: 201 Created
{
  "orderId": "uuid",
  "purchaseOrderNumber": "PO-2024-001",
  "status": "draft",
  "createdAt": "2024-05-18T10:00:00Z"
}
```

### 1.2 Get Order Details
```
GET /api/orders/:orderId
Authorization: Bearer {token}

Response: 200 OK
{
  "orderId": "uuid",
  "purchaseOrderNumber": "PO-2024-001",
  "buyerId": "uuid",
  "supplierId": "uuid",
  "status": "pending",
  "items": [...],
  "totalAmount": 1050.00,
  "payment": {...},
  "shipment": {...},
  "timeline": [...]
}
```

### 1.3 Update Order Status
```
PATCH /api/orders/:orderId/status
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "status": "confirmed",
  "notes": "Order confirmed and ready to process"
}

Response: 200 OK
{
  "orderId": "uuid",
  "status": "confirmed",
  "updatedAt": "2024-05-18T11:00:00Z"
}
```

### 1.4 List Orders
```
GET /api/orders?status=pending&supplierId=uuid&page=1&limit=20
Authorization: Bearer {token}

Query Parameters:
- status: OrderStatus[]
- supplierId: string (uuid)
- buyerId: string (uuid)
- dateRange: {from: date, to: date}
- sortBy: 'date' | 'amount' | 'status'
- sortOrder: 'asc' | 'desc'
- page: number
- limit: number

Response: 200 OK
{
  "data": [{...}, {...}],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 1.5 Update Payment Status
```
PATCH /api/orders/:orderId/payment
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "status": "completed",
  "paidDate": "2024-05-18",
  "paymentReference": "TXN-12345"
}

Response: 200 OK
{
  "orderId": "uuid",
  "payment": {
    "status": "completed",
    "amount": 1050.00,
    "paidDate": "2024-05-18"
  }
}
```

### 1.6 Update Shipment Tracking
```
PATCH /api/orders/:orderId/shipment
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "carrier": "dhl",
  "trackingNumber": "1234567890",
  "status": "in_transit",
  "estimatedDeliveryDate": "2024-06-10"
}

Response: 200 OK
{
  "orderId": "uuid",
  "shipment": {
    "trackingNumber": "1234567890",
    "status": "in_transit",
    "estimatedDeliveryDate": "2024-06-10"
  }
}
```

---

## 2. Supplier Verification API

### 2.1 Submit Verification Request
```
POST /api/suppliers/:supplierId/verification
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "documents": [
    {
      "type": "business_license",
      "fileUrl": "s3://bucket/file.pdf"
    }
  ],
  "businessInfo": {
    "operationYears": 5,
    "employees": 50,
    "annualRevenue": 1000000
  }
}

Response: 201 Created
{
  "verificationId": "uuid",
  "status": "pending",
  "tier": "unverified",
  "submittedAt": "2024-05-18T10:00:00Z"
}
```

### 2.2 Get Verification Status
```
GET /api/suppliers/:supplierId/verification
Authorization: Bearer {token}

Response: 200 OK
{
  "verificationId": "uuid",
  "tier": "bronze",
  "status": "approved",
  "riskScore": 25,
  "complianceScore": 92,
  "approvedAt": "2024-05-15T14:30:00Z",
  "expiresAt": "2025-05-15",
  "documents": [...]
}
```

### 2.3 Upload Verification Document
```
POST /api/suppliers/:supplierId/verification/documents
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: binary
- type: DocumentType
- expiryDate: date (optional)

Response: 201 Created
{
  "documentId": "uuid",
  "status": "pending",
  "uploadedAt": "2024-05-18T10:00:00Z"
}
```

### 2.4 Admin Review Verification
```
PATCH /api/verification/:verificationId/review
Authorization: Bearer {admin-token}
Content-Type: application/json

Request Body:
{
  "status": "approved",
  "tier": "gold",
  "riskScore": 15,
  "complianceScore": 98,
  "comments": "Excellent business documentation"
}

Response: 200 OK
{
  "verificationId": "uuid",
  "tier": "gold",
  "status": "approved",
  "reviewedAt": "2024-05-18T12:00:00Z"
}
```

### 2.5 List Verification Requests
```
GET /api/verification?status=pending&tier=bronze&page=1
Authorization: Bearer {admin-token}

Query Parameters:
- status: VerificationStatus[]
- tier: VerificationTier[]
- riskLevel: RiskLevel[]
- sortBy: 'tier' | 'riskScore' | 'createdAt'
- page: number
- limit: number

Response: 200 OK
{
  "data": [{...}, {...}],
  "pagination": {...}
}
```

---

## 3. Compliance Intelligence API

### 3.1 Run Compliance Check
```
POST /api/compliance/check
Authorization: Bearer {admin-token}
Content-Type: application/json

Request Body:
{
  "checkType": "sanctions",
  "entityName": "Company XYZ",
  "entityType": "company",
  "country": "US",
  "orderId": "uuid"
}

Response: 200 OK
{
  "checkId": "uuid",
  "status": "passed",
  "riskLevel": "low",
  "score": 95,
  "flags": [],
  "completedAt": "2024-05-18T10:05:00Z"
}
```

### 3.2 Sanctions Screening
```
GET /api/compliance/sanctions/:entityId
Authorization: Bearer {token}

Query Parameters:
- databases: string[] (e.g., ['OFAC', 'UN', 'EU'])
- forceRefresh: boolean

Response: 200 OK
{
  "screeningId": "uuid",
  "entityName": "Company XYZ",
  "status": "passed",
  "matches": [],
  "riskLevel": "low",
  "screenedAt": "2024-05-18T10:00:00Z",
  "nextScreeningDate": "2024-08-18"
}
```

### 3.3 Export Control Check
```
POST /api/compliance/export-control
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "productId": "uuid",
  "destinationCountry": "CN",
  "endUse": "commercial"
}

Response: 200 OK
{
  "checkId": "uuid",
  "eccn": "EAR99",
  "controlStatus": "no_control",
  "restrictions": [],
  "validUntil": "2025-05-18"
}
```

### 3.4 Generate Compliance Report
```
POST /api/compliance/reports
Authorization: Bearer {admin-token}
Content-Type: application/json

Request Body:
{
  "type": "violations",
  "period": {
    "from": "2024-01-01",
    "to": "2024-05-18"
  }
}

Response: 201 Created
{
  "reportId": "uuid",
  "status": "generating",
  "estimatedCompletion": "2024-05-18T11:00:00Z"
}
```

### 3.5 List Compliance Checks
```
GET /api/compliance/checks?checkType=sanctions&status=failed
Authorization: Bearer {admin-token}

Query Parameters:
- checkType: ComplianceCheckType[]
- status: ComplianceStatus[]
- riskLevel: string[]
- dateRange: {from: date, to: date}
- sortBy: 'date' | 'riskLevel' | 'status'
- page: number
- limit: number

Response: 200 OK
{
  "data": [{...}, {...}],
  "pagination": {...}
}
```

---

## 4. Admin Panel API

### 4.1 Get Dashboard Metrics
```
GET /api/admin/dashboard
Authorization: Bearer {admin-token}

Query Parameters:
- period: 'today' | 'week' | 'month' | 'year'
- metrics: string[] (e.g., ['gmv', 'orders', 'users'])

Response: 200 OK
{
  "metrics": {
    "gmv": 150000,
    "orders": 1250,
    "activeUsers": 450,
    "newSuppliers": 12
  },
  "trends": {...},
  "alerts": [...]
}
```

### 4.2 List Users
```
GET /api/admin/users?role=supplier&status=active&page=1
Authorization: Bearer {admin-token}

Query Parameters:
- role: 'buyer' | 'supplier' | 'admin'
- status: 'active' | 'suspended' | 'inactive'
- sortBy: 'name' | 'createdAt' | 'lastActivity'
- page: number
- limit: number

Response: 200 OK
{
  "data": [{...}, {...}],
  "pagination": {...}
}
```

### 4.3 Suspend User
```
PATCH /api/admin/users/:userId/suspend
Authorization: Bearer {admin-token}
Content-Type: application/json

Request Body:
{
  "type": "temporary",
  "duration": 30,
  "reason": "Violating terms of service"
}

Response: 200 OK
{
  "userId": "uuid",
  "suspensionId": "uuid",
  "status": "active",
  "expiresAt": "2024-06-17"
}
```

### 4.4 Get Moderation Queue
```
GET /api/admin/moderation?type=listing&status=pending
Authorization: Bearer {admin-token}

Query Parameters:
- type: 'listing' | 'review' | 'message' | 'profile'
- status: 'pending' | 'flagged'
- priority: 'high' | 'medium' | 'low'
- page: number
- limit: number

Response: 200 OK
{
  "data": [{...}, {...}],
  "totalPending": 45,
  "pagination": {...}
}
```

### 4.5 Take Moderation Action
```
PATCH /api/admin/moderation/:itemId
Authorization: Bearer {admin-token}
Content-Type: application/json

Request Body:
{
  "action": "approve",
  "reason": "Content meets guidelines",
  "notes": "Approved after review"
}

Response: 200 OK
{
  "itemId": "uuid",
  "status": "approved",
  "actionedAt": "2024-05-18T10:00:00Z"
}
```

### 4.6 Bulk User Actions
```
POST /api/admin/bulk-actions
Authorization: Bearer {admin-token}
Content-Type: application/json

Request Body:
{
  "userIds": ["uuid1", "uuid2", "uuid3"],
  "action": "suspend",
  "duration": 7,
  "reason": "Policy violation"
}

Response: 202 Accepted
{
  "actionId": "uuid",
  "status": "processing",
  "affectedUsers": 3
}
```

---

## 5. Analytics API

### 5.1 Get Marketplace Metrics
```
GET /api/analytics/metrics?period=daily&granularity=daily
Authorization: Bearer {token}

Query Parameters:
- period: 'today' | 'week' | 'month' | 'year' | 'custom'
- granularity: 'hourly' | 'daily' | 'weekly' | 'monthly'
- metrics: string[] (e.g., ['gmv', 'aov', 'conversion_rate'])

Response: 200 OK
{
  "data": [
    {
      "date": "2024-05-18",
      "gmv": 50000,
      "transactionCount": 400,
      "averageOrderValue": 125
    }
  ],
  "summary": {
    "totalGmv": 350000,
    "totalTransactions": 2800,
    "trend": "up"
  }
}
```

### 5.2 Get Supplier Analytics
```
GET /api/analytics/suppliers/:supplierId
Authorization: Bearer {token}

Query Parameters:
- period: string
- metrics: string[]

Response: 200 OK
{
  "supplierId": "uuid",
  "metrics": {
    "totalOrders": 450,
    "totalRevenue": 225000,
    "averageRating": 4.7,
    "completionRate": 98.5
  },
  "growth": {
    "monthOverMonth": 15.2,
    "quarterOverQuarter": 42.1
  }
}
```

### 5.3 Get Market Trends
```
GET /api/analytics/trends?category=electronics&period=month
Authorization: Bearer {token}

Query Parameters:
- category: string
- period: string
- limit: number

Response: 200 OK
{
  "trends": [
    {
      "trendId": "uuid",
      "category": "electronics",
      "trend": "increasing",
      "change": 25.3,
      "confidence": 92
    }
  ]
}
```

### 5.4 Generate Custom Report
```
POST /api/analytics/reports
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "Q2 Performance Report",
  "type": "sales",
  "period": {
    "from": "2024-04-01",
    "to": "2024-06-30"
  },
  "metrics": ["gmv", "order_count", "aov"],
  "groupBy": ["supplier_id", "category"],
  "format": "pdf"
}

Response: 202 Accepted
{
  "reportId": "uuid",
  "status": "generating",
  "estimatedCompletion": "2024-05-18T11:30:00Z"
}
```

### 5.5 List Reports
```
GET /api/analytics/reports?type=sales&status=completed
Authorization: Bearer {token}

Query Parameters:
- type: string[]
- status: 'generating' | 'completed' | 'failed'
- sortBy: 'createdAt' | 'name'
- page: number
- limit: number

Response: 200 OK
{
  "data": [{...}, {...}],
  "pagination": {...}
}
```

### 5.6 Get Competitive Analysis
```
GET /api/analytics/competitive/:supplierId
Authorization: Bearer {token}

Response: 200 OK
{
  "supplierId": "uuid",
  "competitors": [
    {
      "competitorId": "uuid",
      "name": "Competitor Co",
      "rating": 4.5,
      "orderCount": 500,
      "priceRange": [10, 20]
    }
  ],
  "marketPosition": {
    "rank": 3,
    "percentile": 85
  }
}
```

---

## Error Responses

All endpoints follow consistent error response format:

```
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "orderId",
        "message": "Invalid UUID format"
      }
    ]
  }
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 202: Accepted (async operation)
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 429: Too Many Requests
- 500: Internal Server Error

---

## Rate Limiting

All API endpoints are rate-limited:
- Standard users: 100 requests/minute
- Premium users: 500 requests/minute
- Admin users: 1000 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1716038400
```

---

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token obtained from:
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

