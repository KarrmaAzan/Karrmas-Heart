import axios from 'axios';

const isServer = typeof window === 'undefined';
const isLocalhost = () => {
  if (isServer) return true; // SSR runs on localhost in dev
  return typeof window !== 'undefined' && window.location.hostname === 'localhost';
};

const baseURL = isLocalhost()
  ? 'http://localhost:5000/api/v1' // local dev for both SSR & browser
  : '/api/v1'; // production (served from backend)

const api = axios.create({
  baseURL,
  withCredentials: true,
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
