import Link from "next/link";

export default function Pricing() {
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
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#87CEFA] bg-[#E6E6FA]/30"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your organization&apos;s needs. All
              plans include core features.
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E6E6FA]/50">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Starter
              </h2>
              <p className="text-gray-600 mb-6">Perfect for small teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Up to 10 users
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Basic budget controls
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Standard reporting
                </li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full bg-[#87CEFA] text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-[#87CEFA]/90 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-[#87CEFA] relative">
              <div className="absolute top-0 right-0 bg-[#87CEFA] text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Popular
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Professional
              </h2>
              <p className="text-gray-600 mb-6">Best for growing businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Up to 50 users
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Advanced budget controls
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Custom reporting
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Priority support
                </li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full bg-[#87CEFA] text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-[#87CEFA]/90 transition-colors shadow-md"
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E6E6FA]/50">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Enterprise
              </h2>
              <p className="text-gray-600 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Unlimited users
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Custom integrations
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Dedicated support
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#87CEFA] mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  SLA guarantee
                </li>
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full bg-[#87CEFA] text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-[#87CEFA]/90 transition-colors shadow-sm"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Can I change plans later?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers
                  for annual plans.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E6FA]/50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  Yes, we offer a 14-day free trial on all plans. No credit card
                  required to start.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
