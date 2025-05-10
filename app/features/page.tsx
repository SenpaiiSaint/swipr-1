import Link from "next/link";

export default function Features() {
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
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#87CEFA] bg-[#E6E6FA]/30"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Business
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Swipr&apos;s comprehensive suite of tools can
              transform your organization&apos;s spending management.
            </p>
          </div>

          {/* Feature Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Smart Budgeting */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E6E6FA]/50">
              <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-6">
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Smart Budgeting
              </h2>
              <ul className="space-y-3 text-gray-600">
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
                  Real-time budget tracking and alerts
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
                  Automated budget allocation
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
                  Custom spending categories
                </li>
              </ul>
            </div>

            {/* Policy Control */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E6E6FA]/50">
              <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-6">
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Policy Control
              </h2>
              <ul className="space-y-3 text-gray-600">
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
                  Customizable spending rules
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
                  Automated policy enforcement
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
                  Multi-level approval workflows
                </li>
              </ul>
            </div>

            {/* Analytics */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E6E6FA]/50">
              <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-6">
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Analytics
              </h2>
              <ul className="space-y-3 text-gray-600">
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
                  Real-time spending insights
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
                  Customizable reports
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
                  Predictive analytics
                </li>
              </ul>
            </div>

            {/* Security */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E6E6FA]/50">
              <div className="w-12 h-12 bg-[#E6E6FA]/50 rounded-lg flex items-center justify-center mb-6">
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Security
              </h2>
              <ul className="space-y-3 text-gray-600">
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
                  Enterprise-grade encryption
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
                  Multi-factor authentication
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
                  Fraud detection system
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Transform Your Spending Management?
            </h2>
            <p className="text-gray-600 mb-8">
              Join thousands of organizations already using Swipr to streamline
              their spending.
            </p>
            <Link
              href="/auth/signin"
              className="bg-[#87CEFA] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#87CEFA]/90 transition-colors shadow-md"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
