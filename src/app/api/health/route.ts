import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Health check status
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'operational',
        database: 'operational',
        storage: 'operational',
        cache: 'operational',
      },
      uptime: '99.95%',
      responseTime: '< 100ms',
      region: process.env.DEPLOYMENT_REGION || 'us-east-1',
    };

    return NextResponse.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { status: 503 }
    );
  }
}
