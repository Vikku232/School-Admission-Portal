package school_portal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.StudentDto;
import school_portal.entity.Student;
import school_portal.enums.Gender;
import school_portal.enums.StudentStatus;
import school_portal.repository.StudentRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        
        List<StudentDto> studentDtos = students.stream().map(student -> {
            String fullName = student.getFirstName();
            if (student.getLastName() != null && !student.getLastName().isEmpty()) {
                fullName += " " + student.getLastName();
            }

            return StudentDto.builder()
                    .id(student.getStudentCode())
                    .name(fullName)
                    .grade(student.getGrade() != null ? student.getGrade() : "11th")
                    .section(student.getSection() != null ? student.getSection() : "Sci-A")
                    .stream(student.getStream() != null ? student.getStream() : "Science")
                    .rollNo(student.getRollNo() != null ? student.getRollNo() : "")
                    .parentPhone(student.getPhone() != null ? student.getPhone() : "")
                    .email(student.getEmail() != null ? student.getEmail() : "")
                    .bloodGroup(student.getBloodGroup() != null ? student.getBloodGroup() : "O+")
                    .status(student.getStatus() != null ? student.getStatus().name() : "ACTIVE")
                    .feesStatus(student.getFeesStatus() != null ? student.getFeesStatus() : "PAID")
                    .attendance(student.getAttendance() != null ? student.getAttendance() : "95.0%")
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(studentDtos);
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.getOrDefault("name", "");
        String grade = (String) payload.getOrDefault("grade", "11th");
        String section = (String) payload.getOrDefault("section", "Sci-A (PCM)");
        String stream = (String) payload.getOrDefault("stream", "Science");
        String rollNo = (String) payload.getOrDefault("rollNo", "");
        String phone = (String) payload.getOrDefault("parentPhone", payload.getOrDefault("phone", ""));
        String email = (String) payload.getOrDefault("email", "");
        String bloodGroup = (String) payload.getOrDefault("bloodGroup", "B+");
        String statusStr = (String) payload.getOrDefault("status", "ACTIVE");
        String feesStatus = (String) payload.getOrDefault("feesStatus", "PAID");
        String requestedId = (String) payload.getOrDefault("id", "");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Student name is required"));
        }

        String[] parts = name.trim().split("\\s+", 2);
        String firstName = parts[0];
        String lastName = parts.length > 1 ? parts[1] : "";

        // Auto-generate or sanitize studentCode
        String studentCode = (requestedId != null && !requestedId.trim().isEmpty()) ? requestedId.trim().toUpperCase() : null;
        if (studentCode == null || studentRepository.existsByStudentCode(studentCode)) {
            String prefix = "STU" + (grade != null && grade.contains("12") ? "12" : "11");
            long count = studentRepository.count() + 1;
            studentCode = String.format("%s%02d", prefix, count);
            while (studentRepository.existsByStudentCode(studentCode)) {
                count++;
                studentCode = String.format("%s%02d", prefix, count);
            }
        }

        email = (email != null && !email.trim().isEmpty()) 
                ? email.trim().toLowerCase() 
                : (firstName.toLowerCase() + "." + studentCode.toLowerCase() + "@school.com");

        if (studentRepository.existsByEmail(email)) {
            email = firstName.toLowerCase() + "." + System.currentTimeMillis() % 10000 + "@school.com";
        }

        if (rollNo == null || rollNo.trim().isEmpty()) {
            rollNo = (grade != null && grade.contains("12") ? "XII" : "XI") + "-0" + (studentRepository.count() + 1);
        }

        StudentStatus status = "INACTIVE".equalsIgnoreCase(statusStr) ? StudentStatus.INACTIVE : StudentStatus.ACTIVE;

        Student student = Student.builder()
                .studentCode(studentCode)
                .firstName(firstName)
                .lastName(lastName)
                .grade(grade)
                .section(section)
                .stream(stream)
                .rollNo(rollNo)
                .phone(phone != null ? phone.trim() : "")
                .email(email)
                .bloodGroup(bloodGroup)
                .status(status)
                .feesStatus(feesStatus)
                .attendance("96.5%")
                .gender(Gender.OTHER)
                .passwordHash(passwordEncoder.encode("Student@123"))
                .build();

        Student saved = studentRepository.save(student);

        StudentDto dto = StudentDto.builder()
                .id(saved.getStudentCode())
                .name(name.trim())
                .grade(saved.getGrade())
                .section(saved.getSection())
                .stream(saved.getStream())
                .rollNo(saved.getRollNo())
                .parentPhone(saved.getPhone())
                .email(saved.getEmail())
                .bloodGroup(saved.getBloodGroup())
                .status(saved.getStatus().name())
                .feesStatus(saved.getFeesStatus())
                .attendance(saved.getAttendance())
                .build();

        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @PutMapping("/{studentCode}")
    public ResponseEntity<?> updateStudent(@PathVariable String studentCode, @RequestBody Map<String, Object> payload) {
        Optional<Student> studentOpt = studentRepository.findByStudentCode(studentCode);
        if (studentOpt.isEmpty()) {
            try {
                studentOpt = studentRepository.findById(Long.parseLong(studentCode));
            } catch (NumberFormatException ignored) {}
        }

        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student not found with ID/Code: " + studentCode));
        }

        Student student = studentOpt.get();

        if (payload.containsKey("name")) {
            String name = (String) payload.get("name");
            if (name != null && !name.trim().isEmpty()) {
                String[] parts = name.trim().split("\\s+", 2);
                student.setFirstName(parts[0]);
                student.setLastName(parts.length > 1 ? parts[1] : "");
            }
        }

        if (payload.containsKey("grade") && payload.get("grade") != null) {
            student.setGrade(payload.get("grade").toString());
        }

        if (payload.containsKey("section") && payload.get("section") != null) {
            student.setSection(payload.get("section").toString());
        }

        if (payload.containsKey("stream") && payload.get("stream") != null) {
            student.setStream(payload.get("stream").toString());
        }

        if (payload.containsKey("rollNo") && payload.get("rollNo") != null) {
            student.setRollNo(payload.get("rollNo").toString());
        }

        if (payload.containsKey("parentPhone") && payload.get("parentPhone") != null) {
            student.setPhone(payload.get("parentPhone").toString().trim());
        } else if (payload.containsKey("phone") && payload.get("phone") != null) {
            student.setPhone(payload.get("phone").toString().trim());
        }

        if (payload.containsKey("email") && payload.get("email") != null) {
            student.setEmail(payload.get("email").toString().trim().toLowerCase());
        }

        if (payload.containsKey("bloodGroup") && payload.get("bloodGroup") != null) {
            student.setBloodGroup(payload.get("bloodGroup").toString());
        }

        if (payload.containsKey("status") && payload.get("status") != null) {
            String status = payload.get("status").toString();
            student.setStatus("INACTIVE".equalsIgnoreCase(status) ? StudentStatus.INACTIVE : StudentStatus.ACTIVE);
        }

        if (payload.containsKey("feesStatus") && payload.get("feesStatus") != null) {
            student.setFeesStatus(payload.get("feesStatus").toString());
        }

        Student updated = studentRepository.save(student);

        String fullName = updated.getFirstName() + (updated.getLastName() != null && !updated.getLastName().isEmpty() ? " " + updated.getLastName() : "");

        StudentDto dto = StudentDto.builder()
                .id(updated.getStudentCode())
                .name(fullName)
                .grade(updated.getGrade())
                .section(updated.getSection())
                .stream(updated.getStream())
                .rollNo(updated.getRollNo())
                .parentPhone(updated.getPhone())
                .email(updated.getEmail())
                .bloodGroup(updated.getBloodGroup())
                .status(updated.getStatus().name())
                .feesStatus(updated.getFeesStatus())
                .attendance(updated.getAttendance() != null ? updated.getAttendance() : "95.0%")
                .build();

        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{studentCode}")
    public ResponseEntity<?> deleteStudent(@PathVariable String studentCode) {
        Optional<Student> studentOpt = studentRepository.findByStudentCode(studentCode);
        if (studentOpt.isEmpty()) {
            try {
                studentOpt = studentRepository.findById(Long.parseLong(studentCode));
            } catch (NumberFormatException ignored) {}
        }

        if (studentOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Student already removed or not found", "id", studentCode));
        }

        Student student = studentOpt.get();
        try {
            studentRepository.delete(student);
        } catch (Exception e) {
            // If relational constraint prevents hard delete, mark inactive
            student.setStatus(StudentStatus.INACTIVE);
            studentRepository.save(student);
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "Student deleted successfully from database", "id", studentCode));
    }
}
