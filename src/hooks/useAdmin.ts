import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'user' | 'admin' | 'moderator';
  created_at: string;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setUserRole(null);
      setLoading(false);
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setUserRole(null);
        } else if (data) {
          setUserRole(data.role);
          setIsAdmin(data.role === 'admin' || data.role === 'moderator');
        } else {
          setIsAdmin(false);
          setUserRole('user');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const logAdminActivity = async (action: string, targetType: string, targetId?: string, details?: any) => {
    if (!user || !isAdmin) return;

    try {
      await supabase
        .from('admin_activities')
        .insert({
          admin_id: user.id,
          action,
          target_type: targetType,
          target_id: targetId,
          details
        });
    } catch (error) {
      console.error('Error logging admin activity:', error);
    }
  };

  return { isAdmin, userRole, loading, logAdminActivity };
};