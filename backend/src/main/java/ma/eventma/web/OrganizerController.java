package ma.eventma.web;

import jakarta.validation.Valid;
import ma.eventma.dto.EventDtos;
import ma.eventma.dto.OfferDtos;
import ma.eventma.dto.StatsDtos;
import ma.eventma.security.UserPrincipal;
import ma.eventma.service.OrganizerService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer")
@PreAuthorize("hasRole('ORGANISATEUR')")
public class OrganizerController {

  private final OrganizerService organizerService;

  public OrganizerController(OrganizerService organizerService) {
    this.organizerService = organizerService;
  }

  @GetMapping("/events")
  public List<EventDtos.EventSummary> myEvents(@AuthenticationPrincipal UserPrincipal principal) {
    return organizerService.myEvents(principal.getUser());
  }

  @PostMapping("/events")
  public EventDtos.EventDetail createEvent(@AuthenticationPrincipal UserPrincipal principal,
                                          @Valid @RequestBody EventDtos.CreateEventRequest req) {
    return organizerService.createEvent(principal.getUser(), req);
  }

  @PutMapping("/events/{id}")
  public EventDtos.EventDetail updateEvent(@AuthenticationPrincipal UserPrincipal principal,
                                          @PathVariable Long id,
                                          @Valid @RequestBody EventDtos.UpdateEventRequest req) {
    return organizerService.updateEvent(principal.getUser(), id, req);
  }

  @DeleteMapping("/events/{id}")
  public void deleteEvent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
    organizerService.deleteEvent(principal.getUser(), id);
  }

  @PostMapping("/events/{id}/publish")
  public EventDtos.EventDetail publishEvent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
    return organizerService.publishEvent(principal.getUser(), id);
  }

  @GetMapping("/offers")
  public List<OfferDtos.OfferSummary> myOffers(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam(required = false) Long eventId) {
    return organizerService.myOffers(principal.getUser(), eventId);
  }

  @PostMapping("/offers")
  public OfferDtos.OfferSummary createOffer(@AuthenticationPrincipal UserPrincipal principal,
                                           @Valid @RequestBody OfferDtos.CreateOfferRequest req) {
    return organizerService.createOffer(principal.getUser(), req);
  }

  @PutMapping("/offers/{id}")
  public OfferDtos.OfferSummary updateOffer(@AuthenticationPrincipal UserPrincipal principal,
                                           @PathVariable Long id,
                                           @Valid @RequestBody OfferDtos.UpdateOfferRequest req) {
    return organizerService.updateOffer(principal.getUser(), id, req);
  }

  @DeleteMapping("/offers/{id}")
  public void deleteOffer(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
    organizerService.deleteOffer(principal.getUser(), id);
  }

  @GetMapping("/stats/overview")
  public StatsDtos.Overview overview(@AuthenticationPrincipal UserPrincipal principal) {
    return organizerService.overview(principal.getUser());
  }
}
