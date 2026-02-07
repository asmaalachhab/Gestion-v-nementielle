package ma.eventma.repository;

import ma.eventma.model.Statistique;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface StatistiqueRepository extends JpaRepository<Statistique, Long> {
  Optional<Statistique> findByEventIdAndDateConsultation(Long eventId, LocalDate dateConsultation);
}
