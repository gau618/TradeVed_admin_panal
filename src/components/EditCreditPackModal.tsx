'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface Props {
  pack: {
    id: string;
    name: string;
    credits: number;
    price: number;
    isActive: boolean;
  };
  onUpdated: () => void;
  onClose: () => void;
}

export default function EditCreditPackModal({ pack, onUpdated, onClose }: Props) {
  const [form, setForm] = useState({
    name: pack.name,
    credits: pack.credits.toString(),
    price: pack.price.toString(),
    isActive: pack.isActive,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/admin/creditpacks/${pack.id}`, {
        name: form.name,
        credits: parseInt(form.credits, 10),
        price: parseFloat(form.price),
        isActive: form.isActive,
      });
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update credit pack');
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
              <span className="text-white text-lg">✏️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Edit Credit Pack</h2>
              <p className="text-sm text-gray-600">Update credit pack details</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <input
            name="name"
            placeholder="Credit Pack Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="credits"
            type="number"
            min={1}
            placeholder="Number of Credits"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={form.credits}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            placeholder="Price (₹)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={form.price}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <input
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <label className="ml-3 flex items-center">
              <span className="text-sm font-medium text-gray-700">Active Credit Pack</span>
              <span className="ml-2 text-sm text-gray-500">
                {form.isActive ? '✅' : '❌'}
              </span>
            </label>
          </div>
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
                  Updating...
                </div>
              ) : (
                'Update'
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
