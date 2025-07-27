import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getProfile, updateProfile, uploadImage } from '@/lib/marketplace';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const EditProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      bio: '',
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const profile = await getProfile(user.id);
        if (profile) {
          setCurrentProfile(profile);
          form.reset({
            full_name: profile.full_name || user.user_metadata?.full_name || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
          });
          if (profile.avatar_url) {
            setImagePreview(profile.avatar_url);
          }
        } else {
          // Initialize with user metadata if no profile exists
          form.reset({
            full_name: user.user_metadata?.full_name || '',
            phone: '',
            bio: '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [user, form]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      let avatarUrl = currentProfile?.avatar_url;
      
      // Upload new image if selected
      if (selectedImage) {
        avatarUrl = await uploadImage(selectedImage, 'avatars');
      }

      // Update profile
      await updateProfile(user.id, {
        full_name: data.full_name,
        phone: data.phone,
        bio: data.bio,
        avatar_url: avatarUrl,
      });

      toast({
        title: 'Profil aktualisiert',
        description: 'Ihre Profilinformationen wurden erfolgreich gespeichert.',
      });

      navigate('/profile');
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message || 'Beim Aktualisieren des Profils ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-black mb-4">Anmeldung erforderlich</h2>
            <p className="text-muted-foreground mb-4">
              Sie müssen angemeldet sein, um Ihr Profil zu bearbeiten.
            </p>
            <Link to="/login">
              <Button>Anmelden</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/profile" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zum Profil
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-black font-lexend">Profil bearbeiten</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-border"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-muted border-4 border-border flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                    <Upload className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Klicken Sie auf das Upload-Symbol, um ein Profilbild hinzuzufügen
                </p>
              </div>

              <FormField
                control={form.control}
                name="full_name"
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

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefonnummer (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+41 79 123 45 67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Über mich (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Erzählen Sie etwas über sich..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Speichern...' : 'Änderungen speichern'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};