import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Moon, Sun, Search, Bell, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/', label: 'Live Store', icon: Package },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-sans antialiased overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 hidden md:flex flex-col flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-700">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              <img src="/img/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Zodiac Admin</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive(item.to)
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.user_email || 'admin123@gmail.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-500 dark:text-slate-400 hover:text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-slate-200">
              {location.pathname.includes('/admin/dashboard') && 'Products Overview'}
              {location.pathname.includes('/admin/orders') && 'Orders'}
              {location.pathname.includes('/admin/users') && 'Registered Users'}
              {location.pathname.includes('/admin/products') && 'Products'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
              <input type="text" placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 bg-gray-50 dark:bg-slate-700 focus:bg-white transition-colors dark:text-white" />
            </div>
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-slate-700 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-700">
              <Link to="/admin/dashboard" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img src="/img/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">Zodiac Admin</span>
              </Link>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive(item.to)
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium transition-colors">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
