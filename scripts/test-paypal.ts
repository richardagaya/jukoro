import { PayPalClient } from '../app/lib/paypal';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPayPalConnection() {
  console.log('Testing PayPal API Connection...\n');

  // Check environment variables
  console.log('Environment Variables:');
  console.log('- PAYPAL_CLIENT_ID:', process.env.PAYPAL_CLIENT_ID ? 'Present' : 'Missing');
  console.log('- PAYPAL_CLIENT_SECRET:', process.env.PAYPAL_CLIENT_SECRET ? 'Present' : 'Missing');
  console.log('- PAYPAL_ENVIRONMENT:', process.env.PAYPAL_ENVIRONMENT || 'Not set');
  console.log('- NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || 'Not set');
  console.log('');

  // Validate required environment variables
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET || !process.env.PAYPAL_ENVIRONMENT) {
    console.error('❌ Missing required environment variables. Please check your .env.local file.');
    return;
  }

  try {
    // Initialize PayPal client
    const paypalClient = new PayPalClient({
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      environment: process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'live',
      debug: true
    });

    console.log('✅ PayPal client initialized successfully');

    // Test authentication by creating an order (this will trigger token generation)
    console.log('\nTesting authentication...');
    console.log('✅ Authentication will be tested during order creation');

    // Test order creation
    console.log('\nTesting order creation...');
    const testOrder = {
      intent: 'CAPTURE' as const,
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '10.00'
          },
          description: 'Test Photography Service',
          custom_id: 'test-order-123'
        }
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking/confirmation?provider=paypal&orderId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking?error=payment_cancelled`
      }
    };

    const orderResponse = await paypalClient.createOrder(testOrder);
    console.log('✅ Order created successfully');
    console.log('Order ID:', orderResponse.id);
    console.log('Order Status:', orderResponse.status);

    // Find approval link
    if (orderResponse.links) {
      const approveLink = orderResponse.links.find((link: any) => link.rel === 'approve');
      if (approveLink) {
        console.log('✅ Approval link found');
        console.log('Approval URL:', approveLink.href);
      } else {
        console.log('⚠️ No approval link found in response');
      }
    }

    console.log('\n🎉 PayPal integration test completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Visit the approval URL above to test the payment flow');
    console.log('2. Complete the payment in PayPal');
    console.log('3. You will be redirected back to your confirmation page');

  } catch (error) {
    console.error('❌ PayPal test failed:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      
      // Check for common issues
      if (error.message.includes('Authentication failed')) {
        console.error('\n💡 Possible solutions:');
        console.error('- Check your PayPal Client ID and Secret');
        console.error('- Ensure you\'re using the correct environment (sandbox/live)');
        console.error('- Verify your PayPal app is properly configured');
      }
      
      if (error.message.includes('Failed to create order')) {
        console.error('\n💡 Possible solutions:');
        console.error('- Check your PayPal app permissions');
        console.error('- Verify the order payload format');
        console.error('- Ensure your PayPal account is properly set up');
      }
    }
  }
}

// Run the test
testPayPalConnection().catch(console.error); 