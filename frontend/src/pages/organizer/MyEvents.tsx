import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../app/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../app/components/ui/select';
import { Textarea } from '../../app/components/ui/textarea';
import { Badge } from '../../app/components/ui/badge';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { getEventsByOrganisateurId, categories, regions, Event } from '../../data/mockData';
import { toast } from 'sonner';

export const MyEvents: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_event: '',
    heure_debut: '',
    lieu: '',
    image_url: '',
    categorie_id: '',
    region_id: '',
    statut: 'BROUILLON' as Event['statut'],
  });

  if (!user) return null;

  const myEvents = getEventsByOrganisateurId(user.id);
  const filteredEvents = myEvents.filter(event =>
    event.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData({
      titre: '',
      description: '',
      date_event: '',
      heure_debut: '',
      lieu: '',
      image_url: '',
      categorie_id: '',
      region_id: '',
      statut: 'BROUILLON',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      titre: event.titre,
      description: event.description,
      date_event: event.date_event,
      heure_debut: event.heure_debut,
      lieu: event.lieu,
      image_url: event.image_url,
      categorie_id: String(event.categorie_id),
      region_id: String(event.region_id),
      statut: event.statut,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingEvent) {
      toast.success('Événement modifié avec succès');
    } else {
      toast.success('Événement créé avec succès');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (eventId: number) => {
    toast.success('Événement supprimé avec succès');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1>Mes événements</h1>
          <p className="text-muted-foreground mt-1">
            {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Créer un événement
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un événement..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Events Table */}
      {filteredEvents.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Événement</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Vues</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map(event => {
                    const category = categories.find(c => c.id === event.categorie_id);
                    const region = regions.find(r => r.id === event.region_id);

                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={event.image_url}
                              alt={event.titre}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <p className="font-semibold">{event.titre}</p>
                              <p className="text-sm text-muted-foreground">{region?.nom}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{new Date(event.date_event).toLocaleDateString('fr-FR')}</p>
                            <p className="text-sm text-muted-foreground">{event.heure_debut}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{event.lieu}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{category?.nom}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{event.nb_vues.toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={event.statut} type="event" />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(event.id)}
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
              title="Aucun événement"
              description="Commencez par créer votre premier événement"
              action={{
                label: 'Créer un événement',
                onClick: handleCreate,
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Modifier l\'événement' : 'Créer un événement'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: Concert Saad Lamjarred"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre événement..."
                rows={4}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_event">Date *</Label>
                <Input
                  id="date_event"
                  type="date"
                  value={formData.date_event}
                  onChange={(e) => setFormData({ ...formData, date_event: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="heure_debut">Heure de début *</Label>
                <Input
                  id="heure_debut"
                  type="time"
                  value={formData.heure_debut}
                  onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lieu">Lieu *</Label>
              <Input
                id="lieu"
                value={formData.lieu}
                onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                placeholder="Ex: Palais des Congrès, Marrakech"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="image_url">URL de l'image</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Entrez l'URL d'une image ou laissez vide pour utiliser une image par défaut
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categorie">Catégorie *</Label>
                <Select
                  value={formData.categorie_id}
                  onValueChange={(v) => setFormData({ ...formData, categorie_id: v })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="region">Région *</Label>
                <Select
                  value={formData.region_id}
                  onValueChange={(v) => setFormData({ ...formData, region_id: v })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(reg => (
                      <SelectItem key={reg.id} value={String(reg.id)}>
                        {reg.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="statut">Statut *</Label>
              <Select
                value={formData.statut}
                onValueChange={(v) => setFormData({ ...formData, statut: v as Event['statut'] })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BROUILLON">Brouillon</SelectItem>
                  <SelectItem value="PUBLIE">Publié</SelectItem>
                  <SelectItem value="ANNULE">Annulé</SelectItem>
                  <SelectItem value="TERMINE">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingEvent ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
