import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllListings, updateListingModerationStatus, deleteListing, type AdminListing } from '@/lib/admin';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Eye, Trash2 } from 'lucide-react';

export function AdminListings() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { logAdminActivity } = useAdmin();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getAllListings();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast({
          title: 'Fehler',
          description: 'Anzeigen konnten nicht geladen werden.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [toast]);

  const handleModerationStatusChange = async (
    listingId: string, 
    status: 'approved' | 'rejected' | 'pending'
  ) => {
    if (!user) return;

    try {
      await updateListingModerationStatus(listingId, status, user.id);
      setListings(listings.map(listing => 
        listing.id === listingId 
          ? { ...listing, moderation_status: status, moderated_by: user.id, moderated_at: new Date().toISOString() }
          : listing
      ));
      
      await logAdminActivity('listing_moderation', 'listing', listingId, { status });
      
      toast({
        title: 'Erfolg',
        description: `Anzeige wurde ${status === 'approved' ? 'genehmigt' : status === 'rejected' ? 'abgelehnt' : 'zurückgesetzt'}.`
      });
    } catch (error) {
      console.error('Error updating moderation status:', error);
      toast({
        title: 'Fehler',
        description: 'Moderationsstatus konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await deleteListing(listingId);
      setListings(listings.filter(listing => listing.id !== listingId));
      
      await logAdminActivity('listing_deleted', 'listing', listingId);
      
      toast({
        title: 'Erfolg',
        description: 'Anzeige wurde gelöscht.'
      });
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: 'Fehler',
        description: 'Anzeige konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const getModerationBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Anzeigenverwaltung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anzeigenverwaltung</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead>Ersteller</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead>Preis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Moderation</TableHead>
              <TableHead>Erstellt</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium max-w-xs truncate">
                  {listing.title}
                </TableCell>
                <TableCell>{listing.user.full_name || 'Unbekannt'}</TableCell>
                <TableCell>{listing.category?.name || 'Keine'}</TableCell>
                <TableCell>
                  {listing.price ? `€${listing.price}` : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={listing.moderation_status}
                    onValueChange={(value) => 
                      handleModerationStatusChange(listing.id, value as any)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Wartend</SelectItem>
                      <SelectItem value="approved">Genehmigt</SelectItem>
                      <SelectItem value="rejected">Abgelehnt</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(listing.created_at).toLocaleDateString('de-DE')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/listing/${listing.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteListing(listing.id)}
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