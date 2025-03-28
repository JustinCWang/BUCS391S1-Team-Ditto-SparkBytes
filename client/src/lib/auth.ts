import { supabase } from './supabase';
import { SignInCredentials, SignUpCredentials } from '../types/supabase';

export const Login = async ({ email, password}: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const Register = async ({  
  email,
  password,
  firstName,
  lastName,
  phoneNumber, 
}: SignUpCredentials) => {
  
  const { data: data, error: error } = await supabase.auth.signUp({
    email,
    password,
  });

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

export const Logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};