import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      integrationType, 
      config, 
      testMode = true 
    } = body;

    if (!userId || !integrationType || !config) {
      return NextResponse.json(
        { error: 'User ID, integration type, and config are required' },
        { status: 400 }
      );
    }

    // Validate integration type
    const validTypes = ['shipping', 'erp', 'accounting', 'crm', 'customs', 'other'];
    if (!validTypes.includes(integrationType)) {
      return NextResponse.json(
        { error: `Invalid integration type. Supported: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Store integration
    const { data: integration, error: dbError } = await supabase
      .from('api_integrations')
      .insert([
        {
          user_id: userId,
          integration_type: integrationType,
          config,
          test_mode: testMode,
          status: 'active',
          created_at: new Date(),
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
        integration: {
          id: integration.id,
          type: integrationType,
          status: 'active',
          testMode,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Integration setup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Integration setup failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const integrationType = searchParams.get('type');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('api_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (integrationType) {
      query = query.eq('integration_type', integrationType);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Query failed: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      integrations: data,
    });
  } catch (error) {
    console.error('Fetch integrations error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { integrationId, config } = body;

    if (!integrationId || !config) {
      return NextResponse.json(
        { error: 'Integration ID and config are required' },
        { status: 400 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from('api_integrations')
      .update({ config, updated_at: new Date() })
      .eq('id', integrationId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Update failed: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      integration: updated,
    });
  } catch (error) {
    console.error('Integration update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
}
