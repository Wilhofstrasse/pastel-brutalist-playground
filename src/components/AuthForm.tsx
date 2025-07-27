import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

const signupSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Passwort muss mindestens einen Kleinbuchstaben, einen Großbuchstaben und eine Zahl enthalten'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Vollständiger Name muss mindestens 2 Zeichen lang sein'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

const signinSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

type SignupFormData = z.infer<typeof signupSchema>;
type SigninFormData = z.infer<typeof signinSchema>;
type AuthFormData = SignupFormData | SigninFormData;

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(mode === 'signup' ? signupSchema : signinSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'signup' && { confirmPassword: '', fullName: '' }),
    },
  });

  const password = form.watch('password');

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error(`${provider} sign-in error:`, error);
      toast({
        title: 'Fehler',
        description: `Anmeldung mit ${provider === 'google' ? 'Google' : 'Apple'} fehlgeschlagen. Bitte versuchen Sie es erneut.`,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      if (mode === 'signup') {
        const signupData = data as SignupFormData;
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: signupData.fullName
            }
          }
        });
        
        if (error) throw error;
        toast({
          title: 'Konto erfolgreich erstellt!',
          description: 'Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu bestätigen.',
        });
      } else {
        const signinData = data as SigninFormData;
        const { error } = await supabase.auth.signInWithPassword({
          email: signinData.email,
          password: signinData.password,
        });
        
        if (error) throw error;
        toast({
          title: 'Willkommen zurück!',
          description: 'Sie haben sich erfolgreich angemeldet.',
        });
      }
      onSuccess?.();
    } catch (error: any) {
      let errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Ungültige E-Mail oder Passwort.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'Ein Benutzer mit dieser E-Mail-Adresse ist bereits registriert.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Fehler',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-black font-lexend">
          {mode === 'signin' ? 'Anmelden' : 'Registrieren'}
        </CardTitle>
        {mode === 'signup' && (
          <p className="text-sm text-muted-foreground mt-2">
            Nach der Registrierung erhalten Sie eine E-Mail zur Bestätigung Ihres Kontos.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {/* OAuth Sign-in Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full relative"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Mit Google {mode === 'signin' ? 'anmelden' : 'registrieren'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full relative"
            onClick={() => handleOAuthSignIn('apple')}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09 21.99C7.85 22.03 6.81 20.68 5.97 19.47C4.25 16.98 2.91 12.42 4.69 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
            )}
            Mit Apple {mode === 'signin' ? 'anmelden' : 'registrieren'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Oder mit E-Mail
              </span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vollständiger Name</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Max Mustermann" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. ihre.email@beispiel.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="••••••••" 
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  {mode === 'signup' && password && (
                    <PasswordStrengthIndicator password={password} />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passwort bestätigen</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="••••••••" 
                          type={showConfirmPassword ? "text" : "password"}
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'signin' ? 'Anmelden' : 'Registrieren'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};