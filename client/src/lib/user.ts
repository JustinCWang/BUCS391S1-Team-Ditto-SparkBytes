import { supabase } from "./supabase";

// Update a user's first and last name in the Users table
export const updateUserName = async (userId: string, firstName: string, lastName: string) => {
  const { error } = await supabase
    .from('Users')
    .update({ first_name: firstName, last_name: lastName })
    .eq('user_id', userId);

  return { error };
};

// Update a user's email address
export const updateEmail = async (email: string, password: string, newEmail: string) => {
  // Step 1: Reauthenticate to see if the password is valid for the current user
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) return { error: loginError };

  // Step 2: Update the email
  const { data, error } = await supabase.auth.updateUser({ email: newEmail });

  return { data, error };
};

// Update a user's password
export const updatePassword = async ( email: string, currentPassword: string, newPassword: string) => {
  // Step 1: Re-authenticate the user
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (authError) {
    return { error: authError };
  }

  // Step 2: Update the user's password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { error: updateError };
};

// Fetch the role of a specific user
export const userRole = async ( userId:string ) => {
  const { data, error } = await supabase
  .from('Users')
  .select('role')
  .eq('user_id', userId)
  .single();

  if (error) {
    return { error: error };
  }

  return { data };
}

// Fetch all user records from the Users table
export const fetchAllUsers = async () => {
  const { data, error } = await supabase
    .from('Users')
    .select('*');

  if (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }

  return data;
};
