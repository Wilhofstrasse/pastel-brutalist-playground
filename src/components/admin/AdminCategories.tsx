import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
}

const categorySchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100, 'Name ist zu lang'),
  description: z.string().optional(),
  slug: z.string()
    .min(1, 'Slug ist erforderlich')
    .max(50, 'Slug ist zu lang')
    .regex(/^[a-z0-9-]+$/, 'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten')
});

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { logAdminActivity } = useAdmin();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      slug: ''
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Fehler',
        description: 'Kategorien konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      // Validate slug format with server-side validation
      const { data: validSlug, error: slugError } = await supabase
        .rpc('validate_category_slug', { slug_input: values.slug });

      if (slugError || !validSlug) {
        throw new Error('Ungültiges Slug-Format');
      }

      // Check for duplicate slug (excluding current category if editing)
      const { data: existingCategory, error: duplicateError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', values.slug)
        .neq('id', editingCategory?.id || '')
        .single();

      if (duplicateError && duplicateError.code !== 'PGRST116') {
        throw duplicateError;
      }

      if (existingCategory) {
        throw new Error('Slug bereits vergeben');
      }

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: values.name.trim(),
            description: values.description?.trim() || null,
            slug: values.slug.toLowerCase().trim()
          })
          .eq('id', editingCategory.id);

        if (error) throw error;

        await logAdminActivity('category_updated', 'category', editingCategory.id, values);
        toast({
          title: 'Erfolg',
          description: 'Kategorie wurde aktualisiert.'
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: values.name.trim(),
            description: values.description?.trim() || null,
            slug: values.slug.toLowerCase().trim()
          });

        if (error) throw error;

        await logAdminActivity('category_created', 'category', undefined, values);
        toast({
          title: 'Erfolg',
          description: 'Kategorie wurde erstellt.'
        });
      }

      setDialogOpen(false);
      setEditingCategory(null);
      form.reset();
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Kategorie konnte nicht gespeichert werden.',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || '',
      slug: category.slug
    });
    setDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      // Check if category can be safely deleted
      const { data: canDelete, error: checkError } = await supabase
        .rpc('can_delete_category', { category_id_input: categoryId });

      if (checkError) {
        throw new Error('Fehler beim Prüfen der Kategorie');
      }

      if (!canDelete) {
        toast({
          title: 'Fehler',
          description: 'Kategorie kann nicht gelöscht werden, da sie noch Anzeigen enthält.',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      await logAdminActivity('category_deleted', 'category', categoryId);
      
      toast({
        title: 'Erfolg',
        description: 'Kategorie wurde gelöscht.'
      });
      
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Kategorie konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    form.reset();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kategorienverwaltung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Kategorienverwaltung</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Neue Kategorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">Speichern</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Beschreibung</TableHead>
              <TableHead>Erstellt</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {category.description || '-'}
                </TableCell>
                <TableCell>
                  {new Date(category.created_at).toLocaleDateString('de-DE')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}