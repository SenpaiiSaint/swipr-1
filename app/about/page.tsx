import Link from 'next/link';

export default function About() {
  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white border-b border-[#E6E6FA]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#87CEFA]">
                Swipr
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/features"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-[#87CEFA] transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-[#87CEFA] transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#87CEFA] bg-[#E6E6FA]/30"
                >
                  About
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-[#87CEFA] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signin"
                className="bg-[#87CEFA] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#87CEFA]/90 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-b from-[#E6E6FA]/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Story
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re on a mission to revolutionize how organizations manage their spending and empower teams to make better financial decisions.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E6E6FA]/50 mb-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At Swipr, we believe that managing organizational spending shouldn&apos;t be complicated. 
                We&apos;re building the future of spend management - one that&apos;s intuitive, transparent, and empowering.
              </p>
              <p className="text-gray-600">
                Our platform combines powerful technology with thoughtful design to help organizations 
                of all sizes take control of their spending, reduce administrative overhead, and make 
                better financial decisions.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50">
                <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#87CEFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We constantly push boundaries to create better solutions for our customers.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50">
                <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#87CEFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Customer First</h3>
                <p className="text-gray-600">
                  Everything we do is driven by our commitment to customer success.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50">
                <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#87CEFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Trust & Security</h3>
                <p className="text-gray-600">
                  We maintain the highest standards of security and data protection.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50 text-center">
                <div className="w-24 h-24 bg-[#E6E6FA]/50 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Sarah Johnson</h3>
                <p className="text-[#87CEFA] mb-2">CEO & Co-founder</p>
                <p className="text-gray-600">
                  Former finance executive with 15+ years of experience in spend management.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50 text-center">
                <div className="w-24 h-24 bg-[#E6E6FA]/50 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Michael Chen</h3>
                <p className="text-[#87CEFA] mb-2">CTO & Co-founder</p>
                <p className="text-gray-600">
                  Tech leader with expertise in building scalable financial platforms.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50 text-center">
                <div className="w-24 h-24 bg-[#E6E6FA]/50 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Emily Rodriguez</h3>
                <p className="text-[#87CEFA] mb-2">Head of Product</p>
                <p className="text-gray-600">
                  Product visionary focused on creating intuitive user experiences.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Join Us on Our Journey
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for talented individuals who share our passion for transforming 
              how organizations manage their spending.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block bg-[#87CEFA] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#87CEFA]/90 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 