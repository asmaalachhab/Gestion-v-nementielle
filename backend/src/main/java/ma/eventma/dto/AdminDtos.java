package ma.eventma.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.Set;

public class AdminDtos {

  /** Row used by AdminService/AdminController for listing users. */
  public record UserRow(
      Long id,
      String nom,
      String prenom,
      String email,
      String telephone,
      boolean enabled,
      Set<String> roles,
      LocalDateTime dateInscription
  ) {}

  public record CreateUserRequest(
      @NotBlank String nom,
      @NotBlank String prenom,
      @Email @NotBlank String email,
      @NotBlank String password,
      String telephone,
      Set<String> roles
  ) {}
}
