package ma.eventma.service;

import ma.eventma.dto.EventDtos;
import ma.eventma.model.Event;
import ma.eventma.model.EventStatus;
import ma.eventma.repository.EventRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {

  private final EventRepository eventRepository;

  public EventService(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
  }

  public List<EventDtos.EventSummary> search(String q, Long regionId, Long categoryId, LocalDate dateFrom, LocalDate dateTo, String sort) {
    Specification<Event> spec = (root, query, cb) -> {
      List<Predicate> preds = new ArrayList<>();
      preds.add(cb.equal(root.get("statut"), EventStatus.PUBLIE));
      if (q != null && !q.isBlank()) {
        String like = "%" + q.toLowerCase() + "%";
        preds.add(cb.or(
            cb.like(cb.lower(root.get("titre")), like),
            cb.like(cb.lower(root.get("lieu")), like)
        ));
      }
      if (regionId != null) preds.add(cb.equal(root.get("region").get("id"), regionId));
      if (categoryId != null) preds.add(cb.equal(root.get("categorie").get("id"), categoryId));
      if (dateFrom != null) preds.add(cb.greaterThanOrEqualTo(root.get("dateEvent"), dateFrom));
      if (dateTo != null) preds.add(cb.lessThanOrEqualTo(root.get("dateEvent"), dateTo));

      if (sort != null) {
        if ("date_asc".equalsIgnoreCase(sort)) query.orderBy(cb.asc(root.get("dateEvent")), cb.asc(root.get("heureDebut")));
        else if ("date_desc".equalsIgnoreCase(sort)) query.orderBy(cb.desc(root.get("dateEvent")), cb.desc(root.get("heureDebut")));
        else if ("views".equalsIgnoreCase(sort)) query.orderBy(cb.desc(root.get("nbVues")));
      }
      return cb.and(preds.toArray(new Predicate[0]));
    };

    return eventRepository.findAll(spec).stream().map(EventService::toSummary).toList();
  }

  public EventDtos.EventDetail getById(Long id) {
    Event e = eventRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Event introuvable"));
    if (e.getStatut() != EventStatus.PUBLIE) {
      throw new IllegalArgumentException("Event non publié");
    }
    return toDetail(e);
  }

  public static EventDtos.EventSummary toSummary(Event e) {
    return new EventDtos.EventSummary(
        e.getId(), e.getTitre(), e.getDescription(), e.getDateEvent(), e.getHeureDebut(), e.getLieu(), e.getImageUrl(),
        e.getNbVues(), e.getStatut().name(),
        e.getCategorie().getId(), e.getCategorie().getNom(),
        e.getRegion().getId(), e.getRegion().getNom(),
        e.getOrganisateur().getId(), e.getOrganisateur().getNom() + " " + e.getOrganisateur().getPrenom()
    );
  }

  public static EventDtos.EventDetail toDetail(Event e) {
    return new EventDtos.EventDetail(
        e.getId(), e.getTitre(), e.getDescription(), e.getDateEvent(), e.getHeureDebut(), e.getLieu(), e.getImageUrl(),
        e.getNbVues(), e.getStatut().name(),
        e.getCategorie().getId(), e.getCategorie().getNom(),
        e.getRegion().getId(), e.getRegion().getNom(),
        e.getOrganisateur().getId(), e.getOrganisateur().getNom() + " " + e.getOrganisateur().getPrenom()
    );
  }

  @Transactional
  public void incrementView(Event e) {
    e.setNbVues((e.getNbVues() == null ? 0 : e.getNbVues()) + 1);
    eventRepository.save(e);
  }

  public Event getEntityById(Long id) {
    return eventRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Event introuvable"));
  }
}
