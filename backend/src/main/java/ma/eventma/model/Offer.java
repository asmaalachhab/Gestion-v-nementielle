package ma.eventma.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "offers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Offer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "type_billet", nullable = false, length = 100)
  private String typeBillet;

  @Column(name = "prix", nullable = false, precision = 10, scale = 2)
  private BigDecimal prix;

  @Column(name = "places_initiales", nullable = false)
  private Integer placesInitiales;

  @Column(name = "places_disponibles", nullable = false)
  private Integer placesDisponibles;

  @Column(name = "date_expiration", nullable = false)
  private LocalDate dateExpiration;

  @ManyToOne(optional = false)
  @JoinColumn(name = "event_id")
  private Event event;
}
