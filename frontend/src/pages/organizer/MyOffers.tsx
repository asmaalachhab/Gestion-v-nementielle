import { useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../app/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../app/components/ui/select';
import { Badge } from '../../app/components/ui/badge';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { getEventsByOrganisateurId, offers, Offer } from '../../data/mockData';
import { toast } from 'sonner';

export const MyOffers: React.FC = () => {
  const { user } = useAuth();
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    type_billet: '',
    prix: '',
    places_initial: '',
    places_disponibles: '',
    date_expiration: '',
    event_id: '',
  });

  if (!user) return null;

  const myEvents = getEventsByOrganisateurId(user.id);
  const myEventIds = myEvents.map(e => e.id);
  const myOffers = offers.filter(o => myEventIds.includes(o.event_id));

  const filteredOffers = selectedEventId === 'all'
    ? myOffers
    : myOffers.filter(o => String(o.event_id) === selectedEventId);

  const handleCreate = () => {
    setEditingOffer(null);
    setFormData({
      type_billet: '',
      prix: '',
      places_initial: '',
      places_disponibles: '',
      date_expiration: '',
      event_id: myEvents[0] ? String(myEvents[0].id) : '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      type_billet: offer.type_billet,
      prix: String(offer.prix),
      places_initial: String(offer.places_initial),
      places_disponibles: String(offer.places_disponibles),
      date_expiration: offer.date_expiration,
      event_id: String(offer.event_id),
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingOffer) {
      toast.success('Offre modifiée avec succès');
    } else {
      toast.success('Offre créée avec succès');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (offerId: number) => {
    toast.success('Offre supprimée avec succès');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1>Mes offres</h1>
          <p className="text-muted-foreground mt-1">
            {filteredOffers.length} offre{filteredOffers.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleCreate} disabled={myEvents.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Créer une offre
        </Button>
      </div>

      {/* Filter by Event */}
      <div className="max-w-md">
        <Label>Filtrer par événement</Label>
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les événements</SelectItem>
            {myEvents.map(event => (
              <SelectItem key={event.id} value={String(event.id)}>
                {event.titre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Offers Table */}
      {myEvents.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              icon={AlertTriangle}
              title="Aucun événement"
              description="Vous devez d'abord créer un événement avant de pouvoir ajouter des offres"
            />
          </CardContent>
        </Card>
      ) : filteredOffers.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Événement</TableHead>
                    <TableHead>Type de billet</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Places</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map(offer => {
                    const event = myEvents.find(e => e.id === offer.event_id);
                    const isExpired = new Date(offer.date_expiration) < new Date();
                    const isLowStock = offer.places_disponibles < 10;
                    const stockPercentage = (offer.places_disponibles / offer.places_initial) * 100;

                    return (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{event?.titre}</p>
                            <p className="text-sm text-muted-foreground">
                              {event ? new Date(event.date_event).toLocaleDateString('fr-FR') : '-'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{offer.type_billet}</TableCell>
                        <TableCell className="font-semibold">{offer.prix} DH</TableCell>
                        <TableCell>
                          <div>
                            <p>{offer.places_disponibles} / {offer.places_initial}</p>
                            <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  stockPercentage > 50 ? 'bg-secondary' : 
                                  stockPercentage > 20 ? 'bg-amber-500' : 
                                  'bg-destructive'
                                }`}
                                style={{ width: `${stockPercentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(offer.date_expiration).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {isExpired && (
                              <Badge variant="destructive" className="text-xs">
                                Expirée
                              </Badge>
                            )}
                            {isLowStock && !isExpired && (
                              <Badge variant="secondary" className="text-xs bg-amber-500 text-white">
                                Stock bas
                              </Badge>
                            )}
                            {!isExpired && !isLowStock && (
                              <Badge variant="default" className="text-xs bg-secondary">
                                Active
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(offer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(offer.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              icon={Plus}
              title="Aucune offre"
              description="Créez votre première offre de billetterie"
              action={{
                label: 'Créer une offre',
                onClick: handleCreate,
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? 'Modifier l\'offre' : 'Créer une offre'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="event_id">Événement *</Label>
              <Select
                value={formData.event_id}
                onValueChange={(v) => setFormData({ ...formData, event_id: v })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Sélectionner un événement" />
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

            <div>
              <Label htmlFor="type_billet">Type de billet *</Label>
              <Input
                id="type_billet"
                value={formData.type_billet}
                onChange={(e) => setFormData({ ...formData, type_billet: e.target.value })}
                placeholder="Ex: Standard, VIP, Étudiant"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="prix">Prix (DH) *</Label>
              <Input
                id="prix"
                type="number"
                min="0"
                value={formData.prix}
                onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                placeholder="150"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="places_initial">Places initiales *</Label>
                <Input
                  id="places_initial"
                  type="number"
                  min="1"
                  value={formData.places_initial}
                  onChange={(e) => setFormData({ ...formData, places_initial: e.target.value })}
                  placeholder="100"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="places_disponibles">Places disponibles *</Label>
                <Input
                  id="places_disponibles"
                  type="number"
                  min="0"
                  value={formData.places_disponibles}
                  onChange={(e) => setFormData({ ...formData, places_disponibles: e.target.value })}
                  placeholder="100"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date_expiration">Date d'expiration *</Label>
              <Input
                id="date_expiration"
                type="date"
                value={formData.date_expiration}
                onChange={(e) => setFormData({ ...formData, date_expiration: e.target.value })}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Les clients ne pourront plus réserver après cette date
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingOffer ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
