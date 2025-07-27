import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListingCard } from '@/components/ListingCard';
import { getListings } from '@/lib/marketplace';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);

  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: () => getListings(),
  });

  // Filter listings by search query
  const filteredListings = listingsData?.filter(listing => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.location.toLowerCase().includes(query) ||
      listing.category_id?.toLowerCase().includes(query)
    );
  }) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

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
            {t('common.searchResults')}
          </h1>
          
          {queryParam && (
            <p className="text-xl text-muted-foreground">
              Ergebnisse für "{queryParam}"
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex max-w-lg">
            <Input
              type="text"
              placeholder={t('common.search')}
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
              <SearchIcon className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Results Count */}
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">{t('homepage.noListings')}</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? `Keine Anzeigen für "${searchQuery}" gefunden. Versuchen Sie andere Suchbegriffe.`
                : "Geben Sie einen Suchbegriff ein, um Anzeigen zu finden."
              }
            </p>
            <div className="space-x-4">
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Suche löschen
                </Button>
              )}
              <Button onClick={() => navigate('/')} variant="default">
                Alle Kategorien durchsuchen
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};