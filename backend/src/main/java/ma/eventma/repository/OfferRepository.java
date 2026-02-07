package ma.eventma.repository;

import ma.eventma.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
  List<Offer> findByEventId(Long eventId);
}
