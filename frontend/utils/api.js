import axios from 'axios';

const isServer = typeof window === 'undefined';
const isLocalhost = () => {
  if (isServer) return true;
  return typeof window !== 'undefined' && window.location.hostname === 'localhost';
};

const baseURL = isLocalhost()
  ? 'http://localhost:5000/api/v1'
  : '/api/v1'; // Served from backend

const api = axios.create({
  baseURL,
  // ⚠️ Remove this unless you're doing cookie-based auth
  // withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (!isServer) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
