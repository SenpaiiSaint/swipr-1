"use client";
import { useEffect, useState } from "react";

interface Report {
  totalTransactions: number;
  totalSpendCents: number;
  spendByCategory: { category: string; amountCents: number }[];
}

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => setReport(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      {loading ? (
        <p className="text-gray-600">Loading report...</p>
      ) : !report ? (
        <p className="text-gray-600">No report data found.</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-bold mb-2">Summary</h2>
            <div>
              Total Transactions:{" "}
              <span className="font-mono">{report.totalTransactions}</span>
            </div>
            <div>
              Total Spend:{" "}
              <span className="font-mono">
                ${(report.totalSpendCents / 100).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-bold mb-2">Spend by Category</h2>
            {report.spendByCategory.length === 0 ? (
              <div className="text-gray-600">No spend data by category.</div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {report.spendByCategory.map((row) => (
                    <tr key={row.category} className="border-t">
                      <td className="py-2 px-4">{row.category}</td>
                      <td className="py-2 px-4">
                        ${(row.amountCents / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
