import { Eye, Ticket, TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../app/components/ui/table';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { getEventsByOrganisateurId, reservations, getOfferById, getEventById } from '../../data/mockData';

export const Overview: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const myEvents = getEventsByOrganisateurId(user.id);
  
  // Calculer les KPIs
  const totalViews = myEvents.reduce((sum, event) => sum + event.nb_vues, 0);
  
  // Réservations pour les événements de l'organisateur
  const myEventIds = myEvents.map(e => e.id);
  const myReservations = reservations.filter(res => {
    const offer = getOfferById(res.offer_id);
    return offer && myEventIds.includes(offer.event_id);
  });

  const totalReservations = myReservations.length;
  const totalRevenue = myReservations.reduce((sum, res) => sum + res.montant_total, 0);
  const confirmedReservations = myReservations.filter(r => r.statut === 'CONFIRMEE').length;

  // Dernières réservations
  const latestReservations = [...myReservations]
    .sort((a, b) => new Date(b.date_reservation).getTime() - new Date(a.date_reservation).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
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
            <p className="text-xs text-muted-foreground mt-1">
              Sur {myEvents.length} événement{myEvents.length > 1 ? 's' : ''}
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
              {confirmedReservations} confirmée{confirmedReservations > 1 ? 's' : ''}
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
            <p className="text-xs text-secondary mt-1">
              +12% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Événements actifs
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myEvents.filter(e => e.statut === 'PUBLIE').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sur {myEvents.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vues par événement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myEvents.slice(0, 5).map(event => {
                const percentage = totalViews > 0 ? (event.nb_vues / totalViews) * 100 : 0;
                return (
                  <div key={event.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="truncate flex-1 mr-2">{event.titre}</span>
                      <span className="font-semibold">{event.nb_vues.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Taux de conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {totalViews > 0 ? ((totalReservations / totalViews) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-muted-foreground">
                  {totalReservations} réservations sur {totalViews} vues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières réservations</CardTitle>
        </CardHeader>
        <CardContent>
          {latestReservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Événement</TableHead>
                  <TableHead>Places</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestReservations.map(reservation => {
                  const offer = getOfferById(reservation.offer_id);
                  const event = offer ? getEventById(offer.event_id) : null;

                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-mono text-sm">
                        {reservation.code_reservation}
                      </TableCell>
                      <TableCell>{event?.titre || '-'}</TableCell>
                      <TableCell>{reservation.nb_places}</TableCell>
                      <TableCell className="font-semibold">
                        {reservation.montant_total} DH
                      </TableCell>
                      <TableCell>
                        {new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={reservation.statut} type="reservation" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune réservation pour le moment
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
