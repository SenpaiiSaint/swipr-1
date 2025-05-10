"use client";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  cardId: string;
  amountCents: number;
  merchant: string;
  category: string;
  status: string;
  reason: string | null;
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      {loading ? (
        <p className="text-gray-600">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600">No transactions found.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Card</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Merchant</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-t">
                <td className="py-2 px-4">
                  {new Date(txn.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 font-mono text-xs">{txn.cardId}</td>
                <td className="py-2 px-4">
                  ${(txn.amountCents / 100).toFixed(2)}
                </td>
                <td className="py-2 px-4">{txn.merchant}</td>
                <td className="py-2 px-4">{txn.category}</td>
                <td
                  className={`py-2 px-4 font-bold ${
                    txn.status === "APPROVED"
                      ? "text-green-600"
                      : txn.status === "DECLINED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {txn.status}
                </td>
                <td className="py-2 px-4">{txn.reason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
