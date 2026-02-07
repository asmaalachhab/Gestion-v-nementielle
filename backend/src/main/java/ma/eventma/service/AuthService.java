package ma.eventma.service;

import ma.eventma.dto.AuthDtos;
import ma.eventma.model.RoleName;
import ma.eventma.model.User;
import ma.eventma.repository.RoleRepository;
import ma.eventma.repository.UserRepository;
import ma.eventma.security.JwtService;
import ma.eventma.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder,
                     AuthenticationManager authenticationManager, JwtService jwtService) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @Transactional
  public AuthDtos.UserSummary registerClient(AuthDtos.RegisterRequest req) {
    if (userRepository.existsByEmail(req.email())) {
      throw new IllegalArgumentException("Email déjà utilisé");
    }

    var clientRole = roleRepository.findByNom(RoleName.CLIENT)
        .orElseThrow(() -> new IllegalStateException("Role CLIENT introuvable"));

    User u = User.builder()
        .nom(req.nom())
        .prenom(req.prenom())
        .email(req.email())
        .password(passwordEncoder.encode(req.password()))
        .telephone(req.telephone())
        .enabled(true)
        .dateInscription(LocalDateTime.now())
        .build();
    u.getRoles().add(clientRole);
    u = userRepository.save(u);
    return toSummary(u);
  }

  public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
    var auth = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(req.email(), req.password())
    );
    UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
    User user = principal.getUser();

    Set<String> roles = user.getRoles().stream().map(r -> r.getNom().name()).collect(Collectors.toSet());
    String token = jwtService.generateToken(user.getEmail(), java.util.Map.of(
        "uid", user.getId(),
        "roles", roles
    ));
    return new AuthDtos.AuthResponse(token, toSummary(user));
  }

  public AuthDtos.UserSummary toSummary(User u) {
    Set<String> roles = u.getRoles().stream().map(r -> r.getNom().name()).collect(Collectors.toSet());
    return new AuthDtos.UserSummary(u.getId(), u.getNom(), u.getPrenom(), u.getEmail(), u.getTelephone(),
        Boolean.TRUE.equals(u.getEnabled()), roles);
  }
}
