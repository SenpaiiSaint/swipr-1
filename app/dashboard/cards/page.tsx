"use client";
import { useEffect, useState } from "react";

interface Card {
  id: string;
  nickname: string;
}

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => setCards(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Cards</h1>
      {loading ? (
        <p className="text-gray-600">Loading cards...</p>
      ) : cards.length === 0 ? (
        <p className="text-gray-600">No cards found.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Nickname</th>
              <th className="py-2 px-4 text-left">ID</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id} className="border-t">
                <td className="py-2 px-4">{card.nickname}</td>
                <td className="py-2 px-4 font-mono text-xs">{card.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
