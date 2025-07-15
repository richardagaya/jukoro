# Payment Setup Guide

This guide will help you set up both Pesapal and PayPal payment methods for your photography booking system.

## Environment Variables

Add the following environment variables to your `.env.local` file:

### Pesapal Configuration
```env
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
PESAPAL_IPN_ID=your_pesapal_ipn_id
```

### PayPal Configuration
```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox
```

### General Configuration
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Pesapal Setup

1. **Create a Pesapal Account**
   - Visit [Pesapal](https://www.pesapal.com/) and create a merchant account
   - Complete the verification process

2. **Get API Credentials**
   - Log into your Pesapal merchant dashboard
   - Navigate to the API section
   - Generate your Consumer Key and Consumer Secret
   - Note down your IPN ID

3. **Configure IPN (Instant Payment Notification)**
   - Set your IPN URL to: `https://yourdomain.com/api/pesapal/ipn`
   - This will be automatically registered when you first use the API

## PayPal Setup

1. **Create a PayPal Developer Account**
   - Visit [PayPal Developer Portal](https://developer.paypal.com/)
   - Create a developer account

2. **Create a PayPal App**
   - Go to the Apps & Credentials section
   - Create a new app
   - Choose "Business" account type
   - Select "PayPal Checkout" as the integration type

3. **Get API Credentials**
   - Copy your Client ID and Client Secret
   - For testing, use the Sandbox credentials
   - For production, use the Live credentials

4. **Configure Webhooks (Optional)**
   - Set up webhooks for payment notifications
   - Webhook URL: `https://yourdomain.com/api/paypal/webhook`

## Testing

### Pesapal Testing
- Use Pesapal's sandbox environment for testing
- Test with their provided test phone numbers and amounts

### PayPal Testing
- Use PayPal's sandbox environment for testing
- Create sandbox buyer and seller accounts
- Test with sandbox payment methods

## Production Deployment

1. **Update Environment Variables**
   - Change `PAYPAL_ENVIRONMENT` to `live`
   - Use production credentials for both Pesapal and PayPal
   - Update `NEXT_PUBLIC_BASE_URL` to your production domain

2. **SSL Certificate**
   - Ensure your domain has a valid SSL certificate
   - Both payment providers require HTTPS in production

3. **IPN/Webhook Configuration**
   - Update IPN URLs to use your production domain
   - Test webhook delivery

## Features

### Payment Method Selection
- Users can choose between Pesapal and PayPal during checkout
- Pesapal is recommended for local (Kenyan) payments
- PayPal is recommended for international payments

### Payment Flow
1. User selects a service and fills booking details
2. User chooses payment method (Pesapal or PayPal)
3. User is redirected to the selected payment provider
4. After payment, user is redirected back to confirmation page
5. Payment status is verified and displayed

### Supported Currencies
- Pesapal: KES (Kenyan Shillings)
- PayPal: USD (US Dollars)

## Troubleshooting

### Common Issues

1. **Environment Variables Missing**
   - Ensure all required environment variables are set
   - Check for typos in variable names

2. **Payment Redirect Issues**
   - Verify `NEXT_PUBLIC_BASE_URL` is correctly set
   - Ensure callback URLs are properly configured

3. **Authentication Errors**
   - Verify API credentials are correct
   - Check if credentials are for the right environment (sandbox/live)

4. **Payment Capture Issues (PayPal)**
   - Ensure the order is in APPROVED status before capture
   - Check that the capture API is being called correctly

### Debug Mode
- Set `debug: true` in the payment client configurations for detailed logging
- Check browser console and server logs for error messages

## Security Notes

- Never commit API credentials to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys and secrets
- Monitor payment logs for suspicious activity
- Implement proper error handling and logging 