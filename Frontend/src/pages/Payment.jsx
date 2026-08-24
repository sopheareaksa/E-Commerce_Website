import { useEffect, useState, useRef, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api/axios';
import { generateKhqr, checkBakongPayment, simulateBakongPayment } from '../api/bakong';
import {
  CreditCard,
  Lock,
  QrCode,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function Payment() {
  const [params] = useSearchParams();
  const orderId = params.get('order_id');
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [orderCost, setOrderCost] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('bakong'); // 'bakong' | 'aba'
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'KHR'
  
  // Bakong state
  const [bakongData, setBakongData] = useState(null);
  const [bakongLoading, setBakongLoading] = useState(false);
  const [bakongError, setBakongError] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  const [copied, setCopied] = useState(false);

  // ABA state
  const [abaPayment, setAbaPayment] = useState(null);
  const [paywayTransactionId, setPaywayTransactionId] = useState('');
  const [abaLoading, setAbaLoading] = useState(false);

  // General & Success state
  const [checking, setChecking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  const pollingTimerRef = useRef(null);

  // Fetch initial Order data
  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    api.get(`/orders/${orderId}`)
      .then(async (res) => {
        const o = res.data;
        setOrder(o);
        const cost = parseFloat(o.order_cost || o.total_cost || 0);
        setOrderCost(cost);

        // If order is already paid, directly display success
        if (o.order_status?.toLowerCase() === 'paid' || params.get('paid') === '1') {
          setTxnId(`ORD-${orderId}`);
          setSuccess(true);
        }
      })
      .catch(() => navigate('/'));
  }, [orderId, navigate, params]);

  // Handle Bakong KHQR Generation
  const loadBakongKhqr = useCallback(async (selectedCurr = currency) => {
    if (!orderId) return;
    setBakongLoading(true);
    setBakongError('');
    try {
      const res = await generateKhqr({ orderId, currency: selectedCurr });
      if (res.success && res.data) {
        setBakongData(res.data);
        setIsPolling(true);
      } else {
        setBakongError(res.message || 'Failed to generate Bakong KHQR');
      }
    } catch (err) {
      setBakongError(
        err.response?.data?.message || err.message || 'Error generating Bakong KHQR'
      );
    } finally {
      setBakongLoading(false);
    }
  }, [orderId, currency]);

  // Auto-generate Bakong KHQR when selecting Bakong or changing currency
  useEffect(() => {
    if (selectedMethod === 'bakong' && orderId && !success) {
      loadBakongKhqr(currency);
    }
  }, [selectedMethod, currency, orderId, success, loadBakongKhqr]);

  // Auto-polling for Bakong payment verification
  useEffect(() => {
    if (!isPolling || !bakongData?.md5 || success) {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      return;
    }

    pollingTimerRef.current = setInterval(async () => {
      try {
        const res = await checkBakongPayment({
          orderId,
          md5: bakongData.md5,
        });

        if (res.success && res.status === 'COMPLETED') {
          clearInterval(pollingTimerRef.current);
          setIsPolling(false);
          setTxnId(bakongData.md5 || `ORD-${orderId}`);
          setSuccess(true);
          Swal.fire({ title: 'Payment Successful!', icon: 'success', draggable: true });
        }
      } catch (err) {
        // Silently keep polling unless manually stopped
        console.debug('Polling check error:', err.message);
      }
    }, 3500);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [isPolling, bakongData, orderId, success]);

  // Manual Check Bakong Payment Status
  const handleManualCheckBakong = async () => {
    if (!bakongData?.md5) return;
    setChecking(true);
    try {
      const res = await checkBakongPayment({
        orderId,
        md5: bakongData.md5,
      });

      if (res.success && res.status === 'COMPLETED') {
        setTxnId(bakongData.md5 || `ORD-${orderId}`);
        setSuccess(true);
        Swal.fire({
          title: "Payment Successfully!",
          icon: "success",
          draggable: true
        });
      } else {
        Swal.fire({ title: 'Payment Pending', text: res.message || 'Payment is still pending. Please complete transaction in your bank app.', icon: 'warning' });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Unable to check Bakong payment status.', icon: 'error' });
    } finally {
      setChecking(false);
    }
  };

  // Instant Simulate / Confirm Bakong Payment (for Dev/Testing)
  const handleSimulateBakong = async () => {
    setChecking(true);
    try {
      const res = await simulateBakongPayment({ orderId });
      if (res.success) {
        setTxnId(res.transaction_id || `ORD-${orderId}`);
        setSuccess(true);
        Swal.fire({ title: 'Payment Successful!', icon: 'success', draggable: true });
      } else {
        Swal.fire({ title: 'Error', text: res.message || 'Unable to confirm payment.', icon: 'error' });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Unable to confirm payment.', icon: 'error' });
    } finally {
      setChecking(false);
    }
  };

  // Copy QR string to clipboard
  const handleCopyQr = () => {
    if (!bakongData?.qr) return;
    navigator.clipboard.writeText(bakongData.qr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ABA PayWay handlers
  const handleAbaPay = async () => {
    setAbaLoading(true);
    try {
      const res = await api.post('/payments/aba/create', { order_id: orderId });
      setAbaPayment(res.data.payment);
      setPaywayTransactionId(res.data.transaction_id || '');
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || err.message || 'Unable to open ABA PayWay checkout.', icon: 'error' });
    } finally {
      setAbaLoading(false);
    }
  };

  const checkAbaPaywayStatus = async () => {
    setChecking(true);
    try {
      const response = await api.get(`/payments/aba/status/${orderId}`);
      if (response.data.paid) {
        setTxnId(`Order #${String(orderId).padStart(6, '0')}`);
        setSuccess(true);
        Swal.fire({ title: 'Payment Successful!', icon: 'success', draggable: true });
      } else {
        Swal.fire({ title: 'Payment Pending', text: 'ABA PayWay has not approved this transaction yet.', icon: 'warning' });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Unable to check payment status.', icon: 'error' });
    } finally {
      setChecking(false);
    }
  };

  const simulateAbaPayment = async () => {
    setChecking(true);
    try {
      const response = await api.post(`/payments/aba/simulate/${orderId}`);
      setTxnId(response.data.transaction_id);
      setSuccess(true);
      Swal.fire({ title: 'Payment Successful!', icon: 'success', draggable: true });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Unable to simulate payment.', icon: 'error' });
    } finally {
      setChecking(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-slate-700 text-center">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Your transaction has been confirmed and your order is now being processed.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Order Number</span>
              <span className="font-semibold text-slate-900 dark:text-white">#{String(orderId).padStart(6, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Amount Paid</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">${orderCost.toFixed(2)}</span>
            </div>
            {txnId && (
              <div className="flex justify-between items-start gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Transaction Ref</span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all text-right font-medium">{txnId}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => navigate('/account')}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-none transition flex items-center justify-center gap-2"
            >
              View My Orders <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 py-3.5 px-6 rounded-xl font-semibold transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Checkout & Payment</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Select your preferred payment method to complete Order #{String(orderId || '').padStart(6, '0')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Payment Method Selection & Checkout Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payment Method Selector */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" /> Select Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bakong KHQR Card */}
              <button
                type="button"
                onClick={() => setSelectedMethod('bakong')}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                  selectedMethod === 'bakong'
                    ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20 shadow-md shadow-red-100 dark:shadow-none'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                      KHQR
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Bakong KHQR</span>
                  </div>
                  {selectedMethod === 'bakong' && (
                    <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Scan to pay via Bakong, ABA, ACLEDA, Wing & all Cambodian banks.
                </p>
                <span className="inline-block mt-3 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded-md">
                  Recommended
                </span>
              </button>

              {/* ABA PayWay Card */}
              <button
                type="button"
                onClick={() => setSelectedMethod('aba')}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                  selectedMethod === 'aba'
                    ? 'border-sky-600 bg-sky-50/40 dark:bg-sky-950/20 shadow-md shadow-sky-100 dark:shadow-none'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      ABA
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">ABA PayWay</span>
                  </div>
                  {selectedMethod === 'aba' && (
                    <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pay directly via ABA Mobile app, QR, or international Cards.
                </p>
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Order Reference</span>
                <span className="font-semibold text-slate-900 dark:text-white">#{String(orderId || 0).padStart(6, '0')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Payment Status</span>
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Pending Payment
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-700 text-base font-bold">
                <span className="text-slate-900 dark:text-white">Total Amount</span>
                <span className="text-xl text-indigo-600 dark:text-indigo-400">
                  ${orderCost.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All payments are encrypted and verified through the National Bank of Cambodia (NBC) Bakong network.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Payment Interface */}
        <div className="lg:col-span-5">
          {selectedMethod === 'bakong' ? (
            /* Bakong KHQR Interface */
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 text-center relative overflow-hidden">
              {/* Bakong KHQR Header Banner */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 -mx-6 -mt-6 p-4 text-white flex items-center justify-between mb-6 shadow-inner">
                <div className="flex items-center gap-2 text-left">
                  <div className="bg-white text-red-600 font-black text-xs px-2 py-1 rounded shadow">
                    KHQR
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">Bakong KHQR</h3>
                    <p className="text-[11px] text-red-100">National Bank of Cambodia</p>
                  </div>
                </div>
                {/* Currency Switcher */}
                <div className="flex bg-red-800/60 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 rounded-md transition ${
                      currency === 'USD' ? 'bg-white text-red-700 shadow-sm' : 'text-red-100 hover:text-white'
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('KHR')}
                    className={`px-2.5 py-1 rounded-md transition ${
                      currency === 'KHR' ? 'bg-white text-red-700 shadow-sm' : 'text-red-100 hover:text-white'
                    }`}
                  >
                    KHR (៛)
                  </button>
                </div>
              </div>

              {bakongLoading ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Generating Bakong KHQR...</p>
                </div>
              ) : bakongError ? (
                <div className="py-10 px-4 text-center">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-4">{bakongError}</p>
                  <button
                    onClick={() => loadBakongKhqr(currency)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-semibold transition inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Try Again
                  </button>
                </div>
              ) : bakongData ? (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Scan with <strong className="text-slate-700 dark:text-slate-200">Bakong</strong>, <strong className="text-slate-700 dark:text-slate-200">ABA</strong>, <strong className="text-slate-700 dark:text-slate-200">ACLEDA</strong>, or any banking app.
                  </p>

                  {/* QR Code Container with KHQR style frame */}
                  <div className="inline-block p-4 bg-white rounded-2xl border-2 border-red-100 shadow-inner my-2">
                    <QRCodeSVG
                      value={bakongData.qr}
                      size={200}
                      level="M"
                      includeMargin={false}
                      className="mx-auto"
                    />
                  </div>

                  {/* Amount display */}
                  <div className="mt-3 mb-4">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Amount to Pay</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {currency === 'KHR'
                        ? `${Math.round(bakongData.amount * 4100).toLocaleString()} KHR`
                        : `$${bakongData.amount.toFixed(2)} USD`}
                    </span>
                  </div>

                  {/* Live Polling Status */}
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-5 bg-red-50/50 dark:bg-slate-900/50 py-2 px-3 rounded-xl border border-red-100 dark:border-slate-700">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span>Waiting for your payment confirmation...</span>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleManualCheckBakong}
                      disabled={checking}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg shadow-red-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                      {checking ? 'Checking...' : 'I have completed payment'}
                    </button>

                    <button
                      onClick={handleSimulateBakong}
                      disabled={checking}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Payment Manually
                    </button>

                    <button
                      onClick={handleCopyQr}
                      className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied QR String!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy KHQR Raw String
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            /* ABA PayWay Interface */
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 text-center">
              {abaPayment ? (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Scan to pay with ABA</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Open ABA Mobile app to scan and complete payment.</p>

                  {abaPayment.qrImage || abaPayment.qr_image ? (
                    <img
                      src={abaPayment.qrImage || abaPayment.qr_image}
                      alt="ABA QR Code"
                      className="mx-auto my-4 w-60 max-w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-inner"
                    />
                  ) : (
                    <p className="text-red-500 text-sm my-4">ABA PayWay did not return a QR image.</p>
                  )}

                  <p className="text-xl font-bold text-sky-600 mb-4">${orderCost.toFixed(2)}</p>

                  {(abaPayment.abapay_deeplink || abaPayment.aba_pay_deeplink) && (
                    <a
                      href={abaPayment.abapay_deeplink || abaPayment.aba_pay_deeplink}
                      className="mb-3 block w-full rounded-xl bg-sky-600 py-3 font-bold text-white hover:bg-sky-700 text-sm shadow-md shadow-sky-100"
                    >
                      Open in ABA Mobile App
                    </a>
                  )}

                  <button
                    onClick={checkAbaPaywayStatus}
                    disabled={checking}
                    className="w-full rounded-xl border border-sky-600 py-3 font-bold text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 text-sm transition disabled:opacity-50"
                  >
                    {checking ? 'Checking...' : 'I have completed payment'}
                  </button>

                  <button
                    onClick={simulateAbaPayment}
                    disabled={checking}
                    className="mt-3 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold transition"
                  >
                    Confirm Payment Manually
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">ABA PayWay Checkout</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                    You can pay directly using ABA Mobile or credit/debit cards through ABA PayWay.
                  </p>

                  <button
                    onClick={handleAbaPay}
                    disabled={abaLoading}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3.5 font-bold text-sm shadow-lg shadow-sky-200 dark:shadow-none transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    {abaLoading ? 'Connecting to ABA...' : `Proceed with ABA — $${orderCost.toFixed(2)}`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
