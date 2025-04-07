import axios from 'axios';

const isServer = typeof window === 'undefined';

// ✅ Check if running on localhost
const isLocalhost = () => {
  if (isServer) return true;
  return typeof window !== 'undefined' && window.location.hostname === 'localhost';
};

// ✅ Environment-aware baseURL
const baseURL = isLocalhost()
  ? 'http://localhost:5000/api/v1' // ⬅️ Dev (localhost)
  : process.env.NEXT_PUBLIC_API_URL || 'https://karrmas-heart.onrender.com/api/v1'; // ⬅️ Prod fallback

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
