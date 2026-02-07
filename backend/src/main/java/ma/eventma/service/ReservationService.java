package ma.eventma.service;

import ma.eventma.dto.ReservationDtos;
import ma.eventma.model.*;
import ma.eventma.repository.OfferRepository;
import ma.eventma.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {

  private final ReservationRepository reservationRepository;
  private final OfferRepository offerRepository;

  public ReservationService(ReservationRepository reservationRepository, OfferRepository offerRepository) {
    this.reservationRepository = reservationRepository;
    this.offerRepository = offerRepository;
  }

  @Transactional
  public ReservationDtos.ReservationSummary create(User client, ReservationDtos.CreateReservationRequest req) {
    Offer offer = offerRepository.findById(req.offerId()).orElseThrow(() -> new IllegalArgumentException("Offre introuvable"));
    if (offer.getPlacesDisponibles() < req.nbPlaces()) {
      throw new IllegalArgumentException("Places insuffisantes");
    }

    offer.setPlacesDisponibles(offer.getPlacesDisponibles() - req.nbPlaces());
    offerRepository.save(offer);

    BigDecimal amount = offer.getPrix().multiply(BigDecimal.valueOf(req.nbPlaces()));

    Reservation r = Reservation.builder()
        .codeReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
        .dateReservation(LocalDateTime.now())
        .nbPlaces(req.nbPlaces())
        .montantTotal(amount)
        .statut(ReservationStatus.CONFIRMEE)
        .user(client)
        .offer(offer)
        .build();
    r = reservationRepository.save(r);
    return toSummary(r);
  }

  public List<ReservationDtos.ReservationSummary> myReservations(User client) {
    return reservationRepository.findByUserIdOrderByDateReservationDesc(client.getId()).stream().map(ReservationService::toSummary).toList();
  }

  @Transactional
  public ReservationDtos.ReservationSummary cancel(User client, Long reservationId) {
    Reservation r = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("Reservation introuvable"));
    if (!r.getUser().getId().equals(client.getId())) {
      throw new IllegalArgumentException("Accès interdit");
    }
    if (r.getStatut() == ReservationStatus.ANNULEE) {
      return toSummary(r);
    }

    Event ev = r.getOffer().getEvent();
    LocalDateTime eventDateTime = LocalDateTime.of(ev.getDateEvent(), ev.getHeureDebut());
    LocalDateTime limit = eventDateTime.minusHours(24);
    if (LocalDateTime.now().isAfter(limit)) {
      throw new IllegalArgumentException("Annulation impossible: moins de 24h avant l'événement");
    }

    // restore seats
    Offer offer = r.getOffer();
    offer.setPlacesDisponibles(offer.getPlacesDisponibles() + r.getNbPlaces());
    offerRepository.save(offer);

    r.setStatut(ReservationStatus.ANNULEE);
    r = reservationRepository.save(r);
    return toSummary(r);
  }

  public static ReservationDtos.ReservationSummary toSummary(Reservation r) {
    Offer o = r.getOffer();
    Event e = o.getEvent();
    return new ReservationDtos.ReservationSummary(
        r.getId(), r.getCodeReservation(), r.getDateReservation(), r.getNbPlaces(), r.getMontantTotal(), r.getStatut().name(),
        e.getId(), e.getTitre(), o.getId(), o.getTypeBillet(), o.getPrix()
    );
  }
}
