"use client";
import { useEffect, useState } from "react";

interface Policy {
  id: string;
  name: string;
  expression: string;
  isActive: boolean;
}

export default function PoliciesCrud() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    expression: "",
    isActive: true,
  });
  const [editing, setEditing] = useState<Policy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPolicies = () => {
    setLoading(true);
    fetch("/api/policies")
      .then((res) => res.json())
      .then((data) => setPolicies(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    const res = await fetch("/api/policies", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setError("Failed to save policy");
    } else {
      setForm({ name: "", expression: "", isActive: true });
      setEditing(null);
      fetchPolicies();
    }
    setSubmitting(false);
  };

  const handleEdit = (policy: Policy) => {
    setEditing(policy);
    setForm({
      name: policy.name,
      expression: policy.expression,
      isActive: policy.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this policy?")) return;
    setSubmitting(true);
    const res = await fetch("/api/policies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setError("Failed to delete policy");
    } else {
      fetchPolicies();
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h2 className="text-lg font-bold mb-4">Manage Policies</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <div className="flex gap-2">
          <input
            name="name"
            className="border p-2 flex-1"
            placeholder="Policy Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="expression"
            className="border p-2 flex-1"
            placeholder="Expression (e.g. amount < 50000)"
            value={form.expression}
            onChange={handleChange}
            required
          />
          <label className="flex items-center gap-1">
            <input
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange}
            />
            Active
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={submitting}
          >
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              className="ml-2 text-gray-500 underline"
              onClick={() => {
                setEditing(null);
                setForm({ name: "", expression: "", isActive: true });
              }}
            >
              Cancel
            </button>
          )}
        </div>
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      </form>
      {loading ? (
        <p className="text-gray-600">Loading policies...</p>
      ) : policies.length === 0 ? (
        <p className="text-gray-600">No policies found.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Expression</th>
              <th className="py-2 px-4 text-left">Active</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id} className="border-t">
                <td className="py-2 px-4">{policy.name}</td>
                <td className="py-2 px-4 font-mono text-xs">
                  {policy.expression}
                </td>
                <td className="py-2 px-4">{policy.isActive ? "Yes" : "No"}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-blue-600 underline mr-2"
                    onClick={() => handleEdit(policy)}
                    disabled={submitting}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 underline"
                    onClick={() => handleDelete(policy.id)}
                    disabled={submitting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
