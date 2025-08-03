'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import CreateCreditPackModal from '@/components/CreateCreditPackModal';
import EditCreditPackModal from '@/components/EditCreditPackModal';

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  isActive: boolean;
}

export default function CreditPacksPage() {
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editPack, setEditPack] = useState<CreditPack | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPacks = () => {
    setLoading(true);
    api.get('/admin/creditpacks')
      .then(res => setPacks(res.data.data || []))
      .catch(() => setPacks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this credit pack?')) {
      try {
        await api.delete(`/admin/creditpacks/${id}`);
        fetchPacks();
      } catch (error) {
        console.error('Error deleting credit pack:', error);
      }
    }
  };

  const filteredPacks = packs.filter(pack =>
    pack.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Credit Packs</h1>
        <p className="text-lg text-gray-600">Manage credit packages and pricing</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Packs</p>
              <p className="text-3xl font-bold text-gray-900">{packs.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Packs</p>
              <p className="text-3xl font-bold text-gray-900">{packs.filter(p => p.isActive).length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Credits</p>
              <p className="text-3xl font-bold text-gray-900">{packs.reduce((sum, p) => sum + p.credits, 0)}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">💎</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Price</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{packs.length > 0 ? Math.round(packs.reduce((sum, p) => sum + p.price, 0) / packs.length) : 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <span className="text-2xl">💰</span>
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
                Create Credit Pack
              </button>
              <button 
                onClick={fetchPacks}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                Refresh
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search credit packs..."
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
                <span className="text-gray-600">Loading credit packs...</span>
              </div>
            </div>
          ) : filteredPacks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Credit Packs Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No packs match your search criteria.' : 'Get started by creating your first credit pack.'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <span className="mr-2">➕</span>
                  Create First Pack
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-900">Pack Name</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Credits</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Price</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Value/Credit</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacks.map((pack, index) => (
                  <tr key={pack.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{pack.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{pack.name}</p>
                          <p className="text-sm text-gray-500">ID: {pack.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">💎</span>
                        <span className="font-semibold text-gray-900">{pack.credits.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">₹</span>
                        <span className="font-semibold text-gray-900">{pack.price.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        pack.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <span className="mr-1">{pack.isActive ? '✅' : '❌'}</span>
                        {pack.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">
                        ₹{(pack.price / pack.credits).toFixed(2)}/credit
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setEditPack(pack)}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          <span className="mr-1">✏️</span>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(pack.id)}
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
        <CreateCreditPackModal onCreated={fetchPacks} onClose={() => setShowCreate(false)} />
      )}
      {editPack && (
        <EditCreditPackModal pack={editPack} onUpdated={fetchPacks} onClose={() => setEditPack(null)} />
      )}
    </div>
  );
}
