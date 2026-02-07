import { useState } from 'react';
import { TrendingUp, Eye, Ticket, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../app/components/ui/select';
import { Label } from '../../app/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../app/components/ui/table';
import { useAuth } from '../../contexts/AuthContext';
import { getEventsByOrganisateurId, getStatisticsByEventId } from '../../data/mockData';

export const Statistics: React.FC = () => {
  const { user } = useAuth();
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  if (!user) return null;

  const myEvents = getEventsByOrganisateurId(user.id);
  const statistics = selectedEventId ? getStatisticsByEventId(parseInt(selectedEventId)) : [];

  const totalViews = statistics.reduce((sum, stat) => sum + stat.nb_vues, 0);
  const totalReservations = statistics.reduce((sum, stat) => sum + stat.nb_reservations, 0);
  const totalRevenue = statistics.reduce((sum, stat) => sum + stat.chiffre_affaires, 0);
  const avgViews = statistics.length > 0 ? Math.round(totalViews / statistics.length) : 0;

  // Calcul des tendances (comparaison premier/dernier jour)
  const viewsTrend = statistics.length > 1 
    ? ((statistics[statistics.length - 1].nb_vues - statistics[0].nb_vues) / statistics[0].nb_vues * 100).toFixed(1)
    : '0';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Analysez les performances de vos événements
        </p>
      </div>

      {/* Event Selector */}
      <div className="max-w-md">
        <Label>Sélectionnez un événement</Label>
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Choisir un événement" />
          </SelectTrigger>
          <SelectContent>
            {myEvents.map(event => (
              <SelectItem key={event.id} value={String(event.id)}>
                {event.titre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEventId ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Vues totales
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-secondary mt-1">
                  {viewsTrend > '0' ? '+' : ''}{viewsTrend}% vs début période
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Réservations
                </CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReservations}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sur {statistics.length} jour{statistics.length > 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Chiffre d'affaires
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} DH</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Période sélectionnée
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Moyenne vues/jour
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgViews}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vues par jour
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Évolution des vues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Graphique d'évolution des vues</p>
                  <p className="text-sm">(À implémenter avec recharts)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Détail par jour</CardTitle>
            </CardHeader>
            <CardContent>
              {statistics.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Vues</TableHead>
                        <TableHead>Réservations</TableHead>
                        <TableHead>Chiffre d'affaires</TableHead>
                        <TableHead>Taux de conversion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statistics.map(stat => {
                        const conversionRate = stat.nb_vues > 0 
                          ? ((stat.nb_reservations / stat.nb_vues) * 100).toFixed(2)
                          : '0';

                        return (
                          <TableRow key={stat.id}>
                            <TableCell>
                              {new Date(stat.date_consultation).toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span>{stat.nb_vues}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Ticket className="h-4 w-4 text-muted-foreground" />
                                <span>{stat.nb_reservations}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {stat.chiffre_affaires.toLocaleString()} DH
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 max-w-[100px]">
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-secondary rounded-full"
                                      style={{ width: `${Math.min(parseFloat(conversionRate) * 10, 100)}%` }}
                                    />
                                  </div>
                                </div>
                                <span className="text-sm">{conversionRate}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée statistique disponible pour cet événement
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="mb-2">Sélectionnez un événement</h3>
              <p>Choisissez un événement pour voir ses statistiques détaillées</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
