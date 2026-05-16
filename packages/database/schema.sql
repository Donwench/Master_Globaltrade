-- ==================== EXTENSIONS ====================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================== CORE USERS & AUTH ====================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'buyer',
  status VARCHAR(50) DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  company_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo_url TEXT,
  website VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  country VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  address TEXT,
  company_type VARCHAR(50),
  industry VARCHAR(100),
  employee_count VARCHAR(50),
  revenue VARCHAR(50),
  founding_year INTEGER,
  tax_id VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verification_badge VARCHAR(50),
  compliance_score INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_trades INTEGER DEFAULT 0,
  stripe_customer_id VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

ALTER TABLE users ADD CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES companies(id);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role_id)
);

-- ==================== MARKETPLACE PRODUCTS ====================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  icon_url TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hs_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  import_restrictions JSONB,
  export_restrictions JSONB,
  compliance_requirements TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  description TEXT,
  category_id UUID REFERENCES categories(id),
  hs_code_id UUID REFERENCES hs_codes(id),
  unit_price DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  min_order_quantity INTEGER,
  unit_of_measure VARCHAR(50),
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  certificates JSONB DEFAULT '[]',
  moq_price DECIMAL(15, 2),
  lead_time_days INTEGER,
  stock_status VARCHAR(50) DEFAULT 'in_stock',
  stock_quantity INTEGER,
  origin_country VARCHAR(100),
  packaging_type VARCHAR(100),
  shelf_life VARCHAR(100),
  quality_grade VARCHAR(50),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_inquiries INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE product_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  document_type VARCHAR(100),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== MARKETPLACE RFQ & QUOTATIONS ====================

CREATE TABLE rfqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  quantity INTEGER NOT NULL,
  unit_of_measure VARCHAR(50),
  target_price DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  delivery_location VARCHAR(255),
  delivery_country VARCHAR(100),
  incoterm VARCHAR(50),
  preferred_shipping_method VARCHAR(100),
  required_certifications JSONB DEFAULT '[]',
  compliance_requirements JSONB DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'open',
  expire_at TIMESTAMP,
  urgency VARCHAR(50) DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP
);

CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id),
  supplier_id UUID NOT NULL REFERENCES users(id),
  supplier_company_id UUID NOT NULL REFERENCES companies(id),
  unit_price DECIMAL(15, 2) NOT NULL,
  total_price DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  delivery_time_days INTEGER,
  incoterm VARCHAR(50),
  payment_terms VARCHAR(100),
  validity_days INTEGER DEFAULT 30,
  validity_expires_at TIMESTAMP,
  notes TEXT,
  attachments JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'pending',
  rating_by_buyer DECIMAL(3, 2),
  review_by_buyer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== ORDERS & TRANSACTIONS ====================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE,
  quotation_id UUID REFERENCES quotations(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  buyer_company_id UUID NOT NULL REFERENCES companies(id),
  supplier_id UUID NOT NULL REFERENCES users(id),
  supplier_company_id UUID NOT NULL REFERENCES companies(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15, 2),
  total_amount DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  incoterm VARCHAR(50),
  payment_terms VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  order_status VARCHAR(50) DEFAULT 'confirmed',
  delivery_address TEXT,
  delivery_country VARCHAR(100),
  shipping_method VARCHAR(100),
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  tracking_number VARCHAR(100),
  forwarder_id UUID REFERENCES users(id),
  customs_broker_id UUID REFERENCES users(id),
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE TABLE order_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  document_type VARCHAR(100),
  file_url TEXT,
  file_name VARCHAR(255),
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== CRM SYSTEM ====================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  lead_type VARCHAR(50),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  company_name VARCHAR(255),
  job_title VARCHAR(100),
  industry VARCHAR(100),
  lead_source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  value DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  expected_close_date DATE,
  notes TEXT,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  lead_id UUID REFERENCES leads(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  job_title VARCHAR(100),
  department VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assigned_to UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  related_to_type VARCHAR(50),
  related_to_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'open',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- ==================== MESSAGING ====================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1_id UUID NOT NULL REFERENCES users(id),
  participant_2_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) DEFAULT 'direct',
  name VARCHAR(255),
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT,
  attachments JSONB DEFAULT '[]',
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP
);

-- ==================== DOCUMENTS & FILE MANAGEMENT ====================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  document_type VARCHAR(100),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  related_to_type VARCHAR(50),
  related_to_id UUID,
  extracted_data JSONB DEFAULT '{}',
  storage_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- ==================== SUPPLIER VERIFICATION ====================

CREATE TABLE supplier_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) UNIQUE,
  business_registration_verified BOOLEAN DEFAULT FALSE,
  tax_id_verified BOOLEAN DEFAULT FALSE,
  export_license_verified BOOLEAN DEFAULT FALSE,
  quality_certifications JSONB DEFAULT '[]',
  trade_history_score INTEGER DEFAULT 0,
  on_time_delivery_rate DECIMAL(5, 2) DEFAULT 0.00,
  product_quality_rating DECIMAL(3, 2) DEFAULT 0.00,
  payment_reliability_score INTEGER DEFAULT 0,
  compliance_violations_count INTEGER DEFAULT 0,
  sanctions_check_status VARCHAR(50) DEFAULT 'pending',
  verified_badge_level VARCHAR(50),
  verification_expiry_date DATE,
  verified_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== COMPLIANCE & TRADE ====================

CREATE TABLE compliance_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  alert_type VARCHAR(100),
  severity VARCHAR(50) DEFAULT 'medium',
  description TEXT,
  related_country VARCHAR(100),
  related_product VARCHAR(255),
  status VARCHAR(50) DEFAULT 'open',
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trade_regulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_country VARCHAR(100),
  to_country VARCHAR(100),
  hs_code_id UUID REFERENCES hs_codes(id),
  import_duty_rate DECIMAL(5, 2),
  export_restrictions TEXT,
  import_restrictions TEXT,
  required_documentation JSONB DEFAULT '[]',
  special_requirements TEXT,
  effective_date DATE,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== SUBSCRIPTIONS & BILLING ====================

CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  tier VARCHAR(50),
  price DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  billing_period VARCHAR(50) DEFAULT 'monthly',
  features JSONB DEFAULT '{}',
  max_rfq_per_month INTEGER,
  max_products INTEGER,
  max_team_members INTEGER,
  api_access BOOLEAN DEFAULT FALSE,
  priority_support BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  current_period_start DATE,
  current_period_end DATE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  subscription_id UUID REFERENCES subscriptions(id),
  invoice_number VARCHAR(50) UNIQUE,
  amount DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'unpaid',
  payment_date DATE,
  due_date DATE,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== NOTIFICATIONS ====================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100),
  title VARCHAR(255),
  message TEXT,
  related_to_type VARCHAR(50),
  related_to_id UUID,
  action_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== AUDIT LOGS ====================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100),
  entity_type VARCHAR(100),
  entity_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXES ====================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_rfqs_buyer_id ON rfqs(buyer_id);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_quotations_rfq_id ON quotations(rfq_id);
CREATE INDEX idx_quotations_supplier_id ON quotations(supplier_id);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_leads_company_id ON leads(company_id);
CREATE INDEX idx_leads_owner_id ON leads(owner_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_documents_company_id ON documents(company_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
