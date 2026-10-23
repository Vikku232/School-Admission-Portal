import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { School, LogIn, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../api/axios';
import { Button } from '../../components/shared/Button';
import { LandingPage } from '../Public/LandingPage';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call backend API (proxied via Vite) with 'admin' role
      const cleanEmail = email.trim();
      const response = await api.post('/auth/login', {
        email: cleanEmail,
        password,
        role: 'admin'
      });

      const { token, name } = response.data;
      
      // Save to Zustand & localStorage
      login({ email: cleanEmail, name, role: 'admin' }, token);
      
      toast.success(`Welcome back, ${name}!`);
      
      // Redirect to admin dashboard
      setTimeout(() => {
        const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
        window.location.href = from;
      }, 100);
      
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      let errorMessage = 'Invalid credentials';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = 'Server returned an error';
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Landing Page (non-interactive, blurred) */}
      <div className="absolute inset-0 filter blur-[6px] pointer-events-none select-none opacity-40 scale-[1.02] origin-center z-0">
        <LandingPage />
      </div>

      {/* Close Button in Upper Right */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 shadow-md backdrop-blur-xs transition-all z-20 cursor-pointer group hover:scale-105 active:scale-95"
        title="Go back to Homepage"
      >
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Login Card Overlay with glassmorphism backdrop */}
      <div className="relative min-h-screen bg-[#F5F8FC]/50 backdrop-blur-md flex flex-col items-center justify-center p-4 z-10">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 bg-[#1A4A7A] rounded-xl flex items-center justify-center shadow-lg">
            <School className="w-7 h-7 text-[#F5C518]" />
          </div>
          <h1 className="text-3xl font-bold font-poppins text-[#1A4A7A]">SchoolERP</h1>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 rounded-2xl shadow-xl w-full max-w-[440px] overflow-hidden border border-[#E8EDF2] backdrop-blur-md">
          
          {/* Header Title */}
          <div className="p-4 bg-[#1A4A7A] border-b border-[#E8EDF2] text-center">
            <span className="text-white text-sm font-bold uppercase tracking-wider font-poppins">
              Admin Portal
            </span>
          </div>

          {/* Form Body */}
          <div className="p-8">
            <h2 className="text-xl font-bold font-poppins text-slate-800 mb-6">
              Sign in to Admin Dashboard
            </h2>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@school.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1A4A7A] focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700 font-sans">Password</label>
                  <a href="#" className="text-xs font-semibold text-[#2E6DA4] hover:underline">Forgot password?</a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1A4A7A] focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 pb-3">
                <input type="checkbox" id="remember" className="rounded text-[#1A4A7A] focus:ring-[#1A4A7A] w-4 h-4 cursor-pointer" />
                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none font-sans">Remember me for 30 days</label>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                variant="primary" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In as Admin
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Credentials Box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Demo Admin Credentials:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@school.com');
                    setPassword('12345678');
                    toast.success('Admin credentials auto-filled!');
                  }}
                  className="text-[11px] font-bold text-[#1A4A7A] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                >
                  ⚡ Auto-Fill Credentials
                </button>
              </div>
              <div className="font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                <div>Email: <strong className="text-slate-900">admin@school.com</strong></div>
                <div>Password: <strong className="text-slate-900">12345678</strong></div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-slate-500 font-sans">
          &copy; {new Date().getFullYear()} SchoolERP. All rights reserved.
        </p>
      </div>
    </div>
  );
};
