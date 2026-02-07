import { Calendar, Ticket, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Button } from '../app/components/ui/button';
import { Offer } from '../data/mockData';

interface OfferCardProps {
  offer: Offer;
  onReserve: (offerId: number) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onReserve }) => {
  const isExpiringSoon = new Date(offer.date_expiration) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isLowStock = offer.places_disponibles < 10;
  const isExpired = new Date(offer.date_expiration) < new Date();
  const isOutOfStock = offer.places_disponibles === 0;

  return (
    <Card className={`${(isExpired || isOutOfStock) ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              {offer.type_billet}
            </CardTitle>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{offer.prix} DH</div>
            <div className="text-xs text-muted-foreground">par billet</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Places disponibles</span>
          <span className={`font-semibold ${isLowStock ? 'text-destructive' : ''}`}>
            {offer.places_disponibles} / {offer.places_initial}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Expire le {new Date(offer.date_expiration).toLocaleDateString('fr-FR')}
          </span>
        </div>
        
        {(isExpiringSoon || isLowStock) && !isExpired && !isOutOfStock && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {isLowStock && 'Plus que quelques places disponibles ! '}
              {isExpiringSoon && 'Offre expire bientôt.'}
            </span>
          </div>
        )}
        
        {isExpired && (
          <Badge variant="destructive" className="w-full justify-center">
            Offre expirée
          </Badge>
        )}
        
        {isOutOfStock && !isExpired && (
          <Badge variant="destructive" className="w-full justify-center">
            Complet
          </Badge>
        )}
        
        <Button 
          className="w-full" 
          onClick={() => onReserve(offer.id)}
          disabled={isExpired || isOutOfStock}
        >
          {isExpired ? 'Expirée' : isOutOfStock ? 'Complet' : 'Réserver'}
        </Button>
      </CardContent>
    </Card>
  );
};