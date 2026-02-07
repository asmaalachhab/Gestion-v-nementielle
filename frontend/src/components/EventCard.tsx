import { Calendar, MapPin, Eye } from 'lucide-react';
import { Card, CardContent } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Button } from '../app/components/ui/button';
import { Event, getCategoryById, getRegionById, getOffersByEventId } from '../data/mockData';

interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: number) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  const category = getCategoryById(event.categorie_id);
  const region = getRegionById(event.region_id);
  const offers = getOffersByEventId(event.id);
  const minPrice = offers.length > 0 ? Math.min(...offers.map(o => o.prix)) : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image_url}
          alt={event.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          {category && (
            <Badge className="bg-primary text-primary-foreground">
              {category.nom}
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {event.statut}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-1">{event.titre}</h3>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(event.date_event).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })} • {event.heure_debut}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.lieu}</span>
          </div>
          
          {region && (
            <Badge variant="outline" className="text-xs">
              {region.nom}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{event.nb_vues.toLocaleString()}</span>
            </div>
            {minPrice > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">À partir de </span>
                <span className="font-semibold text-primary">{minPrice} DH</span>
              </div>
            )}
          </div>
          
          <Button 
            size="sm" 
            onClick={() => onViewDetails(event.id)}
          >
            Voir détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};