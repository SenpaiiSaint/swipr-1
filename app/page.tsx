import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white border-b border-[#E6E6FA]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#87CEFA]">
                Swiprr
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
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-[#87CEFA] transition-colors"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="py-20 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Smart Corporate Card Management
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your organization&apos;s spending with intelligent
              budget controls, real-time monitoring, and automated policy
              enforcement.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/auth/signin"
                className="bg-[#87CEFA] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#87CEFA]/90 transition-colors shadow-md"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="bg-white text-[#87CEFA] px-8 py-3 rounded-lg text-lg font-medium border border-[#87CEFA]/50 hover:bg-[#E6E6FA]/30 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" className="py-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Swipr?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50 hover:border-[#87CEFA]/50 transition-colors">
                <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#87CEFA]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Smart Budgeting
                </h3>
                <p className="text-gray-600">
                  Set and manage budgets with real-time tracking and automated
                  alerts.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50 hover:border-[#87CEFA]/50 transition-colors">
                <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#87CEFA]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Policy Control
                </h3>
                <p className="text-gray-600">
                  Enforce spending policies automatically with customizable
                  rules.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50 hover:border-[#87CEFA]/50 transition-colors">
                <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#87CEFA]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analytics
                </h3>
                <p className="text-gray-600">
                  Get detailed insights into spending patterns and trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E6E6FA]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#87CEFA]">Swipr</h3>
              <p className="text-gray-600 text-sm">
                Transform your organization&apos;s spending with smart expense
                management.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#87CEFA] transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#87CEFA] transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#87CEFA] transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="/features"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/security"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="/integrations"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/cookies"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/gdpr"
                    className="text-gray-600 hover:text-[#87CEFA] transition-colors"
                  >
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Swipr. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <select
                  className="text-gray-500 text-sm bg-transparent border-0 focus:ring-0"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
