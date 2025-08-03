"use client";
import { useState } from "react";
import api from "@/lib/api";

interface EditTaskModalProps {
  productId: string;
  task: {
    id: string;
    name: string;
    billing_type: string;
    credit_cost: number;
    monthly_credit_cost: number | null;
  };
  onUpdated: () => void;
  onClose: () => void;
}

export default function EditTaskModal({
  productId,
  task,
  onUpdated,
  onClose,
}: EditTaskModalProps) {
  const [form, setForm] = useState({
    name: task.name,
    billing_type: task.billing_type,
    credit_cost: task.credit_cost.toString(),
    monthly_credit_cost: task.monthly_credit_cost?.toString() || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put(`/admin/products/${productId}/tasks/${task.id}`, {
        name: form.name,
        billing_type: form.billing_type,
        credit_cost: parseInt(form.credit_cost, 10),
        monthly_credit_cost: form.monthly_credit_cost
          ? parseInt(form.monthly_credit_cost, 10)
          : null,
      });
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">✏️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
                <p className="text-sm text-gray-600">
                  Update task configuration and billing
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={loading}
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Task Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter task name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <span className="absolute left-3 top-3.5 text-gray-400">⚙️</span>
            </div>
          </div>

          {/* Billing Type */}
          <div>
            <label
              htmlFor="billing_type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Billing Type
            </label>
            <div className="relative">
              <select
                id="billing_type"
                name="billing_type"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10 appearance-none bg-white"
                value={form.billing_type}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="PER_ACTION">PER_ACTION</option>
                <option value="MONTHLY">MONTHLY</option>
              </select>
              <span className="absolute left-3 top-3.5 text-gray-400">💳</span>
              <span className="absolute right-3 top-3.5 text-gray-400">▼</span>
            </div>
          </div>

          {/* Credit Cost */}
          <div>
            <label
              htmlFor="credit_cost"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Credit Cost
            </label>
            <div className="relative">
              <input
                id="credit_cost"
                name="credit_cost"
                type="number"
                min="0"
                placeholder="Enter credit cost"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10"
                value={form.credit_cost}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <span className="absolute left-3 top-3.5 text-gray-400">💎</span>
            </div>
          </div>

          {/* Monthly Credit Cost */}
          <div>
            <label
              htmlFor="monthly_credit_cost"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Monthly Credit Cost
              <span className="text-gray-500 text-xs ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <input
                id="monthly_credit_cost"
                name="monthly_credit_cost"
                type="number"
                min="0"
                placeholder="Enter monthly credit cost (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10"
                value={form.monthly_credit_cost}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="absolute left-3 top-3.5 text-gray-400">📅</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty if not applicable for this billing type
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Updating...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">✏️</span>
                  Update Task
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
