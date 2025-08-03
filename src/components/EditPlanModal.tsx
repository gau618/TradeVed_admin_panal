'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface EditPlanModalProps {
  plan: {
    id: string;
    name: string;
    price: number;
    duration_in_days: number;
    product_access_limit: number;
    credits_granted: number;
  };
  onUpdated: () => void;
  onClose: () => void;
}

export default function EditPlanModal({ plan, onUpdated, onClose }: EditPlanModalProps) {
  const [form, setForm] = useState({
    name: plan.name,
    price: plan.price.toString(),
    duration_in_days: plan.duration_in_days.toString(),
    product_access_limit: plan.product_access_limit.toString(),
    credits_granted: plan.credits_granted.toString(),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/admin/plans/${plan.id}`, {
        name: form.name,
        price: parseFloat(form.price),
        duration_in_days: parseInt(form.duration_in_days, 10),
        product_access_limit: parseInt(form.product_access_limit, 10),
        credits_granted: parseInt(form.credits_granted, 10),
      });
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update plan');
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
              <h2 className="text-xl font-bold text-gray-900 mb-1">Edit Plan</h2>
              <p className="text-sm text-gray-600">Update subscription plan details</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <input 
            name="name" 
            placeholder="Plan Name" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            value={form.name} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            placeholder="Price (₹)" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            value={form.price} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <input 
            name="duration_in_days" 
            type="number" 
            placeholder="Duration (days)" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            value={form.duration_in_days} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <input 
            name="product_access_limit" 
            type="number" 
            placeholder="Access Tier Limit" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            value={form.product_access_limit} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <input 
            name="credits_granted" 
            type="number" 
            placeholder="Credits Granted" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            value={form.credits_granted} 
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
