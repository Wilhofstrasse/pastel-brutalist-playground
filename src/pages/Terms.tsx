import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const Terms = () => {
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
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-xl text-muted-foreground">
            Stand: {new Date().toLocaleDateString('de-CH')}
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                1. Geltungsbereich
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Dienstleistungen 
                der Plattform Filipe Andrade und regeln das Rechtsverhältnis zwischen dem 
                Betreiber und den Nutzern der Website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Nutzung der Plattform</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h4>2.1 Registrierung</h4>
              <p>
                Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. 
                Bei der Registrierung sind wahrheitsgemäße Angaben zu machen.
              </p>
              
              <h4>2.2 Verantwortlichkeiten</h4>
              <p>
                Nutzer sind für alle Aktivitäten unter ihrem Account verantwortlich und 
                müssen ihre Zugangsdaten sicher verwahren.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Anzeigen und Inhalte</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h4>3.1 Inhaltliche Verantwortung</h4>
              <p>
                Nutzer sind allein verantwortlich für die von ihnen eingestellten Inhalte. 
                Diese müssen den geltenden Gesetzen entsprechen.
              </p>
              
              <h4>3.2 Verbotene Inhalte</h4>
              <ul>
                <li>Illegale Waren oder Dienstleistungen</li>
                <li>Gewaltverherrlichende oder diskriminierende Inhalte</li>
                <li>Urheberrechtsverletzende Materialien</li>
                <li>Falsche oder irreführende Angaben</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Haftung</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Der Betreiber fungiert lediglich als Plattform und ist nicht Partei der 
                zwischen den Nutzern geschlossenen Verträge. Die Haftung ist auf 
                vorsätzliche und grob fahrlässige Pflichtverletzungen beschränkt.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Datenschutz</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns wichtig. Details zur 
                Datenverarbeitung finden Sie in unserer 
                <Link to="/privacy" className="text-primary hover:underline ml-1">
                  Datenschutzerklärung
                </Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Änderungen der AGB</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Der Betreiber behält sich vor, diese AGB jederzeit zu ändern. 
                Nutzer werden über wesentliche Änderungen informiert.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Schlussbestimmungen</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Es gilt Schweizer Recht. Sollten einzelne Bestimmungen unwirksam sein, 
                bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
              
              <p className="mt-4">
                <strong>Kontakt:</strong><br />
                Filipe Andrade<br />
                E-Mail: info@filipeandrade.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};