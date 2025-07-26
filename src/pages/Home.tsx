import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/ListingCard';
import { categories } from '@/data/categories';
import heroImage from '@/assets/marketplace-hero.jpg';

// Mock data for featured listings
const mockListings = [
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
    title: 'Vintage Leather Sofa',
    price: 'CHF 850',
    location: 'Basel',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    category: 'Haus, Garten & Heimwerken'
  },
  {
    id: '3',
    title: 'Mountain Bike - Scott Scale',
    price: 'CHF 2,500',
    location: 'Bern',
    imageUrl: 'https://images.unsplash.com/photo-1544191696-15693072c645?w=400&h=300&fit=crop',
    category: 'Sport, Freizeit & Outdoor'
  },
  {
    id: '4',
    title: 'Designer Handtasche',
    price: 'CHF 320',
    location: 'Genf',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
    category: 'Mode & Accessoires'
  },
  {
    id: '5',
    title: 'BMW 3er Serie',
    price: 'CHF 28,500',
    location: 'Lausanne',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    category: 'Fahrzeuge & Motorräder'
  },
  {
    id: '6',
    title: 'Gaming Setup Complete',
    price: 'CHF 1,800',
    location: 'St. Gallen',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    category: 'Elektronik & Technik'
  }
];

export const Home = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith('de') ? 'de' : 'en';

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockListings.map((listing) => (
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
        </div>
      </section>
    </div>
  );
};