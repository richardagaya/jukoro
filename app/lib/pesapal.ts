interface PesapalConfig {
  consumerKey: string;
  consumerSecret: string;
  debug?: boolean;
}

interface PesapalOrder {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email_address: string;
    phone_number: string;
    country_code: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    line_1: string;
    line_2: string;
    city: string;
    state: string;
    postal_code: string;
    zip_code: string;
  };
}

interface AuthResponse {
  token: string;
  expiryDate: string;
  error?: string;
  error_description?: string;
}

class PesapalError extends Error {
  constructor(
    message: string,
    public readonly details?: any,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'PesapalError';
  }
}

export class PesapalClient {
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private config: PesapalConfig) {
    this.baseUrl = config.debug
      ? 'https://cybqa.pesapal.com/pesapalv3'
      : 'https://pay.pesapal.com/v3';
  }

  private async getToken(): Promise<string> {
    try {
      // Check if we have a valid token
      if (this.token && Date.now() < this.tokenExpiry) {
        return this.token;
      }

      console.log('Requesting new Pesapal token...');
      const response = await fetch(`${this.baseUrl}/api/Auth/RequestToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          consumer_key: this.config.consumerKey,
          consumer_secret: this.config.consumerSecret,
        }),
      });

      const data: AuthResponse = await response.json();
      console.log('Pesapal auth response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new PesapalError(
          'Authentication failed',
          data,
          response.status
        );
      }

      if (data.error || data.error_description) {
        throw new PesapalError(
          data.error_description || data.error || 'Authentication failed',
          data
        );
      }

      if (!data.token) {
        throw new PesapalError('No token received from authentication response', data);
      }

      this.token = data.token;
      // Set token expiry to 5 minutes from now
      this.tokenExpiry = Date.now() + (4 * 60 * 1000); // 4 minutes to be safe
      return this.token;
    } catch (error) {
      if (error instanceof PesapalError) {
        throw error;
      }
      throw new PesapalError(
        'Failed to authenticate with Pesapal',
        error instanceof Error ? error.message : error
      );
    }
  }

  async submitOrder(order: PesapalOrder) {
    try {
      const token = await this.getToken();
      console.log('Submitting order to Pesapal:', JSON.stringify(order, null, 2));

      const response = await fetch(`${this.baseUrl}/api/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();
      console.log('Pesapal order response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new PesapalError(
          'Failed to submit order',
          data,
          response.status
        );
      }

      return data;
    } catch (error) {
      if (error instanceof PesapalError) {
        throw error;
      }
      throw new PesapalError(
        'Failed to submit order to Pesapal',
        error instanceof Error ? error.message : error
      );
    }
  }

  async getTransactionStatus(orderTrackingId: string) {
    try {
      const token = await this.getToken();
      console.log('Checking transaction status for:', orderTrackingId);

      const response = await fetch(
        `${this.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log('Pesapal status response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new PesapalError(
          'Failed to get transaction status',
          data,
          response.status
        );
      }

      return data;
    } catch (error) {
      if (error instanceof PesapalError) {
        throw error;
      }
      throw new PesapalError(
        'Failed to check transaction status',
        error instanceof Error ? error.message : error
      );
    }
  }

  async registerIpnUrl(url: string, ipnNotificationType: 'GET' | 'POST') {
    try {
      const token = await this.getToken();
      console.log('Registering IPN URL:', url);

      const response = await fetch(`${this.baseUrl}/api/URLSetup/RegisterIPN`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
          ipn_notification_type: ipnNotificationType,
        }),
      });

      const data = await response.json();
      console.log('Pesapal IPN registration response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new PesapalError(
          'Failed to register IPN URL',
          data,
          response.status
        );
      }

      return data;
    } catch (error) {
      if (error instanceof PesapalError) {
        throw error;
      }
      throw new PesapalError(
        'Failed to register IPN URL',
        error instanceof Error ? error.message : error
      );
    }
  }
} 