
import React, { useState } from 'react';
import { useAppState } from '../store';
import { COMPANY_INFO } from '../constants';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const { login } = useAppState();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // login returns a boolean
    const success = login(userId, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  const isFormValid = userId.trim() !== '' && password.trim() !== '';

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-6 font-['Inter']">
      <div className="w-full max-w-[400px] bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8 sm:p-10">
          {/* Company Branding */}
          <div className="text-center mb-10">
            <Logo size="lg" className="mx-auto mb-6" />
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
              {COMPANY_INFO.name}
            </h1>
            <div className="mt-2 h-0.5 w-8 bg-[#0B72E7] mx-auto rounded-full"></div>
            <p className="mt-4 text-sm text-gray-500 font-medium">
              Transport Management System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identity Input */}
            <div className="space-y-1.5">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Email or Phone"
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B72E7] focus:border-transparent transition-all sm:text-sm"
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="space-y-1.5 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B72E7] focus:border-transparent transition-all sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.413 7.502 7.244 4.5 12 4.5c4.756 0 8.773 3.162 10.065 7.498a1.01 1.01 0 010 .644C20.587 16.498 16.756 19.5 12 19.5c-4.756 0-8.773-3.162-10.065-7.498z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center space-x-2 text-red-500 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Login Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-[#0B72E7] hover:bg-[#095ebf] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg shadow-sm transition-all duration-200 sm:text-sm"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer info */}
        <div className="bg-gray-50 border-t border-gray-100 p-5 text-center">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            App Created by Md Mostafizur Rahman
            <br />
            <span className="opacity-60">February 2025</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
