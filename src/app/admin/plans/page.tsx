'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import CreatePlanModal from '@/components/CreatePlanModal';
import EditPlanModal from '@/components/EditPlanModal';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration_in_days: number;
  product_access_limit: number;
  credits_granted: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPlans = () => {
    setLoading(true);
    api
      .get('/admin/plans')
      .then(res => setPlans(res.data.data || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await api.delete(`/admin/plans/${id}`);
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDurationText = (days: number) => {
    if (days === 30) return '1 Month';
    if (days === 90) return '3 Months';
    if (days === 365) return '1 Year';
    if (days === 7) return '1 Week';
    return `${days} Days`;
  };

  const getPlanTypeColor = (price: number) => {
    if (price === 0) return 'bg-gray-100 text-gray-800';
    if (price < 1000) return 'bg-blue-100 text-blue-800';
    if (price < 5000) return 'bg-purple-100 text-purple-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
        <p className="text-lg text-gray-600">Manage pricing plans and subscription tiers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Plans</p>
              <p className="text-3xl font-bold text-gray-900">{plans.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Free Plans</p>
              <p className="text-3xl font-bold text-gray-900">{plans.filter(p => p.price === 0).length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">🆓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Price</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{plans.length > 0 ? Math.round(plans.reduce((sum, p) => sum + p.price, 0) / plans.length) : 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Credits</p>
              <p className="text-3xl font-bold text-gray-900">{plans.reduce((sum, p) => sum + p.credits_granted, 0)}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <span className="text-2xl">💎</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">➕</span>
                Create Plan
              </button>
              <button 
                onClick={fetchPlans}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                Refresh
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-gray-600">Loading plans...</span>
              </div>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Plans Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No plans match your search criteria.' : 'Get started by creating your first subscription plan.'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <span className="mr-2">➕</span>
                  Create First Plan
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-900">Plan Name</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Price</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Duration</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Access Limit</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Credits</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Value</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan, index) => (
                  <tr key={plan.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{plan.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{plan.name}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanTypeColor(plan.price)}`}>
                            {plan.price === 0 ? 'Free' : plan.price < 1000 ? 'Basic' : plan.price < 5000 ? 'Premium' : 'Enterprise'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">₹</span>
                        <div>
                          <span className="font-semibold text-gray-900">{plan.price.toLocaleString()}</span>
                          {plan.price > 0 && (
                            <p className="text-sm text-gray-500">₹{Math.round(plan.price / plan.duration_in_days)}/day</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">📅</span>
                        <div>
                          <span className="font-medium text-gray-900">{getDurationText(plan.duration_in_days)}</span>
                          <p className="text-sm text-gray-500">{plan.duration_in_days} days</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🎯</span>
                        <span className="font-medium text-gray-900">{plan.product_access_limit}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">💎</span>
                        <span className="font-medium text-gray-900">{plan.credits_granted.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {plan.credits_granted > 0 && plan.price > 0 ? (
                          <span className="text-gray-600">₹{(plan.price / plan.credits_granted).toFixed(2)}/credit</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setEditPlan(plan)}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          <span className="mr-1">✏️</span>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(plan.id)}
                          className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          <span className="mr-1">🗑️</span>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreatePlanModal
          onCreated={fetchPlans}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editPlan && (
        <EditPlanModal
          plan={editPlan}
          onUpdated={fetchPlans}
          onClose={() => setEditPlan(null)}
        />
      )}
    </div>
  );
}
