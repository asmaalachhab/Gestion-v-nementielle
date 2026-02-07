package ma.eventma.web;

import jakarta.validation.Valid;
import ma.eventma.dto.AdminDtos;
import ma.eventma.model.Category;
import ma.eventma.model.Region;
import ma.eventma.repository.CategoryRepository;
import ma.eventma.repository.RegionRepository;
import ma.eventma.service.AdminService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

  private final AdminService adminService;
  private final CategoryRepository categoryRepository;
  private final RegionRepository regionRepository;

  public AdminController(AdminService adminService, CategoryRepository categoryRepository, RegionRepository regionRepository) {
    this.adminService = adminService;
    this.categoryRepository = categoryRepository;
    this.regionRepository = regionRepository;
  }

  // USERS
  @GetMapping("/users")
  public List<AdminDtos.UserRow> users() {
    return adminService.listUsers();
  }

  @PostMapping("/users")
  public AdminDtos.UserRow createUser(@Valid @RequestBody AdminDtos.CreateUserRequest req) {
    return adminService.createUser(req);
  }

  @PutMapping("/users/{id}/toggle-enabled")
  public AdminDtos.UserRow toggleEnabled(@PathVariable Long id) {
    return adminService.toggleEnabled(id);
  }

  // CATEGORIES
  @GetMapping("/categories")
  public List<Category> categories() {
    return categoryRepository.findAll();
  }

  @PostMapping("/categories")
  public Category createCategory(@RequestBody Category c) {
    c.setId(null);
    return categoryRepository.save(c);
  }

  @PutMapping("/categories/{id}")
  public Category updateCategory(@PathVariable Long id, @RequestBody Category c) {
    Category existing = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable"));
    existing.setNom(c.getNom());
    existing.setDescription(c.getDescription());
    return categoryRepository.save(existing);
  }

  @DeleteMapping("/categories/{id}")
  public void deleteCategory(@PathVariable Long id) {
    categoryRepository.deleteById(id);
  }

  // REGIONS
  @GetMapping("/regions")
  public List<Region> regions() {
    return regionRepository.findAll();
  }

  @PostMapping("/regions")
  public Region createRegion(@RequestBody Region r) {
    r.setId(null);
    return regionRepository.save(r);
  }

  @PutMapping("/regions/{id}")
  public Region updateRegion(@PathVariable Long id, @RequestBody Region r) {
    Region existing = regionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Région introuvable"));
    existing.setNom(r.getNom());
    existing.setCode(r.getCode());
    return regionRepository.save(existing);
  }

  @DeleteMapping("/regions/{id}")
  public void deleteRegion(@PathVariable Long id) {
    regionRepository.deleteById(id);
  }
}
