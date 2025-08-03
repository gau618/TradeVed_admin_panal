'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import SubscriptionModal from '@/components/SubscriptionModal';

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  start_date: string;
  end_date: string;
  status: string;
  user?: { email: string; name: string };
  plan?: { name: string };
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface Plan {
  id: string;
  name: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSub, setEditSub] = useState<Subscription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [subsRes, usersRes, plansRes] = await Promise.all([
        api.get('/admin/subscriptions'),
        api.get('/admin/users'),
        api.get('/admin/plans'),
      ]);
      setSubscriptions(subsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setPlans(plansRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await api.delete(`/admin/subscriptions/${id}`);
        fetchAll();
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    (sub.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.plan?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '✅';
      case 'expired':
        return '❌';
      case 'cancelled':
        return '⏹️';
      case 'pending':
        return '⏳';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscriptions</h1>
        <p className="text-lg text-gray-600">Manage user subscriptions and billing</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900">{subscriptions.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
              <p className="text-3xl font-bold text-gray-900">{subscriptions.filter(s => s.status === 'active').length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Expired</p>
              <p className="text-3xl font-bold text-gray-900">{subscriptions.filter(s => s.status === 'expired').length}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Expiring Soon</p>
              <p className="text-3xl font-bold text-gray-900">
                {subscriptions.filter(s => isExpiringSoon(s.end_date)).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <span className="text-2xl">⚠️</span>
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
                onClick={() => { setEditSub(null); setModalOpen(true); }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">➕</span>
                Create Subscription
              </button>
              <button 
                onClick={fetchAll}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                Refresh
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search subscriptions..."
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
                <span className="text-gray-600">Loading subscriptions...</span>
              </div>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscriptions Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No subscriptions match your search criteria.' : 'Get started by creating your first subscription.'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => { setEditSub(null); setModalOpen(true); }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <span className="mr-2">➕</span>
                  Create First Subscription
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-900">User</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Plan</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Start Date</th>
                  <th className="text-left p-4 font-semibold text-gray-900">End Date</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub, index) => (
                  <tr key={sub.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            {(sub.user?.name || sub.user?.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{sub.user?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">{sub.user?.email || sub.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">📋</span>
                        <div>
                          <p className="font-medium text-gray-900">{sub.plan?.name || 'Unknown Plan'}</p>
                          <p className="text-sm text-gray-500">ID: {sub.planId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">📅</span>
                        <span className="text-gray-900">{formatDate(sub.start_date)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🏁</span>
                        <div>
                          <span className="text-gray-900">{formatDate(sub.end_date)}</span>
                          {isExpiringSoon(sub.end_date) && (
                            <p className="text-xs text-orange-600 font-medium">Expiring Soon!</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sub.status)}`}>
                        <span className="mr-1">{getStatusIcon(sub.status)}</span>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => { setEditSub(sub); setModalOpen(true); }}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          <span className="mr-1">✏️</span>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(sub.id)}
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

      {/* Modal */}
      {modalOpen && (
        <SubscriptionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={fetchAll}
          subscription={editSub || undefined}
          users={users}
          plans={plans}
        />
      )}
    </div>
  );
}
