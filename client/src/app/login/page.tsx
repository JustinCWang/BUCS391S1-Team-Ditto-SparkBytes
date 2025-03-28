'use client'
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';

import { Login } from '../../lib/auth'
import { useAuth } from '@/context/AuthContext';

import { Eye, EyeOff } from 'lucide-react';
import { Loader } from 'lucide-react';

// Define the LoginPage component as a React Functional Component
const LoginPage = () => {
  // Use the useRouter hook from Next.js for navigation
  const router = useRouter();

  // General states to have animations and error handling
  const [loading, setLoading] = useState(false);
  const [onError, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // for eye toggle

  // States needed for logging in
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const { user} = useAuth();

  useEffect(() => {
      if (user) {
        router.push('/dashboard');
      }
  }, [router, user]);

  // Function to handle form submission
  const onSubmitLogin = async (values: { email: string, password: string }) => {
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

  return (
    // Flex the form so that its in the middle of the screen
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {/** Define the container for the actual form */}
      <div className="w-full max-w-sm">
        {/** Title and min-description */}
        <h2 className="text-3xl font-bold font-montserrat text-text-primary">Welcome back</h2>
        <p className="text-sm font-inter mb-6">Log In to your account</p>
        {/** Actual form with the data */}
        <form
          className=""
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitLogin({ email, password });
          }}
        >
          {/** First form input being email */}
          <div>
            {/** Error handling */}
            <p className={onError ? "font-inter italic text-sm text-red-500 mb-1" : "hidden"}>Login or password is invalid.</p>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none ${onError ? "focus:border-red-500": " focus:border-text-primary"} mb-6`}
            />
          </div>
          
          {/** Error handling */}
          <p className={onError ? "font-inter italic text-sm text-red-500 mb-1" : "hidden"}>Login or password is invalid.</p>

          {/** Second form input which is the password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full font-inter border border-gray-300 px-4 py-3 rounded-md pr-10 focus:outline-none focus:border-text-primary"
            />
            {/** Alow users to see the password and position absolute to the input so that it stays */}
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          
          {/** Forgot password link, not linked to anything as of right now */}
          <a className='flex justify-end mt-2 mb-10 text-blue-600 text-sm font-inter underline cursor-pointer'>Forgot your password?</a>
          
          {/** Submit the form plus loading animation while waiting to log in */}
          <button
            type="submit"
            className="w-full bg-brand-primary text-white text-2xl font-poppins font-black 
            py-2 px-5
            rounded-md 
            duration-300 ease-in hover:bg-hover-primary 
            flex items-center justify-center"
            disabled={loading}
          >
            {loading ?  
              <Loader className="animate-spin" size={40} style={{ animationDuration: '3s' }}/>
              : 'Continue'}
          </button>

        </form>
        
        <div className="border-t border-gray-300 my-6" />

        {/** Register if someone doesn't have an account */}
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
};

export default LoginPage;