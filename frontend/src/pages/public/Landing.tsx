import { useState } from 'react';
import { Search, Calendar as CalendarIcon, MapPin, Tag, TrendingUp, Sparkles, MapPinned } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../app/components/ui/select';
import { EventCard } from '../../components/EventCard';
import { events, categories, regions } from '../../data/mockData';

interface LandingProps {
  onViewEventDetails: (eventId: number) => void;
  onViewAllEvents: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onViewEventDetails, onViewAllEvents }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Événements triés par vues (tendances)
  const trendingEvents = [...events]
    .filter(e => e.statut === 'PUBLIE')
    .sort((a, b) => b.nb_vues - a.nb_vues)
    .slice(0, 3);

  // Nouveaux événements
  const newEvents = [...events]
    .filter(e => e.statut === 'PUBLIE')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Événements par région (exemple: Casablanca)
  const eventsByRegion = events
    .filter(e => e.statut === 'PUBLIE' && e.region_id === 1)
    .slice(0, 3);

  const handleSearch = () => {
    onViewAllEvents();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-[url('https://www.digitechlab.fr/wp-content/uploads/2024/10/organiser-evenement.png')] bg-cover bg-center opacity-15" />
        {/* Soft overlay to keep readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background/85 to-secondary/15" />
        <div className="relative">

        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Découvrez des événements<br />partout au Maroc
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Concerts, festivals, conférences, expositions et bien plus encore
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="bg-card rounded-xl shadow-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <SelectValue placeholder="Région" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={String(region.id)}>
                        {region.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <SelectValue placeholder="Catégorie" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>
              </div>
      </section>

      {/* Trending Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2>Événements populaires</h2>
              <p className="text-muted-foreground">Les plus consultés en ce moment</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={onViewEventDetails}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" onClick={onViewAllEvents}>
              Voir tous les événements
            </Button>
          </div>
        </div>
      </section>

      {/* New Events */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h2>Nouveaux événements</h2>
              <p className="text-muted-foreground">Découvrez les dernières annonces</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={onViewEventDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Events by Region */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPinned className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2>Événements à Casablanca-Settat</h2>
              <p className="text-muted-foreground">Découvrez ce qui se passe près de chez vous</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsByRegion.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={onViewEventDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="mb-2">Explorer par catégorie</h2>
            <p className="text-muted-foreground">Trouvez l'événement qui vous correspond</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => {
              const categoryEvents = events.filter(e => e.categorie_id === category.id && e.statut === 'PUBLIE');
              return (
                <div
                  key={category.id}
                  className="p-6 bg-card rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={onViewAllEvents}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Tag className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-1">{category.nom}</h3>
                    <p className="text-sm text-muted-foreground">{categoryEvents.length} événements</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
