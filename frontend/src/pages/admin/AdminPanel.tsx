import { useState } from 'react';
import { Users, MapPin, Tag, Shield, Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../app/components/ui/table';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../app/components/ui/tabs';
import { Badge } from '../../app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../app/components/ui/dialog';
import { Textarea } from '../../app/components/ui/textarea';
import { Switch } from '../../app/components/ui/switch';
import { users, regions, categories, roles } from '../../data/mockData';
import { toast } from 'sonner';

export const AdminPanel: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'user' | 'region' | 'category'>('user');

  const handleToggleUser = (userId: number, enabled: boolean) => {
    toast.success(`Utilisateur ${enabled ? 'activé' : 'désactivé'}`);
  };

  const handleDeleteRegion = (regionId: number) => {
    toast.success('Région supprimée');
  };

  const handleDeleteCategory = (categoryId: number) => {
    toast.success('Catégorie supprimée');
  };

  const openDialog = (type: 'user' | 'region' | 'category') => {
    setDialogType(type);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1>Administration</h1>
          <p className="text-muted-foreground mt-1">
            Gérer les utilisateurs, régions et catégories
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="regions">
              <MapPin className="mr-2 h-4 w-4" />
              Régions
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Tag className="mr-2 h-4 w-4" />
              Catégories
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <Button onClick={() => openDialog('user')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Rôles</TableHead>
                        <TableHead>Date inscription</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {user.prenom[0]}{user.nom[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{user.prenom} {user.nom}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.telephone}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map(role => (
                                <Badge key={role.id} variant="outline" className="text-xs">
                                  {role.nom.replace('ROLE_', '')}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(user.date_inscription).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={user.enabled}
                                onCheckedChange={(checked) => handleToggleUser(user.id, checked)}
                              />
                              <span className="text-sm text-muted-foreground">
                                {user.enabled ? 'Actif' : 'Désactivé'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regions Tab */}
          <TabsContent value="regions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des régions</CardTitle>
                <Button onClick={() => openDialog('region')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regions.map(region => (
                        <TableRow key={region.id}>
                          <TableCell className="font-semibold">{region.nom}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{region.code}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteRegion(region.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des catégories</CardTitle>
                <Button onClick={() => openDialog('category')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map(category => (
                    <Card key={category.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">{category.nom}</CardTitle>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Generic Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Ajouter {dialogType === 'user' ? 'un utilisateur' : dialogType === 'region' ? 'une région' : 'une catégorie'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {dialogType === 'region' && (
                <>
                  <div>
                    <Label>Nom de la région</Label>
                    <Input placeholder="Ex: Casablanca-Settat" className="mt-2" />
                  </div>
                  <div>
                    <Label>Code</Label>
                    <Input placeholder="Ex: CAS" className="mt-2" maxLength={3} />
                  </div>
                </>
              )}
              {dialogType === 'category' && (
                <>
                  <div>
                    <Label>Nom de la catégorie</Label>
                    <Input placeholder="Ex: Concert" className="mt-2" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Description..." className="mt-2" rows={3} />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                toast.success('Créé avec succès');
                setDialogOpen(false);
              }}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
