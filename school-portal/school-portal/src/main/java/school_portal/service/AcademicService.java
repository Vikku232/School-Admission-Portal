package school_portal.service;

import school_portal.dto.academic.*;

public interface AcademicService {
    GradeResponseDto createGrade(GradeRequestDto request);
    CourseResponseDto createCourse(CourseRequestDto request);
    BatchResponseDto createBatch(BatchRequestDto request);
    StudentBatchAssignmentResponseDto assignStudentToBatch(StudentBatchAssignmentRequestDto request);
    TimetableResponseDto createTimetable(TimetableRequestDto request);
}
