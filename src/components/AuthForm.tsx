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
                    <Input placeholder="z.B. max@beispiel.com" type="email" {...field} />
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