"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-[#87CEFA]"
            >
              Swipr
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/dashboard"
                    ? "text-[#87CEFA] bg-[#E6E6FA]/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/cards"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/dashboard/cards"
                    ? "text-[#87CEFA] bg-[#E6E6FA]/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cards
              </Link>
              <Link
                href="/dashboard/budgets"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/dashboard/budgets"
                    ? "text-[#87CEFA] bg-[#E6E6FA]/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Budgets
              </Link>
              <Link
                href="/dashboard/users"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/dashboard/users"
                    ? "text-[#87CEFA] bg-[#E6E6FA]/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Users
              </Link>
              <Link
                href="/dashboard/transactions"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/dashboard/transactions"
                    ? "text-[#87CEFA] bg-[#E6E6FA]/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Transactions
              </Link>
              <Link
                href="/dashboard/policies"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/dashboard/policies"
                    ? "text-[#87CEFA] bg-[#E6E6FA]/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Policies
              </Link>
              <Link
                href="/dashboard/reports"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/dashboard/reports"
                    ? "text-[#87CEFA] bg-[#E6E6FA]/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Reports
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowConfirmDialog(true)}
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Signing out...</span>
                </>
              ) : (
                <span>Sign out</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Sign Out
            </h3>
            <p className="text-gray-600 mb-6">
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
                className="px-4 py-2 text-sm font-medium text-white bg-[#87CEFA] rounded-md hover:bg-[#87CEFA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
