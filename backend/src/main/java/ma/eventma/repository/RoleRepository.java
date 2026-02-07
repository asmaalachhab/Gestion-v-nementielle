package ma.eventma.repository;

import ma.eventma.model.Role;
import ma.eventma.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByNom(RoleName nom);
}
