import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/ListingCard';
import { categories } from '@/data/categories';
import { getListings } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import heroImage from '@/assets/marketplace-hero.jpg';

export const Home = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith('de') ? 'de' : 'en';
  
  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: () => getListings(),
  });
  
  const featuredListings = listingsData?.data?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-mint border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight font-lexend">
                {t('homepage.title')}
              </h1>
              <p className="text-xl text-muted-foreground font-public">
                {t('homepage.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="bright" size="lg" className="font-bold">
                  Anzeige erstellen
                </Button>
                <Button variant="outline" size="lg" className="font-bold">
                  Kategorien entdecken
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Marketplace Hero" 
                className="w-full h-auto border-2 border-black shadow-brutalist-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-foreground mb-8 font-lexend">
            {t('common.categories')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.slice(0, 14).map((category, index) => {
              const colors = [
                'bg-sage', 'bg-cream', 'bg-peach', 'bg-lavender', 
                'bg-aqua', 'bg-lime', 'bg-yellow'
              ];
              const bgColor = colors[index % colors.length];
              
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`${bgColor} border-2 border-black shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none h-auto p-4 flex-col space-y-2`}
                >
                  <div className="text-2xl">📦</div>
                  <span className="text-xs font-bold text-center leading-tight">
                    {category.name[currentLanguage]}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-foreground font-lexend">
              {t('homepage.featuredListings')}
            </h2>
            <Button variant="outline" className="font-bold">
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