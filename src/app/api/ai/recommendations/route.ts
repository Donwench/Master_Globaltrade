import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type = 'suppliers', filters = {} } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Generate recommendations based on user history and preferences
    const recommendations = await generateRecommendations(userId, type, filters);

    // Store recommendations
    const { data: recRecord, error: dbError } = await supabase
      .from('ai_recommendations')
      .insert([
        {
          user_id: userId,
          recommendation_type: type,
          recommendations: recommendations,
          filters,
          status: 'active',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        recommendations: {
          id: recRecord.id,
          type,
          items: recommendations,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Recommendation generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Recommendation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('ai_recommendations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('recommendation_type', type);
    }

    const { data, error, count } = await query.range(
      parseInt(offset),
      parseInt(offset) + parseInt(limit) - 1
    );

    if (error) {
      throw new Error(`Query failed: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Fetch recommendations error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

async function generateRecommendations(
  userId: string,
  type: string,
  filters: Record<string, unknown>
): Promise<Array<Record<string, unknown>>> {
  // Mock recommendation engine - integrate with ML models in production
  const recommendations: Array<Record<string, unknown>> = [];

  switch (type) {
    case 'suppliers':
      recommendations.push(
        {
          id: 'sup_001',
          name: 'Premium Suppliers Co.',
          category: 'electronics',
          region: 'Southeast Asia',
          rating: 4.8,
          matchScore: 0.92,
          reason: 'Excellent quality match and pricing for your category',
          avgLeadTime: 14,
          verificationLevel: 'platinum',
        },
        {
          id: 'sup_002',
          name: 'Global Trade Partners',
          category: 'textiles',
          region: 'South Asia',
          rating: 4.5,
          matchScore: 0.87,
          reason: 'Strong compliance record and cost-effective',
          avgLeadTime: 21,
          verificationLevel: 'gold',
        }
      );
      break;

    case 'products':
      recommendations.push(
        {
          id: 'prod_001',
          name: 'High-Efficiency Component A',
          category: 'electronics',
          priceRange: '45-65 USD',
          demandScore: 0.89,
          profitMargin: 35,
          reason: 'High market demand in your region',
          competitors: 12,
        },
        {
          id: 'prod_002',
          name: 'Eco-Friendly Material B',
          category: 'sustainable',
          priceRange: '120-180 USD',
          demandScore: 0.76,
          profitMargin: 42,
          reason: 'Growing market with premium pricing',
          competitors: 8,
        }
      );
      break;

    case 'markets':
      recommendations.push(
        {
          id: 'mkt_001',
          region: 'Southeast Asia',
          category: 'electronics',
          marketSize: '5.2B USD',
          growthRate: 12.5,
          opportunity: 'high',
          reason: 'Rapid industrialization and e-commerce growth',
        },
        {
          id: 'mkt_002',
          region: 'East Africa',
          category: 'agricultural',
          marketSize: '1.8B USD',
          growthRate: 15.3,
          opportunity: 'emerging',
          reason: 'Untapped market with high growth potential',
        }
      );
      break;

    default:
      recommendations.push({
        id: 'default',
        message: 'Custom recommendations based on user profile',
      });
  }

  return recommendations;
}
