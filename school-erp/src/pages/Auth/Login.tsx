import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { School, LogIn, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../api/axios';
import { Button } from '../../components/shared/Button';
import { LandingPage } from '../Public/LandingPage';

export const Login: React.FC = () => {
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
  const searchParams = new URLSearchParams(location.search);
  const initialRole = (searchParams.get('role') as 'teacher' | 'student') || 'teacher';
  const [role, setRole] = useState<'teacher' | 'student'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call backend API (proxied via Vite)
      const response = await api.post('/auth/login', {
        email,
        password,
        role
      });

      const { token, name } = response.data;
      
      // Save to Zustand & localStorage
      login({ email, name, role }, token);
      
      toast.success(`Welcome back, ${name}!`);
      
      // Force redirect after a tiny delay to ensure Zustand state is fully committed
      setTimeout(() => {
        const from = (location.state as any)?.from?.pathname || `/${role}/dashboard`;
        // Use window.location as a fallback if navigate fails
        window.location.href = from;
      }, 100);
      
    } catch (err: any) {
      console.error("Login Error:", err);
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
        
        {/* Role Selector Buttons */}
        <div className="flex p-4 gap-4 bg-slate-50 border-b border-[#E8EDF2]">
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
              role === 'teacher' 
                ? 'bg-[#1A4A7A] text-white ring-2 ring-[#1A4A7A] ring-offset-2' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#1A4A7A] hover:text-[#1A4A7A]'
            }`}
          >
            Teacher Portal
          </button>
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
              role === 'student' 
                ? 'bg-[#1A4A7A] text-white ring-2 ring-[#1A4A7A] ring-offset-2' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#1A4A7A] hover:text-[#1A4A7A]'
            }`}
          >
            Student Portal
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <h2 className="text-xl font-bold font-poppins text-slate-800 mb-6">
            Sign in to {role === 'teacher' ? 'Teacher' : 'Student'} Portal
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {role === 'teacher' ? 'Teacher Email' : 'Student ID / Roll Number'}
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={role === 'student' ? "e.g. STD2026001" : "Enter your email"}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1A4A7A] focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  {role === 'student' ? 'Password (Date of Birth)' : 'Password'}
                </label>
                {role !== 'student' && (
                  <a href="#" className="text-xs font-semibold text-[#2E6DA4] hover:underline">Forgot password?</a>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={role === 'student' ? "e.g. DDMMYYYY or YYYY-MM-DD" : "••••••••"}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1A4A7A] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 pb-3">
              <input type="checkbox" id="remember" className="rounded text-[#1A4A7A] focus:ring-[#1A4A7A] w-4 h-4 cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">Remember me for 30 days</label>
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
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-slate-500">
        &copy; {new Date().getFullYear()} SchoolERP. All rights reserved.
      </p>
      </div>
    </div>
  );
};
