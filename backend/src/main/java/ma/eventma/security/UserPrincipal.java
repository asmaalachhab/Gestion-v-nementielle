package ma.eventma.security;

import ma.eventma.model.Role;
import ma.eventma.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {

  private final User user;

  public UserPrincipal(User user) {
    this.user = user;
  }

  public User getUser() {
    return user;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Set<Role> roles = user.getRoles();
    return roles.stream()
        .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getNom().name()))
        .collect(Collectors.toSet());
  }

  @Override public String getPassword() { return user.getPassword(); }
  @Override public String getUsername() { return user.getEmail(); }
  @Override public boolean isAccountNonExpired() { return true; }
  @Override public boolean isAccountNonLocked() { return true; }
  @Override public boolean isCredentialsNonExpired() { return true; }
  @Override public boolean isEnabled() { return Boolean.TRUE.equals(user.getEnabled()); }
}
