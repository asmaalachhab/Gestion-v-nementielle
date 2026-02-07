package ma.eventma.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public class AuthDtos {
  public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
  public record RegisterRequest(@NotBlank String nom, @NotBlank String prenom, @Email @NotBlank String email, @NotBlank String password, String telephone) {}
  public record AuthResponse(String token, UserSummary user) {}
  public record UserSummary(Long id, String nom, String prenom, String email, String telephone, boolean enabled, Set<String> roles) {}
}
