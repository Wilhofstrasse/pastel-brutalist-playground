import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListingCard } from '@/components/ListingCard';
import { categories } from '@/data/categories';
import { getListings } from '@/lib/supabase';
import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

export const Category = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const currentLanguage = i18n.language.startsWith('de') ? 'de' : 'en';
  
  const category = categories.find(cat => cat.id === categoryId);
  
  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['listings', categoryId],
    queryFn: () => getListings(),
  });

  // Filter listings by category and search query
  const filteredListings = listingsData?.data?.filter(listing => {
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
          <h1 className="text-4xl font-black mb-4 font-lexend">Category Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The category you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/')} variant="bright">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
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
            className="mb-4 bg-background"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-black text-foreground mb-4 font-lexend">
            {category.name[currentLanguage]}
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Browse all listings in {category.name[currentLanguage]}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex max-w-lg">
            <Input
              type="text"
              placeholder={`Search in ${category.name[currentLanguage]}...`}
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
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Results */}
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
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2">No listings found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? `No listings found for "${searchQuery}" in ${category.name[currentLanguage]}`
                : `No listings available in ${category.name[currentLanguage]} yet.`
              }
            </p>
            <div className="space-x-4">
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              )}
              <Button onClick={() => navigate('/create-listing')} variant="bright">
                Create First Listing
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};