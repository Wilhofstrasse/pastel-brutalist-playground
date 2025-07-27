import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/ListingCard';
import { categories } from '@/data/categories';
import { getListings } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import heroImage from '@/assets/marketplace-hero.jpg';

export const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = i18n.language.startsWith('de') ? 'de' : 'en';
  
  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: () => getListings(),
  });
  
  const featuredListings = listingsData?.data?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">
              {t('homepage.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('homepage.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                size="lg" 
                variant="default" 
                className="font-semibold"
                onClick={() => navigate('/create-listing')}
              >
                {t('profile.createListing')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="font-semibold"
                onClick={() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Kategorien entdecken
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories-section" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            {t('common.categories')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                onClick={() => navigate(`/category/${category.id}`)}
                className="h-auto p-4 flex-col space-y-2 min-h-[100px] text-center"
              >
                <div className="text-2xl">{category.icon}</div>
                <span className="text-xs font-medium leading-tight">
                  {category.name[currentLanguage]}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              {t('homepage.featuredListings')}
            </h2>
            <Button 
              variant="outline" 
              className="font-semibold"
              onClick={() => navigate('/search')}
            >
              Alle anzeigen
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-48 rounded-lg mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
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
            <div className="text-center py-12">
              <p className="text-muted-foreground">No listings available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};