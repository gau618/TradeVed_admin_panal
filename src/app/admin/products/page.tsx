"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import CreateProductModal from "@/components/CreateProductModal";
import EditProductModal from "@/components/EditProductModal";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description?: string;
  access_tier: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/admin/products")
      .then((res) => setProducts(res.data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTierColor = (tier: number) => {
    if (tier === 1) return 'bg-green-100 text-green-800';
    if (tier === 2) return 'bg-blue-100 text-blue-800';
    if (tier === 3) return 'bg-purple-100 text-purple-800';
    if (tier === 4) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  // const getTierLabel = (tier: number) => {
  //   const labels = {
  //     1: 'Basic',
  //     2: 'Standard',
  //     3: 'Premium',
  //     4: 'Enterprise',
  //     5: 'Ultimate'
  //   };
  //   return labels[tier as keyof typeof labels] || `Tier ${tier}`;
  // };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-lg text-gray-600">Manage your platform products and features</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Basic Tier</p>
              <p className="text-3xl font-bold text-gray-900">{products.filter(p => p.access_tier === 1).length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">🟢</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Premium Tier</p>
              <p className="text-3xl font-bold text-gray-900">{products.filter(p => p.access_tier >= 3).length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">💎</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Tier</p>
              <p className="text-3xl font-bold text-gray-900">
                {products.length > 0 ? (products.reduce((sum, p) => sum + p.access_tier, 0) / products.length).toFixed(1) : '0'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <span className="text-2xl">📊</span>
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
                Create Product
              </button>
              <button 
                onClick={fetchProducts}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <span className="mr-2">🔄</span>
                Refresh
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
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
                <span className="text-gray-600">Loading products...</span>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No products match your search criteria.' : 'Get started by creating your first product.'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <span className="mr-2">➕</span>
                  Create First Product
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-900">Product Name</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Description</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Access Tier</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{product.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-700 max-w-xs truncate">
                        {product.description || (
                          <span className="text-gray-400 italic">No description</span>
                        )}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTierColor(product.access_tier)}`}>
                          <span className="mr-1">🎯</span>
                          {product.access_tier}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => router.push(`/admin/products/${product.id}/tasks`)}
                          className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                        >
                          <span className="mr-1">⚙️</span>
                          Tasks
                        </button>
                        <button 
                          onClick={() => setEditProduct(product)}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          <span className="mr-1">✏️</span>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
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
        <CreateProductModal
          onCreated={fetchProducts}
          onClose={() => setShowModal(false)}
        />
      )}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onUpdated={fetchProducts}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
}
