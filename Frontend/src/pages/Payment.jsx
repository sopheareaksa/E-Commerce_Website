import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CreditCard, Lock } from 'lucide-react';

export default function Payment() {
  const [params] = useSearchParams();
  const orderId = params.get('order_id');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderCost, setOrderCost] = useState(0);
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    api.get(`/orders/${orderId}`).then((res) => {
      setOrderCost(parseFloat(res.data.order_cost));
    }).catch(() => navigate('/'));
  }, [orderId, navigate]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payments', { order_id: orderId });
      setTxnId(res.data.transaction_id);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-slate-700 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-600" viewBox="0 0 52 52">
              <circle className="text-green-200 dark:text-green-800" cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
              <path fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-16" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Successfully</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Your payment has been processed securely.</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Txn: {txnId}</p>
          <button onClick={() => navigate('/account')} className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700">
            View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Details</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Complete your purchase securely.</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-8 border border-gray-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Order Reference</span>
            <span className="font-semibold text-slate-900 dark:text-white">#{String(orderId || 0).padStart(6, '0')}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Total Amount To Pay</span>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${orderCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cardholder Name</label>
            <input type="text" required placeholder="John Doe"
              className="w-full bg-transparent border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" required placeholder="0000 0000 0000 0000" maxLength={19}
                className="w-full bg-transparent border border-gray-300 dark:border-slate-600 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
              <input type="text" required placeholder="MM/YY" maxLength={5}
                className="w-full bg-transparent border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVC</label>
              <input type="text" required placeholder="123" maxLength={3}
                className="w-full bg-transparent border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white" />
            </div>
          </div>
        </div>

        <button onClick={handlePay} disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-xl py-4 text-base font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Lock className="w-4 h-4" /> Pay ${orderCost.toFixed(2)} Securely
        </button>
      </div>
    </div>
  );
}
