'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  name?: string;
  email: string;
  registration_status?: string;
  userRole: { role: { id: string; title: string } }[];
}

interface Role {
  id: string;
  title: string;
}

interface UserModalProps {
  user?: User;
  roles: Role[];
  onClose: () => void;
  onSaved: () => void;
}

export default function UserModal({ user, roles, onClose, onSaved }: UserModalProps) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    roleId: user?.userRole?.[0]?.role.id || '',
    isActive: user ? user.registration_status !== 'SUSPENDED' : true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload: any = { name: form.name, roleId: form.roleId };
      if (isEdit) {
        payload.isActive = form.isActive;
        await api.put(`/admin/users/${user.id}`, payload);
      } else {
        payload.email = form.email;
        payload.password = form.password;
        await api.post('/admin/users', payload); // Fixed syntax error
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
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
                <span className="text-white text-lg">{isEdit ? '✏️' : '➕'}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isEdit ? 'Edit User' : 'Create New User'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isEdit ? 'Update user information' : 'Add a new user to the system'}
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
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <span className="absolute left-3 top-3.5 text-gray-400">👤</span>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10 ${
                  isEdit ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                value={form.email}
                onChange={handleChange}
                required
                disabled={isEdit || loading}
              />
              <span className="absolute left-3 top-3.5 text-gray-400">📧</span>
            </div>
            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed after creation</p>
            )}
          </div>

          {/* Password Field (Create only) */}
          {!isEdit && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <span className="absolute left-3 top-3.5 text-gray-400">🔒</span>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-2">
              User Role
            </label>
            <div className="relative">
              <select
                id="roleId"
                name="roleId"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10 appearance-none bg-white"
                value={form.roleId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.title}
                  </option>
                ))}
              </select>
              <span className="absolute left-3 top-3.5 text-gray-400">👑</span>
              <span className="absolute right-3 top-3.5 text-gray-400">▼</span>
            </div>
          </div>

          {/* Active Status (Edit only) */}
          {isEdit && (
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <label htmlFor="isActive" className="ml-3 flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  User is Active
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {form.isActive ? '✅' : '❌'}
                </span>
              </label>
            </div>
          )}

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
                  {isEdit ? 'Update User' : 'Create User'}
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
