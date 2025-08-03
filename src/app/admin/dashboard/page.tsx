'use client';
import withAdminAuth from '@/utils/withAdminAuth';

function DashboardPage() {
  const stats = [
    {
      name: 'Total Users',
      value: '12,847',
      change: '+12%',
      changeType: 'positive',
      color: 'blue',
      emoji: '👥'
    },
    {
      name: 'Monthly Revenue',
      value: '₹2,45,680',
      change: '+8.2%',
      changeType: 'positive',
      color: 'green',
      emoji: '💰'
    },
    {
      name: 'Active Subscriptions',
      value: '8,432',
      change: '+5.4%',
      changeType: 'positive',
      color: 'purple',
      emoji: '📊'
    },
    {
      name: 'Quiz Completions',
      value: '3,247',
      change: '-2.1%',
      changeType: 'negative',
      color: 'orange',
      emoji: '🎯'
    }
  ];

  const recentActivity = [
    { id: 1, user: 'Rahul Sharma', action: 'Completed Quiz Module', time: '2 minutes ago', status: 'success' },
    { id: 2, user: 'Priya Patel', action: 'Started Paper Trading', time: '5 minutes ago', status: 'info' },
    { id: 3, user: 'Amit Kumar', action: 'Subscription Expired', time: '10 minutes ago', status: 'warning' },
    { id: 4, user: 'Sneha Gupta', action: 'New User Registration', time: '15 minutes ago', status: 'success' },
    { id: 5, user: 'Vikram Singh', action: 'Failed Payment', time: '20 minutes ago', status: 'error' }
  ];

  const quickActions = [
    { name: 'Add New User', href: '/admin/users/add', color: 'blue', emoji: '👤' },
    { name: 'Create Quiz', href: '/admin/quiz/create', color: 'green', emoji: '❓' },
    { name: 'View Reports', href: '/admin/reports', color: 'purple', emoji: '📈' },
    { name: 'Manage Plans', href: '/admin/plans', color: 'orange', emoji: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                <span className="text-2xl">{stat.emoji}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600 mt-1">Latest user actions and system events</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'info' ? 'bg-blue-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <span className="text-sm">
                      {activity.status === 'success' ? '✅' :
                       activity.status === 'info' ? '👁️' :
                       activity.status === 'warning' ? '⚠️' :
                       '❌'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600 mt-1">Common administrative tasks</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {quickActions.map((action) => (
                <a
                  key={action.name}
                  href={action.href}
                  className={`flex items-center w-full p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid ${
                    action.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
                    action.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                    action.color === 'purple' ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50' :
                    'border-orange-300 hover:border-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <span className="text-xl mr-3">{action.emoji}</span>
                  <span className={`text-sm font-medium ${
                    action.color === 'blue' ? 'text-blue-700' :
                    action.color === 'green' ? 'text-green-700' :
                    action.color === 'purple' ? 'text-purple-700' :
                    'text-orange-700'
                  }`}>
                    {action.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          <p className="text-sm text-gray-600 mt-1">Current platform health and performance</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">All Systems Operational</h3>
              <p className="text-sm text-gray-600">99.9% uptime this month</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <p className="text-sm text-gray-600">Average response time: 120ms</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
              <p className="text-sm text-gray-600">15% increase in active users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(DashboardPage);
