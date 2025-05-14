import { PesapalClient } from '../app/lib/pesapal';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function registerIpn() {
  try {
    // Validate environment variables
    if (!process.env.PESAPAL_CONSUMER_KEY || !process.env.PESAPAL_CONSUMER_SECRET) {
      throw new Error('Missing Pesapal credentials in environment variables');
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('Missing NEXT_PUBLIC_BASE_URL in environment variables');
    }

    const pesapal = new PesapalClient({
      consumerKey: process.env.PESAPAL_CONSUMER_KEY,
      consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
      debug: true // Using sandbox environment
    });

    // Use the base URL from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const ipnUrl = `${baseUrl}/api/pesapal/ipn`;
    
    console.log('Registering IPN URL:', ipnUrl);
    
    const response = await pesapal.registerIpnUrl(ipnUrl, 'GET');
    console.log('IPN Registration Response:', JSON.stringify(response, null, 2));

    if (response.ipn_id) {
      console.log('\nSuccess! Add this to your .env.local file:');
      console.log(`PESAPAL_IPN_ID=${response.ipn_id}`);
    } else {
      console.error('No IPN ID received in the response');
    }
  } catch (error) {
    console.error('Failed to register IPN:', error);
    process.exit(1);
  }
}

registerIpn(); 