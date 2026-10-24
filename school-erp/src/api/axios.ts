import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Global Axios instance configured with a base URL to match the Vite proxy.
 * This ensures all API calls are automatically routed to the Spring Boot backend.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
