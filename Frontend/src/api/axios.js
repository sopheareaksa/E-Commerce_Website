import axios from 'axios';

const BACKEND_API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://zodiac-backend-6vfn.onrender.com/api'
    : 'http://localhost:8000/api');

const api = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Silent background pre-warming ping on initial load (no-cors mode to prevent any browser console warnings)
if (typeof window !== 'undefined') {
  fetch(`${BACKEND_API_URL}/products`, { method: 'GET', mode: 'no-cors', cache: 'no-store' }).catch(() => {});
}

export default api;
