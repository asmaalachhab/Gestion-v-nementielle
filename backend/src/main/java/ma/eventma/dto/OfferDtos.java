package ma.eventma.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class OfferDtos {

  /** Used by event detail offers list and organizer offers list. */
  public record OfferSummary(
      Long id,
      String typeBillet,
      BigDecimal prix,
      Integer placesInitiales,
      Integer placesDisponibles,
      Integer sold,
      LocalDate dateExpiration,
      Long eventId,
      String eventTitre
  ) {}

  /** Existing name in the generated front mock. */
  public record OfferCreateRequest(
      @NotNull Long eventId,
      @NotBlank String typeBillet,
      @NotNull BigDecimal prix,
      @NotNull Integer placesInitiales,
      @NotNull LocalDate dateExpiration
  ) {}

  /** Aliases expected by services/controllers. */
  public record CreateOfferRequest(
      @NotNull Long eventId,
      @NotBlank String typeBillet,
      @NotNull BigDecimal prix,
      @NotNull Integer placesInitiales,
      @NotNull LocalDate dateExpiration
  ) {}

  public record UpdateOfferRequest(
      @NotNull Long eventId,
      @NotBlank String typeBillet,
      @NotNull BigDecimal prix,
      @NotNull Integer placesInitiales,
      @NotNull LocalDate dateExpiration
  ) {}
}
