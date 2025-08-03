'use client';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  NewspaperIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
  HomeIcon,
  CreditCardIcon,
  CubeIcon,
  UserIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState({ users: false, quiz: false });

  const toggleExpanded = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: HomeIcon,
      current: false
    },
    {
      name: 'Quiz',
      icon: QuestionMarkCircleIcon,
      current: false,
      hasSubmenu: true,
      submenu: [
        { name: 'Game Modes', href: '/admin/quiz?tab=game-modes', icon: Cog6ToothIcon },
        { name: 'User Progression', href: '/admin/quiz?tab=users', icon: UserGroupIcon },
        { name: 'Level Calculator', href: '/admin/quiz?tab=calculator', icon: ChartBarIcon }
      ]
    },
     {
      name: 'Users',
      icon: UserGroupIcon,
      current: false,
      hasSubmenu: true,
      submenu: [
        { name: 'Plans', href: '/admin/plans', icon: DocumentTextIcon },
        { name: 'Products', href: '/admin/products', icon: CubeIcon },
        { name: 'Credit Packs', href: '/admin/creditpacks', icon: CreditCardIcon },
        { name: 'Users Management', href: '/admin/users', icon: UserGroupIcon },
        { name: 'Subscriptions', href: '/admin/subscriptions', icon: DocumentDuplicateIcon }
      ]
    },
    {
      name: 'Quest',
      href: '/admin/quest',
      icon: DocumentTextIcon,
      current: false
    },
    {
      name: 'Paper Trading',
      href: '/admin/paper-trading',
      icon: ArrowTrendingUpIcon,
      current: false
    },
    {
      name: 'Journal',
      href: '/admin/journal',
      icon: NewspaperIcon,
      current: false
    },
    {
      name: 'Copy Trading',
      href: '/admin/copy-trading',
      icon: DocumentDuplicateIcon,
      current: false
    },
    {
      name: 'Scanner',
      href: '/admin/scanner',
      icon: MagnifyingGlassIcon,
      current: false
    },
    {
      name: 'Visualizer',
      href: '/admin/visualizer',
      icon: ChartBarIcon,
      current: false
    },
    {
      name: 'Backtest',
      href: '/admin/backtest',
      icon: Cog6ToothIcon,
      current: false
    },
    {
      name: 'No Code Algo',
      href: '/admin/no-code-algo',
      icon: CodeBracketIcon,
      current: false
    },
   
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col min-h-screen shadow-2xl border-r border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <p className="text-slate-400 text-sm mt-1">Management Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.name}>
            {item.hasSubmenu ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name.toLowerCase())}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    item.current
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {expandedItems[item.name.toLowerCase()] ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </button>
                
                {/* Submenu */}
                {expandedItems[item.name.toLowerCase()] && (
                  <div className="mt-2 ml-4 space-y-1 border-l-2 border-slate-600 pl-4">
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className="flex items-center px-3 py-2 text-sm text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors duration-200 group"
                      >
                        <subItem.icon className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.current
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={logout} 
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-red-600/25"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
