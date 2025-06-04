'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

const services = {
  portrait: {
    title: 'Studio Photography',
    price: 1000,
    description: 'Professional portrait session with 10 edited images',
    image: '/services/service1.jpg',
  },
  event: {
    title: 'Event Photography',
    price: 2000,
    description: 'Full event coverage with 50+ edited images',
    image: '/services/images.jpeg',
  },
  class: {
    title: 'Photography Classes',
    price: 1500,
    description: 'One-on-one photography instruction',
    image: '/services/service3.webp',
  }
};

function BookingContent() {
  const searchParams = useSearchParams();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const service = searchParams.get('service');
    if (service && services[service as keyof typeof services]) {
      setSelectedService(service);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!selectedService) {
        throw new Error('Please select a service');
      }

      const service = services[selectedService as keyof typeof services];
      
      const response = await fetch('/api/pesapal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service: selectedService,
          amount: service.price
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      // Redirect to Pesapal payment page
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services/hero.jpg"
            alt="Booking Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Book a Session</h1>
          <p className="text-xl md:text-2xl">Let's create something beautiful together</p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Service Selection */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Select Your Service</h2>
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(services).map(([key, service]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedService(key)}
                    className={`p-6 rounded-lg border-2 transition-colors ${
                      selectedService === key
                        ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold">{service.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                        <p className="mt-2 font-medium">KES {service.price}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-6">Booking Details</h2>
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedService || loading}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay KES ${selectedService ? services[selectedService as keyof typeof services].price : '0'}`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default function Booking() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
} 