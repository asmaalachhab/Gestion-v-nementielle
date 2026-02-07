package ma.eventma.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventDtos {

  /** Used by public search results (and organizer lists). */
  public record EventSummary(
      Long id,
      String titre,
      String description,
      LocalDate dateEvent,
      LocalTime heureDebut,
      String lieu,
      String imageUrl,
      Integer nbVues,
      String statut,
      Long categorieId,
      String categorieNom,
      Long regionId,
      String regionNom,
      Long organisateurId,
      String organisateurNomComplet
  ) {}

  /** Used by event detail page. */
  public record EventDetail(
      Long id,
      String titre,
      String description,
      LocalDate dateEvent,
      LocalTime heureDebut,
      String lieu,
      String imageUrl,
      Integer nbVues,
      String statut,
      Long categorieId,
      String categorieNom,
      Long regionId,
      String regionNom,
      Long organisateurId,
      String organisateurNomComplet
  ) {}

  /** Used by organizer create event. */
  public record CreateEventRequest(
      @NotBlank String titre,
      String description,
      @NotNull LocalDate dateEvent,
      @NotNull LocalTime heureDebut,
      @NotBlank String lieu,
      String imageUrl,
      @NotNull Long categorieId,
      @NotNull Long regionId
  ) {}

  /** Used by organizer update event (partial updates allowed). */
  public record UpdateEventRequest(
      String titre,
      String description,
      LocalDate dateEvent,
      LocalTime heureDebut,
      String lieu,
      String imageUrl,
      Long categorieId,
      Long regionId,
      String statut
  ) {}

  /** Backward-compatible record kept (some front code may still reference it). */
  public record CreateOrUpdateEventRequest(
      @NotBlank String titre,
      String description,
      @NotNull LocalDate dateEvent,
      @NotNull LocalTime heureDebut,
      @NotBlank String lieu,
      String imageUrl,
      @NotNull Long categorieId,
      @NotNull Long regionId
  ) {}
}
