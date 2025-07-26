import { useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (supabase) {
        // Real Supabase auth
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user ?? null);
          }
        );

        return () => subscription.unsubscribe();
      } else {
        // Fallback auth
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        const handleStorageChange = () => {
          getCurrentUser().then(setUser);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
      }
    };

    initAuth();
  }, []);

  return { user, loading };
};