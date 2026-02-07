import { useState } from 'react';
import { Menu, X, Calendar, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onLoginClick }) => {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('landing');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-primary">EventMa</h2>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('events')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Événements
            </button>
            
            {isAuthenticated ? (
              <>
                {hasRole('ROLE_ORGANISATEUR') && (
                  <button
                    onClick={() => onNavigate('organizer-dashboard')}
                    className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>
                )}
                
                {hasRole('ROLE_ADMIN') && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </button>
                )}

                <div className="flex items-center gap-2 pl-4 border-l">
                  <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {user?.prenom[0]}{user?.nom[0]}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">{user?.prenom}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('reservations')}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Mes réservations
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={onLoginClick}>
                <User className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
            )}

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="px-3 py-1 bg-muted rounded text-sm hover:bg-muted/80 transition-colors"
            >
              {language.toUpperCase()}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onNavigate('events');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left hover:bg-muted rounded-lg transition-colors"
              >
                Événements
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-left hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Mon profil
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('reservations');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-left hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Mes réservations
                  </button>

                  {hasRole('ROLE_ORGANISATEUR') && (
                    <button
                      onClick={() => {
                        onNavigate('organizer-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-left hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard organisateur
                    </button>
                  )}

                  {hasRole('ROLE_ADMIN') && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-left hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Administration
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-left hover:bg-muted rounded-lg transition-colors flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-left hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Se connecter
                </button>
              )}

              <button
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="px-4 py-2 text-left hover:bg-muted rounded-lg transition-colors"
              >
                Langue: {language === 'fr' ? 'Français' : 'العربية'}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
