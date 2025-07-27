import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SavedListingButton } from './SavedListingButton';

interface ListingCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  imageUrl: string;
  category: string;
  isFavorited?: boolean;
  showSaveButton?: boolean;
}

export const ListingCard = ({ 
  id, 
  title, 
  price, 
  location, 
  imageUrl, 
  category,
  isFavorited = false,
  showSaveButton = true
}: ListingCardProps) => {
  return (
    <Card className="bg-card border border-border hover:shadow-lg transition-all duration-200 overflow-hidden h-full">
      <div className="relative">
        <Link to={`/listing/${id}`}>
          <div className="aspect-[4/3] bg-muted overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        {showSaveButton && (
          <div className="absolute top-3 right-3 bg-background/95 hover:bg-background shadow-sm rounded-full">
            <SavedListingButton listingId={id} />
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex flex-col h-full">
        <div className="space-y-3 flex-1">
          <div className="text-xs font-semibold text-primary uppercase tracking-wide">
            {category}
          </div>
          
          <Link to={`/listing/${id}`}>
            <h3 className="font-semibold text-base text-foreground hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
              {title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-foreground">
              {price}
            </span>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[100px]">{location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};