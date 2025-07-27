import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateProfile, uploadImage } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Vollständiger Name muss mindestens 2 Zeichen haben'),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      phone: user?.user_metadata?.phone || '',
      bio: user?.user_metadata?.bio || '',
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      let avatarUrl = user.user_metadata?.avatar_url;

      // Upload profile image if selected
      if (profileImage) {
        const { data: uploadData, error: uploadError } = await uploadImage(profileImage);
        if (uploadError) throw uploadError;
        avatarUrl = uploadData?.publicUrl;
      }

      // Update profile
      const { error } = await updateProfile(user.id, {
        full_name: data.fullName,
        phone: data.phone,
        bio: data.bio,
        avatar_url: avatarUrl,
      });

      if (error) throw error;

      toast({
        title: 'Profil aktualisiert',
        description: 'Ihre Profildaten wurden erfolgreich gespeichert.',
      });

      navigate('/profile');
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
              <div className="space-y-4">
                <FormLabel>Profilbild</FormLabel>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-background border-2 border-black shadow-brutalist rounded-sm flex items-center justify-center overflow-hidden">
                    {previewUrl || user?.user_metadata?.avatar_url ? (
                      <img
                        src={previewUrl || user?.user_metadata?.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Bild hochladen
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
              </div>

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

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon (optional)</FormLabel>
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
                      <Input placeholder="Erzählen Sie etwas über sich..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Speichere...' : 'Profil speichern'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};