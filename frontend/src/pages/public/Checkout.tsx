import { useState } from 'react';
import { ArrowLeft, Check, Ticket, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Separator } from '../../app/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../app/components/ui/dialog';
import { getOfferById, getEventById } from '../../data/mockData';
import { addReservation } from '../../data/storage';
import { useAuth } from '../../contexts/AuthContext';

interface CheckoutProps {
  offerId: number;
  onBack: () => void;
  onComplete: () => void;
  onLoginRequired: () => void;
}

type Step = 1 | 2 | 3;

export const Checkout: React.FC<CheckoutProps> = ({ offerId, onBack, onComplete, onLoginRequired }) => {
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [nbPlaces, setNbPlaces] = useState(1);
  const [reservationCode, setReservationCode] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const offer = getOfferById(offerId);
  const event = offer ? getEventById(offer.event_id) : null;

  if (!offer || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Offre non trouvée</h2>
          <Button onClick={onBack}>Retour</Button>
        </div>
      </div>
    );
  }

  const montantTotal = offer.prix * nbPlaces;
  const isExpired = new Date(offer.date_expiration) < new Date();
  const isOutOfStock = offer.places_disponibles === 0;
  const hasError = isExpired || isOutOfStock || nbPlaces > offer.places_disponibles;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!isAuthenticated) {
        onLoginRequired();
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Enregistrer la réservation (persistée dans localStorage)
      if (user) {
        const created = addReservation({
          user_id: user.id,
          offer_id: offer.id,
          nb_places: nbPlaces,
          montant_total: montantTotal,
        });
        setReservationCode(created.code_reservation);
      }
      setCurrentStep(3);
      setShowSuccessModal(true);
    }
  };

  const steps = [
    { number: 1, title: 'Choix de l\'offre', icon: Ticket },
    { number: 2, title: 'Informations', icon: CreditCard },
    { number: 3, title: 'Confirmation', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto max-w-5xl py-4 px-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted
                          ? 'bg-secondary border-secondary text-white'
                          : isActive
                          ? 'bg-primary border-primary text-white'
                          : 'bg-background border-border text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <p className={`mt-2 text-sm ${isActive ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-24 h-0.5 mx-4 mb-6 ${
                        isCompleted ? 'bg-secondary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Offre */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sélection du nombre de places</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="nbPlaces">Nombre de places</Label>
                    <Input
                      id="nbPlaces"
                      type="number"
                      min="1"
                      max={offer.places_disponibles}
                      value={nbPlaces}
                      onChange={(e) => setNbPlaces(Math.max(1, parseInt(e.target.value) || 1))}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Maximum: {offer.places_disponibles} places disponibles
                    </p>
                  </div>

                  {nbPlaces > offer.places_disponibles && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                      Pas assez de places disponibles. Maximum: {offer.places_disponibles}
                    </div>
                  )}

                  {isExpired && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                      Cette offre a expiré le {new Date(offer.date_expiration).toLocaleDateString('fr-FR')}
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    onClick={handleNextStep}
                    disabled={hasError}
                  >
                    Continuer
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Informations */}
            {currentStep === 2 && isAuthenticated && user && (
              <Card>
                <CardHeader>
                  <CardTitle>Vos informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Prénom</Label>
                      <Input value={user.prenom} disabled className="mt-2" />
                    </div>
                    <div>
                      <Label>Nom</Label>
                      <Input value={user.nom} disabled className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input value={user.email} disabled className="mt-2" />
                  </div>

                  <div>
                    <Label>Téléphone</Label>
                    <Input value={user.telephone} disabled className="mt-2" />
                  </div>

                  <Separator />

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Note: Dans une implémentation réelle, vous pourriez ajouter ici les informations de paiement.
                      Pour cette démo, la réservation sera confirmée directement.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      Retour
                    </Button>
                    <Button onClick={handleNextStep} className="flex-1">
                      Confirmer la réservation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary">
                    <CheckCircle2 className="h-6 w-6" />
                    Réservation confirmée !
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Votre code de réservation</p>
                    <p className="text-2xl font-bold text-secondary">{reservationCode}</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Un email de confirmation a été envoyé à {user?.email}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Événement</span>
                      <span className="font-semibold">{event.titre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type de billet</span>
                      <span className="font-semibold">{offer.type_billet}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre de places</span>
                      <span className="font-semibold">{nbPlaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Montant total</span>
                      <span className="font-semibold text-primary">{montantTotal} DH</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={onComplete}>
                    Voir mes réservations
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Récapitulatif */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <img
                    src={event.image_url}
                    alt={event.titre}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="mb-2">{event.titre}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date_event).toLocaleDateString('fr-FR')} • {event.heure_debut}
                  </p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{offer.type_billet}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix unitaire</span>
                      <span>{offer.prix} DH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre de places</span>
                      <span>{nbPlaces}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">{montantTotal} DH</span>
                </div>

                <Badge variant="outline" className="w-full justify-center text-xs">
                  Expire le {new Date(offer.date_expiration).toLocaleDateString('fr-FR')}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-secondary">
              <CheckCircle2 className="h-6 w-6" />
              Réservation réussie !
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-12 w-12 text-secondary" />
            </div>
            <p className="text-muted-foreground mb-6">
              Votre réservation a été confirmée avec succès.
            </p>
            <Button onClick={() => {
              setShowSuccessModal(false);
              onComplete();
            }}>
              Voir mes réservations
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
