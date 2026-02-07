import { Badge } from '../app/components/ui/badge';

type EventStatus = 'BROUILLON' | 'PUBLIE' | 'ANNULE' | 'TERMINE';
type ReservationStatus = 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'EXPIREE';

interface StatusBadgeProps {
  status: EventStatus | ReservationStatus;
  type: 'event' | 'reservation';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  const getVariant = () => {
    if (type === 'event') {
      switch (status) {
        case 'PUBLIE':
          return 'default';
        case 'BROUILLON':
          return 'secondary';
        case 'ANNULE':
          return 'destructive';
        case 'TERMINE':
          return 'outline';
        default:
          return 'secondary';
      }
    } else {
      switch (status) {
        case 'CONFIRMEE':
          return 'default';
        case 'EN_ATTENTE':
          return 'secondary';
        case 'ANNULEE':
        case 'EXPIREE':
          return 'destructive';
        default:
          return 'secondary';
      }
    }
  };

  const getLabel = () => {
    const labels: Record<string, string> = {
      BROUILLON: 'Brouillon',
      PUBLIE: 'Publié',
      ANNULE: 'Annulé',
      TERMINE: 'Terminé',
      EN_ATTENTE: 'En attente',
      CONFIRMEE: 'Confirmée',
      ANNULEE: 'Annulée',
      EXPIREE: 'Expirée',
    };
    return labels[status] || status;
  };

  const variant = getVariant();
  const className = variant === 'default' ? 'bg-secondary text-secondary-foreground' : '';

  return (
    <Badge variant={variant} className={className}>
      {getLabel()}
    </Badge>
  );
};