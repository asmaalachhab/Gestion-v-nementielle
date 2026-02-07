package ma.eventma.web;

import ma.eventma.dto.EventDtos;
import ma.eventma.dto.OfferDtos;
import ma.eventma.repository.OfferRepository;
import ma.eventma.service.EventService;
import ma.eventma.service.StatService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

  private final EventService eventService;
  private final OfferRepository offerRepository;
  private final StatService statService;

  public EventController(EventService eventService, OfferRepository offerRepository, StatService statService) {
    this.eventService = eventService;
    this.offerRepository = offerRepository;
    this.statService = statService;
  }

  @GetMapping
  public List<EventDtos.EventSummary> search(
      @RequestParam(required = false) String q,
      @RequestParam(required = false) Long regionId,
      @RequestParam(required = false) Long categoryId,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
      @RequestParam(required = false) String sort
  ) {
    return eventService.search(q, regionId, categoryId, dateFrom, dateTo, sort);
  }

  @GetMapping("/{id}")
  public EventDtos.EventDetail detail(@PathVariable Long id) {
    return eventService.getById(id);
  }

  @PostMapping("/{id}/view")
  public void view(@PathVariable Long id) {
    var event = eventService.getEntityById(id);
    eventService.incrementView(event);
    statService.onView(event);
  }

  @GetMapping("/{id}/offers")
  public List<OfferDtos.OfferSummary> offers(@PathVariable Long id) {
    return offerRepository.findByEventId(id).stream()
        .filter(o -> o.getDateExpiration() == null || !o.getDateExpiration().isBefore(LocalDate.now()))
        .map(o -> {
          int sold = o.getPlacesInitiales() - o.getPlacesDisponibles();
          return new OfferDtos.OfferSummary(o.getId(), o.getTypeBillet(), o.getPrix(), o.getPlacesInitiales(), o.getPlacesDisponibles(), sold, o.getDateExpiration(), o.getEvent().getId(), o.getEvent().getTitre());
        })
        .toList();
  }
}
