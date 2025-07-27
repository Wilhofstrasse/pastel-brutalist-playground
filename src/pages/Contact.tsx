import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Nachricht gesendet",
      description: "Vielen Dank für Ihre Nachricht. Wir werden uns bald bei Ihnen melden.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
            Kontakt
          </h1>
          <p className="text-xl text-muted-foreground">
            Nehmen Sie Kontakt mit uns auf - wir helfen Ihnen gerne weiter
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Nachricht senden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ihr vollständiger Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ihre.email@beispiel.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Betreff *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Worum geht es?"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Nachricht *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Teilen Sie uns mit, wie wir Ihnen helfen können..."
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Nachricht senden
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kontaktinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <p className="text-muted-foreground">info@filipeandrade.com</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Wir antworten normalerweise innerhalb von 24 Stunden
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-muted-foreground">+41 XX XXX XX XX</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mo-Fr: 9:00-18:00 Uhr
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Standort</p>
                    <p className="text-muted-foreground">Schweiz</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lokaler Service, persönliche Betreuung
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Häufige Fragen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Wie kann ich eine Anzeige aufgeben?</p>
                  <p className="text-sm text-muted-foreground">
                    Registrieren Sie sich und klicken Sie auf "Anzeige erstellen"
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Ist der Service kostenlos?</p>
                  <p className="text-sm text-muted-foreground">
                    Ja, das Aufgeben von Anzeigen ist völlig kostenlos
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Wie kann ich Anzeigen bearbeiten?</p>
                  <p className="text-sm text-muted-foreground">
                    In Ihrem Profil finden Sie alle Ihre Anzeigen zum Bearbeiten
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};