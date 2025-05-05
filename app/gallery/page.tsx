'use client';

import { useState } from 'react';
import Image from 'next/image';

const categories = ['All', 'Portraits', 'Events', 'Landscape', 'Street'];

const images = [
  { id: 1, category: 'Portraits', src: '/gallery/portrait-1.jpg' },
  { id: 2, category: 'Events', src: '/gallery/2.jpg' },
  { id: 3, category: 'Landscape', src: '/gallery/landscape-1.jpg' },
  { id: 4, category: 'Street', src: '/gallery/street-1.jpg' },
  { id: 5, category: 'Portraits', src: '/gallery/portrait-2.jpg' },
  { id: 6, category: 'Events', src: '/gallery/6.jpg' },
  { id: 7, category: 'Landscape', src: '/gallery/landscape-2.jpg' },
  { id: 8, category: 'Street', src: '/gallery/street-2.jpg' },
  { id: 9, category: 'Portraits', src: '/gallery/portrait-3.jpg' },
  { id: 10, category: 'Events', src: '/gallery/10.jpg' },
  { id: 11, category: 'Landscape', src: '/gallery/landscape-3.jpg' },
  { id: 12, category: 'Street', src: '/gallery/street-3.jpg' },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(image => image.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/gallery/hero.jpg"
            alt="Gallery Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Gallery</h1>
          <p className="text-xl md:text-2xl">A collection of our finest work</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="relative group aspect-square overflow-hidden rounded-lg">
                <Image
                  src={image.src}
                  alt={`Gallery Image ${image.id}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 