import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { PesapalClient } from '@/app/lib/pesapal';

// Debug logging for environment variables
console.log('API Route Environment Variables Status:', {
  PESAPAL_CONSUMER_KEY: typeof process.env.PESAPAL_CONSUMER_KEY === 'string' ? 'Present' : 'Missing',
  PESAPAL_CONSUMER_SECRET: typeof process.env.PESAPAL_CONSUMER_SECRET === 'string' ? 'Present' : 'Missing',
  PESAPAL_IPN_ID: typeof process.env.PESAPAL_IPN_ID === 'string' ? 'Present' : 'Missing',
  NEXT_PUBLIC_BASE_URL: typeof process.env.NEXT_PUBLIC_BASE_URL === 'string' ? 'Present' : 'Missing'
});

export async function POST(request: Request) {
  try {
    // Validate environment variables first
    if (typeof process.env.PESAPAL_CONSUMER_KEY !== 'string' || !process.env.PESAPAL_CONSUMER_KEY.trim()) {
      throw new Error('PESAPAL_CONSUMER_KEY is missing or empty');
    }
    if (typeof process.env.PESAPAL_CONSUMER_SECRET !== 'string' || !process.env.PESAPAL_CONSUMER_SECRET.trim()) {
      throw new Error('PESAPAL_CONSUMER_SECRET is missing or empty');
    }
    if (typeof process.env.PESAPAL_IPN_ID !== 'string' || !process.env.PESAPAL_IPN_ID.trim()) {
      throw new Error('PESAPAL_IPN_ID is missing or empty');
    }
    if (typeof process.env.NEXT_PUBLIC_BASE_URL !== 'string' || !process.env.NEXT_PUBLIC_BASE_URL.trim()) {
      throw new Error('NEXT_PUBLIC_BASE_URL is missing or empty');
    }

    // Initialize Pesapal client after validation
    const pesapalClient = new PesapalClient({
      consumerKey: process.env.PESAPAL_CONSUMER_KEY,
      consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
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

    // Submit the order
    const orderResponse = await pesapalClient.submitOrder({
      id: uuidv4(),
      currency: "KES",
      amount: amount,
      description: `Photography Service: ${service}`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation`,
      notification_id: process.env.PESAPAL_IPN_ID,
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
    // Validate environment variables first
    if (typeof process.env.PESAPAL_CONSUMER_KEY !== 'string' || !process.env.PESAPAL_CONSUMER_KEY.trim()) {
      throw new Error('PESAPAL_CONSUMER_KEY is missing or empty');
    }
    if (typeof process.env.PESAPAL_CONSUMER_SECRET !== 'string' || !process.env.PESAPAL_CONSUMER_SECRET.trim()) {
      throw new Error('PESAPAL_CONSUMER_SECRET is missing or empty');
    }

    // Initialize Pesapal client after validation
    const pesapalClient = new PesapalClient({
      consumerKey: process.env.PESAPAL_CONSUMER_KEY,
      consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
      debug: process.env.NODE_ENV !== 'production'
    });

    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get('OrderTrackingId');

    if (!orderTrackingId) {
      return NextResponse.json(
        { error: 'OrderTrackingId is required' },
        { status: 400 }
      );
    }

    // Get transaction status
    const status = await pesapalClient.getTransactionStatus(orderTrackingId);

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