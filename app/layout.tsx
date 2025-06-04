import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jukoro",
  description: "Professional photography services for every occasion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation */}
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

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Jukoro</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Capturing moments that last forever. Professional photography services for every occasion.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/services" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Moi avenue the bazaar plaza</li>
                  <li>Nairobi, Kenya</li>
                  <li>contact@jukoro.com</li>
                  <li>+254 112 465 832</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">
              <p>&copy; {new Date().getFullYear()} Jukoro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
