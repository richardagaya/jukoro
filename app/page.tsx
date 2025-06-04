import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold">
                Jukoro
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  Home
                </Link>
                <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  Services
                </Link>
                <Link href="/gallery" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  Gallery
                </Link>
                <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-image.jpg"
            alt="Hero Image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Capture Your Moments</h1>
          <p className="text-xl md:text-2xl mb-8">Professional photography services for every occasion</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
            >
              View Services
            </Link>
            <Link
              href="/booking"
              className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Studio Photography",
                description: "Professional studio sessions for all occasions",
                image: "/services/service1.jpg"
              },
              {
                title: "Event Photography",
                description: "Document your special moments professionally",
                image: "/services/images.jpeg"
              },
              {
                title: "Photography Classes",
                description: "Learn photography from a professional",
                image: "/services/service3.webp"
              }
            ].map((service, index) => (
              <div key={index} className="relative group">
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Something Beautiful?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Book your session today and let's capture your special moments together.
          </p>
          <Link
            href="/booking"
            className="inline-block px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
}
