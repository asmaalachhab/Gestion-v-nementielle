package ma.eventma.dto;

import java.math.BigDecimal;
import java.util.List;

public class StatsDtos {
  public record Overview(Long totalVues, Long totalReservations, BigDecimal chiffreAffaires, Long evenementsActifs, Double tauxConversion, List<EventViews> vuesParEvenement) {}
  public record EventViews(Long eventId, String titre, Long vues) {}
  public record EventStats(Long eventId, String titre, Long vues, Long reservations, BigDecimal chiffreAffaires, Double tauxConversion) {}
}
