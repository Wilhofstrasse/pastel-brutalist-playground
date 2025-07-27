import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Eye, Clock, Tag } from 'lucide-react';
import { getAdminStats, type AdminStats } from '@/lib/admin';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      title: 'Benutzer gesamt',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registrierte Benutzer'
    },
    {
      title: 'Anzeigen gesamt',
      value: stats.totalListings,
      icon: FileText,
      description: 'Alle Anzeigen'
    },
    {
      title: 'Aktive Anzeigen',
      value: stats.activeListings,
      icon: Eye,
      description: 'Öffentlich sichtbar'
    },
    {
      title: 'Warteschlange',
      value: stats.pendingListings,
      icon: Clock,
      description: 'Warten auf Moderation'
    },
    {
      title: 'Kategorien',
      value: stats.totalCategories,
      icon: Tag,
      description: 'Verfügbare Kategorien'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schnellzugriff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Moderation erforderlich</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {stats.pendingListings} Anzeigen warten auf Genehmigung
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Aktive Plattform</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {stats.activeListings} von {stats.totalListings} Anzeigen sind aktiv
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Benutzerbasis</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {stats.totalUsers} registrierte Benutzer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}