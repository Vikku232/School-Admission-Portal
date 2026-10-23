package school_portal.service;

import school_portal.dto.assignment.AssignmentRequestDto;
import school_portal.dto.assignment.AssignmentResponseDto;
import school_portal.dto.assignment.AssignmentSubmissionRequestDto;
import school_portal.dto.assignment.AssignmentSubmissionResponseDto;
import school_portal.dto.exam.ExamRequestDto;
import school_portal.dto.exam.ExamResponseDto;

public interface ExamAssignmentService {
    ExamResponseDto createExam(ExamRequestDto request);
    AssignmentResponseDto createAssignment(AssignmentRequestDto request);
    AssignmentSubmissionResponseDto submitAssignment(AssignmentSubmissionRequestDto request);
}
