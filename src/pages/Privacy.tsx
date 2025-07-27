import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Database, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const Privacy = () => {
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
            Datenschutzerklärung
          </h1>
          <p className="text-xl text-muted-foreground">
            Stand: {new Date().toLocaleDateString('de-CH')} | Ihr Datenschutz ist uns wichtig
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Datenschutz im Überblick
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir 
                verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen 
                Bestimmungen (DSGVO, TKG 2003). In dieser Datenschutzerklärung informieren 
                wir Sie über die wichtigsten Aspekte der Datenverarbeitung.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Welche Daten sammeln wir?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Registrierungsdaten</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>E-Mail-Adresse (erforderlich für Anmeldung)</li>
                  <li>Name (optional für Profil)</li>
                  <li>Telefonnummer (optional für Kontakt)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Nutzungsdaten</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Anzeigen und deren Inhalte</li>
                  <li>Suchverlauf (anonymisiert)</li>
                  <li>Technische Daten (IP-Adresse, Browser, Geräteinformationen)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Wie verwenden wir Ihre Daten?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1">Bereitstellung der Dienste</h4>
                  <p className="text-sm text-muted-foreground">
                    Ermöglichung der Nutzung unserer Plattform, Anzeigenverwaltung und Kommunikation
                  </p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1">Verbesserung der Plattform</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyse des Nutzerverhaltens zur Optimierung unserer Dienste (anonymisiert)
                  </p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1">Kommunikation</h4>
                  <p className="text-sm text-muted-foreground">
                    Wichtige Mitteilungen über Ihr Konto und unsere Dienste
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Datenweitergabe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                Wir geben Ihre persönlichen Daten nicht an Dritte weiter, außer:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Sie haben ausdrücklich eingewilligt</li>
                <li>Es ist für die Vertragsabwicklung erforderlich</li>
                <li>Wir sind gesetzlich dazu verpflichtet</li>
                <li>Es dient der Durchsetzung unserer Rechte</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ihre Rechte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Auskunft & Berichtigung</h4>
                  <p className="text-sm text-muted-foreground">
                    Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten und deren Berichtigung.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Löschung & Widerspruch</h4>
                  <p className="text-sm text-muted-foreground">
                    Sie können die Löschung Ihrer Daten verlangen und der Verarbeitung widersprechen.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Datenportabilität</h4>
                  <p className="text-sm text-muted-foreground">
                    Sie haben das Recht, Ihre Daten in einem strukturierten Format zu erhalten.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Beschwerderecht</h4>
                  <p className="text-sm text-muted-foreground">
                    Sie können sich bei der Datenschutzbehörde über unsere Datenverarbeitung beschweren.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies & Technologien</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                Wir verwenden Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Notwendige Cookies:</strong> Für die Grundfunktionen der Website</li>
                <li><strong>Funktionale Cookies:</strong> Für erweiterte Funktionen und Personalisierung</li>
                <li><strong>Analytische Cookies:</strong> Zur Verbesserung unserer Dienste (anonymisiert)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontakt zum Datenschutz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns:
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <p><strong>Filipe Andrade</strong></p>
                <p>E-Mail: datenschutz@filipeandrade.com</p>
                <p>Oder nutzen Sie unser 
                  <Link to="/contact" className="text-primary hover:underline ml-1">
                    Kontaktformular
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};