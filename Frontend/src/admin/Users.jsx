import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, UserCheck, UserPlus } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_admin_users');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_admin_users_stats');
      return cached ? JSON.parse(cached) : { total: 0, active: 0, latestId: 0 };
    } catch {
      return { total: 0, active: 0, latestId: 0 };
    }
  });

  const [loading, setLoading] = useState(() => !localStorage.getItem('cached_admin_users'));
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then((res) => {
      const data = res.data;
      setUsers(data);
      const total = data.length;
      const active = data.length;
      const latestId = data.length > 0 ? Math.max(...data.map((u) => u.user_id)) : 0;
      const newStats = { total, active, latestId };
      setStats(newStats);
      try {
        localStorage.setItem('cached_admin_users', JSON.stringify(data));
        localStorage.setItem('cached_admin_users_stats', JSON.stringify(newStats));
      } catch {
        // quota safety
      }
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.user_name?.toLowerCase().includes(q) || u.user_email?.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Registered</p>
            {loading && stats.total === 0 ? (
              <div className="h-7 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Active Accounts</p>
            {loading && stats.active === 0 ? (
              <div className="h-7 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Latest User ID</p>
            {loading && stats.latestId === 0 ? (
              <div className="h-7 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.latestId || '—'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Accounts</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Full list of every user who has registered on the store.</p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-700 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {loading && filtered.length === 0 ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        <div className="w-28 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="w-36 h-4 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded-full" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-700 mb-4">
                      <Users className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No users yet</h3>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">No accounts have been registered on the store.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => (
                  <tr key={u.user_id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400 dark:text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {u.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{u.user_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{u.user_email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        #{u.user_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
