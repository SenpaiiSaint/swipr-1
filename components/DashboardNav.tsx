"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

interface Organization {
  name: string;
  industry: string | null;
  subscriptionTier: string;
}

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    // Fetch organization details
    fetch("/api/organization")
      .then((res) => res.json())
      .then((data) => setOrganization(data))
      .catch(console.error);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  // Get industry-specific menu items
  const getIndustryMenuItems = (industry: string | null) => {
    const baseItems = [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/cards", label: "Cards" },
      { href: "/dashboard/budgets", label: "Budgets" },
      { href: "/dashboard/users", label: "Users" },
      { href: "/dashboard/transactions", label: "Transactions" },
      { href: "/dashboard/policies", label: "Policies" },
      { href: "/dashboard/reports", label: "Reports" },
    ];

    // Add industry-specific menu items
    switch (industry?.toLowerCase()) {
      case 'retail':
        baseItems.push(
          { href: "/dashboard/inventory", label: "Inventory" },
          { href: "/dashboard/suppliers", label: "Suppliers" }
        );
        break;
      case 'manufacturing':
        baseItems.push(
          { href: "/dashboard/production", label: "Production" },
          { href: "/dashboard/supply-chain", label: "Supply Chain" }
        );
        break;
      // Add more industry-specific menu items as needed
    }

    return baseItems;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center pl-4">
            <Link 
              href="/dashboard" 
              className="group relative"
              aria-label="Dashboard Home"
            >
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-blue-500 group-hover:to-blue-600 transition-all duration-500">
                {organization?.name || "Swipr"}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 px-4">
            {organization && getIndustryMenuItems(organization.industry).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === item.href
                    ? "text-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 pr-4">
            {organization && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="px-3 py-1.5 bg-gray-50/80 backdrop-blur-sm text-gray-700 rounded-lg text-sm font-medium ring-1 ring-gray-100/50 shadow-sm">
                  {organization.industry}
                </span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100/80 backdrop-blur-sm text-blue-600 rounded-lg text-sm font-medium ring-1 ring-blue-100/50 shadow-sm">
                  {organization.subscriptionTier}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowConfirmDialog(true)}
              disabled={isLoading}
              className="relative inline-flex items-center px-4 py-2 border border-gray-100 rounded-lg text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-gray-50/80 hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
              aria-label="Sign out"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2 text-gray-500 group-hover:text-gray-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign out</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-gray-100/50">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {organization && getIndustryMenuItems(organization.industry).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                pathname === item.href
                  ? "text-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
              }`}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
              {pathname === item.href && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div 
          className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirmDialog(false);
          }}
        >
          <div 
            className="bg-white/90 backdrop-blur-md rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl transform transition-all duration-300 ring-1 ring-gray-100/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-red-100/50 rounded-full blur-sm"></div>
              <div className="relative flex items-center justify-center w-12 h-12 mx-auto bg-red-50 rounded-full mb-4 ring-1 ring-red-100/50">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 id="dialog-title" className="text-lg font-medium text-gray-900 text-center mb-2">
              Confirm Sign Out
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to sign out? You&apos;ll need to sign in
              again to access your account.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="relative px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300"></div>
                <span className="relative">{isLoading ? "Signing out..." : "Sign out"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
