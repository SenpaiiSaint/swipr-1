"use client";
import { useState } from "react";

interface Budget {
  id: string;
  category: string;
  amountCents: number;
  period: "DAILY" | "WEEKLY" | "MONTHLY";
}

export default function BudgetList({ budgets }: { budgets: Budget[] }) {
  const [list, setList] = useState<Budget[]>(budgets);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [period, setPeriod] = useState<"DAILY" | "WEEKLY" | "MONTHLY">(
    "MONTHLY"
  );

  async function add() {
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amountCents: amount, period }),
    });
    if (res.ok) {
      const newB: Budget = await res.json();
      setList([...list, newB]);
      setCategory("");
      setAmount(0);
    }
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y">
        {list.map((b) => (
          <li key={b.id} className="py-2">
            {b.category} - {(b.amountCents / 100).toFixed(2)} / {b.period}
          </li>
        ))}
      </ul>
      <div className="space-x-2">
        <input
          className="border p-1"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          suppressHydrationWarning
        />
        <input
          className="border p-1"
          type="number"
          placeholder="Amount ($)"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          suppressHydrationWarning
        />
        <select
          className="border p-1"
          value={period}
          onChange={(e) =>
            setPeriod(e.target.value as "DAILY" | "WEEKLY" | "MONTHLY")
          }
          suppressHydrationWarning
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>
      </div>
      <button 
        className="bg-blue-500 text-white p-2 rounded" 
        onClick={add}
        suppressHydrationWarning
      >
        Add
      </button>
    </div>
  );
}
