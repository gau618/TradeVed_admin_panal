'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import CreateTaskModal from '@/components/CreateTaskModal';
import EditTaskModal from '@/components/EditTaskModal';

interface ProductTask {
  id: string;
  productId: string;
  name: string;
  billing_type: string;
  credit_cost: number;
  monthly_credit_cost: number | null;
  created_at: string;
  updated_at: string;
}

export default function ProductTasksPage() {
  const { productId } = useParams();
  const router = useRouter();
  const [tasks, setTasks] = useState<ProductTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<ProductTask | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [productName, setProductName] = useState('');

  const fetchTasks = () => {
    setLoading(true);
    api.get(`/admin/products/${productId}/tasks`)
      .then(res => setTasks(res.data.data || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

 const fetchProductInfo = () => {
  api.get('/admin/products')
    .then(res => {
      const products = res.data.data || []; // Access the products array
      const product = products.find((p: any) => p.id === productId); // Use find() to get single product
      console.log('Found Product:', product);
      setProductName(product?.name || 'Unknown Product');
    })
    .catch((error) => { 
      console.error('Error fetching product info:', error);
      setProductName('Unknown Product');
    });
};



  useEffect(() => {
    if (productId) {
      fetchTasks();
      fetchProductInfo();
    }
  }, [productId]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/admin/products/${productId}/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.billing_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBillingTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'per_use':
        return 'bg-blue-100 text-blue-800';
      case 'monthly':
        return 'bg-green-100 text-green-800';
      case 'one_time':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillingTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'per_use':
        return 'Per Use';
      case 'monthly':
        return 'Monthly';
      case 'one_time':
        return 'One Time';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 text-sm bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 mr-4"
          >
            <span className="mr-2">←</span>
            Back
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Product Tasks</h1>
            <p className="text-lg text-gray-600">
              Managing tasks for: <span className="font-semibold text-gray-900">{productName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">⚙️</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Per Use Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{tasks.filter(t => t.billing_type === 'per_use').length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">🔄</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{tasks.filter(t => t.billing_type === 'monthly').length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Credit Cost</p>
              <p className="text-3xl font-bold text-gray-900">
                {tasks.length > 0 ? Math.round(tasks.reduce((sum, t) => sum + t.credit_cost, 0) / tasks.length) : 0}
              </p>
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
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">➕</span>
                Create Task
              </button>
              <button 
                onClick={fetchTasks}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                Refresh
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
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
                <span className="text-gray-600">Loading tasks...</span>
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No tasks match your search criteria.' : 'Get started by creating your first task for this product.'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <span className="mr-2">➕</span>
                  Create First Task
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-900">Task Name</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Billing Type</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Credit Cost</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Monthly Cost</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Created</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Updated</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <tr key={task.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{task.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{task.name}</p>
                          <p className="text-sm text-gray-500">ID: {task.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBillingTypeColor(task.billing_type)}`}>
                        <span className="mr-1">
                          {task.billing_type === 'per_use' ? '🔄' : task.billing_type === 'monthly' ? '📅' : '⚡'}
                        </span>
                        {getBillingTypeLabel(task.billing_type)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">💎</span>
                        <span className="font-semibold text-gray-900">{task.credit_cost}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {task.monthly_credit_cost ? (
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">📅</span>
                          <span className="font-semibold text-gray-900">{task.monthly_credit_cost}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{formatDate(task.created_at)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{formatDate(task.updated_at)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setEditTask(task)}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          <span className="mr-1">✏️</span>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)}
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
      {showModal && (
        <CreateTaskModal
          productId={productId as string}
          onCreated={fetchTasks}
          onClose={() => setShowModal(false)}
        />
      )}
      {editTask && (
        <EditTaskModal
          productId={productId as string}
          task={editTask}
          onUpdated={fetchTasks}
          onClose={() => setEditTask(null)}
        />
      )}
    </div>
  );
}
