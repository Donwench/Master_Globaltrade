# 🚀 TradeFlow - Enterprise Global B2B/B2C Import-Export Marketplace

**Enterprise-grade AI-powered platform for sourcing and exporting products from Russia and China to worldwide markets.**

## 📋 Overview

TradeFlow is a next-generation SaaS marketplace combining:
- 🌍 Global supplier network (Russia, China, and beyond)
- 🤖 AI-powered supplier matching and market intelligence
- 📋 RFQ & quotation management system
- 💼 Lightweight CRM integration
- 📦 Logistics & trade compliance tracking
- ✅ Supplier verification system
- 💳 Subscription-based monetization
- 🔐 Enterprise security & role-based access

## 🎯 Target Users

- Manufacturers & Exporters
- Importers & Global Buyers
- Freight Forwarders
- Customs Brokers
- Trading Companies
- SMEs & Enterprise buyers

## 🏗️ Project Structure

```
tradeflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Dashboard shell
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx   # Login page
│   │       └── register/
│   │           └── page.tsx   # Registration page
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # React hooks
│   ├── lib/                    # Utilities & helpers
│   ├── services/               # Business logic services
│   ├── store/                  # Zustand state management
│   ├── types/                  # TypeScript types
│   └── middleware.ts           # Authentication middleware
├── packages/database/          # Database schema & migrations
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
└── next.config.js              # Next.js config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/Donwench/Master_Globaltrade.git
cd Master_Globaltrade
npm install
```

### 2. Database Setup

```bash
# Create database
sudo -u postgres createdb tradeflow

# Load schema
sudo -u postgres psql -d tradeflow -f packages/database/schema.sql

# Or use npm script
npm run db:setup
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
# DATABASE_URL, JWT_SECRET, SUPABASE keys, etc.
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Supabase
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Zustand
- **Auth**: JWT + Middleware
- **API**: RESTful with Next.js API routes
- **Payment**: Stripe (future)
- **Hosting**: Vercel (recommended)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for UI icons

## 🔐 Authentication

- Email/password registration
- JWT access tokens (15m expiry)
- Refresh token rotation (7d)
- Role-based access control (RBAC)
- Two-factor authentication ready
- Social login ready (Google, GitHub)

## 📊 Database Schema

Comprehensive schema including:
- Users & Companies
- Products & Categories
- RFQs & Quotations
- Orders & Transactions
- CRM (Leads, Contacts, Tasks)
- Messaging
- Documents
- Supplier Verification
- Compliance & Trade Regulations
- Subscriptions & Billing
- Notifications & Audit Logs

## 🎨 Design System

- **Typography**: Inter font
- **Colors**: Primary (Sky Blue), Secondary (Slate), Accent (Pink)
- **Components**: Reusable, modular design
- **Animations**: Smooth transitions with Framer Motion
- **Responsiveness**: Mobile-first approach
- **Theme**: Dark/Light mode support
- **Gradients**: Modern gradient overlays
- **Glass Morphism**: Glassmorphic UI elements

## 🚢 Development Phases

### Phase 1: Foundation ✅ COMPLETE
- [x] Project structure
- [x] Database schema
- [x] Authentication setup
- [x] Landing page - Full-featured hero, features showcase, CTA sections
- [x] Dashboard shell - Stats cards, activity charts, recent RFQs, top suppliers
- [x] Login page - Email/password auth with social login ready
- [x] Registration page - Form validation & password strength indicator
- [x] Global styles - Tailwind utilities, animations, glassmorphism

### Phase 2: Marketplace Core
- [ ] Product listing
- [ ] RFQ system
- [ ] Quotation management
- [ ] Supplier profiles
- [ ] Search & filtering

### Phase 3: CRM & Communication
- [ ] Lead management
- [ ] Messaging system
- [ ] Email notifications
- [ ] Task management

### Phase 4: Advanced Features
- [ ] Order management
- [ ] Supplier verification
- [ ] Compliance intelligence
- [ ] Admin panel
- [ ] Analytics

### Phase 5: AI Integration
- [ ] Document extraction
- [ ] Market analysis
- [ ] Smart recommendations
- [ ] Translation API
- [ ] Compliance assistant

### Phase 6: Monetization & Scale
- [ ] Subscription system
- [ ] Payment processing
- [ ] API integration
- [ ] Performance optimization
- [ ] Deployment

## 📝 Environment Variables

Required for development:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
JWT_SECRET=your_secret_min_32_chars
REFRESH_SECRET=your_refresh_secret_min_32_chars
NEXTAUTH_SECRET=your_secret_min_32_chars
```

See `.env.example` for complete list.

## 🔗 API Structure

```
/api/
  /auth/              # Authentication endpoints
  /users/             # User management
  /suppliers/         # Supplier endpoints
  /products/          # Product catalog
  /rfq/               # Request for Quotation
  /quotations/        # Quotation system
  /orders/            # Order management
  /messages/          # Messaging
  /crm/               # CRM endpoints
  /documents/         # File management
  /ai/                # AI services (future)
  /admin/             # Admin endpoints
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Quality
npm run lint             # Run linting
npm run type-check       # Check TypeScript
npm run format           # Format code

# Database
npm run db:setup         # Initialize database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
npm run db:reset         # Reset database
```

## 📚 Documentation

- [API Documentation](./docs/API.md) - Detailed endpoint docs
- [Database Schema](./docs/DATABASE.md) - Schema documentation
- [Architecture Guide](./docs/ARCHITECTURE.md) - System architecture
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production setup

## 🤝 Contributing

Contributions welcome! Please follow:
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component modularity

## 📄 License

Proprietary - All rights reserved

## 🚀 Roadmap & Future

- ✅ Phase 1: Foundation (COMPLETE)
- ⏳ Phase 2: Marketplace Core
- ⏳ Phase 3: CRM & Communication
- ⏳ Phase 4: Advanced Features
- ⏳ Phase 5: AI Integration
- ⏳ Phase 6: Monetization & Scale

## 💼 Enterprise Features (Coming)

- API access for partners
- White-label solutions
- Custom integration support
- Dedicated account management
- SLA & Premium support
- Advanced analytics
- Custom workflows

## 📞 Support

For support and questions:
- Email: support@tradeflow.io
- Docs: https://docs.tradeflow.io
- Issues: GitHub Issues

---

**Built with ❤️ by the TradeFlow Team**

*Making global trade frictionless, transparent, and secure.*
