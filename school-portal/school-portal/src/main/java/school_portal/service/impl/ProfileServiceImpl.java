package school_portal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import school_portal.dto.student.GuardianRequestDto;
import school_portal.dto.student.GuardianResponseDto;
import school_portal.dto.student.StudentRequestDto;
import school_portal.dto.student.StudentResponseDto;
import school_portal.entity.Guardian;
import school_portal.entity.Student;
import school_portal.enums.StudentStatus;
import school_portal.exception.BadRequestException;
import school_portal.exception.ResourceNotFoundException;
import school_portal.repository.GuardianRepository;
import school_portal.repository.StudentRepository;
import school_portal.service.ProfileService;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final StudentRepository studentRepository;
    private final GuardianRepository guardianRepository;

    @Override
    public StudentResponseDto registerStudent(StudentRequestDto request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Student with this email already exists");
        }
        if (studentRepository.existsByStudentCode(request.getStudentCode())) {
            throw new BadRequestException("Student with this code already exists");
        }

        Student student = Student.builder()
                .studentCode(request.getStudentCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash("password_hash_placeholder") // In real security, we BCrypt-encode this
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .permanentAddress(request.getPermanentAddress())
                .currentAddress(request.getCurrentAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .bloodGroup(request.getBloodGroup())
                .enrollmentDate(request.getEnrollmentDate())
                .status(StudentStatus.ACTIVE)
                .build();

        Student saved = studentRepository.save(student);

        return convertToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDto getStudentProfile(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        return convertToDto(student);
    }

    @Override
    public GuardianResponseDto addGuardian(GuardianRequestDto request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + request.getStudentId()));

        Guardian guardian = Guardian.builder()
                .student(student)
                .guardianName(request.getGuardianName())
                .relation(request.getRelation())
                .occupation(request.getOccupation())
                .phone(request.getPhone())
                .email(request.getEmail())
                .isPrimaryContact(request.getIsPrimaryContact() != null && request.getIsPrimaryContact())
                .build();

        Guardian saved = guardianRepository.save(guardian);

        return GuardianResponseDto.builder()
                .guardianId(saved.getGuardianId())
                .studentId(student.getStudentId())
                .guardianName(saved.getGuardianName())
                .relation(saved.getRelation())
                .occupation(saved.getOccupation())
                .phone(saved.getPhone())
                .email(saved.getEmail())
                .isPrimaryContact(saved.getIsPrimaryContact())
                .build();
    }

    private StudentResponseDto convertToDto(Student student) {
        return StudentResponseDto.builder()
                .studentId(student.getStudentId())
                .studentCode(student.getStudentCode())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .status(student.getStatus())
                .build();
    }
}
