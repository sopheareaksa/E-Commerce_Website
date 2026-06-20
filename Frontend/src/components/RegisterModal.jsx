import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, UserPlus } from 'lucide-react';

export default function RegisterModal() {
  const { register, registerModalOpen, setRegisterModalOpen, setLoginModalOpen } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!registerModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password, passwordConfirmation);
      setRegisterModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setRegisterModalOpen(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join us today</p>
          </div>
          <button onClick={close} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" /> {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => { close(); setLoginModalOpen(true); }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
