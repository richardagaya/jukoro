'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface PaymentStatus {
  status: string;
  payment_method?: string;
  payment_account?: string;
  payment_source?: string;
  amount?: number;
  currency?: string;
  created_date?: string;
  created_time?: string;
}

function PaymentConfirmationContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const orderTrackingId = searchParams.get('OrderTrackingId');
      const orderId = searchParams.get('orderId');
      const provider = searchParams.get('provider');
      
      if (!orderTrackingId && !orderId) {
        setStatus('error');
        setError('Payment tracking ID not found');
        return;
      }

      try {
        let response;
        let data;

        if (provider === 'paypal' && orderId) {
          // Handle PayPal payment
          response = await fetch(`/api/paypal?orderId=${orderId}`);
          data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to verify PayPal payment');
          }

          // For PayPal, we need to capture the payment if it's approved
          if (data.status === 'APPROVED') {
            const captureResponse = await fetch('/api/paypal/capture', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ orderId }),
            });

            const captureData = await captureResponse.json();

            if (!captureResponse.ok) {
              throw new Error(captureData.error || 'Failed to capture PayPal payment');
            }

            setPaymentDetails(captureData);
            setStatus(captureData.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING');
          } else {
            setPaymentDetails(data);
            setStatus(data.status || 'PENDING');
          }
        } else {
          // Handle Pesapal payment
          response = await fetch(`/api/pesapal?OrderTrackingId=${orderTrackingId}`);
          data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to verify payment');
          }

          setPaymentDetails(data);
          setStatus(data.status || 'PENDING');
        }
      } catch (error) {
        setStatus('error');
        setError(error instanceof Error ? error.message : 'Payment verification failed');
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services/hero.jpg"
            alt="Payment Confirmation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Payment Status</h1>
          <p className="text-xl md:text-2xl">Verifying your payment...</p>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
              <p className="text-xl">Verifying payment status...</p>
            </div>
          )}

          {status === 'COMPLETED' && (
            <div className="space-y-6">
              <div className="text-green-500">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-green-500">Payment Successful!</h2>
              {paymentDetails && (
                <div className="mt-4 space-y-2 text-left bg-gray-50 dark:bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Amount:</span> {paymentDetails.currency || 'KES'} {paymentDetails.amount}
                  </p>
                  {paymentDetails.payment_method && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Payment Method:</span> {paymentDetails.payment_method}
                    </p>
                  )}
                  {paymentDetails.payment_source && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Payment Source:</span> {paymentDetails.payment_source}
                    </p>
                  )}
                  {paymentDetails.created_date && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Date:</span> {new Date(paymentDetails.created_date).toLocaleString()}
                    </p>
                  )}
                  {paymentDetails.created_time && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Date:</span> {new Date(paymentDetails.created_time).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-6">
                Thank you for your booking. We will contact you shortly with further details.
              </p>
            </div>
          )}

          {status === 'FAILED' && (
            <div className="space-y-6">
              <div className="text-red-500">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-red-500">Payment Failed</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Unfortunately, your payment was not successful. Please try again or contact support.
              </p>
            </div>
          )}

          {status === 'PENDING' && (
            <div className="space-y-6">
              <div className="text-yellow-500">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-yellow-500">Payment Pending</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Your payment is being processed. Please wait a moment...
              </p>
              {paymentDetails && paymentDetails.amount && (
                <p className="text-gray-600 dark:text-gray-300">
                  Amount: KES {paymentDetails.amount}
                </p>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="text-red-500">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-red-500">Error</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">{error}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function PaymentConfirmation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  );
} 