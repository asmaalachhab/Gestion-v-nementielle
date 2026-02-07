package ma.eventma.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "regions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Region {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nom", nullable = false, length = 100)
  private String nom;

  @Column(name = "code", nullable = false, length = 10)
  private String code;
}
