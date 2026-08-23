import api from './axios';

/**
 * Bakong KHQR API client functions
 */

/**
 * Generate Bakong KHQR for an order
 * @param {Object} params
 * @param {number|string} params.orderId
 * @param {string} [params.currency='USD'] - 'USD' | 'KHR'
 */
export const generateKhqr = async ({ orderId, currency = 'USD' }) => {
  const response = await api.post('/bakong/generate-khqr', {
    order_id: orderId,
    currency,
  });
  return response.data;
};

/**
 * Check payment status by MD5 hash
 * @param {Object} params
 * @param {number|string} params.orderId
 * @param {string} params.md5
 */
export const checkBakongPayment = async ({ orderId, md5 }) => {
  const response = await api.post('/bakong/check-payment', {
    order_id: orderId,
    md5,
  });
  return response.data;
};

/**
 * Simulate or manually confirm Bakong payment (e.g. for development / instant confirmation)
 * @param {Object} params
 * @param {number|string} params.orderId
 */
export const simulateBakongPayment = async ({ orderId }) => {
  const response = await api.post('/bakong/simulate-payment', {
    order_id: orderId,
  });
  return response.data;
};

export default {
  generateKhqr,
  checkBakongPayment,
  simulateBakongPayment,
};
