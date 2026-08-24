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

// Lightweight background pre-warming ping on initial load
if (typeof window !== 'undefined') {
  const base = BACKEND_API_URL.replace(/\/api\/?$/, '');
  fetch(`${base}/`, { method: 'GET', mode: 'cors', cache: 'no-store' }).catch(() => {});
}

export default api;
