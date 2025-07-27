import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getListing, updateListing, uploadImage, getCategories } from '@/lib/marketplace';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const listingSchema = z.object({
  title: z.string().min(3, 'Titel muss mindestens 3 Zeichen lang sein'),
  description: z.string().min(10, 'Beschreibung muss mindestens 10 Zeichen lang sein'),
  price: z.number().min(0, 'Preis muss positiv sein'),
  location: z.string().min(2, 'Standort ist erforderlich'),
  category_id: z.string().min(1, 'Bitte wählen Sie eine Kategorie'),
});

type ListingFormData = z.infer<typeof listingSchema>;

export const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: '',
      category_id: '',
    },
  });

  useEffect(() => {
    const loadListing = async () => {
      if (!id || !user) return;
      
      try {
        const listing = await getListing(id);
        if (!listing) {
          toast({
            title: 'Fehler',
            description: 'Anzeige nicht gefunden',
            variant: 'destructive',
          });
          navigate('/profile');
          return;
        }

        if (listing.user_id !== user.id) {
          toast({
            title: 'Fehler',
            description: 'Sie haben keine Berechtigung, diese Anzeige zu bearbeiten',
            variant: 'destructive',
          });
          navigate('/profile');
          return;
        }

        form.reset({
          title: listing.title,
          description: listing.description || '',
          price: listing.price || 0,
          location: listing.location || '',
          category_id: listing.category_id || '',
        });

        setExistingImages(listing.images || []);
      } catch (error) {
        console.error('Error loading listing:', error);
        toast({
          title: 'Fehler',
          description: 'Fehler beim Laden der Anzeige',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id, user, form, navigate, toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + images.length + files.length;
    
    if (totalImages > 5) {
      toast({
        title: 'Zu viele Bilder',
        description: 'Maximum 5 Bilder erlaubt',
        variant: 'destructive',
      });
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ListingFormData) => {
    if (!user || !id) return;

    setUploading(true);
    try {
      // Upload new images
      const newImageUrls: string[] = [];
      for (const image of images) {
        const imageUrl = await uploadImage(image);
        newImageUrls.push(imageUrl);
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...newImageUrls];

      // Update listing
      await updateListing(id, {
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        category_id: data.category_id,
        images: allImages,
      });

      toast({
        title: 'Erfolgreich!',
        description: 'Ihre Anzeige wurde aktualisiert.',
      });

      navigate('/profile');
    } catch (error: any) {
      let errorMessage = 'Ein Fehler ist aufgetreten';
      
      if (error.message?.includes('violates row-level security')) {
        errorMessage = 'Sie haben keine Berechtigung, diese Aktion auszuführen.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Fehler',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-black mb-4">Anmeldung erforderlich</h2>
            <p className="text-muted-foreground mb-4">
              Sie müssen angemeldet sein, um eine Anzeige zu bearbeiten.
            </p>
            <Link to="/login">
              <Button>Anmelden</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Laden...</div>
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
          <CardTitle className="text-3xl font-black font-lexend">Anzeige bearbeiten</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titel</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Gebrauchtes Fahrrad in gutem Zustand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beschreibung</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Beschreiben Sie Ihren Artikel detailliert..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preis (CHF)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? 0 : parseFloat(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standort</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="z.B. Zürich, Basel, Bern..." 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategorie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategorie auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Bilder (Max 5)</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Existing images */}
                  {existingImages.map((imageUrl, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExistingImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                  }

                  {/* New images */}
                  {images.map((image, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                  }
                  
                  {(existingImages.length + images.length) < 5 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Bild hinzufügen</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tipp: Gute Bilder erhöhen die Chance auf erfolgreiche Verkäufe
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? 'Wird aktualisiert...' : 'Anzeige aktualisieren'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
