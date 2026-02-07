package ma.eventma.service;

import ma.eventma.dto.EventDtos;
import ma.eventma.dto.OfferDtos;
import ma.eventma.dto.StatsDtos;
import ma.eventma.model.*;
import ma.eventma.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class OrganizerService {

  private final EventRepository eventRepository;
  private final OfferRepository offerRepository;
  private final CategoryRepository categoryRepository;
  private final RegionRepository regionRepository;

  private final ReservationRepository reservationRepository;

  public OrganizerService(EventRepository eventRepository, OfferRepository offerRepository,
                          CategoryRepository categoryRepository, RegionRepository regionRepository,
                          ReservationRepository reservationRepository) {
    this.eventRepository = eventRepository;
    this.offerRepository = offerRepository;
    this.categoryRepository = categoryRepository;
    this.regionRepository = regionRepository;
    this.reservationRepository = reservationRepository;
  }

  public List<EventDtos.EventSummary> myEvents(User organizer) {
    return eventRepository.findAll().stream()
        .filter(e -> e.getOrganisateur().getId().equals(organizer.getId()))
        .sorted(Comparator.comparing(Event::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
        .map(EventService::toSummary)
        .toList();
  }

  @Transactional
  public EventDtos.EventDetail createEvent(User organizer, EventDtos.CreateEventRequest req) {
    Category cat = categoryRepository.findById(req.categorieId()).orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable"));
    Region reg = regionRepository.findById(req.regionId()).orElseThrow(() -> new IllegalArgumentException("Région introuvable"));

    Event e = Event.builder()
        .titre(req.titre())
        .description(req.description())
        .dateEvent(req.dateEvent())
        .heureDebut(req.heureDebut())
        .lieu(req.lieu())
        .imageUrl(req.imageUrl())
        .categorie(cat)
        .region(reg)
        .organisateur(organizer)
        .statut(EventStatus.BROUILLON)
        .createdAt(java.time.LocalDateTime.now())
        .updatedAt(java.time.LocalDateTime.now())
        .nbVues(0)
        .build();
    e = eventRepository.save(e);
    return EventService.toDetail(e);
  }

  @Transactional
  public EventDtos.EventDetail updateEvent(User organizer, Long id, EventDtos.UpdateEventRequest req) {
    Event e = eventRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Event introuvable"));
    if (!e.getOrganisateur().getId().equals(organizer.getId())) throw new IllegalArgumentException("Accès interdit");
    if (req.titre() != null) e.setTitre(req.titre());
    if (req.description() != null) e.setDescription(req.description());
    if (req.dateEvent() != null) e.setDateEvent(req.dateEvent());
    if (req.heureDebut() != null) e.setHeureDebut(req.heureDebut());
    if (req.lieu() != null) e.setLieu(req.lieu());
    if (req.imageUrl() != null) e.setImageUrl(req.imageUrl());
    if (req.statut() != null) e.setStatut(EventStatus.valueOf(req.statut()));
    if (req.categorieId() != null) e.setCategorie(categoryRepository.findById(req.categorieId()).orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable")));
    if (req.regionId() != null) e.setRegion(regionRepository.findById(req.regionId()).orElseThrow(() -> new IllegalArgumentException("Région introuvable")));
    e.setUpdatedAt(java.time.LocalDateTime.now());
    e = eventRepository.save(e);
    return EventService.toDetail(e);
  }

  @Transactional
  public void deleteEvent(User organizer, Long id) {
    Event e = eventRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Event introuvable"));
    if (!e.getOrganisateur().getId().equals(organizer.getId())) throw new IllegalArgumentException("Accès interdit");
    eventRepository.delete(e);
  }

  @Transactional
  public EventDtos.EventDetail publishEvent(User organizer, Long id) {
    Event e = eventRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Event introuvable"));
    if (!e.getOrganisateur().getId().equals(organizer.getId())) throw new IllegalArgumentException("Accès interdit");
    e.setStatut(EventStatus.PUBLIE);
    e.setUpdatedAt(java.time.LocalDateTime.now());
    e = eventRepository.save(e);
    return EventService.toDetail(e);
  }

  public List<OfferDtos.OfferSummary> myOffers(User organizer, Long eventId) {
    return offerRepository.findAll().stream()
        .filter(o -> o.getEvent().getOrganisateur().getId().equals(organizer.getId()))
        .filter(o -> eventId == null || o.getEvent().getId().equals(eventId))
        .map(OrganizerService::toOfferSummary)
        .toList();
  }

  @Transactional
  public OfferDtos.OfferSummary createOffer(User organizer, OfferDtos.CreateOfferRequest req) {
    Event e = eventRepository.findById(req.eventId()).orElseThrow(() -> new IllegalArgumentException("Event introuvable"));
    if (!e.getOrganisateur().getId().equals(organizer.getId())) throw new IllegalArgumentException("Accès interdit");

    Offer o = Offer.builder()
        .event(e)
        .typeBillet(req.typeBillet())
        .prix(req.prix())
        .placesInitiales(req.placesInitiales())
        .placesDisponibles(req.placesInitiales())
        .dateExpiration(req.dateExpiration())
        .build();
    o = offerRepository.save(o);
    return toOfferSummary(o);
  }

  @Transactional
  public OfferDtos.OfferSummary updateOffer(User organizer, Long id, OfferDtos.UpdateOfferRequest req) {
    Offer o = offerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Offre introuvable"));
    if (!o.getEvent().getOrganisateur().getId().equals(organizer.getId())) throw new IllegalArgumentException("Accès interdit");

    if (req.typeBillet() != null) o.setTypeBillet(req.typeBillet());
    if (req.prix() != null) o.setPrix(req.prix());
    if (req.dateExpiration() != null) o.setDateExpiration(req.dateExpiration());
    // For simplicity, do not allow decreasing below sold
    if (req.placesInitiales() != null) {
      int sold = o.getPlacesInitiales() - o.getPlacesDisponibles();
      if (req.placesInitiales() < sold) throw new IllegalArgumentException("Places initiales < vendues");
      int newDisponibles = req.placesInitiales() - sold;
      o.setPlacesInitiales(req.placesInitiales());
      o.setPlacesDisponibles(newDisponibles);
    }

    o = offerRepository.save(o);
    return toOfferSummary(o);
  }

  @Transactional
  public void deleteOffer(User organizer, Long id) {
    Offer o = offerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Offre introuvable"));
    if (!o.getEvent().getOrganisateur().getId().equals(organizer.getId())) throw new IllegalArgumentException("Accès interdit");
    offerRepository.delete(o);
  }

  public StatsDtos.Overview overview(User organizer) {
    var events = eventRepository.findAll().stream().filter(e -> e.getOrganisateur().getId().equals(organizer.getId())).toList();
    long totalVues = events.stream().map(e -> e.getNbVues() == null ? 0 : e.getNbVues()).mapToLong(Integer::longValue).sum();
    long evenementsActifs = events.stream().filter(e -> e.getStatut() == EventStatus.PUBLIE).count();

        var myReservationList = reservationRepository.findAll().stream()
        .filter(r -> r.getOffer().getEvent().getOrganisateur().getId().equals(organizer.getId()))
        .filter(r -> r.getStatut() == ReservationStatus.CONFIRMEE)
        .toList();

    long totalReservations = myReservationList.size();
    BigDecimal ca = myReservationList.stream().map(Reservation::getMontantTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

    double conversion = totalVues == 0 ? 0.0 : (double) totalReservations / (double) totalVues;

    List<StatsDtos.EventViews> vuesPar = events.stream()
        .sorted(Comparator.comparing(Event::getNbVues, Comparator.nullsLast(Comparator.reverseOrder())))
        .limit(8)
        .map(e -> new StatsDtos.EventViews(e.getId(), e.getTitre(), (long) (e.getNbVues() == null ? 0 : e.getNbVues())))
        .toList();

    return new StatsDtos.Overview(totalVues, totalReservations, ca, evenementsActifs, conversion, vuesPar);
  }

  private static OfferDtos.OfferSummary toOfferSummary(Offer o) {
    int sold = o.getPlacesInitiales() - o.getPlacesDisponibles();
    return new OfferDtos.OfferSummary(o.getId(), o.getTypeBillet(), o.getPrix(), o.getPlacesInitiales(), o.getPlacesDisponibles(), sold, o.getDateExpiration(), o.getEvent().getId(), o.getEvent().getTitre());
  }
}
