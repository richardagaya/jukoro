import { NextResponse } from 'next/server';
import { PayPalClient } from '@/app/lib/paypal';

export async function POST(request: Request) {
  try {
    // Validate environment variables first
    if (typeof process.env.PAYPAL_CLIENT_ID !== 'string' || !process.env.PAYPAL_CLIENT_ID.trim()) {
      throw new Error('PAYPAL_CLIENT_ID is missing or empty');
    }
    if (typeof process.env.PAYPAL_CLIENT_SECRET !== 'string' || !process.env.PAYPAL_CLIENT_SECRET.trim()) {
      throw new Error('PAYPAL_CLIENT_SECRET is missing or empty');
    }
    if (typeof process.env.PAYPAL_ENVIRONMENT !== 'string' || !process.env.PAYPAL_ENVIRONMENT.trim()) {
      throw new Error('PAYPAL_ENVIRONMENT is missing or empty');
    }

    // Validate PayPal environment
    if (!['sandbox', 'live'].includes(process.env.PAYPAL_ENVIRONMENT)) {
      throw new Error('PAYPAL_ENVIRONMENT must be either "sandbox" or "live"');
    }

    // Initialize PayPal client after validation
    const paypalClient = new PayPalClient({
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      environment: process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'live',
      debug: process.env.NODE_ENV !== 'production'
    });

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'OrderId is required' },
        { status: 400 }
      );
    }

    // Capture the payment
    const captureResult = await paypalClient.captureOrder(orderId);

    // Return the capture result
    return NextResponse.json({
      success: true,
      capture_id: captureResult.id,
      status: captureResult.status,
      payment_source: captureResult.payment_source?.paypal?.email_address,
      amount: captureResult.purchase_units?.[0]?.amount?.value,
      currency: captureResult.purchase_units?.[0]?.amount?.currency_code
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Payment capture failed';
    const statusCode = (error as any)?.statusCode || 500;
    const details = (error as any)?.details;

    return NextResponse.json(
      { 
        error: errorMessage,
        ...(details && { details })
      },
      { status: statusCode }
    );
  }
} 