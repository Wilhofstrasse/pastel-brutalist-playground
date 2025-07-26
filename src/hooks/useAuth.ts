import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // Listen for storage changes (sign in/out)
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { user, loading };
};