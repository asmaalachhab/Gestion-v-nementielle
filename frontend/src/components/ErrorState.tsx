import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';

interface ErrorStateProps {
  code?: number;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  code, 
  title, 
  message, 
  onRetry, 
  onGoHome 
}) => {
  // Messages d'erreur par code HTTP
  const getErrorInfo = () => {
    switch (code) {
      case 400:
        return {
          title: 'Requête invalide',
          message: 'Les données envoyées sont incorrectes. Veuillez vérifier vos informations.',
        };
      case 401:
        return {
          title: 'Non authentifié',
          message: 'Vous devez vous connecter pour accéder à cette page.',
        };
      case 403:
        return {
          title: 'Accès refusé',
          message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.',
        };
      case 404:
        return {
          title: 'Page non trouvée',
          message: 'La page ou la ressource que vous recherchez n\'existe pas.',
        };
      case 409:
        return {
          title: 'Conflit',
          message: 'Cette action ne peut pas être effectuée en raison d\'un conflit avec l\'état actuel.',
        };
      case 422:
        return {
          title: 'Données non valides',
          message: 'Les données fournies ne respectent pas les règles de validation.',
        };
      case 500:
        return {
          title: 'Erreur serveur',
          message: 'Une erreur interne s\'est produite. Veuillez réessayer plus tard.',
        };
      case 503:
        return {
          title: 'Service indisponible',
          message: 'Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.',
        };
      default:
        return {
          title: title || 'Une erreur est survenue',
          message: message || 'Une erreur inattendue s\'est produite.',
        };
    }
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            
            {code && (
              <div className="text-sm text-muted-foreground mb-2">
                Erreur {code}
              </div>
            )}
            
            <h3 className="mb-2">{errorInfo.title}</h3>
            <p className="text-muted-foreground mb-6">
              {errorInfo.message}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {onRetry && (
                <Button onClick={onRetry} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réessayer
                </Button>
              )}
              {onGoHome && (
                <Button onClick={onGoHome} variant="outline" className="flex-1">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
