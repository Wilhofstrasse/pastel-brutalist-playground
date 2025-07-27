import { useState, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, User, Menu, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCategories } from '@/lib/marketplace';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  const currentLanguage = i18n.language.startsWith('de') ? 'de' : 'en';

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-background border-b-2 border-black font-public">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xl font-black">F</span>
            </div>
            <span className="ml-3 text-xl font-black hidden sm:block">filipeandrade.com</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-r-0 bg-background focus:ring-2 focus:ring-primary/20 h-11"
              />
              <Button 
                type="submit" 
                variant="default" 
                size="icon" 
                className="rounded-l-none h-11"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="bg-background">
                  {t('common.categories')}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-background border border-border shadow-lg rounded-md z-50">
                <DropdownMenuItem className="font-semibold border-b border-border">
                  {t('common.allCategories')}
                </DropdownMenuItem>
                {categoriesLoading
                  ? [...Array(5)].map((_, i) => (
                      <DropdownMenuItem key={i} className="animate-pulse">
                        <span className="h-4 w-full bg-muted rounded" />
                      </DropdownMenuItem>
                    ))
                  : categories.map((category) => (
                      <DropdownMenuItem key={category.id} className="hover:bg-accent">
                        <Link
                          to={`/category/${category.id}`}
                          className="w-full flex items-center py-2"
                        >
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Navigation */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Hallo, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <Link to="/create-listing">
                  <Button variant="default" className="font-semibold">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('profile.createListing')}
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-background">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background border border-border shadow-lg rounded-md z-50">
                    <DropdownMenuItem>
                      <Link to="/profile" className="w-full">{t('common.profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                    <Link to="/profile?tab=saved-listings" className="w-full">{t('profile.savedListings')}</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem>
                        <Link to="/admin" className="w-full">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      className="text-destructive cursor-pointer" 
                      onClick={async () => {
                        try {
                          await import('@/lib/marketplace').then(({ signOut }) => signOut());
                        } catch (error) {
                          console.error('Logout error:', error);
                        }
                      }}
                    >
                      {t('common.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="font-semibold">
                  <User className="h-4 w-4 mr-2" />
                  Anmelden
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              ref={menuButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-background"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="flex">
            <Input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none border-r-0 bg-background focus:ring-2 focus:ring-primary/20 h-11"
            />
            <Button 
              type="submit" 
              variant="default" 
              size="icon" 
              className="rounded-l-none h-11"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <FocusTrap
            focusTrapOptions={{
              onDeactivate: () => menuButtonRef.current?.focus(),
              clickOutsideDeactivates: true,
              escapeDeactivates: true,
            }}
          >
            <div
              className="lg:hidden border-t-2 border-black py-4"
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsMobileMenuOpen(false);
                  menuButtonRef.current?.focus();
                }
              }}
            >
              <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start bg-background">
                {t('common.categories')}
              </Button>
              {user ? (
                <>
                  <Link to="/create-listing" className="block">
                    <Button variant="default" className="w-full justify-start font-semibold">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('profile.createListing')}
                    </Button>
                  </Link>
                  <Link to="/profile" className="block">
                    <Button variant="ghost" className="w-full justify-start bg-background">
                      <User className="h-4 w-4 mr-2" />
                      {t('common.profile')}
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full justify-start font-semibold">
                    <User className="h-4 w-4 mr-2" />
                    Anmelden
                  </Button>
                </Link>
              )}
            </div>
          </div>
          </FocusTrap>
        )}
      </div>
    </nav>
  );
};