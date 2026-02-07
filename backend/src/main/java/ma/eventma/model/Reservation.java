package ma.eventma.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reservation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "code_reservation", nullable = false, unique = true, length = 50)
  private String codeReservation;

  @Column(name = "date_reservation")
  private LocalDateTime dateReservation;

  @Column(name = "nb_places", nullable = false)
  private Integer nbPlaces;

  @Column(name = "montant_total", nullable = false, precision = 10, scale = 2)
  private BigDecimal montantTotal;

  @Enumerated(EnumType.STRING)
  @Column(name = "statut")
  private ReservationStatus statut = ReservationStatus.EN_ATTENTE;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne(optional = false)
  @JoinColumn(name = "offer_id")
  private Offer offer;
}
