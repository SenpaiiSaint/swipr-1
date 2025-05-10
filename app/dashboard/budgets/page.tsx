"use client";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const BudgetList = dynamic(() => import('@/components/BudgetList'), {
  ssr: false,
  loading: () => <p className="text-gray-600">Loading budget form...</p>
});

interface Budget {
  id: string;
  category: string;
  amountCents: number;
  period: "DAILY" | "WEEKLY" | "MONTHLY";
  spentCents: number;
  utilization: number;
  alertThreshold: number;
  lastAlert: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/budgets")
      .then((res) => res.json())
      .then((data) => setBudgets(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your organization&apos;s spending budgets</p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Budget Overview</h2>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                      Filter
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Export
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <BudgetList budgets={budgets} />
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Budget Summary</h2>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 gap-5">
                  <div className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Budget</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      ${budgets.reduce((sum, b) => sum + b.amountCents, 0) / 100}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Spent</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      ${budgets.reduce((sum, b) => sum + b.spentCents, 0) / 100}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Utilization</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {budgets.length > 0
                        ? `${(budgets.reduce((sum, b) => sum + b.utilization, 0) / budgets.length).toFixed(1)}%`
                        : "0%"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
