'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Login } from '../../lib/auth';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

const LoginPage = () => {
  const router = useRouter();

  // General state variables
  const [loading, setLoading] = useState(false);
  const [onError, setError] = useState(false);
  const [resetPasswordError, setResetError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for showing the reset password form (for sending reset emails)
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Theme and user context
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Redirect logged-in user to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [router, user]);

  // Submit login credentials
  const onSubmitLogin = async (values: { email: string; password: string }) => {
    try {
      setError(false);
      setLoading(true);
      const { error } = await Login(values);
      if (error) {
        setError(true);
        throw new Error(error.message);
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to send a password reset email using Supabase
  const sendResetPassword = async (email: string) => {
    try {
      setResetError(false);
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset`
      });
      if (error) {
        setResetError(true);
        console.error('Reset password error:', error);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setResetError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!resetPassword) {
    // Render the login form
    return (
      <div className={`flex items-center justify-center min-h-screen px-4 ${isDark ? 'bg-[#222224]' : 'bg-gray-50'}`}>
        <div className="w-full max-w-sm">
          <h2 className={`text-3xl font-bold font-montserrat ${isDark ? 'text-white' : 'text-text-primary'}`}>
            Welcome back
          </h2>
          <p className={`text-sm font-inter mb-6 ${isDark ? 'text-white' : 'text-text-primary'}`}>
            Log In to your account
          </p>
          
          {/* Login Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitLogin({ email, password });
            }}
          >
            {onError && (
              <p className="font-inter italic text-sm text-red-500 mb-1">
                Login or password is invalid.
              </p>
            )}
            
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full font-inter px-4 py-3 rounded-md focus:outline-none mb-6 ${
                  isDark
                    ? 'text-white placeholder-gray-400 border border-gray-600'
                    : 'text-text-primary placeholder-gray-500 border border-gray-300'
                } ${onError ? 'focus:border-red-500' : isDark ? 'focus:border-white' : 'focus:border-text-primary'}`}
              />
            </div>

            {/* Password with toggle */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full font-inter px-4 py-3 rounded-md focus:outline-none ${
                isDark
                  ? 'text-white placeholder-gray-400 border border-gray-600'
                  : 'text-text-primary placeholder-gray-500 border border-gray-300'
              } ${onError ? 'focus:border-red-500' : isDark ? 'focus:border-white' : 'focus:border-text-primary'}`}
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Forgot Password */}
            <p
              onClick={() => {
                setResetPassword(true);
                setSuccess(false);
              }}
              className="flex justify-end mt-2 mb-10 text-blue-600 text-brand-primary text-sm font-semibold hover:underline cursor-pointer"
            >
              Forgot your password?
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-brand-primary text-white text-2xl font-poppins font-black py-2 px-5 rounded-md duration-300 ease-in hover:bg-hover-primary flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin" size={40} style={{ animationDuration: '3s' }} />
              ) : (
                'Continue'
              )}
            </button>
          </form>
          <div className={`border-t my-6 ${isDark ? 'border-gray-700' : 'border-gray-300'}`} />

          {/* Register link */}
          <p className="text-text-primary text-center font-inter text-sm mt-4">
            Don&apos;t have an account?{' '}
            <span
              onClick={() => router.push('/signup')}
              className="text-brand-primary font-semibold hover:underline cursor-pointer"
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Render the reset password email form
  return (
    <div className={`flex items-center justify-center min-h-screen px-4 transition-colors duration-300 ${isDark ? 'bg-[#222224]' : 'bg-gray-50'}`}>
      <div className="w-full max-w-sm">
        <h2 className={`text-3xl font-bold font-montserrat ${isDark ? 'text-white' : 'text-text-primary'}`}>
          Reset Your Password
        </h2>
        <p className={`text-sm font-inter mb-6 ${isDark ? 'text-white' : 'text-text-primary'}`}>
          Enter your email to receive a password reset link. 
        </p>

        {/* Reset Form */}  
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendResetPassword(email);
          }}
        >
          {resetPasswordError && (
            <p className="font-inter italic text-sm text-red-500 mb-1 text-center">
              Unable to send reset link.
            </p>
          )}

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full font-inter px-4 py-3 rounded-md focus:outline-none mb-6 ${
                isDark
                  ? 'text-white placeholder-gray-400 border border-gray-600'
                  : 'text-text-primary placeholder-gray-500 border border-gray-300'
              } ${resetPasswordError ? 'focus:border-red-500' : isDark ? 'focus:border-white' : 'focus:border-text-primary'}`}
            />
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-4 text-green-600 text-center">
              Success! Check your email to reset your password!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-brand-primary text-white text-2xl font-poppins font-black py-2 px-5 rounded-md duration-300 ease-in hover:bg-hover-primary flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" size={40} style={{ animationDuration: '3s' }} />
            ) : (
              'Continue'
            )}
          </button>
        </form>
        <div className={`border-t my-6 ${isDark ? 'border-gray-700' : 'border-gray-300'}`} />

        {/* Return to login */}
        <p className={`text-center font-inter text-sm mt-4 ${
        isDark ? 'text-gray-300' : 'text-text-primary'}`}>
        Remember your password?{' '}
          <span
              onClick={() => {
                setResetPassword(false);
                setSuccess(false);
              }}
              className="text-brand-primary font-semibold hover:underline cursor-pointer"
            >
              Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
