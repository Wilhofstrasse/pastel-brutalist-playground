import { useTranslation } from 'react-i18next';
import { User, Settings, Heart, Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingCard } from '@/components/ListingCard';

const mockUserListings = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max - Wie neu',
    price: 'CHF 1,200',
    location: 'Zürich',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    category: 'Elektronik & Technik'
  },
  {
    id: '2',
    title: 'Gaming Setup Complete',
    price: 'CHF 1,800',
    location: 'Zürich',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    category: 'Elektronik & Technik'
  }
];

const mockSavedListings = [
  {
    id: '3',
    title: 'Vintage Leather Sofa',
    price: 'CHF 850',
    location: 'Basel',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    category: 'Haus, Garten & Heimwerken',
    isFavorited: true
  },
  {
    id: '4',
    title: 'Mountain Bike - Scott Scale',
    price: 'CHF 2,500',
    location: 'Bern',
    imageUrl: 'https://images.unsplash.com/photo-1544191696-15693072c645?w=400&h=300&fit=crop',
    category: 'Sport, Freizeit & Outdoor',
    isFavorited: true
  }
];

export const Profile = () => {
  const { t } = useTranslation();

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
                  Max Mustermann
                </h1>
                <div className="space-y-1 text-foreground">
                  <p>Mitglied seit Januar 2024</p>
                  <p>⭐ 4.8 Bewertung • 15 Verkäufe</p>
                  <p>📍 Zürich, Schweiz</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="bright" className="font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('profile.createListing')}
                </Button>
                <Button variant="outline" className="font-bold">
                  <Settings className="h-4 w-4 mr-2" />
                  {t('profile.accountSettings')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="my-listings" className="space-y-6">
          <TabsList className="bg-background border-2 border-black shadow-brutalist">
            <TabsTrigger 
              value="my-listings" 
              className="data-[state=active]:bg-cream font-bold"
            >
              <Package className="h-4 w-4 mr-2" />
              {t('profile.myListings')} (2)
            </TabsTrigger>
            <TabsTrigger 
              value="saved-listings" 
              className="data-[state=active]:bg-lavender font-bold"
            >
              <Heart className="h-4 w-4 mr-2" />
              {t('profile.savedListings')} (2)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-foreground font-lexend">
                {t('profile.myListings')}
              </h2>
              <Button variant="bright" className="font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Neue Anzeige
              </Button>
            </div>
            
            {mockUserListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockUserListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price}
                    location={listing.location}
                    imageUrl={listing.imageUrl}
                    category={listing.category}
                  />
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
                    Erstelle deine erste Anzeige und beginne zu verkaufen!
                  </p>
                  <Button variant="bright" className="font-bold">
                    <Plus className="h-4 w-4 mr-2" />
                    Erste Anzeige erstellen
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved-listings" className="space-y-6">
            <h2 className="text-2xl font-black text-foreground font-lexend">
              {t('profile.savedListings')}
            </h2>
            
            {mockSavedListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSavedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price}
                    location={listing.location}
                    imageUrl={listing.imageUrl}
                    category={listing.category}
                    isFavorited={listing.isFavorited}
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
                    Speichere interessante Anzeigen für später!
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