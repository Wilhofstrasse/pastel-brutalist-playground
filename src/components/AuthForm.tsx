import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signIn, signUp } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const authSchema = z.union([signupSchema, signinSchema]);

type SignupFormData = z.infer<typeof signupSchema>;
type SigninFormData = z.infer<typeof signinSchema>;
type AuthFormData = SignupFormData | SigninFormData;

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { toast } = useToast();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(mode === 'signup' ? signupSchema : signinSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'signup' && { confirmPassword: '', fullName: '' }),
    },
  });

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      if (mode === 'signup') {
        const signupData = data as SignupFormData;
        const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);
        if (error) throw error;
        toast({
          title: 'Konto erfolgreich erstellt!',
          description: 'Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu bestätigen.',
        });
      } else {
        const signinData = data as SigninFormData;
        const { error } = await signIn(signinData.email, signinData.password);
        if (error) throw error;
        toast({
          title: 'Willkommen zurück!',
          description: 'Sie haben sich erfolgreich angemeldet.',
        });
      }
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
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
                      <Input placeholder="Ihr vollständiger Name" {...field} />
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
                    <Input placeholder="ihre@email.com" type="email" {...field} />
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
                    <Input 
                      placeholder="••••••••" 
                      type="password" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (mode === 'signup') {
                          setPasswordStrength(calculatePasswordStrength(e.target.value));
                        }
                      }}
                    />
                  </FormControl>
                  {mode === 'signup' && field.value && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 w-full rounded ${
                              level <= passwordStrength
                                ? getPasswordStrengthColor(passwordStrength)
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Passwort-Stärke: {getPasswordStrengthText(passwordStrength)}
                      </p>
                    </div>
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
                      <Input placeholder="••••••••" type="password" {...field} />
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