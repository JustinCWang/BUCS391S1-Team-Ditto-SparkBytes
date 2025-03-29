import { supabase } from "./supabase";

export const updateUserName = async (userId: string, firstName: string, lastName: string) => {
  const { error } = await supabase
    .from('Users')
    .update({ first_name: firstName, last_name: lastName })
    .eq('user_id', userId);

  return { error };
};