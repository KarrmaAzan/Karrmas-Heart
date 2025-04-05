import axios from 'axios';

const isServer = typeof window === 'undefined';

// ✅ Check if running on localhost
const isLocalhost = () => {
  if (isServer) return true;
  return typeof window !== 'undefined' && window.location.hostname === 'localhost';
};

// ✅ Environment-aware baseURL
const baseURL = isLocalhost()
  ? 'http://localhost:5000/api/v1'
  : process.env.NEXT_PUBLIC_API_URL || '/api/v1'; // fallback for SSR or proxying

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
