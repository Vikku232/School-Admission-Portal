package school_portal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import school_portal.entity.Admin;
import school_portal.entity.Teacher;
import school_portal.repository.AdminRepository;
import school_portal.repository.TeacherRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
public class UserManagementController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // TODO: Ideally secure this with @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    // For now, depending on SecurityConfig.

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody Admin newAdmin) {
        if (adminRepository.existsByEmail(newAdmin.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        // Hash the password
        newAdmin.setPasswordHash(passwordEncoder.encode(newAdmin.getPasswordHash()));
        
        // Ensure role is set properly (defaulting to ADMIN if not SUPER_ADMIN)
        if (newAdmin.getRole() == null || newAdmin.getRole().isEmpty()) {
            newAdmin.setRole("ADMIN");
        }
        
        newAdmin.setIsActive(true);
        Admin savedAdmin = adminRepository.save(newAdmin);
        
        // Nullify password before returning
        savedAdmin.setPasswordHash(null);
        return ResponseEntity.ok(savedAdmin);
    }

    @PostMapping("/create-teacher")
    public ResponseEntity<?> createTeacher(@RequestBody Teacher newTeacher) {
        if (teacherRepository.existsByEmail(newTeacher.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (teacherRepository.existsByTeacherCode(newTeacher.getTeacherCode())) {
            return ResponseEntity.badRequest().body("Teacher code already exists");
        }

        // Hash the password
        newTeacher.setPasswordHash(passwordEncoder.encode(newTeacher.getPasswordHash()));
        
        newTeacher.setIsActive(true);
        newTeacher.setIsFirstLogin(true);
        
        Teacher savedTeacher = teacherRepository.save(newTeacher);
        
        // Nullify password before returning
        savedTeacher.setPasswordHash(null);
        return ResponseEntity.ok(savedTeacher);
    }
}
