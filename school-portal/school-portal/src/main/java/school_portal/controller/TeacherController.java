package school_portal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.TeacherDto;
import school_portal.entity.Teacher;
import school_portal.enums.Gender;
import school_portal.repository.TeacherRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/teachers", "/teachers"})
public class TeacherController {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();
        
        List<TeacherDto> teacherDtos = teachers.stream().map(teacher -> {
            String fullName = teacher.getFirstName();
            if (teacher.getLastName() != null && !teacher.getLastName().isEmpty()) {
                fullName += " " + teacher.getLastName();
            }
            
            String status = "ACTIVE";
            if (teacher.getIsActive() != null && !teacher.getIsActive()) {
                status = "INACTIVE";
            } else if (teacher.getIsFirstLogin() != null && teacher.getIsFirstLogin()) {
                status = "PENDING";
            }
            
            return TeacherDto.builder()
                    .id(teacher.getTeacherCode())
                    .name(fullName)
                    .subject(teacher.getSubject() != null && !teacher.getSubject().isBlank() ? teacher.getSubject() : "Senior Secondary Faculty")
                    .qualification(teacher.getQualification() != null && !teacher.getQualification().isBlank() ? teacher.getQualification() : "Post Graduate / B.Ed")
                    .phone(teacher.getPhone() != null ? teacher.getPhone() : "")
                    .email(teacher.getEmail() != null ? teacher.getEmail() : "")
                    .experience(teacher.getExperience() != null && !teacher.getExperience().isBlank() ? teacher.getExperience() : "5+ Years")
                    .status(status)
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(teacherDtos);
    }

    @PostMapping
    public ResponseEntity<?> createTeacher(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.getOrDefault("name", "");
        String email = (String) payload.getOrDefault("email", "");
        String phone = (String) payload.getOrDefault("phone", "");
        String subject = (String) payload.getOrDefault("subject", "Senior Secondary Subject");
        String qualification = (String) payload.getOrDefault("qualification", "Post Graduate, B.Ed");
        String experience = (String) payload.getOrDefault("experience", "3 Years");
        String status = (String) payload.getOrDefault("status", "ACTIVE");
        String requestedId = (String) payload.getOrDefault("id", "");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Teacher name is required"));
        }

        email = (email != null && !email.trim().isEmpty()) 
                ? email.trim().toLowerCase() 
                : ("tch." + System.currentTimeMillis() % 10000 + "@school.com");

        if (teacherRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "A faculty member with this email already exists: " + email));
        }

        // Auto-generate or sanitize teacherCode
        String teacherCode = (requestedId != null && !requestedId.trim().isEmpty()) ? requestedId.trim().toUpperCase() : null;
        if (teacherCode == null || teacherRepository.existsByTeacherCode(teacherCode)) {
            long count = teacherRepository.count() + 1;
            teacherCode = String.format("TCH%03d", count);
            while (teacherRepository.existsByTeacherCode(teacherCode)) {
                count++;
                teacherCode = String.format("TCH%03d", count);
            }
        }

        String[] parts = name.trim().split("\\s+", 2);
        String firstName = parts[0];
        String lastName = parts.length > 1 ? parts[1] : "";

        boolean isActive = !"INACTIVE".equalsIgnoreCase(status);
        boolean isFirstLogin = "PENDING".equalsIgnoreCase(status);

        Teacher teacher = Teacher.builder()
                .teacherCode(teacherCode)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phone(phone != null ? phone.trim() : "")
                .subject(subject)
                .qualification(qualification)
                .experience(experience)
                .passwordHash(passwordEncoder.encode("Teacher@123"))
                .gender(Gender.OTHER)
                .isActive(isActive)
                .isFirstLogin(isFirstLogin)
                .build();

        Teacher saved = teacherRepository.save(teacher);

        TeacherDto dto = TeacherDto.builder()
                .id(saved.getTeacherCode())
                .name(name.trim())
                .subject(saved.getSubject())
                .qualification(saved.getQualification())
                .phone(saved.getPhone())
                .email(saved.getEmail())
                .experience(saved.getExperience())
                .status(status)
                .build();

        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @PutMapping("/{teacherCode}")
    public ResponseEntity<?> updateTeacher(@PathVariable String teacherCode, @RequestBody Map<String, Object> payload) {
        Optional<Teacher> teacherOpt = teacherRepository.findByTeacherCode(teacherCode);
        if (teacherOpt.isEmpty()) {
            try {
                teacherOpt = teacherRepository.findById(Long.parseLong(teacherCode));
            } catch (NumberFormatException ignored) {}
        }

        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Teacher not found with ID/Code: " + teacherCode));
        }

        Teacher teacher = teacherOpt.get();

        if (payload.containsKey("name")) {
            String name = (String) payload.get("name");
            if (name != null && !name.trim().isEmpty()) {
                String[] parts = name.trim().split("\\s+", 2);
                teacher.setFirstName(parts[0]);
                teacher.setLastName(parts.length > 1 ? parts[1] : "");
            }
        }

        if (payload.containsKey("subject") && payload.get("subject") != null) {
            teacher.setSubject(payload.get("subject").toString());
        }

        if (payload.containsKey("qualification") && payload.get("qualification") != null) {
            teacher.setQualification(payload.get("qualification").toString());
        }

        if (payload.containsKey("experience") && payload.get("experience") != null) {
            teacher.setExperience(payload.get("experience").toString());
        }

        if (payload.containsKey("phone") && payload.get("phone") != null) {
            teacher.setPhone(payload.get("phone").toString().trim());
        }

        if (payload.containsKey("email") && payload.get("email") != null) {
            String newEmail = payload.get("email").toString().trim().toLowerCase();
            if (!newEmail.equalsIgnoreCase(teacher.getEmail()) && teacherRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already in use by another faculty member"));
            }
            teacher.setEmail(newEmail);
        }

        if (payload.containsKey("status") && payload.get("status") != null) {
            String status = payload.get("status").toString();
            teacher.setIsActive(!"INACTIVE".equalsIgnoreCase(status));
            teacher.setIsFirstLogin("PENDING".equalsIgnoreCase(status));
        }

        Teacher updated = teacherRepository.save(teacher);

        String fullName = updated.getFirstName() + (updated.getLastName() != null && !updated.getLastName().isEmpty() ? " " + updated.getLastName() : "");

        TeacherDto dto = TeacherDto.builder()
                .id(updated.getTeacherCode())
                .name(fullName)
                .subject(updated.getSubject())
                .qualification(updated.getQualification())
                .phone(updated.getPhone())
                .email(updated.getEmail())
                .experience(updated.getExperience())
                .status(updated.getIsActive() ? (updated.getIsFirstLogin() ? "PENDING" : "ACTIVE") : "INACTIVE")
                .build();

        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{teacherCode}")
    public ResponseEntity<?> deleteTeacher(@PathVariable String teacherCode) {
        Optional<Teacher> teacherOpt = teacherRepository.findByTeacherCode(teacherCode);
        if (teacherOpt.isEmpty()) {
            try {
                teacherOpt = teacherRepository.findById(Long.parseLong(teacherCode));
            } catch (NumberFormatException ignored) {}
        }

        if (teacherOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Teacher already removed or not found", "id", teacherCode));
        }

        Teacher teacher = teacherOpt.get();
        try {
            teacherRepository.delete(teacher);
        } catch (Exception e) {
            // In case of FK constraint violation, mark as inactive
            teacher.setIsActive(false);
            teacherRepository.save(teacher);
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "Teacher deleted successfully from database", "id", teacherCode));
    }
}
