"use client";
import { useState, useEffect } from "react";

export default function ScorePreviewDashboard() {
  const [amount, setAmount] = useState(1000);
  const [merchant, setMerchant] = useState("");
  const [cardId, setCardId] = useState("");
  const [cards, setCards] = useState<{ id: string; nickname: string }[]>([]);
  const [result, setResult] = useState<{
    approved: boolean;
    reason: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch cards for dropdown
  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, merchant, cardId }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">Score Preview Simulator</h2>
      <form onSubmit={handleTest} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Amount (cents)</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Merchant</label>
          <input
            className="border p-2 w-full"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Card</label>
          <select
            className="border p-2 w-full"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            required
          >
            <option value="">Select a card</option>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.nickname}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Testing..." : "Test Policy"}
        </button>
      </form>
      {result && (
        <div className="mt-6 p-4 rounded bg-gray-50 border">
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
