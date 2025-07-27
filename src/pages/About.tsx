import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Startseite
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Über uns
          </h1>
          <p className="text-xl text-muted-foreground">
            Lernen Sie Filipe Andrade und unsere Mission kennen
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Unsere Geschichte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Filipe Andrade ist Ihr vertrauensvoller Partner für hochwertige Produkte und 
                Dienstleistungen. Mit jahrelanger Erfahrung und einer Leidenschaft für Exzellenz 
                bieten wir eine kuratierte Auswahl an Artikeln, die Qualität und Wert vereinen.
              </p>
              <p className="text-foreground leading-relaxed">
                Unser Marktplatz verbindet Käufer und Verkäufer in einer sicheren und 
                benutzerfreundlichen Umgebung. Wir glauben daran, dass jeder Kunde die beste 
                Erfahrung verdient, und arbeiten kontinuierlich daran, unsere Services zu verbessern.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card>
            <CardHeader>
              <CardTitle>Unsere Werte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Qualität</h3>
                  <p className="text-sm text-muted-foreground">
                    Nur die besten Produkte schaffen es in unser Sortiment
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Vertrauen</h3>
                  <p className="text-sm text-muted-foreground">
                    Transparenz und Ehrlichkeit in allen Geschäftsbeziehungen
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Exzellenter Kundenservice steht bei uns an erster Stelle
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Kontakt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <p className="text-sm text-muted-foreground">info@filipeandrade.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-sm text-muted-foreground">+41 XX XXX XX XX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Standort</p>
                    <p className="text-sm text-muted-foreground">Schweiz</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};