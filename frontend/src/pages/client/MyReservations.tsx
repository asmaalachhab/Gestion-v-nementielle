import { Calendar, Ticket, Eye, XCircle } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../app/components/ui/table';
import { Badge } from '../../app/components/ui/badge';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { getOfferById, getEventById } from '../../data/mockData';
import { getReservationsByUserIdPersisted } from '../../data/storage';
import { toast } from 'sonner';

interface MyReservationsProps {
  onViewEventDetails: (eventId: number) => void;
}

export const MyReservations: React.FC<MyReservationsProps> = ({ onViewEventDetails }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const reservations = getReservationsByUserIdPersisted(user.id);

  const handleCancelReservation = (reservationId: number) => {
    toast.success('Réservation annulée avec succès');
  };

  if (reservations.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="mb-8">Mes réservations</h1>
          <Card>
            <CardContent className="py-8">
              <EmptyState
                icon={Ticket}
                title="Aucune réservation"
                description="Vous n'avez pas encore effectué de réservation. Découvrez nos événements et réservez vos places !"
                action={{
                  label: 'Découvrir les événements',
                  onClick: () => window.location.href = '/'
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2">Mes réservations</h1>
          <p className="text-muted-foreground">
            {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Desktop Table */}
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Événement</TableHead>
                  <TableHead>Type de billet</TableHead>
                  <TableHead>Places</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map(reservation => {
                  const offer = getOfferById(reservation.offer_id);
                  const event = offer ? getEventById(offer.event_id) : null;

                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-mono text-sm">
                        {reservation.code_reservation}
                      </TableCell>
                      <TableCell>
                        {event ? (
                          <div>
                            <p className="font-semibold">{event.titre}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.date_event).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{offer?.type_billet || '-'}</TableCell>
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
                      <TableCell>
                        <div className="flex gap-2">
                          {event && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onViewEventDetails(event.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {reservation.statut === 'EN_ATTENTE' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelReservation(reservation.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {reservations.map(reservation => {
            const offer = getOfferById(reservation.offer_id);
            const event = offer ? getEventById(offer.event_id) : null;

            return (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{event?.titre || 'Événement'}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {reservation.code_reservation}
                      </p>
                    </div>
                    <StatusBadge status={reservation.statut} type="reservation" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(event.date_event).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type de billet</p>
                      <p className="font-semibold">{offer?.type_billet || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Places</p>
                      <p className="font-semibold">{reservation.nb_places}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Montant total</p>
                      <p className="font-semibold text-primary">{reservation.montant_total} DH</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date réservation</p>
                      <p className="font-semibold">
                        {new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {event && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewEventDetails(event.id)}
                        className="flex-1"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir l'événement
                      </Button>
                    )}
                    {reservation.statut === 'EN_ATTENTE' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
