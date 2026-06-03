import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const subscriptionPlans = {
  starter: {
    name: 'Starter',
    price: 29,
    interval: 'month',
    features: [
      'Up to 100 RFQs/month',
      'Basic supplier directory',
      'Standard support',
      'Document extraction (5 docs/month)',
      'Market analysis (basic)',
    ],
  },
  professional: {
    name: 'Professional',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited RFQs',
      'Advanced supplier matching',
      'Priority support',
      'Document extraction (100 docs/month)',
      'Market analysis (advanced)',
      'AI recommendations',
      'Translation API',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    features: [
      'Unlimited everything',
      'Dedicated account manager',
      '24/7 premium support',
      'Unlimited document extraction',
      'Advanced AI features',
      'Custom integrations',
      'API access',
      'Compliance assistant',
    ],
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, paymentMethodId } = body;

    if (!userId || !planId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'User ID, plan ID, and payment method are required' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const { data: userSubscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let stripeCustomerId = userSubscription?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: subscriptionPlans[planId as keyof typeof subscriptionPlans].name,
            },
            unit_amount: subscriptionPlans[planId as keyof typeof subscriptionPlans].price * 100,
            recurring: {
              interval: 'month',
            },
          },
        },
      ],
      default_payment_method: paymentMethodId,
      automatic_tax: { enabled: true },
    });

    // Store subscription in database
    const { data: subRecord, error: dbError } = await supabase
      .from('user_subscriptions')
      .upsert([
        {
          user_id: userId,
          plan_id: planId,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
          updated_at: new Date(),
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
        subscription: {
          id: subRecord.id,
          planId,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Subscription failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`Query failed: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Fetch subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId } = body;

    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'User ID and plan ID are required' },
        { status: 400 }
      );
    }

    // Get current subscription
    const { data: currentSub } = await supabase
      .from('user_subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (!currentSub?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Update subscription plan
    await stripe.subscriptions.update(currentSub.stripe_subscription_id, {
      items: [
        {
          id: (await stripe.subscriptions.retrieve(currentSub.stripe_subscription_id)).items.data[0].id,
          price_data: {
            currency: 'usd',
            product_data: {
              name: subscriptionPlans[planId as keyof typeof subscriptionPlans].name,
            },
            unit_amount: subscriptionPlans[planId as keyof typeof subscriptionPlans].price * 100,
            recurring: {
              interval: 'month',
            },
          },
        },
      ],
    });

    // Update database
    const { data: updatedSub } = await supabase
      .from('user_subscriptions')
      .update({ plan_id: planId })
      .eq('user_id', userId)
      .select()
      .single();

    return NextResponse.json({
      success: true,
      subscription: updatedSub,
    });
  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
}
