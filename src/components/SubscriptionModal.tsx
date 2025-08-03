'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Subscription } from '@/types/subscription';

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  subscription?: Subscription;
  users: { id: string; email: string; name: string }[];
  plans: { id: string; name: string }[];
}

export default function SubscriptionModal({
  open,
  onClose,
  onSaved,
  subscription,
  users,
  plans,
}: SubscriptionModalProps) {
  const isEdit = !!subscription;
  const [form, setForm] = useState({
    userId: subscription?.userId || '',
    planId: subscription?.planId || '',
    start_date: subscription?.start_date?.slice(0, 10) || '',
    end_date: subscription?.end_date?.slice(0, 10) || '',
    status: subscription?.status || 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subscription) {
      setForm({
        userId: subscription.userId,
        planId: subscription.planId,
        start_date: subscription.start_date.slice(0, 10),
        end_date: subscription.end_date.slice(0, 10),
        status: subscription.status,
      });
    } else {
      setForm({
        userId: '',
        planId: '',
        start_date: '',
        end_date: '',
        status: 'ACTIVE',
      });
    }
  }, [subscription, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/admin/subscriptions/${subscription!.id}`, {
          ...form,
          start_date: new Date(form.start_date),
          end_date: new Date(form.end_date),
        });
      } else {
        await api.post('/admin/subscriptions', {
          ...form,
          start_date: new Date(form.start_date),
          end_date: new Date(form.end_date),
        });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save subscription');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">{isEdit ? '✏️' : '➕'}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isEdit ? 'Edit Subscription' : 'Create New Subscription'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isEdit ? 'Update subscription details' : 'Add a new subscription to the system'}
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
          {/* User Selection */}
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              User
            </label>
            <div className="relative">
              <select
                id="userId"
                name="userId"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10 appearance-none bg-white ${
                  isEdit ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                value={form.userId}
                onChange={handleChange}
                required
                disabled={isEdit || loading}
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <span className="absolute left-3 top-3.5 text-gray-400">👤</span>
              <span className="absolute right-3 top-3.5 text-gray-400">▼</span>
            </div>
            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">User cannot be changed after creation</p>
            )}
          </div>

          {/* Plan Selection */}
          <div>
            <label htmlFor="planId" className="block text-sm font-medium text-gray-700 mb-2">
              Subscription Plan
            </label>
            <div className="relative">
              <select
                id="planId"
                name="planId"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10 appearance-none bg-white"
                value={form.planId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select a plan</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <span className="absolute left-3 top-3.5 text-gray-400">📋</span>
              <span className="absolute right-3 top-3.5 text-gray-400">▼</span>
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <span className="absolute left-3 top-3.5 text-gray-400">📅</span>
              </div>
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <span className="absolute left-3 top-3.5 text-gray-400">🏁</span>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Subscription Status
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10 appearance-none bg-white"
                value={form.status}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="ACTIVE">✅ Active</option>
                <option value="EXPIRED">❌ Expired</option>
                <option value="CANCELLED">⏹️ Cancelled</option>
              </select>
              <span className="absolute left-3 top-3.5 text-gray-400">📊</span>
              <span className="absolute right-3 top-3.5 text-gray-400">▼</span>
            </div>
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
                  {isEdit ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">{isEdit ? '✏️' : '➕'}</span>
                  {isEdit ? 'Update Subscription' : 'Create Subscription'}
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
