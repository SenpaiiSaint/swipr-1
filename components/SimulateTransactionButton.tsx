"use client";
import { useState } from "react";

export default function SimulateTransactionButton({
  cards,
}: {
  cards: { id: string; nickname: string }[];
}) {
  const [result, setResult] = useState<{
    approved: boolean;
    reason: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    setLoading(true);
    setResult(null);

    // Use random or preset values
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    const amount = Math.floor(Math.random() * 10000) + 100; // 100 to 10100 cents
    const merchants = ["Amazon", "Apple", "ALCOHOL", "Uber"];
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];

    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, merchant, cardId: randomCard.id }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="my-6">
      <button
        onClick={simulate}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        disabled={loading || cards.length === 0}
      >
        {loading ? "Simulating..." : "Simulate Transaction"}
      </button>
      {result && (
        <div className="mt-4 p-4 rounded bg-gray-50 border">
          <div>
            <span
              className={`font-bold ${
                result.approved ? "text-green-600" : "text-red-600"
              }`}
            >
              {result.approved ? "Approved" : "Declined"}
            </span>
          </div>
          <div className="text-gray-700">Reason: {result.reason}</div>
        </div>
      )}
    </div>
  );
}
