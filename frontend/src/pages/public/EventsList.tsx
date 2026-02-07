import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../app/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../app/components/ui/sheet';
import { EventCard } from '../../components/EventCard';
import { EmptyState } from '../../components/EmptyState';
import { events, categories, regions } from '../../data/mockData';
import { Calendar } from 'lucide-react';

interface EventsListProps {
  onViewEventDetails: (eventId: number) => void;
}

export const EventsList: React.FC<EventsListProps> = ({ onViewEventDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'popularity' | 'price'>('date');

  // Filtrage des événements
  const filteredEvents = events
    .filter(e => e.statut === 'PUBLIE')
    .filter(e => {
      if (searchQuery) {
        return e.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
               e.description.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(e => selectedRegion === 'all' || String(e.region_id) === selectedRegion)
    .filter(e => selectedCategory === 'all' || String(e.categorie_id) === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date_event).getTime() - new Date(b.date_event).getTime();
        case 'popularity':
          return b.nb_vues - a.nb_vues;
        case 'price':
          return 0; // Simplified for mock
        default:
          return 0;
      }
    });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedCategory('all');
    setSortBy('date');
  };

  const hasActiveFilters = searchQuery || selectedRegion !== 'all' || selectedCategory !== 'all';

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">Recherche</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2">Région</label>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes les régions" />
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
        <label className="block mb-2">Catégorie</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes les catégories" />
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

      <div>
        <label className="block mb-2">Trier par</label>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="popularity">Popularité</SelectItem>
            <SelectItem value="price">Prix</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          <X className="mr-2 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Tous les événements</h1>
          <p className="text-muted-foreground">
            {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h3>Filtres</h3>
              </div>
              <FiltersContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filtres
                    {hasActiveFilters && (
                      <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                        Actifs
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={onViewEventDetails}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="Aucun événement trouvé"
                description="Essayez de modifier vos critères de recherche ou réinitialisez les filtres."
                action={hasActiveFilters ? {
                  label: "Réinitialiser les filtres",
                  onClick: resetFilters
                } : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
