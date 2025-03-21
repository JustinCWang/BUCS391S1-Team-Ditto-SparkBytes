'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  userSession: Session | null;
}

/**
 * useContext() to hold the state of type AuthContextType or be undefined given
 * that you have not logged in yet and have been sent a JWT token from the Supabase client
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 
 * @param children takes in react nodes which are put in between the auth context so we don't
 * have to pass down props for each component which would cause prop drilling. Instead we can use
 * the context from AuthContext.Provider which will hold the values we need for the session and user
 * @returns AuthContext.Provider that holds the session and user data
 */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * userSession and user need to be named the same as interface variables to tie the values we
   * update the state with to pass in the AuthContext.Provider value since it expects the AuthContextType.
   */
  const [userSession, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    /**
     * Made the getSession async function to use the getSession() function from Supabase 
     * to see if the current user has a valid session and has already logged in. 
     * If not then will set the user and userSessions to null.
     * Learn more here https://supabase.com/docs/reference/javascript/auth-getsession
     */
    const getSession = async () => {
      const { data: currentSession, error } = await supabase.auth.getSession();
  
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
  
      setSession(currentSession.session);
      setUser(currentSession.session?.user ?? null);
    };

    // Call the getSession function to set the variables of user and userSession
    getSession();

    /**
     * Listen for changes using onAuthStateChange() function from Supabase
     * Which is called when an events happens like the token being refreshed, sign out, etc
     * Learn more about it here: https://supabase.com/docs/reference/javascript/auth-onauthstatechange
     */
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ userSession, user}}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * @returns the value of context from the AuthContext.Provider given that the component is nested within
 * the layout.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
