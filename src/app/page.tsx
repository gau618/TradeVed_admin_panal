export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3">
                <span className="text-white text-lg">⚡</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Trading Platform</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Home
              </a>
              <a href="/features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Features
              </a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                About
              </a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Contact
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <span className="mr-2">🔐</span>
                Admin Login
              </a>
              
              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="text-center max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
              <span className="text-3xl">⚡</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Trading Platform
            </h1>
            <p className="text-xl text-gray-600">
              Professional admin dashboard for managing your trading platform
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">🔐</span>
              Admin Login
            </a>
            <a
              href="/admin/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="mr-2">📊</span>
              View Dashboard
            </a>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-2xl mb-3">📈</div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">
                Comprehensive trading analytics and performance metrics
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-2xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-sm text-gray-600">
                Manage users, subscriptions, and platform access
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-2xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">
                Enterprise-grade security for your trading platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
