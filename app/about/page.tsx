import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about/hero.jpg"
            alt="About Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Me</h1>
          <p className="text-xl md:text-2xl">Capturing moments, creating memories</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square">
              <Image
                src="/services/download.jpeg"
                alt="Photographer Profile"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">My Story</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                With over 10 years of experience in professional photography, I've dedicated my career to capturing the essence of every moment. My journey began with a simple passion for documenting life's beautiful moments, which has evolved into a thriving photography business.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                I specialize in portrait, event, and landscape photography, with a keen eye for detail and a unique ability to capture authentic emotions. My work has been featured in several exhibitions and publications, and I've had the privilege of working with clients from all walks of life.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                When I'm not behind the camera, I'm teaching photography classes to help others discover their creative potential. I believe that everyone has a unique perspective to share through photography.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Equipment */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">My Equipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Cameras",
                items: [
                  "Canon EOS R5",
                  "Sony A7R IV",
                  "Fujifilm GFX 100"
                ]
              },
              {
                title: "Lenses",
                items: [
                  "24-70mm f/2.8",
                  "70-200mm f/2.8",
                  "85mm f/1.4",
                  "35mm f/1.4"
                ]
              }
            ].map((category, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 