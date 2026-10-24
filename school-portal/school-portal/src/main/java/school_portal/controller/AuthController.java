package school_portal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.auth.LoginRequestDto;
import school_portal.dto.auth.LoginResponseDto;
import school_portal.entity.Admin;
import school_portal.entity.Teacher;
import school_portal.entity.Student;
import school_portal.repository.AdminRepository;
import school_portal.repository.TeacherRepository;
import school_portal.repository.StudentRepository;
import school_portal.security.JwtUtil;

import java.util.Optional;

@RestController
@RequestMapping({"/api/auth", "/auth"})
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        String email = request.getEmail();
        String password = request.getPassword();
        String role = request.getRole();

        if (role == null) {
            return ResponseEntity.badRequest().body("Role must be provided");
        }

        String name = "";

        if ("admin".equalsIgnoreCase(role)) {
            Optional<Admin> adminOpt = adminRepository.findByEmail(email);
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                if (passwordEncoder.matches(password, admin.getPasswordHash())) {
                    name = admin.getName();
                } else {
                    return ResponseEntity.status(401).body("Invalid credentials");
                }
            } else {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
        } else if ("teacher".equalsIgnoreCase(role)) {
            Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
            if (teacherOpt.isPresent()) {
                Teacher teacher = teacherOpt.get();
                if (passwordEncoder.matches(password, teacher.getPasswordHash())) {
                    name = teacher.getFirstName() + " " + teacher.getLastName();
                } else {
                    return ResponseEntity.status(401).body("Invalid credentials");
                }
            } else {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
        } else if ("student".equalsIgnoreCase(role)) {
            // Find student by studentCode first. If not found, try by email.
            Optional<Student> studentOpt = studentRepository.findByStudentCode(email);
            if (!studentOpt.isPresent()) {
                studentOpt = studentRepository.findByEmail(email);
            }
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                boolean matches = false;
                
                // 1. Verify against password_hash (custom password)
                if (passwordEncoder.matches(password, student.getPasswordHash())) {
                    matches = true;
                } else if (student.getDateOfBirth() != null) {
                    // 2. Or verify against Date of Birth in various formats
                    java.time.LocalDate dob = student.getDateOfBirth();
                    java.time.format.DateTimeFormatter fmtYYYYMMDD = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    java.time.format.DateTimeFormatter fmtDDMMYYYY = java.time.format.DateTimeFormatter.ofPattern("ddMMyyyy");
                    java.time.format.DateTimeFormatter fmtDD_MM_YYYY = java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy");
                    java.time.format.DateTimeFormatter fmtDD_slash_MM_slash_YYYY = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    
                    if (password.equals(dob.format(fmtYYYYMMDD)) ||
                        password.equals(dob.format(fmtDDMMYYYY)) ||
                        password.equals(dob.format(fmtDD_MM_YYYY)) ||
                        password.equals(dob.format(fmtDD_slash_MM_slash_YYYY))) {
                        matches = true;
                    }
                }
                
                if (matches) {
                    name = student.getFirstName() + " " + (student.getLastName() != null ? student.getLastName() : "");
                } else {
                    return ResponseEntity.status(401).body("Invalid credentials");
                }
            } else {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
        } else {
            // Default handler for unknown
            return ResponseEntity.status(401).body("Role not supported for login currently");
        }

        String token = jwtUtil.generateToken(email, role.toUpperCase());
        
        LoginResponseDto response = LoginResponseDto.builder()
                .token(token)
                .role(role)
                .name(name)
                .email(email)
                .build();

        return ResponseEntity.ok(response);
    }
}
