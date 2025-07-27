import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { deleteListing } from '@/lib/marketplace';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';

interface ListingActionsProps {
  listingId: string;
  onDelete?: () => void;
}

export const ListingActions = ({ listingId, onDelete }: ListingActionsProps) => {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEdit = () => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteListing(listingId);
      toast({
        title: 'Anzeige gelöscht',
        description: 'Ihre Anzeige wurde erfolgreich gelöscht.',
      });
      onDelete?.();
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message || 'Fehler beim Löschen der Anzeige',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleEdit} variant="outline" size="sm">
        <Edit className="h-4 w-4 mr-2" />
        Bearbeiten
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={deleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? 'Lösche...' : 'Löschen'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anzeige löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diese Anzeige löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};