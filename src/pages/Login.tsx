import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Login = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <AuthForm mode={mode} />
        
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <Button
            variant="ghost"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="font-bold"
          >
            {mode === 'signin' ? 'Sign up here' : 'Sign in here'}
          </Button>
        </div>
      </div>
    </div>
  );
};