import { useMemo, useState } from 'react';
import { User as UserIcon, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import { Separator } from '../../app/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../app/components/ui/dialog';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export const Profile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  const [editPrenom, setEditPrenom] = useState('');
  const [editNom, setEditNom] = useState('');
  const [editTelephone, setEditTelephone] = useState('');

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const initials = useMemo(() => {
    if (!user) return '';
    return `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`;
  }, [user]);

  if (!user) {
    return null;
  }

  const openEdit = () => {
    setEditPrenom(user.prenom);
    setEditNom(user.nom);
    setEditTelephone(user.telephone);
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    const ok = await updateProfile({
      prenom: editPrenom.trim(),
      nom: editNom.trim(),
      telephone: editTelephone.trim(),
    });

    if (ok) {
      toast.success('Profil mis à jour');
      setEditOpen(false);
    } else {
      toast.error('Impossible de modifier le profil');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    if (newPwd.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error('La confirmation ne correspond pas');
      return;
    }

    const result = await changePassword(currentPwd, newPwd);
    if (result.ok) {
      toast.success('Mot de passe modifié');
      setPwdOpen(false);
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } else {
      toast.error(result.error || 'Impossible de modifier le mot de passe');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-8">Mon profil</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {initials}
                  </span>
                </div>
                <div>
                  <h3>{user.prenom} {user.nom}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-semibold">{user.prenom} {user.nom}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-semibold">{user.telephone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Membre depuis</p>
                    <p className="font-semibold">
                      {new Date(user.date_inscription).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <Button variant="outline" className="w-full" onClick={openEdit}>
                Modifier mes informations
              </Button>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statut du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  <div className="flex-1">
                    <Badge 
                      variant={user.enabled ? 'default' : 'destructive'}
                      className={user.enabled ? 'bg-secondary text-secondary-foreground' : ''}
                    >
                      {user.enabled ? 'Actif' : 'Désactivé'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rôles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {user.roles.map(role => (
                  <Badge key={role.id} variant="outline" className="w-full justify-start">
                    {role.nom.replace('ROLE_', '')}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setPwdOpen(true)}>
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier mes informations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Prénom</Label>
                  <Input value={editPrenom} onChange={(e) => setEditPrenom(e.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input value={editNom} onChange={(e) => setEditNom(e.target.value)} className="mt-2" />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input value={user.email} disabled className="mt-2" />
              </div>

              <div>
                <Label>Téléphone</Label>
                <Input value={editTelephone} onChange={(e) => setEditTelephone(e.target.value)} className="mt-2" />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>
                  Annuler
                </Button>
                <Button className="flex-1" onClick={handleSaveProfile}>
                  Enregistrer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Change Password Modal */}
        <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Changer le mot de passe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Mot de passe actuel</Label>
                <Input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label>Nouveau mot de passe</Label>
                <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label>Confirmer le nouveau mot de passe</Label>
                <Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="mt-2" />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setPwdOpen(false)}>
                  Annuler
                </Button>
                <Button className="flex-1" onClick={handleChangePassword}>
                  Modifier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
