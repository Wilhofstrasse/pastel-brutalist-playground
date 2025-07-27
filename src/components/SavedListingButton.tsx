import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveListing, unsaveListing, isListingSaved } from '@/lib/marketplace';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface SavedListingButtonProps {
  listingId: string;
  className?: string;
}

export const SavedListingButton = ({ listingId, className }: SavedListingButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: isSaved = false } = useQuery({
    queryKey: ['listing-saved', listingId, user?.id],
    queryFn: () => isListingSaved(listingId),
    enabled: !!user?.id,
  });

  const saveMutation = useMutation({
    mutationFn: (listingId: string) => saveListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing-saved', listingId] });
      queryClient.invalidateQueries({ queryKey: ['saved-listings'] });
      toast({
        title: 'Gespeichert!',
        description: 'Anzeige wurde zu Ihren gespeicherten Anzeigen hinzugefügt.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler',
        description: error.message || 'Fehler beim Speichern der Anzeige',
        variant: 'destructive',
      });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: (listingId: string) => unsaveListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing-saved', listingId] });
      queryClient.invalidateQueries({ queryKey: ['saved-listings'] });
      toast({
        title: 'Entfernt',
        description: 'Anzeige wurde aus Ihren gespeicherten Anzeigen entfernt.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler',
        description: error.message || 'Fehler beim Entfernen der Anzeige',
        variant: 'destructive',
      });
    },
  });

  const handleToggleSave = () => {
    if (!user) {
      toast({
        title: 'Anmeldung erforderlich',
        description: 'Sie müssen sich anmelden, um Anzeigen zu speichern.',
        variant: 'destructive',
      });
      return;
    }

    if (isSaved) {
      unsaveMutation.mutate(listingId);
    } else {
      saveMutation.mutate(listingId);
    }
  };

  const isLoading = saveMutation.isPending || unsaveMutation.isPending;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleSave}
      disabled={isLoading}
      className={cn(
        "h-8 w-8 hover:bg-background/80 transition-colors",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-colors",
          isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
        )} 
      />
    </Button>
  );
};