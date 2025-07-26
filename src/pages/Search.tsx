import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListingCard } from '@/components/ListingCard';
import { getListings } from '@/lib/supabase';
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
  const filteredListings = listingsData?.data?.filter(listing => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.location.toLowerCase().includes(query) ||
      listing.categories?.name_en?.toLowerCase().includes(query) ||
      listing.categories?.name_de?.toLowerCase().includes(query)
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
            className="mb-4 bg-background"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-black text-foreground mb-4 font-lexend">
            Search Results
          </h1>
          
          {queryParam && (
            <p className="text-xl text-muted-foreground">
              Results for "{queryParam}"
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex max-w-lg">
            <Input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none border-r-0 bg-background border-2 border-black shadow-brutalist h-12"
            />
            <Button 
              type="submit" 
              variant="bright" 
              size="icon" 
              className="rounded-l-none"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${filteredListings.length} listing${filteredListings.length !== 1 ? 's' : ''} found`}
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
                price={`${listing.currency} ${listing.price.toLocaleString()}`}
                location={listing.location}
                imageUrl={listing.image_urls[0] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'}
                category={listing.categories?.name_en || 'Uncategorized'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-black bg-muted rounded-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? `No listings found for "${searchQuery}". Try different keywords.`
                : "Enter a search term to find listings."
              }
            </p>
            <div className="space-x-4">
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              )}
              <Button onClick={() => navigate('/')} variant="bright">
                Browse All Categories
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};