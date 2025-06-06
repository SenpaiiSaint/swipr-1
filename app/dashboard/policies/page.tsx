"use client";
import PoliciesCrud from "@/components/PoliciesCrud";

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your organization&apos;s spending policies</p>
        </div>
        <PoliciesCrud />
      </div>
    </main>
  );
}
