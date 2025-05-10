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
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/budgets")
      .then((res) => res.json())
      .then((data) => setBudgets(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-gray-600">Manage your organization&apos;s budgets</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <p className="text-gray-600">Loading budgets...</p>
          ) : (
            <BudgetList budgets={budgets} />
          )}
        </div>
      </div>
    </main>
  );
}
