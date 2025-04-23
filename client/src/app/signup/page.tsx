'use client'
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';

import { Register } from '../../lib/auth'
import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { useAuth } from '@/context/AuthContext';

import { Eye, EyeOff } from 'lucide-react';
import { Loader } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Define the LoginPage component as a React Functional Component
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

  // States needed for logging in
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
      if (user) {
        router.push('/dashboard');
      }
  }, [router, user]);

  // Function to handle form submission
  const onSubmitRegister = async (values: {email: string, password: string, firstName:string, lastName:string, phoneNumber:string }) => {
    try {
      setError(false);
      setLoading(true);

      const parsedPhone = parsePhoneNumberWithError(values.phoneNumber, 'US');
      const formattedPhone = parsedPhone.number;
      values.phoneNumber = formattedPhone;

      const { error } = await Register(values);
      
      if (error) {
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
    <div
       className={`flex items-center justify-center min-h-screen px-4 transition-colors duration-300 ${
         isDark ? 'bg-[#1e1e1e] text-white' : 'bg-gray-50 text-black'
       }`}
     >
      {/** Define the container for the actual form */}
      <div className="w-full max-w-sm">
        {/** Title and min-description */}
        <h2 className="text-3xl text-black dark:white font-bold font-montserrat text-text-primary">Welcome to Spark!Bytes
        </h2>
        <p className="text-sm font-inter mb-6">Use your &quot;bu.edu&quot; email address to make an account
        </p>
        {/** Actual form with the data */}
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
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-text-primary mb-6`}
            />
            <input
              type="text"
              name="last name"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={(e) => setLast(e.target.value)}
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-text-primary mb-6`}
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
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none ${onError ||  invalidEmailDomain ? "focus:border-red-500": " focus:border-text-primary"} mb-6`}
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
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-text-primary mb-6`}
            />
          </div>

          {/** Fourth form input which is the password */}
          <div className="relative mb-10">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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