import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListingCard } from '@/components/ListingCard';
import { getListings, getCategories } from '@/lib/marketplace';
import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

export const Category = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const currentLanguage = i18n.language.startsWith('de') ? 'de' : 'en';
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const category = categories?.find(cat => cat.id === categoryId);
  
  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['listings', categoryId],
    queryFn: () => getListings(categoryId),
  });

  // Filter listings by category and search query
  const filteredListings = listingsData?.filter(listing => {
    const matchesCategory = !categoryId || listing.category_id === categoryId;
    const matchesSearch = !searchQuery || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filter above
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Kategorie nicht gefunden</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Die gesuchte Kategorie existiert nicht.
          </p>
          <Button onClick={() => navigate('/')} variant="default">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.backToHome')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.backToHome')}
          </Button>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {category?.name || 'Kategorie'}
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Durchsuche alle Anzeigen in {category?.name || 'dieser Kategorie'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex max-w-lg">
            <Input
              type="text"
              placeholder={`Suchen in ${category?.name || 'Kategorie'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none border-r-0 bg-background focus:ring-2 focus:ring-primary/20 h-11"
            />
            <Button 
              type="submit" 
              variant="default" 
              size="icon" 
              className="rounded-l-none h-11"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {isLoading ? 'Laden...' : `${filteredListings.length} ${t('common.listingsFound')}`}
          </p>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-4 border-2 border-black"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={`CHF ${listing.price?.toLocaleString() || '0'}`}
                location={listing.location || 'Unbekannt'}
                imageUrl={listing.images?.[0] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'}
                category="Allgemein"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-border bg-muted rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2">{t('homepage.noListings')}</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? `Keine Anzeigen für "${searchQuery}" in ${category?.name || 'dieser Kategorie'} gefunden`
                : `Noch keine Anzeigen in ${category?.name || 'dieser Kategorie'} verfügbar.`
              }
            </p>
            <div className="space-x-4">
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Suche löschen
                </Button>
              )}
              <Button onClick={() => navigate('/create-listing')} variant="default">
                {t('common.createFirstListing')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};