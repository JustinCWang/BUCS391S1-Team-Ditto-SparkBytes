import { supabase } from './supabase';
import { SignInCredentials, SignUpCredentials } from '../types/supabase';

// Handles user login using Supabase auth
export const Login = async ({ email, password}: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

// Handles user registration with Supabase auth and inserts additional info into 'Users' table
export const Register = async ({  
  email,
  password,
  firstName,
  lastName,
  phoneNumber, 
}: SignUpCredentials) => {
  
  // Step 1: Register user with email and password
  const { data: data, error: error } = await supabase.auth.signUp({
    email,
    password,
  });

  // If registration fails or user isn't returned, exit early
  if (error || !data.user) {
    return { error: error };
  }

  // Step 2: Insert into Users table using authData.user.id
  const { error: insertError } = await supabase.from('Users').insert([
    {
      user_id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      bu_email: email,
      phone_num: phoneNumber,
      role: 'student', // default role for the user
    },
  ]);

  return { error: insertError };
};

// Logs out the current user
export const Logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};