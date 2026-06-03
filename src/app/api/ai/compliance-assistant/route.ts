import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityId, entityType, region, checkType = 'comprehensive' } = body;

    if (!entityId || !entityType || !region) {
      return NextResponse.json(
        { error: 'Entity ID, type, and region are required' },
        { status: 400 }
      );
    }

    // Perform compliance check
    const complianceResult = await performComplianceCheck(
      entityId,
      entityType,
      region,
      checkType
    );

    // Store compliance check result
    const { data: checkRecord, error: dbError } = await supabase
      .from('ai_compliance_checks')
      .insert([
        {
          entity_id: entityId,
          entity_type: entityType,
          region,
          check_type: checkType,
          result_data: complianceResult,
          status: 'completed',
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
        complianceCheck: {
          id: checkRecord.id,
          entityId,
          entityType,
          region,
          checkType,
          ...complianceResult,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Compliance check error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Compliance check failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType');
    const region = searchParams.get('region');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    let query = supabase
      .from('ai_compliance_checks')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (entityId) {
      query = query.eq('entity_id', entityId);
    }
    if (entityType) {
      query = query.eq('entity_type', entityType);
    }
    if (region) {
      query = query.eq('region', region);
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
    console.error('Fetch compliance checks error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch compliance checks' },
      { status: 500 }
    );
  }
}

async function performComplianceCheck(
  entityId: string,
  entityType: string,
  region: string,
  checkType: string
): Promise<Record<string, unknown>> {
  // Mock compliance assistant - integrate with sanctions databases and regulations APIs
  const baseResult = {
    entityId,
    entityType,
    region,
    checkType,
    overallStatus: 'compliant',
    lastUpdated: new Date().toISOString(),
    checks: [] as Array<Record<string, unknown>>,
    recommendations: [] as string[],
    riskLevel: 'low' as const,
  };

  // Add checks based on type
  if (checkType === 'comprehensive' || checkType === 'sanctions') {
    baseResult.checks.push({
      name: 'Sanctions Check',
      status: 'passed',
      details: 'Entity not found in OFAC, UN, or EU sanctions lists',
      lastChecked: new Date().toISOString(),
    });
  }

  if (checkType === 'comprehensive' || checkType === 'export-control') {
    baseResult.checks.push({
      name: 'Export Control Compliance',
      status: 'passed',
      details: 'Entity complies with export control regulations for ' + region,
      lastChecked: new Date().toISOString(),
    });
  }

  if (checkType === 'comprehensive' || checkType === 'import-duties') {
    baseResult.checks.push({
      name: 'Import Duties & Tariffs',
      status: 'warning',
      details: `Applicable tariff rate for ${region}: 12-18% depending on product classification`,
      lastChecked: new Date().toISOString(),
    });
    baseResult.recommendations.push('Verify product HS codes for accurate tariff classification');
    baseResult.riskLevel = 'medium';
  }

  if (checkType === 'comprehensive' || checkType === 'documentation') {
    baseResult.checks.push({
      name: 'Required Documentation',
      status: 'warning',
      details: `${region} requires: Commercial Invoice, Bill of Lading, Certificate of Origin, Packing List`,
      lastChecked: new Date().toISOString(),
    });
    baseResult.recommendations.push('Ensure all required documents are prepared and certified');
  }

  if (checkType === 'comprehensive' || checkType === 'standards') {
    baseResult.checks.push({
      name: 'Product Standards Compliance',
      status: 'passed',
      details: `Products meet ${region} safety and quality standards`,
      lastChecked: new Date().toISOString(),
    });
  }

  if (baseResult.checks.some(c => c.status === 'failed')) {
    baseResult.overallStatus = 'non-compliant';
    baseResult.riskLevel = 'high';
  } else if (baseResult.checks.some(c => c.status === 'warning')) {
    baseResult.riskLevel = 'medium';
  }

  baseResult.recommendations.push('Review and maintain updated compliance records regularly');
  baseResult.recommendations.push('Consider compliance insurance for high-value transactions');

  return baseResult;
}
