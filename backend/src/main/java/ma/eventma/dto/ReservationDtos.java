package ma.eventma.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReservationDtos {

  public record CreateReservationRequest(@NotNull Long offerId, @NotNull @Min(1) Integer nbPlaces) {}

  public record ReservationRow(
      Long id,
      String codeReservation,
      LocalDateTime dateReservation,
      Integer nbPlaces,
      BigDecimal montantTotal,
      String statut,
      Long offerId,
      String typeBillet,
      Long eventId,
      String eventTitre,
      BigDecimal prixBillet
  ) {}

  /** Alias expected by services/controllers. */
  public record ReservationSummary(
      Long id,
      String codeReservation,
      LocalDateTime dateReservation,
      Integer nbPlaces,
      BigDecimal montantTotal,
      String statut,
      Long eventId,
      String eventTitre,
      Long offerId,
      String typeBillet,
      BigDecimal prixBillet
  ) {}
}
