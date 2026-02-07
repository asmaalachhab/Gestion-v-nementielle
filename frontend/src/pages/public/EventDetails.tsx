import { Calendar, MapPin, Eye, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import { Separator } from '../../app/components/ui/separator';
import { OfferCard } from '../../components/OfferCard';
import { EventCard } from '../../components/EventCard';
import { StatusBadge } from '../../components/StatusBadge';
import { getEventById, getCategoryById, getRegionById, getOffersByEventId, getUserById, events } from '../../data/mockData';

interface EventDetailsProps {
  eventId: number;
  onBack: () => void;
  onReserve: (offerId: number) => void;
  onViewEventDetails: (eventId: number) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ 
  eventId, 
  onBack, 
  onReserve,
  onViewEventDetails 
}) => {
  const event = getEventById(eventId);
  
  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Événement non trouvé</h2>
          <Button onClick={onBack}>Retour</Button>
        </div>
      </div>
    );
  }

  const category = getCategoryById(event.categorie_id);
  const region = getRegionById(event.region_id);
  const offers = getOffersByEventId(event.id);
  const organisateur = getUserById(event.organisateur_id);

  // Événements similaires (même catégorie)
  const similarEvents = events
    .filter(e => e.categorie_id === event.categorie_id && e.id !== event.id && e.statut === 'PUBLIE')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto max-w-7xl py-4 px-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={event.image_url}
          alt={event.titre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 container mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {category && (
              <Badge className="bg-primary text-primary-foreground">
                {category.nom}
              </Badge>
            )}
            {region && (
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                {region.nom}
              </Badge>
            )}
            <StatusBadge status={event.statut} type="event" />
          </div>
          <h1 className="text-white text-4xl lg:text-5xl drop-shadow-lg">
            {event.titre}
          </h1>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-semibold truncate">
                      {new Date(event.date_event).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">Heure</p>
                    <p className="font-semibold">{event.heure_debut}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">Vues</p>
                    <p className="font-semibold">{event.nb_vues.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="mb-1">Lieu</h3>
                  <p className="text-muted-foreground">{event.lieu}</p>
                </div>
              </div>
              {/* Map Placeholder */}
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <MapPin className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>

            {/* Description */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="mb-4">À propos de cet événement</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Organisateur */}
            {organisateur && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="mb-4">Organisé par</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {organisateur.prenom[0]}{organisateur.nom[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{organisateur.prenom} {organisateur.nom}</p>
                    <p className="text-sm text-muted-foreground">{organisateur.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Offers */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card border rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3>Billets disponibles</h3>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {offers.length > 0 ? (
                  <div className="space-y-4">
                    {offers.map(offer => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        onReserve={onReserve}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune offre disponible pour le moment
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Events */}
        {similarEvents.length > 0 && (
          <>
            <Separator className="my-12" />
            <div>
              <h2 className="mb-6">Événements similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={onViewEventDetails}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
