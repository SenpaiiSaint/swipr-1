"use client";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

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

export default function BudgetList({ budgets }: { budgets: Budget[] }) {
  const [list, setList] = useState<Budget[]>(budgets || []);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [period, setPeriod] = useState<"DAILY" | "WEEKLY" | "MONTHLY">("MONTHLY");

  async function add() {
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amountCents: amount * 100, period }),
    });
    if (res.ok) {
      const { data: newB } = await res.json();
      setList([...list, newB]);
      setCategory("");
      setAmount(0);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Budget</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="category"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g. Office Supplies"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              suppressHydrationWarning
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              suppressHydrationWarning
            />
          </div>
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              id="period"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={period}
              onChange={(e) => setPeriod(e.target.value as "DAILY" | "WEEKLY" | "MONTHLY")}
              suppressHydrationWarning
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={add}
              suppressHydrationWarning
            >
              <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Budget
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Budget List</h3>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No budgets</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new budget.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {list.map((b) => (
              <li key={b.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{b.category}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {b.period.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Budget: {formatCurrency(b.amountCents)}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Spent: {formatCurrency(b.spentCents)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                              b.utilization >= b.alertThreshold
                                ? "text-red-800 bg-red-200"
                                : b.utilization >= 80
                                ? "text-yellow-800 bg-yellow-200"
                                : "text-green-800 bg-green-200"
                            }`}>
                              {b.utilization.toFixed(1)}% Used
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-gray-600">
                              {b.utilization >= b.alertThreshold ? "Over Budget" : "On Track"}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${Math.min(b.utilization, 100)}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              b.utilization >= b.alertThreshold
                                ? "bg-red-500"
                                : b.utilization >= 80
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
