import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface AdminActivity {
  id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: any;
  created_at: string;
  admin: {
    full_name: string | null;
  } | null;
}

export function AdminActivities() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_activities')
          .select(`
            *,
            profiles!admin_activities_admin_id_fkey (full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        
        setActivities(data?.map(activity => ({
          ...activity,
          admin: (activity as any).profiles
        })) || []);
      } catch (error) {
        console.error('Error fetching admin activities:', error);
        toast({
          title: 'Fehler',
          description: 'Admin-Aktivitäten konnten nicht geladen werden.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('delete')) return 'destructive';
    if (action.includes('create')) return 'default';
    if (action.includes('update')) return 'secondary';
    return 'outline';
  };

  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      'role_updated': 'Rolle aktualisiert',
      'listing_moderation': 'Anzeige moderiert',
      'listing_deleted': 'Anzeige gelöscht',
      'category_created': 'Kategorie erstellt',
      'category_updated': 'Kategorie aktualisiert',
      'category_deleted': 'Kategorie gelöscht',
      'user_banned': 'Benutzer gesperrt',
      'user_unbanned': 'Benutzer entsperrt'
    };
    return actionMap[action] || action;
  };

  const getTargetTypeText = (targetType: string) => {
    const typeMap: Record<string, string> = {
      'user': 'Benutzer',
      'listing': 'Anzeige',
      'category': 'Kategorie'
    };
    return typeMap[targetType] || targetType;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin-Aktivitäten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin-Aktivitäten</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Aktion</TableHead>
              <TableHead>Ziel</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Zeit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">
                  {activity.admin?.full_name || 'Unbekannt'}
                </TableCell>
                <TableCell>
                  <Badge variant={getActionBadgeVariant(activity.action)}>
                    {getActionText(activity.action)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {getTargetTypeText(activity.target_type)}
                    </span>
                    {activity.target_id && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {activity.target_id.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {activity.details ? (
                    <div className="max-w-xs">
                      <pre className="text-xs text-muted-foreground truncate">
                        {JSON.stringify(activity.details, null, 0)}
                      </pre>
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                    locale: de
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Keine Admin-Aktivitäten gefunden.
          </div>
        )}
      </CardContent>
    </Card>
  );
}