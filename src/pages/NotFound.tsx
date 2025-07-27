import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto mb-8 bg-muted rounded-full flex items-center justify-center">
          <Home className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-black mb-4 font-lexend text-foreground">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Seite nicht gefunden</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="space-y-4">
          <Link to="/">
            <Button variant="default" className="font-semibold">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Startseite
            </Button>
          </Link>
          <div>
            <Link to="/search" className="text-primary hover:underline">
              Zur Suche
            </Link>
            <span className="mx-2 text-muted-foreground">|</span>
            <Link to="/category/electronics-technology" className="text-primary hover:underline">
              Kategorien durchsuchen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
