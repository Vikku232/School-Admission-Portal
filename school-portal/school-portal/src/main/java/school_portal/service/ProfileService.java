package school_portal.service;

import school_portal.dto.student.GuardianRequestDto;
import school_portal.dto.student.GuardianResponseDto;
import school_portal.dto.student.StudentRequestDto;
import school_portal.dto.student.StudentResponseDto;

public interface ProfileService {
    StudentResponseDto registerStudent(StudentRequestDto request);
    StudentResponseDto getStudentProfile(Long studentId);
    GuardianResponseDto addGuardian(GuardianRequestDto request);
}
