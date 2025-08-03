'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface CreateTaskModalProps {
  productId: string;
  onCreated: () => void;
  onClose: () => void;
}

export default function CreateTaskModal({ productId, onCreated, onClose }: CreateTaskModalProps) {
  const [form, setForm] = useState({
    name: '',
    billing_type: 'PER_ACTION',
    credit_cost: '',
    monthly_credit_cost: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post(`/admin/products/${productId}/tasks`, {
        name: form.name,
        billing_type: form.billing_type,
        credit_cost: form.billing_type === 'PER_ACTION' ? parseInt(form.credit_cost, 10) : null,
        monthly_credit_cost: form.billing_type === 'RECURRING' ? parseInt(form.monthly_credit_cost, 10) : null,
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">➕</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Create New Task</h2>
              <p className="text-sm text-gray-600">Add a new task to this product</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <input
            name="name"
            placeholder="Task Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <select
            name="billing_type"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-white"
            value={form.billing_type}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="PER_ACTION">🔄 Per Action</option>
            <option value="RECURRING">📅 Recurring</option>
          </select>
          <input
            name="credit_cost"
            type="number"
            min={0}
            placeholder="Credit Cost"
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              form.billing_type !== 'PER_ACTION' ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
            value={form.credit_cost}
            onChange={handleChange}
            required={form.billing_type === 'PER_ACTION'}
            disabled={form.billing_type !== 'PER_ACTION' || loading}
          />
          <input
            name="monthly_credit_cost"
            type="number"
            min={0}
            placeholder="Monthly Credit Cost"
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              form.billing_type !== 'RECURRING' ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
            value={form.monthly_credit_cost}
            onChange={handleChange}
            required={form.billing_type === 'RECURRING'}
            disabled={form.billing_type !== 'RECURRING' || loading}
          />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create'
              )}
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
