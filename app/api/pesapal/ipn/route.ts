import { NextResponse } from 'next/server';
import { PesapalClient } from '@/app/lib/pesapal';

const pesapal = new PesapalClient({
  consumerKey: process.env.PESAPAL_CONSUMER_KEY || '',
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || '',
  debug: process.env.NODE_ENV !== 'production'
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received IPN notification:', data);

    // Verify the transaction status
    const status = await pesapal.getTransactionStatus(data.OrderTrackingId);
    console.log('Transaction status:', status);

    // Here you would typically:
    // 1. Update your database with the payment status
    // 2. Send email notifications
    // 3. Update order status
    // 4. etc.

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('IPN handling error:', error);
    return NextResponse.json(
      { error: 'Failed to process IPN notification' },
      { status: 500 }
    );
  }
}

// Pesapal may also send GET requests to verify the IPN URL
export async function GET(request: Request) {
  return NextResponse.json({ status: 'success' });
} 