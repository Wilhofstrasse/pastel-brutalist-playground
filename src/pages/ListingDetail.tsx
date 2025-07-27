import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Heart, Share2, Flag, MapPin, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { getListing, getProfile } from '@/lib/marketplace';
import { SavedListingButton } from '@/components/SavedListingButton';

export const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListing(id!),
    enabled: !!id,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', listing?.user_id],
    queryFn: () => getProfile(listing!.user_id),
    enabled: !!listing?.user_id,
  });

  if (!id) {
    return <Navigate to="/404" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !listing) {
    return <Navigate to="/404" replace />;
  }

  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'];

  const seller = {
    name: profile?.full_name || 'Benutzer',
    memberSince: new Date(profile?.created_at || listing.created_at).getFullYear().toString()
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
              <div className="aspect-[4/3] bg-mint relative">
                <img 
                  src={images[currentImageIndex]} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <SavedListingButton 
                    listingId={listing.id} 
                    className="bg-background/95 hover:bg-background shadow-sm h-10 w-10"
                  />
                </div>
              </div>
              {images.length > 1 && (
                <CardContent className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden ${
                          currentImageIndex === index 
                            ? 'border-primary' 
                            : 'border-black'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${listing.title} ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Title and Price */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                    {listing.category_id || 'Allgemein'}
                  </div>
                  <h1 className="text-3xl font-black text-foreground font-lexend">
                    {listing.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="bg-background">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="bg-background">
                    <Flag className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="text-4xl font-black text-foreground">
                CHF {listing.price?.toLocaleString() || '0'}
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {listing.location || 'Unbekannt'}
                <Calendar className="h-4 w-4 ml-4 mr-2" />
                {new Date(listing.created_at).toLocaleDateString('de-DE')}
              </div>
            </div>

            {/* Description */}
            <Card className="bg-background border-2 border-black shadow-brutalist">
              <CardContent className="p-6">
                <h2 className="text-xl font-black mb-4 font-lexend">
                  {t('common.description')}
                </h2>
                <div className="prose prose-sm max-w-none">
                  {(listing.description || 'Keine Beschreibung verfügbar.').split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 text-foreground leading-relaxed font-public">
                      {paragraph}
                    </p>
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
                      <div className="font-bold">{seller.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Mitglied seit {seller.memberSince}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-black h-0.5" />
                  
                  <div className="space-y-3">
                    <Button variant="bright" className="w-full font-bold" disabled>
                      Nachricht senden
                      <span className="text-xs block">(Demnächst verfügbar)</span>
                    </Button>
                    <Button variant="outline" className="w-full font-bold" disabled>
                      Telefonnummer anzeigen
                      <span className="text-xs block">(Demnächst verfügbar)</span>
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