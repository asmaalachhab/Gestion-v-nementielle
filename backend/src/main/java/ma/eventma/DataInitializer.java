package ma.eventma;

import ma.eventma.model.*;
import ma.eventma.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Configuration
public class DataInitializer {

  @Bean
  CommandLineRunner initData(RoleRepository roleRepo, UserRepository userRepo, CategoryRepository catRepo, RegionRepository regionRepo,
                             EventRepository eventRepo, OfferRepository offerRepo, PasswordEncoder encoder) {
    return args -> {
      // Roles
      for (RoleName rn : RoleName.values()) {
        roleRepo.findByNom(rn).orElseGet(() -> roleRepo.save(Role.builder().nom(rn).build()));
      }

      // Categories
      if (catRepo.count() == 0) {
        catRepo.saveAll(List.of(
            Category.builder().nom("Concert").description("Concerts et festivals").build(),
            Category.builder().nom("Sport").description("Événements sportifs").build(),
            Category.builder().nom("Spectacle").description("Théâtre, humour, show").build(),
            Category.builder().nom("Exposition").description("Expositions et salons").build()
        ));
      }

      // Regions
      if (regionRepo.count() == 0) {
        regionRepo.saveAll(List.of(
            Region.builder().nom("Casablanca-Settat").code("CS").build(),
            Region.builder().nom("Rabat-Salé-Kénitra").code("RSK").build(),
            Region.builder().nom("Marrakech-Safi").code("MS").build(),
            Region.builder().nom("Tanger-Tétouan-Al Hoceïma").code("TTA").build()
        ));
      }

      // Demo users
      if (userRepo.count() == 0) {
        Role adminRole = roleRepo.findByNom(RoleName.ADMIN).orElseThrow();
        Role orgRole = roleRepo.findByNom(RoleName.ORGANISATEUR).orElseThrow();
        Role clientRole = roleRepo.findByNom(RoleName.CLIENT).orElseThrow();

        User admin = User.builder()
            .nom("Admin")
            .prenom("EventMa")
            .email("admin@example.ma")
            .password(encoder.encode("password"))
            .telephone("0600000000")
            .enabled(true)
            .dateInscription(LocalDateTime.now())
            .build();
        admin.getRoles().add(adminRole);

        User organizer = User.builder()
            .nom("Organizer")
            .prenom("EventMa")
            .email("org@example.ma")
            .password(encoder.encode("password"))
            .telephone("0611111111")
            .enabled(true)
            .dateInscription(LocalDateTime.now())
            .build();
        organizer.getRoles().add(orgRole);

        User client = User.builder()
            .nom("Client")
            .prenom("EventMa")
            .email("client@example.ma")
            .password(encoder.encode("password"))
            .telephone("0622222222")
            .enabled(true)
            .dateInscription(LocalDateTime.now())
            .build();
        client.getRoles().add(clientRole);

        userRepo.saveAll(List.of(admin, organizer, client));
      }

      // Demo events + offers
      if (eventRepo.count() == 0) {
        User organizer = userRepo.findByEmail("org@example.ma").orElseThrow();
        Category concert = catRepo.findAll().get(0);
        Region casa = regionRepo.findAll().get(0);

        Event e1 = Event.builder()
            .titre("Festival Casablanca Night")
            .description("Un festival musical à Casablanca")
            .dateEvent(LocalDate.now().plusDays(10))
            .heureDebut(LocalTime.of(20, 0))
            .lieu("Casablanca")
            .imageUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745")
            .nbVues(124)
            .statut(EventStatus.PUBLIE)
            .categorie(concert)
            .region(casa)
            .organisateur(organizer)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        Event e2 = Event.builder()
            .titre("Match de football")
            .description("Match amical au stade")
            .dateEvent(LocalDate.now().plusDays(20))
            .heureDebut(LocalTime.of(18, 30))
            .lieu("Rabat")
            .imageUrl("https://images.unsplash.com/photo-1521412644187-c49fa049e84d")
            .nbVues(77)
            .statut(EventStatus.PUBLIE)
            .categorie(catRepo.findAll().stream().filter(c -> c.getNom().equalsIgnoreCase("Sport")).findFirst().orElse(concert))
            .region(regionRepo.findAll().get(1))
            .organisateur(organizer)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        e1 = eventRepo.save(e1);
        e2 = eventRepo.save(e2);

        offerRepo.saveAll(List.of(
            Offer.builder().event(e1).typeBillet("Standard").prix(new BigDecimal("150.00")).placesInitiales(200).placesDisponibles(200).dateExpiration(LocalDate.now().plusDays(9)).build(),
            Offer.builder().event(e1).typeBillet("VIP").prix(new BigDecimal("400.00")).placesInitiales(50).placesDisponibles(50).dateExpiration(LocalDate.now().plusDays(9)).build(),
            Offer.builder().event(e2).typeBillet("Tribune").prix(new BigDecimal("80.00")).placesInitiales(500).placesDisponibles(500).dateExpiration(LocalDate.now().plusDays(19)).build()
        ));
      }
    };
  }
}
