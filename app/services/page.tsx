import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Portrait Photography",
    description: "Professional portrait sessions for individuals, couples, and families. Perfect for capturing special moments and creating lasting memories.",
    price: "$250",
    duration: "1-2 hours",
    includes: [
      "Professional photo shoot",
      "10 edited digital images",
      "Online gallery access",
      "Print release"
    ],
    image: "/services/portrait.jpg"
  },
  {
    title: "Event Photography",
    description: "Capture the magic of your special events with our professional event photography service. Perfect for weddings, parties, and corporate events.",
    price: "$500",
    duration: "4 hours",
    includes: [
      "Full event coverage",
      "50+ edited digital images",
      "Online gallery access",
      "Print release",
      "Fast turnaround"
    ],
    image: "/services/event.jpg"
  },
  {
    title: "Photography Classes",
    description: "Learn photography from a professional. Perfect for beginners and intermediate photographers looking to improve their skills.",
    price: "$150",
    duration: "2 hours",
    includes: [
      "One-on-one instruction",
      "Camera basics",
      "Composition techniques",
      "Lighting fundamentals",
      "Post-processing tips"
    ],
    image: "/services/class.jpg"
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services/hero.jpg"
            alt="Services Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-xl md:text-2xl">Professional photography services tailored to your needs</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-64">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{service.price}</span>
                    <span className="text-gray-500 dark:text-gray-400"> / session</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Duration: {service.duration}</p>
                  <ul className="mb-6 space-y-2">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/booking?service=${encodeURIComponent(service.title)}`}
                    className="block w-full text-center bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Portrait Client",
                text: "The photos turned out absolutely stunning! The photographer made me feel so comfortable and captured my personality perfectly."
              },
              {
                name: "Michael Chen",
                role: "Event Client",
                text: "Professional, punctual, and the photos were beyond our expectations. Will definitely book again for our next event!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.text}"</p>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 