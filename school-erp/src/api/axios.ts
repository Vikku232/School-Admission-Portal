import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Resolves and normalizes the backend API base URL.
 * Guarantees that the base URL always ends with '/api',
 * even if VITE_API_URL was configured without the '/api' suffix in Vercel.
 */
const getBaseUrl = (): string => {
  let url = (import.meta.env.VITE_API_URL || 'https://school-admission-portal-2.onrender.com/api').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor:
 * Automatically injects the JWT token from the Zustand authStore into the 
 * Authorization header of every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    // Access token directly from the store state
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
