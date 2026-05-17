import { NextRequest, NextResponse } from 'next/server';
import { Company } from '@/types';

// Mock suppliers database
const MOCK_SUPPLIERS: Company[] = [
  {
    id: 'c-001',
    name: 'Russian Steel Works',
    slug: 'russian-steel-works',
    description: 'Leading supplier of industrial steel products with 20+ years experience',
    logoUrl: '',
    website: 'https://russiansteel.example.com',
    email: 'contact@russiansteel.com',
    phone: '+7-123-456-7890',
    country: 'Russia',
    city: 'Moscow',
    companyType: 'supplier',
    verified: true,
    verificationBadge: 'gold',
    complianceScore: 98,
    rating: 4.8,
    totalTrades: 1250,
    subscriptionTier: 'pro',
    createdAt: new Date('2000-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'c-002',
    name: 'China Tech Solutions',
    slug: 'china-tech-solutions',
    description: 'Specialized in electronic components and microcontrollers',
    logoUrl: '',
    website: 'https://chinatech.example.com',
    email: 'info@chinatech.com',
    phone: '+86-10-1234-5678',
    country: 'China',
    city: 'Beijing',
    companyType: 'supplier',
    verified: true,
    verificationBadge: 'silver',
    complianceScore: 92,
    rating: 4.6,
    totalTrades: 890,
    subscriptionTier: 'pro',
    createdAt: new Date('2010-06-15'),
    updatedAt: new Date(),
  },
  {
    id: 'c-003',
    name: 'Russian Industrial Export',
    slug: 'russian-industrial-export',
    description: 'Premium aerospace and defense grade materials supplier',
    logoUrl: '',
    website: 'https://rusindustrialexport.example.com',
    email: 'sales@rusindustrialexport.com',
    phone: '+7-495-123-4567',
    country: 'Russia',
    city: 'St. Petersburg',
    companyType: 'supplier',
    verified: true,
    verificationBadge: 'platinum',
    complianceScore: 99,
    rating: 5.0,
    totalTrades: 2100,
    subscriptionTier: 'enterprise',
    createdAt: new Date('1994-03-10'),
    updatedAt: new Date(),
  },
  {
    id: 'c-004',
    name: 'China Textile Group',
    slug: 'china-textile-group',
    description: 'Large-scale textile manufacturer and exporter',
    logoUrl: '',
    website: 'https://chinatextile.example.com',
    email: 'export@chinatextile.com',
    phone: '+86-571-1234-5678',
    country: 'China',
    city: 'Hangzhou',
    companyType: 'supplier',
    verified: true,
    verificationBadge: 'silver',
    complianceScore: 88,
    rating: 4.4,
    totalTrades: 1650,
    subscriptionTier: 'pro',
    createdAt: new Date('2008-02-20'),
    updatedAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query')?.toLowerCase() || '';
    const country = searchParams.get('country');
    const verified = searchParams.get('verified') === 'true';
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));

    // Filter suppliers
    let filtered = MOCK_SUPPLIERS.filter((supplier) => {
      const matchesQuery =
        query === '' ||
        supplier.name.toLowerCase().includes(query) ||
        supplier.description?.toLowerCase().includes(query);

      const matchesCountry = !country || supplier.country === country;
      const matchesVerified = !verified || supplier.verified;
      const matchesRating = !minRating || supplier.rating >= minRating;

      return matchesQuery && matchesCountry && matchesVerified && matchesRating;
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const suppliers = filtered.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: {
        suppliers,
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
        hasMore: start + limit < total,
      },
    });
  } catch (error) {
    console.error('Supplier search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Supplier search failed',
        code: 'SUPPLIER_SEARCH_ERROR',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newSupplier: Company = {
      id: `c-${Date.now()}`,
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description,
      logoUrl: body.logoUrl || '',
      website: body.website,
      email: body.email,
      phone: body.phone,
      country: body.country,
      city: body.city,
      companyType: 'supplier',
      verified: false,
      complianceScore: 0,
      rating: 0,
      totalTrades: 0,
      subscriptionTier: 'free',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: newSupplier,
      message: 'Supplier profile created successfully',
    });
  } catch (error) {
    console.error('Supplier creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Supplier creation failed',
        code: 'SUPPLIER_CREATION_ERROR',
      },
      { status: 500 }
    );
  }
}
