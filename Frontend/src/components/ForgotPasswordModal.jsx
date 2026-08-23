import { useState } from 'react';
import { KeyRound, Lock, Mail, X } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordModal() {
  const { forgotPasswordModalOpen, setForgotPasswordModalOpen, setLoginModalOpen } = useAuth();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!forgotPasswordModalOpen) return null;

  const close = () => {
    setForgotPasswordModalOpen(false);
    setStep('email');
    setOtp('');
    setPassword('');
    setPasswordConfirmation('');
    setMessage('');
    setError('');
  };

  const sendOtp = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await api.post('/forgot-password/send-otp', { email });
      setMessage(response.data.message);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send a verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/forgot-password/verify-otp', { email, otp });
      setMessage('Code verified. Choose a new password.');
      setStep('password');
    } catch (err) {
      setError(err.response?.data?.message || 'The verification code could not be confirmed.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await api.post('/forgot-password/reset', {
        email,
        otp,
        password,
        password_confirmation: passwordConfirmation,
      });
      close();
      setLoginModalOpen(true);
      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset the password.');
    } finally {
      setSubmitting(false);
    }
  };

  const title = step === 'email' ? 'Reset your password' : step === 'otp' ? 'Enter verification code' : 'Choose a new password';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-md mx-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start justify-between px-8 pt-8 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{step === 'email' ? 'We will email you a six-digit code.' : `For ${email}`}</p>
          </div>
          <button onClick={close} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-8 pb-8">
          {message && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">{message}</div>}
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">{error}</div>}

          {step === 'email' && <form onSubmit={sendOtp} className="space-y-4">
            <Input icon={<Mail className="w-4 h-4" />} type="email" value={email} onChange={setEmail} placeholder="Email address" />
            <Submit loading={submitting}>Send verification code</Submit>
          </form>}

          {step === 'otp' && <form onSubmit={verifyOtp} className="space-y-4">
            <Input icon={<KeyRound className="w-4 h-4" />} value={otp} onChange={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))} placeholder="Six-digit code" inputMode="numeric" maxLength="6" />
            <Submit loading={submitting}>Verify code</Submit>
            <button type="button" disabled={submitting} onClick={sendOtp} className="w-full text-sm font-semibold text-indigo-600 hover:underline">Send a new code</button>
          </form>}

          {step === 'password' && <form onSubmit={resetPassword} className="space-y-4">
            <Input icon={<Lock className="w-4 h-4" />} type="password" value={password} onChange={setPassword} placeholder="New password (at least 6 characters)" />
            <Input icon={<Lock className="w-4 h-4" />} type="password" value={passwordConfirmation} onChange={setPasswordConfirmation} placeholder="Confirm new password" />
            <Submit loading={submitting}>Reset password</Submit>
          </form>}

          <button type="button" onClick={() => { close(); setLoginModalOpen(true); }} className="mt-5 w-full text-center text-sm font-semibold text-indigo-600 hover:underline">Back to sign in</button>
        </div>
      </div>
    </div>
  );
}

function Input({ icon, type = 'text', value, onChange, placeholder, ...props }) {
  return <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required className="w-full rounded-xl border border-gray-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" {...props} /></div>;
}

function Submit({ loading, children }) {
  return <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Please wait...' : children}</button>;
}
