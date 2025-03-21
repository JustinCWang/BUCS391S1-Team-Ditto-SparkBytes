import { supabase } from './supabase';
import { SignInCredentials, SignUpCredentials } from '../types/supabase';

export const Login = async ({ email, password}: SignUpCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
};

export const Register = async ({ email, password }: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const Logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};