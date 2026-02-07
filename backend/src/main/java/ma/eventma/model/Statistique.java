package ma.eventma.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "statistiques")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Statistique {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "date_consultation", nullable = false)
  private LocalDate dateConsultation;

  @Column(name = "nb_vues")
  private Integer nbVues = 0;

  @Column(name = "nb_reservations")
  private Integer nbReservations = 0;

  @Column(name = "chiffre_affaires", precision = 12, scale = 2)
  private BigDecimal chiffreAffaires = BigDecimal.ZERO;

  @ManyToOne(optional = false)
  @JoinColumn(name = "event_id")
  private Event event;
}
