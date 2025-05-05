const fs = require('fs');
const https = require('https');
const path = require('path');

// Create necessary directories
const directories = [
  'public',
  'public/services',
  'public/gallery',
  'public/about',
  'public/contact'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Image URLs from Unsplash
const images = {
  // Hero images
  '/hero-image.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80',
  '/services/hero.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80',
  '/gallery/hero.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80',
  '/about/hero.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80',
  '/contact/hero.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80',

  // Service images
  '/services/portrait.jpg': 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80',
  '/services/event.jpg': 'https://images.unsplash.com/photo-1511795409834-432f31197ce3?auto=format&fit=crop&w=800&q=80',
  '/services/class.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',

  // Gallery images
  '/gallery/portrait-1.jpg': 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80',
  '/gallery/portrait-2.jpg': 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80',
  '/gallery/portrait-3.jpg': 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80',
  '/gallery/event-1.jpg': 'https://images.unsplash.com/photo-1511795409834-432f31197ce3?auto=format&fit=crop&w=800&q=80',
  '/gallery/event-2.jpg': 'https://images.unsplash.com/photo-1511795409834-432f31197ce3?auto=format&fit=crop&w=800&q=80',
  '/gallery/event-3.jpg': 'https://images.unsplash.com/photo-1511795409834-432f31197ce3?auto=format&fit=crop&w=800&q=80',
  '/gallery/landscape-1.jpg': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  '/gallery/landscape-2.jpg': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  '/gallery/landscape-3.jpg': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  '/gallery/street-1.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  '/gallery/street-2.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  '/gallery/street-3.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',

  // About page images
  '/about/profile.jpg': 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80',
};

// Download function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting image downloads...');
  
  for (const [path, url] of Object.entries(images)) {
    const filepath = `public${path}`;
    try {
      await downloadImage(url, filepath);
      console.log(`Downloaded: ${filepath}`);
    } catch (error) {
      console.error(`Error downloading ${filepath}:`, error);
    }
  }
  
  console.log('All downloads completed!');
}

downloadAllImages(); 