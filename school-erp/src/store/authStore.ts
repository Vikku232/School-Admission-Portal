import { create } from 'zustand';

// Define the User structure based on our roles
export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
}

// Define the state and actions for authentication
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

/**
 * Zustand store for Authentication state.
 * Manages user details, JWT token, and login/logout actions.
 */
export const useAuthStore = create<AuthState>((set) => {
  // Check if there's an existing token in localStorage for persistence
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    isAuthenticated: !!storedToken,
    login: (user, token) => {
      // Store token and user in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      // Clear storage on logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
