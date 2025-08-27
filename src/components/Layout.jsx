import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  BookOpen, 
  TrendingUp, 
  Users, 
  User, 
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Your daily overview' },
    { name: 'Journal', href: '/journal', icon: BookOpen, description: 'Write and manage entries' },
    { name: 'Mood Trends', href: '/mood-trends', icon: TrendingUp, description: 'Track your progress' },
    { name: 'Community', href: '/stories', icon: Users, description: 'Share and connect' },
    { name: 'AI Health', href: '/ai-health', icon: Sparkles, description: 'Your ultimate health assistance' },
    { name: 'Profile', href: '/profile', icon: User, description: 'Account settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile sidebar overlay - transparent */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Layout Container */}
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-opacity-20 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">MoodLog</h1>
                <p className="text-xs text-blue-100">Mental Health Journal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-2.5 h-4 w-4 transition-colors ${
                      isActive(item.href) 
                        ? 'text-white' 
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-xs mt-0.5 ${
                        isActive(item.href) 
                          ? 'text-blue-100' 
                          : 'text-gray-500 group-hover:text-gray-600'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    {isActive(item.href) && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile Section - Restructured */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="space-y-2">
              {/* User Info */}
              <div className="flex items-center p-2.5 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-semibold">
                      {user?.displayName?.charAt(0) || user?.username?.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.displayName || user?.username}
                  </p>
                  <p className="text-xs text-gray-500">Anonymous User</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-200"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200 shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h1 className="text-base font-bold text-gray-900">MoodLog</h1>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {user?.displayName?.charAt(0) || user?.username?.charAt(0)}
              </span>
            </div>
          </div>

          {/* Page Content with proper spacing */}
          <main className="min-h-screen p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
