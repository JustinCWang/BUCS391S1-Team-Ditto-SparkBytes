'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';
import { Loader } from 'lucide-react';

const ResetPasswordPage = () => {
  const router = useRouter();

  // General state variables
  const [loading, setLoading] = useState(false);
  const [onError, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State for password inputs
  const [data, setData] = useState<{ password: string; confirmPassword: string }>({
    password: '',
    confirmPassword: '',
  });

  // Handle input change events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Confirm passwords match and update the user's password
  const confirmPasswords = async () => {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      setError(false);
      // Update the user's password (requires a valid session)
      const { data: resetData, error } = await supabase.auth.updateUser({ password });
      if (error) {
        console.log('Update error:', error);
        setError(true);
        return;
      }
      if (resetData) {
        console.log('Password updated:', resetData);
        // Sign out the user to clear the session after updating the password
        await supabase.auth.signOut();
        // Redirect to the login page with a query parameter to prevent auto-redirect to dashboard
        router.push('/login?fromReset=true');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold font-montserrat text-text-primary">Reset Your Password</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await confirmPasswords();
          }}
        >
          {onError && (
            <p className="font-inter italic text-sm text-red-500 mb-1">
              An error occurred while resetting your password.
            </p>
          )}
          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your new password"
              value={data.password}
              onChange={handleChange}
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none ${
                onError ? 'focus:border-red-500' : 'focus:border-text-primary'
              }`}
            />
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={data.confirmPassword}
              onChange={handleChange}
              className="w-full font-inter border border-gray-300 px-4 py-3 rounded-md pr-10 focus:outline-none focus:border-text-primary"
            />
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white text-2xl font-poppins font-black py-2 px-5 rounded-md duration-300 ease-in hover:bg-hover-primary flex items-center justify-center"
          >
            {loading ? (
              <Loader className="animate-spin" size={40} style={{ animationDuration: '3s' }} />
            ) : (
              'Confirm'
            )}
          </button>
        </form>
        <div className="border-t border-gray-300 my-6" />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
