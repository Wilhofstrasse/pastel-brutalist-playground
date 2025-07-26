import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ListingCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  imageUrl: string;
  category: string;
  isFavorited?: boolean;
}

export const ListingCard = ({ 
  id, 
  title, 
  price, 
  location, 
  imageUrl, 
  category,
  isFavorited = false 
}: ListingCardProps) => {
  return (
    <Card className="bg-background border-2 border-black shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 overflow-hidden">
      <div className="relative">
        <Link to={`/listing/${id}`}>
          <div className="aspect-[4/3] bg-mint border-b-2 border-black overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute top-2 right-2 bg-background/90 hover:bg-background ${
            isFavorited ? 'text-red-500' : 'text-black'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-xs font-bold text-sage uppercase tracking-wide">
            {category}
          </div>
          
          <Link to={`/listing/${id}`}>
            <h3 className="font-bold text-lg text-foreground hover:text-sage transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-foreground">
              {price}
            </span>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {location}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};