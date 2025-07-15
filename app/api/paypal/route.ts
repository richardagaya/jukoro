import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { PayPalClient } from '@/app/lib/paypal';

// Debug logging for environment variables
console.log('PayPal API Route Environment Variables Status:', {
  PAYPAL_CLIENT_ID: typeof process.env.PAYPAL_CLIENT_ID === 'string' ? 'Present' : 'Missing',
  PAYPAL_CLIENT_SECRET: typeof process.env.PAYPAL_CLIENT_SECRET === 'string' ? 'Present' : 'Missing',
  PAYPAL_ENVIRONMENT: typeof process.env.PAYPAL_ENVIRONMENT === 'string' ? 'Present' : 'Missing',
  NEXT_PUBLIC_BASE_URL: typeof process.env.NEXT_PUBLIC_BASE_URL === 'string' ? 'Present' : 'Missing'
});

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
    if (typeof process.env.NEXT_PUBLIC_BASE_URL !== 'string' || !process.env.NEXT_PUBLIC_BASE_URL.trim()) {
      throw new Error('NEXT_PUBLIC_BASE_URL is missing or empty');
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
    const { name, email, phone, date, message, service, amount } = body;

    if (!name || !email || !phone || !date || !service || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create PayPal order
    const orderId = uuidv4();
    const orderResponse = await paypalClient.createOrder({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toString()
          },
          description: `Photography Service: ${service}`,
          custom_id: orderId
        }
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation?provider=paypal`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking?error=payment_cancelled`
      }
    });

    // Check if we have approval links in the response
    if (orderResponse && orderResponse.links) {
      const approveLink = orderResponse.links.find((link: any) => link.rel === 'approve');
      if (approveLink) {
        // Construct the final return URL with the actual order ID
        const finalReturnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation?provider=paypal&orderId=${orderResponse.id}`;
        // Update the approve link with our return URL
        const updatedApproveLink = `${approveLink.href}&return_url=${encodeURIComponent(finalReturnUrl)}`;
        return NextResponse.json({ 
          redirect_url: updatedApproveLink,
          order_id: orderResponse.id 
        });
      }
    }

    console.error('Invalid PayPal response:', orderResponse);
    return NextResponse.json(
      { error: 'Invalid response from payment provider' },
      { status: 500 }
    );
  } catch (error) {
    console.error('PayPal payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
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

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'OrderId is required' },
        { status: 400 }
      );
    }

    // Get order details
    const orderDetails = await paypalClient.getOrder(orderId);

    // Format the response
    return NextResponse.json({
      status: orderDetails.status,
      payment_source: orderDetails.payment_source?.paypal?.email_address,
      amount: orderDetails.purchase_units?.[0]?.amount?.value,
      currency: orderDetails.purchase_units?.[0]?.amount?.currency_code,
      created_time: orderDetails.create_time
    });
  } catch (error) {
    console.error('PayPal status check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to check payment status';
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