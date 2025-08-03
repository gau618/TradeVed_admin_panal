'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface CreateProductModalProps {
  onCreated: () => void;
  onClose: () => void;
}

export default function CreateProductModal({ onCreated, onClose }: CreateProductModalProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    access_tier: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/admin/products', {
        name: form.name,
        description: form.description || undefined,
        access_tier: parseInt(form.access_tier, 10),
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product');
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
              <h2 className="text-xl font-bold text-gray-900 mb-1">Create New Product</h2>
              <p className="text-sm text-gray-600">Add a new product to your platform</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <input
            name="name"
            placeholder="Product Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
            rows={3}
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="access_tier"
            type="number"
            min={1}
            placeholder="Access Tier (min 1)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={form.access_tier}
            onChange={handleChange}
            required
            disabled={loading}
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
