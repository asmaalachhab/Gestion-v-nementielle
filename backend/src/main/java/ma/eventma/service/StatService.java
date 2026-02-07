package ma.eventma.service;

import ma.eventma.model.Event;
import ma.eventma.model.Statistique;
import ma.eventma.repository.EventRepository;
import ma.eventma.repository.StatistiqueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class StatService {
  private final StatistiqueRepository repo;
  private final EventRepository eventRepository;

  public StatService(StatistiqueRepository repo, EventRepository eventRepository) {
    this.repo = repo;
    this.eventRepository = eventRepository;
  }

  // Methods expected by controllers (thin wrappers)
  @Transactional
  public void onView(Event event) {
    recordView(event);
  }

  @Transactional
  public void onReservationConfirmed(Long eventId, BigDecimal amount) {
    Event e = eventRepository.findById(eventId)
        .orElseThrow(() -> new IllegalArgumentException("Event introuvable"));
    recordReservation(e, amount);
  }

  @Transactional
  public void onReservationCancelled(Long eventId, BigDecimal amount) {
    Event e = eventRepository.findById(eventId)
        .orElseThrow(() -> new IllegalArgumentException("Event introuvable"));
    recordCancellation(e, amount);
  }

  @Transactional
  public void recordView(Event event) {
    LocalDate today = LocalDate.now();
    Statistique s = repo.findByEventIdAndDateConsultation(event.getId(), today)
        .orElseGet(() -> repo.save(Statistique.builder()
            .event(event)
            .dateConsultation(today)
            .nbVues(0)
            .nbReservations(0)
            .chiffreAffaires(BigDecimal.ZERO)
            .build()));
    s.setNbVues((s.getNbVues()==null?0:s.getNbVues()) + 1);
    repo.save(s);
  }

  @Transactional
  public void recordReservation(Event event, BigDecimal amount) {
    LocalDate today = LocalDate.now();
    Statistique s = repo.findByEventIdAndDateConsultation(event.getId(), today)
        .orElseGet(() -> repo.save(Statistique.builder()
            .event(event)
            .dateConsultation(today)
            .nbVues(0)
            .nbReservations(0)
            .chiffreAffaires(BigDecimal.ZERO)
            .build()));
    s.setNbReservations((s.getNbReservations()==null?0:s.getNbReservations()) + 1);
    s.setChiffreAffaires((s.getChiffreAffaires()==null?BigDecimal.ZERO:s.getChiffreAffaires()).add(amount));
    repo.save(s);
  }

  @Transactional
  public void recordCancellation(Event event, BigDecimal amount) {
    LocalDate today = LocalDate.now();
    Statistique s = repo.findByEventIdAndDateConsultation(event.getId(), today)
        .orElse(null);
    if (s == null) return;
    s.setNbReservations(Math.max(0, (s.getNbReservations()==null?0:s.getNbReservations()) - 1));
    BigDecimal ca = (s.getChiffreAffaires()==null?BigDecimal.ZERO:s.getChiffreAffaires()).subtract(amount);
    if (ca.signum() < 0) ca = BigDecimal.ZERO;
    s.setChiffreAffaires(ca);
    repo.save(s);
  }
}
