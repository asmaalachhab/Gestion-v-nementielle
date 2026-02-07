package ma.eventma.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "titre", nullable = false, length = 200)
  private String titre;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "date_event", nullable = false)
  private LocalDate dateEvent;

  @Column(name = "heure_debut", nullable = false)
  private LocalTime heureDebut;

  @Column(name = "lieu", nullable = false, length = 255)
  private String lieu;

  @Column(name = "image_url", length = 255)
  private String imageUrl;

  @Column(name = "nb_vues")
  private Integer nbVues = 0;

  @Enumerated(EnumType.STRING)
  @Column(name = "statut")
  private EventStatus statut = EventStatus.BROUILLON;

  @ManyToOne(optional = false)
  @JoinColumn(name = "categorie_id")
  private Category categorie;

  @ManyToOne(optional = false)
  @JoinColumn(name = "region_id")
  private Region region;

  @ManyToOne(optional = false)
  @JoinColumn(name = "organisateur_id")
  private User organisateur;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}
