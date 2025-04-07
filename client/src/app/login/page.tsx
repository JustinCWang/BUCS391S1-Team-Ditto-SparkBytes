'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Login } from '../../lib/auth';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const LoginPage = () => {
  const router = useRouter();

  // General state variables
  const [loading, setLoading] = useState(false);
  const [onError, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for showing the reset password form (for sending reset emails)
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { user } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if the user is already logged in
    if (user) {
      router.push('/dashboard');
    }
  }, [router, user]);

  // Function to handle login form submission
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
      setError(false);
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset`
      });
      if (error) {
        setError(true);
        console.error('Reset password error:', error);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!resetPassword) {
    // Render the login form
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold font-montserrat text-text-primary">Welcome back</h2>
          <p className="text-sm font-inter mb-6">Log In to your account</p>
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
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none ${
                  onError ? 'focus:border-red-500' : 'focus:border-text-primary'
                } mb-6`}
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full font-inter border border-gray-300 px-4 py-3 rounded-md pr-10 focus:outline-none focus:border-text-primary"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            <p
              onClick={() => {
                setResetPassword(true);
                setSuccess(false);
              }}
              className="flex justify-end mt-2 mb-10 text-blue-600 text-sm font-inter underline cursor-pointer"
            >
              Forgot your password?
            </p>
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
          <div className="border-t border-gray-300 my-6" />
          <p className="text-center font-inter text-sm mt-4">
            Don&apos;t have an account?{' '}
            <span
              onClick={() => router.push('/signup')}
              className="text-blue-600 font-inter underline cursor-pointer"
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold font-montserrat text-text-primary">Reset Your Password</h2>
        <p className="text-sm font-inter mb-6">Enter your email to receive a password reset link.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendResetPassword(email);
          }}
        >
          {onError && (
            <p className="font-inter italic text-sm text-red-500 mb-1">
              Unable to send reset link.
            </p>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none ${
                onError ? 'focus:border-red-500' : 'focus:border-text-primary'
              } mb-6`}
            />
          </div>
          {success && (
            <div className="mb-4 text-green-600">
              Success! Check your email to reset your password!
            </div>
          )}
          <p
            onClick={() => {
              setResetPassword(false);
              setSuccess(false);
            }}
            className="flex justify-end mt-2 mb-10 text-blue-600 text-sm font-inter underline cursor-pointer"
          >
            Login
          </p>
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
        <div className="border-t border-gray-300 my-6" />
      </div>
    </div>
  );
};

export default LoginPage;
