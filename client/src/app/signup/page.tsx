'use client'
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';

import { Register } from '../../lib/auth'
import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { useAuth } from '@/context/AuthContext';

import { Eye, EyeOff } from 'lucide-react';
import { Loader } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Sign-up form for new Spark!Bytes users using BU email
const SignUpPage= () => {
  // Use the useRouter hook from Next.js for navigation
  const router = useRouter();

  // General states to have animations and error handling
  const [loading, setLoading] = useState(false);

  // onError for general errors
  const [onError, setError] = useState(false);

  // onErrorBU for when the user does not input a BU email
  const [invalidEmailDomain, setInvalidEmailDomain] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // for eye toggle

  // Add state for password validation
  const [passwordTooShort, setPasswordTooShort] = useState(false);

  // States needed for logging in
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Redirect to dashboard if already logged in
  useEffect(() => {
      if (user) {
        router.push('/dashboard');
      }
  }, [router, user]);

  // Handle form submission
  const onSubmitRegister = async (values: {email: string, password: string, firstName:string, lastName:string, phoneNumber:string }) => {
    try {
      setError(false);
      setPasswordTooShort(false);
      setLoading(true);

      // Check password length before continuing
      if (values.password.length < 8) {
        setPasswordTooShort(true);
        setLoading(false);
        return;
      }

      // Format and validate phone number
      const parsedPhone = parsePhoneNumberWithError(values.phoneNumber, 'US');
      const formattedPhone = parsedPhone.number;
      values.phoneNumber = formattedPhone;

      // Submit registration
      const { error } = await Register(values);
      
      if (error) {
        // Only set general error if it's not a password length issue
        setError(true);
        throw new Error(error.message);
      }

    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Flex the form so that its in the middle of the screen
    <div className={`flex items-center justify-center min-h-screen px-4 transition-colors duration-300 ${isDark ? 'bg-[#222224] text-white' : 'bg-gray-50 text-text-primary'}`}>
      
      {/** Define the container for the actual form */}
      <div className="w-full max-w-sm">

        {/** Title and min-description */}
        <h2 className={`text-3xl font-bold font-montserrat ${isDark ? 'text-white' : 'text-text-primary'}`}>
          Welcome to Spark!Bytes
        </h2>
        <p className={`text-sm font-inter mb-6 ${isDark ? 'text-white' : 'text-text-primary'}`}>
          Use your &quot;bu.edu&quot; email address to make an account
        </p>
        
        {/* Sign-up Form */}
        <form
          className=""
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitRegister({ email, password, firstName, lastName, phoneNumber});
          }}
        >
          {/** First form input being first name and last name*/}
          <div className='flex gap-2'>
            <input
              type="text"
              name="first name"
              placeholder="First Name"
              required
              value={firstName}
              onChange={(e) => setFirst(e.target.value)}
              className={`w-full font-inter px-4 py-3 rounded-md focus:outline-none mb-4 ${
                isDark
                  ? 'text-white placeholder-gray-400 border border-gray-600 focus:border-white'
                  : 'text-text-primary placeholder-gray-500 border border-gray-300 focus:border-text-primary'
              }`}
            />
            <input
              type="text"
              name="last name"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={(e) => setLast(e.target.value)}
              className={`w-full font-inter px-4 py-3 rounded-md focus:outline-none mb-4 ${
                isDark
                  ? 'text-white placeholder-gray-400 border border-gray-600 focus:border-white'
                  : 'text-text-primary placeholder-gray-500 border border-gray-300 focus:border-text-primary'
              }`}
            />
          </div>

          {/** Second form input being email */}
          <div>
            {/** Error handling */}
            {invalidEmailDomain && (
              <p className="font-inter italic text-sm text-red-500 mb-1">
                Please use a BU email address (@bu.edu).
              </p>
            )}

            {onError && !invalidEmailDomain && (
              <p className="font-inter italic text-sm text-red-500 mb-1">
                There is already an account with this email.
              </p>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setInvalidEmailDomain(!e.target.value.toLowerCase().endsWith('@bu.edu'));
              }}
              className={`w-full font-inter px-4 py-3 rounded-md focus:outline-none mb-4
                ${isDark 
                  ? 'text-white placeholder-gray-400 border border-gray-600' 
                  : 'text-text-primary placeholder-gray-500 border border-gray-300'}
                ${onError || invalidEmailDomain 
                  ? 'focus:border-red-500' 
                  : isDark 
                    ? 'focus:border-white' 
                    : 'focus:border-text-primary'}
              `}
            />
          </div>

          {/** Third form input being phone number */}
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="123-456-7890"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`w-full font-inter px-4 py-3 rounded-md focus:outline-none mb-4 ${
                isDark
                  ? 'text-white placeholder-gray-400 border border-gray-600 focus:border-white'
                  : 'text-text-primary placeholder-gray-500 border border-gray-300 focus:border-text-primary'
              }`}
            />
          </div>

          {/** Fourth form input which is the password */}
          <div className="relative mb-2">
            {/* Add password validation error message */}
            {passwordTooShort && (
              <p className="font-inter italic text-sm text-red-500 mb-1">
                Password must be at least 8 characters long.
              </p>
            )}
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Clear the error when user types a valid password
                if (e.target.value.length >= 8) {
                  setPasswordTooShort(false);
                }
              }}
              className={`w-full font-inter px-4 py-3 rounded-md focus:outline-none ${
                isDark
                  ? 'text-white placeholder-gray-400 border border-gray-600 focus:border-white'
                  : 'text-text-primary placeholder-gray-500 border border-gray-300 focus:border-text-primary'
              } ${passwordTooShort ? 'border-red-500' : ''}`}
            />
            {/** Allow users to see the password and position absolute to the input so that it stays */}
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-10">
            Password must be at least 8 characters long.
          </p>

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
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-brand-primary font-semibold hover:underline"
          >
            Log in
          </span>
        </p>

      </div>
    </div>
  );
};

export default SignUpPage;