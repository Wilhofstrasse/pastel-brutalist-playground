import { useTranslation } from 'react-i18next';
import { User, Settings, Heart, Package, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingCard } from '@/components/ListingCard';
import { ListingActions } from '@/components/ListingActions';
import { useAuth } from '@/hooks/useAuth';
import { getUserListings, getSavedListings, signOut } from '@/lib/marketplace';
import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const Profile = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'my-listings';

  const userListingsQuery = useQuery({
    queryKey: ['user-listings', user?.id],
    queryFn: () => getUserListings(user!.id),
    enabled: !!user?.id,
  });

  const { data: userListingsData, isLoading: userListingsLoading } = userListingsQuery;

  const { data: savedListingsData, isLoading: savedListingsLoading } = useQuery({
    queryKey: ['saved-listings', user?.id],
    queryFn: () => getSavedListings(user!.id),
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Abgemeldet',
        description: 'Sie wurden erfolgreich abgemeldet.',
      });
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userListings = userListingsData || [];
  const savedListings = savedListingsData || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="bg-sage border-2 border-black shadow-brutalist mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 bg-background border-2 border-black shadow-brutalist rounded-sm flex items-center justify-center">
                <User className="h-12 w-12" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-black text-foreground font-lexend mb-2">
                  {user.user_metadata?.full_name || 'User'}
                </h1>
                <div className="space-y-1 text-foreground">
                  <p>{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/profile/edit">
                  <Button variant="outline" className="font-bold">
                    <Settings className="h-4 w-4 mr-2" />
                    Profil bearbeiten
                  </Button>
                </Link>
                <Link to="/create-listing">
                  <Button variant="bright" className="font-bold">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('profile.createListing')}
                  </Button>
                </Link>
                <Button variant="outline" className="font-bold" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('common.logout')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} className="space-y-6">
          <TabsList className="bg-background border-2 border-black shadow-brutalist">
            <TabsTrigger 
              value="my-listings" 
              className="data-[state=active]:bg-cream font-bold"
            >
              <Package className="h-4 w-4 mr-2" />
              {t('profile.myListings')} ({userListings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="saved-listings" 
              className="data-[state=active]:bg-lavender font-bold"
            >
              <Heart className="h-4 w-4 mr-2" />
              {t('profile.savedListings')} ({savedListings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-listings" className="space-y-6">
                <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-foreground font-lexend">
                Meine Anzeigen
              </h2>
              <Link to="/create-listing">
                <Button variant="bright" className="font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  Neue Anzeige
                </Button>
              </Link>
            </div>
            
            {userListingsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted h-48 rounded-lg mb-4"></div>
                    <div className="bg-muted h-4 rounded mb-2"></div>
                    <div className="bg-muted h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : userListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((listing) => (
                  <div key={listing.id} className="space-y-4">
                    <ListingCard
                      id={listing.id}
                      title={listing.title}
                      price={`CHF ${listing.price?.toLocaleString() || '0'}`}
                      location={listing.location || 'Unbekannt'}
                      imageUrl={listing.images?.[0] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'}
                      category="Allgemein"
                      showSaveButton={false}
                    />
                    <ListingActions 
                      listingId={listing.id} 
                      onDelete={() => userListingsQuery.refetch()}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="bg-background border-2 border-black shadow-brutalist">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-black mb-2 font-lexend">
                    Noch keine Anzeigen
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Erstellen Sie Ihre erste Anzeige, um auf unserem Marktplatz zu verkaufen.
                  </p>
                  <Link to="/create-listing">
                    <Button variant="bright" className="font-bold">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('common.createFirstListing')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved-listings" className="space-y-6">
            <h2 className="text-2xl font-black text-foreground font-lexend">
              {t('profile.savedListings')}
            </h2>
            
            {savedListingsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted h-48 rounded-lg mb-4"></div>
                    <div className="bg-muted h-4 rounded mb-2"></div>
                    <div className="bg-muted h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : savedListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={`CHF ${listing.price?.toLocaleString() || '0'}`}
                    location={listing.location || 'Unbekannt'}
                    imageUrl={listing.images?.[0] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'}
                    category="Allgemein"
                    isFavorited={true}
                    showSaveButton={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-background border-2 border-black shadow-brutalist">
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-black mb-2 font-lexend">
                    Keine gespeicherten Anzeigen
                  </h3>
                  <p className="text-muted-foreground">
                    Artikel, die Sie speichern, erscheinen hier für späteren Zugriff.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};