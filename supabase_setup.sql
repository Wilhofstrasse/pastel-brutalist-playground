-- Enable RLS (Row Level Security)
alter table if exists public.profiles enable row level security;
alter table if exists public.listings enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.saved_listings enable row level security;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  name_de text not null,
  name_en text not null,
  icon text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create listings table
create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  price decimal(10,2) not null,
  currency text not null default 'CHF',
  location text not null,
  category_id uuid references public.categories(id) on delete cascade,
  image_urls text[] default array[]::text[],
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('active', 'sold', 'inactive')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create saved_listings table
create table if not exists public.saved_listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, listing_id)
);

-- Create storage bucket for listing images
insert into storage.buckets (id, name, public) 
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- RLS Policies for profiles
create policy "Users can view all profiles" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- RLS Policies for categories
create policy "Anyone can view categories" on public.categories
  for select using (true);

-- RLS Policies for listings
create policy "Anyone can view active listings" on public.listings
  for select using (status = 'active');

create policy "Users can view own listings" on public.listings
  for select using (auth.uid() = user_id);

create policy "Users can insert own listings" on public.listings
  for insert with check (auth.uid() = user_id);

create policy "Users can update own listings" on public.listings
  for update using (auth.uid() = user_id);

create policy "Users can delete own listings" on public.listings
  for delete using (auth.uid() = user_id);

-- RLS Policies for saved_listings
create policy "Users can view own saved listings" on public.saved_listings
  for select using (auth.uid() = user_id);

create policy "Users can insert own saved listings" on public.saved_listings
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own saved listings" on public.saved_listings
  for delete using (auth.uid() = user_id);

-- Storage policy for listing images
create policy "Anyone can view listing images" on storage.objects
  for select using (bucket_id = 'listing-images');

create policy "Users can upload listing images" on storage.objects
  for insert with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');

create policy "Users can update their listing images" on storage.objects
  for update using (bucket_id = 'listing-images' and auth.role() = 'authenticated');

create policy "Users can delete their listing images" on storage.objects
  for delete using (bucket_id = 'listing-images' and auth.role() = 'authenticated');

-- Insert sample categories
insert into public.categories (name, name_de, name_en, icon) values
  ('Electronics', 'Elektronik & Technik', 'Electronics & Tech', '📱'),
  ('Vehicles', 'Fahrzeuge & Motorräder', 'Vehicles & Motorcycles', '🚗'),
  ('Fashion', 'Mode & Accessoires', 'Fashion & Accessories', '👕'),
  ('Home', 'Haus, Garten & Heimwerken', 'Home & Garden', '🏠'),
  ('Sports', 'Sport, Freizeit & Outdoor', 'Sports & Outdoor', '⚽'),
  ('Books', 'Bücher & Medien', 'Books & Media', '📚'),
  ('Services', 'Dienstleistungen', 'Services', '🔧'),
  ('Jobs', 'Jobs & Karriere', 'Jobs & Career', '💼'),
  ('Real Estate', 'Immobilien', 'Real Estate', '🏘️'),
  ('Animals', 'Tiere & Zubehör', 'Animals & Accessories', '🐕'),
  ('Music', 'Musik & Instrumente', 'Music & Instruments', '🎵'),
  ('Games', 'Spiele & Spielzeug', 'Games & Toys', '🎮'),
  ('Art', 'Kunst & Antiquitäten', 'Art & Antiques', '🎨'),
  ('Other', 'Sonstiges', 'Other', '📦')
on conflict do nothing;

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();