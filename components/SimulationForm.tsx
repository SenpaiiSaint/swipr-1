"use client";
import { useState } from "react";

interface Card {
  id: string;
  nickname: string;
}
interface Policy {
  id: string;
  name: string;
  expression: string;
}

export default function SimulationForm({ cards }: { cards: Card[] }) {
  const [amount, setAmount] = useState(1000);
  const [merchant, setMerchant] = useState("");
  const [cardId, setCardId] = useState(cards[0]?.id || "");
  const [result, setResult] = useState<{
    approved: boolean;
    reason: string;
    triggeredPolicy?: Policy | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8 mb-8">
      <h2 className="text-2xl font-bold mb-4">Simulate a Transaction</h2>
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
          {!result.approved && result.triggeredPolicy && (
            <div className="mt-2 text-sm text-gray-500">
              <div>Triggered Policy:</div>
              <div className="font-bold">{result.triggeredPolicy.name}</div>
              <div className="font-mono text-xs">
                {result.triggeredPolicy.expression}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
