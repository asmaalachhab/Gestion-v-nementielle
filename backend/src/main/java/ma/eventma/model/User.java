package ma.eventma.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nom", nullable = false, length = 100)
  private String nom;

  @Column(name = "prenom", nullable = false, length = 100)
  private String prenom;

  @Column(name = "email", nullable = false, unique = true, length = 150)
  private String email;

  @Column(name = "password", nullable = false, length = 255)
  private String password;

  @Column(name = "telephone", length = 20)
  private String telephone;

  @Column(name = "enabled")
  private Boolean enabled = true;

  @Column(name = "date_inscription")
  private LocalDateTime dateInscription;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id")
  )
  @Builder.Default
  private Set<Role> roles = new HashSet<>();
}
