import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { PesapalClient } from '@/app/lib/pesapal';

// Add debug logging for environment variables
console.log('Environment check:', {
  hasConsumerKey: !!process.env.PESAPAL_CONSUMER_KEY,
  hasConsumerSecret: !!process.env.PESAPAL_CONSUMER_SECRET,
  hasIpnId: !!process.env.PESAPAL_IPN_ID,
  hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL
});

// Initialize Pesapal client
const pesapal = new PesapalClient({
  consumerKey: process.env.PESAPAL_CONSUMER_KEY || '',
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || '',
  debug: process.env.NODE_ENV !== 'production'
});

export async function POST(request: Request) {
  try {
    // Add detailed environment variable checking
    const missingVars = [];
    if (!process.env.PESAPAL_CONSUMER_KEY) missingVars.push('PESAPAL_CONSUMER_KEY');
    if (!process.env.PESAPAL_CONSUMER_SECRET) missingVars.push('PESAPAL_CONSUMER_SECRET');
    if (!process.env.PESAPAL_IPN_ID) missingVars.push('PESAPAL_IPN_ID');
    if (!process.env.NEXT_PUBLIC_BASE_URL) missingVars.push('NEXT_PUBLIC_BASE_URL');

    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    const body = await request.json();
    const { name, email, phone, date, message, service, amount } = body;

    if (!name || !email || !phone || !date || !service || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Submit the order
    const orderResponse = await pesapal.submitOrder({
      id: uuidv4(),
      currency: "KES",
      amount: amount,
      description: `Photography Service: ${service}`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/booking/confirmation`,
      notification_id: process.env.PESAPAL_IPN_ID!,
      billing_address: {
        email_address: email,
        phone_number: phone,
        country_code: "KE",
        first_name: name.split(' ')[0],
        middle_name: "",
        last_name: name.split(' ').slice(1).join(' ') || "",
        line_1: "",
        line_2: "",
        city: "",
        state: "",
        postal_code: "",
        zip_code: ""
      }
    });

    // Check if we have a redirect URL in the response
    if (orderResponse && orderResponse.redirect_url) {
      return NextResponse.json({ redirect_url: orderResponse.redirect_url });
    } else {
      console.error('Invalid Pesapal response:', orderResponse);
      return NextResponse.json(
        { error: 'Invalid response from payment provider' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Pesapal payment error:', error);
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
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get('OrderTrackingId');

    if (!orderTrackingId) {
      return NextResponse.json(
        { error: 'OrderTrackingId is required' },
        { status: 400 }
      );
    }

    // Get transaction status
    const status = await pesapal.getTransactionStatus(orderTrackingId);

    // Format the response
    return NextResponse.json({
      status: status.payment_status_description,
      payment_method: status.payment_method,
      payment_account: status.payment_account,
      amount: status.amount,
      created_date: status.created_date
    });
  } catch (error) {
    console.error('Pesapal status check error:', error);
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