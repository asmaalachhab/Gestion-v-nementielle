package ma.eventma.web;

import jakarta.validation.Valid;
import ma.eventma.dto.ReservationDtos;
import ma.eventma.security.UserPrincipal;
import ma.eventma.service.ReservationService;
import ma.eventma.service.StatService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

  private final ReservationService reservationService;
  private final StatService statService;

  public ReservationController(ReservationService reservationService, StatService statService) {
    this.reservationService = reservationService;
    this.statService = statService;
  }

  @PostMapping
  public ReservationDtos.ReservationSummary create(@AuthenticationPrincipal UserPrincipal principal,
                                                   @Valid @RequestBody ReservationDtos.CreateReservationRequest req) {
    var res = reservationService.create(principal.getUser(), req);
    // stats: reservation
    statService.onReservationConfirmed(res.eventId(), res.montantTotal());
    return res;
  }

  @GetMapping("/me")
  public List<ReservationDtos.ReservationSummary> myReservations(@AuthenticationPrincipal UserPrincipal principal) {
    return reservationService.myReservations(principal.getUser());
  }

  @PostMapping("/{id}/cancel")
  public ReservationDtos.ReservationSummary cancel(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
    var before = reservationService.myReservations(principal.getUser()).stream().filter(r -> r.id().equals(id)).findFirst().orElse(null);
    var res = reservationService.cancel(principal.getUser(), id);
    if (before != null && "CONFIRMEE".equals(before.statut()) && "ANNULEE".equals(res.statut())) {
      statService.onReservationCancelled(res.eventId(), before.montantTotal());
    }
    return res;
  }
}
