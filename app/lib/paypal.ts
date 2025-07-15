interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'live';
  debug?: boolean;
}

interface PayPalOrder {
  intent: 'CAPTURE';
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
    description: string;
    custom_id: string;
  }>;
  application_context: {
    return_url: string;
    cancel_url: string;
  };
}

interface PayPalCaptureOrder {
  id: string;
  status: string;
  payment_source: {
    paypal: {
      account_id: string;
      email_address: string;
    };
  };
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
    payee: {
      email_address: string;
    };
    shipping: {
      name: {
        full_name: string;
      };
    };
  }>;
}

class PayPalError extends Error {
  constructor(
    message: string,
    public readonly details?: any,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'PayPalError';
  }
}

export class PayPalClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private config: PayPalConfig) {
    // Add validation for required config
    if (!config.clientId || config.clientId.trim() === '') {
      throw new PayPalError('Client ID is required and cannot be empty');
    }
    if (!config.clientSecret || config.clientSecret.trim() === '') {
      throw new PayPalError('Client Secret is required and cannot be empty');
    }
    if (!['sandbox', 'live'].includes(config.environment)) {
      throw new PayPalError('Environment must be either "sandbox" or "live"');
    }

    console.log('Initializing PayPalClient with config:', {
      hasClientId: !!config.clientId,
      clientIdLength: config.clientId.length,
      hasClientSecret: !!config.clientSecret,
      clientSecretLength: config.clientSecret.length,
      environment: config.environment,
      debug: config.debug
    });

    this.baseUrl = config.environment === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    try {
      // Check if we have a valid token
      if (this.accessToken && Date.now() < this.tokenExpiry) {
        return this.accessToken!;
      }

      console.log('Requesting new PayPal access token...');
      
      const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();
      console.log('PayPal auth response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new PayPalError(
          'Authentication failed',
          data,
          response.status
        );
      }

      if (data.error) {
        throw new PayPalError(
          data.error_description || data.error || 'Authentication failed',
          data
        );
      }

      if (!data.access_token || typeof data.access_token !== 'string') {
        throw new PayPalError('No access token received from authentication response', data);
      }

      this.accessToken = data.access_token as string;
      // Set token expiry to 8 hours from now (PayPal tokens last 9 hours, so 8 to be safe)
      this.tokenExpiry = Date.now() + (8 * 60 * 60 * 1000);
      return this.accessToken;
    } catch (error) {
      if (error instanceof PayPalError) {
        throw error;
      }
      throw new PayPalError(
        'Failed to authenticate with PayPal',
        error instanceof Error ? error.message : error
      );
    }
  }

  async createOrder(order: PayPalOrder) {
    try {
      const token = await this.getAccessToken();
      console.log('Creating PayPal order:', JSON.stringify(order, null, 2));

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();
      console.log('PayPal order creation response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new PayPalError(
          'Failed to create order',
          data,
          response.status
        );
      }

      return data;
    } catch (error) {
      if (error instanceof PayPalError) {
        throw error;
      }
      throw new PayPalError(
        'Failed to create PayPal order',
        error instanceof Error ? error.message : error
      );
    }
  }

  async captureOrder(orderId: string): Promise<PayPalCaptureOrder> {
    try {
      const token = await this.getAccessToken();
      console.log('Capturing PayPal order:', orderId);

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('PayPal capture response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new PayPalError(
          'Failed to capture order',
          data,
          response.status
        );
      }

      return data;
    } catch (error) {
      if (error instanceof PayPalError) {
        throw error;
      }
      throw new PayPalError(
        'Failed to capture PayPal order',
        error instanceof Error ? error.message : error
      );
    }
  }

  async getOrder(orderId: string) {
    try {
      const token = await this.getAccessToken();
      console.log('Getting PayPal order details:', orderId);

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('PayPal order details response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new PayPalError(
          'Failed to get order details',
          data,
          response.status
        );
      }

      return data;
    } catch (error) {
      if (error instanceof PayPalError) {
        throw error;
      }
      throw new PayPalError(
        'Failed to get PayPal order details',
        error instanceof Error ? error.message : error
      );
    }
  }
} 