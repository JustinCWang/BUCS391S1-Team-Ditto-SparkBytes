'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  userSession: Session | null;
  
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

/**
 * useContext() to hold the state of type AuthContextType or be undefined given
 * that you have not logged in yet and have been sent a JWT token from the Supabase client
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @param children takes in react nodes which are put in between the auth context so we don't
 * have to pass down props for each component which would cause prop drilling. Instead we can use
 * the context from AuthContext. Provider which will hold the values we need for the session and user.
 * @returns AuthContext.Provider that holds the session and user data
 */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSession, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // Contains the URL of the user's avatar image
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // useEffect hook that runs once when the component is mounted
  useEffect(() => {
    const getSession = async () => {
      const { data: currentSession, error } = await supabase.auth.getSession();
  
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
  
      setSession(currentSession.session);
      setUser(currentSession.session?.user ?? null);
      
      // if (currentSession.session && currentSession.session.user)
      if (currentSession.session?.user) {
        const { data } = await supabase
          .from('Users')
          .select('avatar_path')
          .eq('user_id', currentSession.session.user.id)
          .single();
        // If the avatar_path is available, get its public URL and update the state
        if (data && data.avatar_path) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(data.avatar_path);
          // Set the avatarUrl state to the public URL retrieved
          setAvatarUrl(publicUrl);
        }
      }
    };

    getSession();

    // Subscribe to authentication state changes (like login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          const { data } = await supabase
            .from('Users')
            .select('avatar_path')
            .eq('user_id', session.user.id)
            .single();
          if (data && data.avatar_path) {
            const { data: { publicUrl } } = supabase
              .storage
              .from('avatars')
              .getPublicUrl(data.avatar_path);
            setAvatarUrl(publicUrl);
          } else {
            setAvatarUrl(null);
          }
        })();
      } else {
        setAvatarUrl(null);
      }
    });
    
    // Return a cleanup function to unsubscribe from the auth listener on unmount
    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ userSession, user, avatarUrl, setAvatarUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context.
 * 
 * @returns The value provided by AuthContext.Provider.
 * If the component is not wrapped inside an AuthProvider, it throws an error.
 */
// use value={{ userSession, user, avatarUrl, setAvatarUrl }}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

