-- Add category images with appropriate icons
UPDATE categories SET image_url = '📚', description = 'Bücher, Filme, Musik und andere Medien' WHERE slug = 'books-media';
UPDATE categories SET image_url = '📱', description = 'Computer, Handys, Gadgets und elektronische Geräte' WHERE slug = 'electronics';
UPDATE categories SET image_url = '👕', description = 'Kleidung, Schuhe, Accessoires und Schmuck' WHERE slug = 'fashion';
UPDATE categories SET image_url = '🏠', description = 'Möbel, Geräte, Gartenwerkzeuge und Wohndeko' WHERE slug = 'home-garden';
UPDATE categories SET image_url = '🛠️', description = 'Professionelle und persönliche Dienstleistungen' WHERE slug = 'services';
UPDATE categories SET image_url = '⚽', description = 'Sportausrüstung, Outdoor-Ausrüstung und Freizeitartikel' WHERE slug = 'sports-recreation';
UPDATE categories SET image_url = '🚗', description = 'Autos, Motorräder, Fahrräder und andere Fahrzeuge' WHERE slug = 'vehicles';

-- Add the missing categories from the original data
INSERT INTO categories (name, slug, description, image_url) VALUES
('Fahrzeuge & Motorräder', 'motors-automotive', 'Autos, Motorräder und andere Fahrzeuge', '🚗'),
('Elektronik & Technik', 'electronics-technology', 'Computer, Smartphones und technische Geräte', '📱'),
('Haus, Garten & Heimwerken', 'home-garden-diy', 'Möbel, Gartenwerkzeuge und Heimwerkerbedarf', '🏠'),
('Mode & Accessoires', 'fashion-accessories', 'Kleidung, Schuhe und Accessoires', '👕'),
('Schmuck & Uhren', 'jewellery-watches', 'Schmuck, Uhren und Accessoires', '⌚'),
('Gesundheit, Schönheit & Pflege', 'health-beauty-personal-care', 'Gesundheits- und Schönheitsprodukte', '💄'),
('Sport, Freizeit & Outdoor', 'sports-leisure-outdoor', 'Sportausrüstung und Outdoor-Aktivitäten', '🏃'),
('Spielzeug, Spiele, Baby & Kinder', 'toys-games-baby-kids', 'Spielzeug und Kinderartikel', '🧸'),
('Bücher, Medien & Musikinstrumente', 'books-media-musical-instruments', 'Bücher, Filme und Musikinstrumente', '📚'),
('Sammlerobjekte, Kunst & Antiquitäten', 'collectibles-art-antiques', 'Kunst, Antiquitäten und Sammlerobjekte', '🎨'),
('Business, Büro & Industrie', 'business-office-industrial', 'Büroausstattung und Industriebedarf', '💼'),
('Tierbedarf', 'pet-supplies', 'Alles für Haustiere', '🐕'),
('Lebensmittel, Getränke & Spezialprodukte', 'food-beverage-specialty-consumables', 'Lebensmittel und Getränke', '☕'),
('Tickets, Reisen, Immobilien & Dienstleistungen', 'tickets-travel-real-estate-services', 'Tickets, Reisen und Dienstleistungen', '✈️');