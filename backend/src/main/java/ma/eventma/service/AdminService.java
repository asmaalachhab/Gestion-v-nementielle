package ma.eventma.service;

import ma.eventma.dto.AdminDtos;
import ma.eventma.model.RoleName;
import ma.eventma.model.User;
import ma.eventma.repository.RoleRepository;
import ma.eventma.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;

  public AdminService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public AdminDtos.UserRow createUser(AdminDtos.CreateUserRequest req) {
    if (userRepository.existsByEmail(req.email())) {
      throw new IllegalArgumentException("Email déjà utilisé");
    }

    User u = User.builder()
        .nom(req.nom())
        .prenom(req.prenom())
        .email(req.email())
        .telephone(req.telephone())
        .password(passwordEncoder.encode(req.password()))
        .enabled(true)
        .dateInscription(LocalDateTime.now())
        .build();

    for (String r : req.roles()) {
      RoleName rn = RoleName.valueOf(r);
      var role = roleRepository.findByNom(rn).orElseThrow(() -> new IllegalStateException("Role " + r + " introuvable"));
      u.getRoles().add(role);
    }

    u = userRepository.save(u);
    return toRow(u);
  }

  public java.util.List<AdminDtos.UserRow> listUsers() {
    return userRepository.findAll().stream().map(AdminService::toRow).toList();
  }

  @Transactional
  public AdminDtos.UserRow toggleEnabled(Long id) {
    User u = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User introuvable"));
    u.setEnabled(!Boolean.TRUE.equals(u.getEnabled()));
    u = userRepository.save(u);
    return toRow(u);
  }

  public static AdminDtos.UserRow toRow(User u) {
    Set<String> roles = u.getRoles().stream().map(rr -> rr.getNom().name()).collect(Collectors.toSet());
    return new AdminDtos.UserRow(u.getId(), u.getNom(), u.getPrenom(), u.getEmail(), u.getTelephone(), Boolean.TRUE.equals(u.getEnabled()), roles, u.getDateInscription());
  }
}
