import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export const Messages = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Nachrichten</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ihre Nachrichten</CardTitle>
            <CardDescription>
              Hier können Sie Nachrichten zu Ihren Anzeigen verwalten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Noch keine Nachrichten vorhanden.
              </p>
              <p className="text-sm text-muted-foreground">
                Sobald jemand auf Ihre Anzeigen antwortet oder Sie eine Nachricht senden, 
                erscheint sie hier.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};