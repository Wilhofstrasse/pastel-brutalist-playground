import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Heart, Share2, Flag, MapPin, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const ListingDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Mock listing data - in real app, fetch based on id
  const listing = {
    id: '1',
    title: 'iPhone 15 Pro Max - Wie neu',
    price: 'CHF 1,200',
    location: 'Zürich',
    description: 'Verkaufe mein iPhone 15 Pro Max in ausgezeichnetem Zustand. Das Gerät wurde immer mit Hülle und Panzerglas verwendet. Originalverpackung und Zubehör sind vorhanden. Akku-Zustand: 98%. Keine Kratzer oder Beschädigungen.',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=600&fit=crop'
    ],
    category: 'Elektronik & Technik',
    postedDate: '2024-01-15',
    seller: {
      name: 'Max Mustermann',
      rating: 4.8,
      responseTime: '< 1 Stunde'
    },
    specifications: {
      'Speicher': '256 GB',
      'Farbe': 'Space Black',
      'Zustand': 'Wie neu',
      'Garantie': 'Bis März 2025'
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="bg-background">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="bg-background border-2 border-black shadow-brutalist overflow-hidden">
              <div className="aspect-[4/3] bg-mint">
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {listing.images.slice(1).map((image, index) => (
                    <div key={index} className="flex-shrink-0 w-20 h-20 border-2 border-black">
                      <img 
                        src={image} 
                        alt={`${listing.title} ${index + 2}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Title and Price */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                    {listing.category}
                  </div>
                  <h1 className="text-3xl font-black text-foreground font-lexend">
                    {listing.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="bg-background">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="bg-background">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="bg-background">
                    <Flag className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="text-4xl font-black text-foreground">
                {listing.price}
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {listing.location}
                <Calendar className="h-4 w-4 ml-4 mr-2" />
                {listing.postedDate}
              </div>
            </div>

            {/* Description */}
            <Card className="bg-background border-2 border-black shadow-brutalist">
              <CardContent className="p-6">
                <h2 className="text-xl font-black mb-4 font-lexend">
                  {t('common.description')}
                </h2>
                <p className="text-foreground leading-relaxed font-public">
                  {listing.description}
                </p>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="bg-background border-2 border-black shadow-brutalist">
              <CardContent className="p-6">
                <h2 className="text-xl font-black mb-4 font-lexend">
                  {t('common.details')}
                </h2>
                <div className="space-y-3">
                  {Object.entries(listing.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2">
                      <span className="font-bold text-muted-foreground">{key}:</span>
                      <span className="text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-cream border-2 border-black shadow-brutalist">
              <CardContent className="p-6">
                <h3 className="text-lg font-black mb-4 font-lexend">
                  {t('listing.contactSeller')}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-sage border-2 border-black shadow-brutalist rounded-sm flex items-center justify-center mr-3">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold">{listing.seller.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ⭐ {listing.seller.rating} • {listing.seller.responseTime}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-black h-0.5" />
                  
                  <div className="space-y-3">
                    <Button variant="bright" className="w-full font-bold">
                      Nachricht senden
                    </Button>
                    <Button variant="outline" className="w-full font-bold">
                      Telefonnummer anzeigen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-lavender border-2 border-black shadow-brutalist">
              <CardContent className="p-6">
                <h3 className="text-lg font-black mb-4 font-lexend">
                  Sicherheitstipps
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Treffen Sie sich an öffentlichen Orten</li>
                  <li>• Prüfen Sie den Artikel vor dem Kauf</li>
                  <li>• Zahlen Sie nie im Voraus</li>
                  <li>• Vertrauen Sie Ihrem Bauchgefühl</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};