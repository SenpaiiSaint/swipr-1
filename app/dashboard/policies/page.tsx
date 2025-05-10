"use client";
import PoliciesCrud from "@/components/PoliciesCrud";

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Policies</h1>
      <PoliciesCrud />
    </main>
  );
}
