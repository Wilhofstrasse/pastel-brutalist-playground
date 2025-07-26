export interface Category {
  id: string;
  name: {
    de: string;
    en: string;
  };
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'motors-automotive',
    name: {
      de: 'Fahrzeuge & Motorräder',
      en: 'Motors & Automotive'
    },
    icon: 'Car'
  },
  {
    id: 'electronics-technology',
    name: {
      de: 'Elektronik & Technik',
      en: 'Electronics & Technology'
    },
    icon: 'Smartphone'
  },
  {
    id: 'home-garden-diy',
    name: {
      de: 'Haus, Garten & Heimwerken',
      en: 'Home, Garden & DIY'
    },
    icon: 'Home'
  },
  {
    id: 'fashion-accessories',
    name: {
      de: 'Mode & Accessoires',
      en: 'Fashion & Accessories'
    },
    icon: 'Shirt'
  },
  {
    id: 'jewellery-watches',
    name: {
      de: 'Schmuck & Uhren',
      en: 'Jewellery & Watches'
    },
    icon: 'Watch'
  },
  {
    id: 'health-beauty-personal-care',
    name: {
      de: 'Gesundheit, Schönheit & Pflege',
      en: 'Health, Beauty & Personal Care'
    },
    icon: 'Heart'
  },
  {
    id: 'sports-leisure-outdoor',
    name: {
      de: 'Sport, Freizeit & Outdoor',
      en: 'Sports, Leisure & Outdoor'
    },
    icon: 'Bike'
  },
  {
    id: 'toys-games-baby-kids',
    name: {
      de: 'Spielzeug, Spiele, Baby & Kinder',
      en: 'Toys, Games, Baby & Kids'
    },
    icon: 'Baby'
  },
  {
    id: 'books-media-musical-instruments',
    name: {
      de: 'Bücher, Medien & Musikinstrumente',
      en: 'Books, Media & Musical Instruments'
    },
    icon: 'Book'
  },
  {
    id: 'collectibles-art-antiques',
    name: {
      de: 'Sammlerobjekte, Kunst & Antiquitäten',
      en: 'Collectibles, Art & Antiques'
    },
    icon: 'Palette'
  },
  {
    id: 'business-office-industrial',
    name: {
      de: 'Business, Büro & Industrie',
      en: 'Business, Office & Industrial'
    },
    icon: 'Briefcase'
  },
  {
    id: 'pet-supplies',
    name: {
      de: 'Tierbedarf',
      en: 'Pet Supplies'
    },
    icon: 'PawPrint'
  },
  {
    id: 'food-beverage-specialty-consumables',
    name: {
      de: 'Lebensmittel, Getränke & Spezialprodukte',
      en: 'Food, Beverage & Specialty Consumables'
    },
    icon: 'Coffee'
  },
  {
    id: 'tickets-travel-real-estate-services',
    name: {
      de: 'Tickets, Reisen, Immobilien & Dienstleistungen',
      en: 'Tickets, Travel, Real Estate & Services'
    },
    icon: 'Plane'
  }
];