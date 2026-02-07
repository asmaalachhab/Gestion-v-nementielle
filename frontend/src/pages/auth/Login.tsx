import { useState } from 'react';
import { Eye, EyeOff, LogIn, X } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../app/components/ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [registerData, setRegisterData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        toast.success('Connexion réussie !');
        onSuccess();
        onClose();
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setRegisterLoading(true);

    try {
      const success = await register(registerData);
      if (success) {
        toast.success('Inscription réussie ! Vous êtes maintenant connecté.');
        onSuccess();
        onClose();
      } else {
        toast.error('Cet email est déjà utilisé');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connexion</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Se connecter</TabsTrigger>
            <TabsTrigger value="register">S'inscrire</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="votre@email.ma"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="login-password">Mot de passe</Label>
                <div className="relative mt-2">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="button" variant="link" className="px-0 text-sm">
                Mot de passe oublié ?
              </Button>

              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? (
                  'Connexion...'
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Se connecter
                  </>
                )}
              </Button>

              <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                <p className="font-semibold mb-2">Comptes de test :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Client: client@example.ma / password123</li>
                  <li>• Organisateur: organisateur@example.ma / password123</li>
                  <li>• Admin: admin@example.ma / password123</li>
                </ul>
              </div>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="register-prenom">Prénom</Label>
                  <Input
                    id="register-prenom"
                    type="text"
                    placeholder="Mohamed"
                    value={registerData.prenom}
                    onChange={(e) => setRegisterData({ ...registerData, prenom: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="register-nom">Nom</Label>
                  <Input
                    id="register-nom"
                    type="text"
                    placeholder="Alami"
                    value={registerData.nom}
                    onChange={(e) => setRegisterData({ ...registerData, nom: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="votre@email.ma"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="register-telephone">Téléphone</Label>
                <Input
                  id="register-telephone"
                  type="tel"
                  placeholder="+212 6 12 34 56 78"
                  value={registerData.telephone}
                  onChange={(e) => setRegisterData({ ...registerData, telephone: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="register-password">Mot de passe</Label>
                <div className="relative mt-2">
                  <Input
                    id="register-password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="register-confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <Button type="submit" className="w-full" disabled={registerLoading}>
                {registerLoading ? 'Inscription...' : 'S\'inscrire'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
