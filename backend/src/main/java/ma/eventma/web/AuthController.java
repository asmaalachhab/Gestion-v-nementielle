package ma.eventma.web;

import jakarta.validation.Valid;
import ma.eventma.dto.AuthDtos;
import ma.eventma.security.UserPrincipal;
import ma.eventma.service.AuthService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public AuthDtos.UserSummary register(@Valid @RequestBody AuthDtos.RegisterRequest req) {
    return authService.registerClient(req);
  }

  @PostMapping("/login")
  public AuthDtos.AuthResponse login(@Valid @RequestBody AuthDtos.LoginRequest req) {
    return authService.login(req);
  }

  @GetMapping("/me")
  public AuthDtos.UserSummary me(@AuthenticationPrincipal UserPrincipal principal) {
    if (principal == null) throw new IllegalArgumentException("Non authentifié");
    return authService.toSummary(principal.getUser());
  }
}
