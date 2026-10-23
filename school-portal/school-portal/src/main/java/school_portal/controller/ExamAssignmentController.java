package school_portal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.assignment.AssignmentRequestDto;
import school_portal.dto.assignment.AssignmentResponseDto;
import school_portal.dto.assignment.AssignmentSubmissionRequestDto;
import school_portal.dto.assignment.AssignmentSubmissionResponseDto;
import school_portal.dto.exam.ExamRequestDto;
import school_portal.dto.exam.ExamResponseDto;
import school_portal.service.ExamAssignmentService;

@RestController
@RequestMapping("/api/exams-assignments")
@RequiredArgsConstructor
public class ExamAssignmentController {

    private final ExamAssignmentService examAssignmentService;

    @PostMapping("/exams")
    public ResponseEntity<ExamResponseDto> createExam(@Valid @RequestBody ExamRequestDto request) {
        return new ResponseEntity<>(examAssignmentService.createExam(request), HttpStatus.CREATED);
    }

    @PostMapping("/assignments")
    public ResponseEntity<AssignmentResponseDto> createAssignment(@Valid @RequestBody AssignmentRequestDto request) {
        return new ResponseEntity<>(examAssignmentService.createAssignment(request), HttpStatus.CREATED);
    }

    @PostMapping("/submissions")
    public ResponseEntity<AssignmentSubmissionResponseDto> submitAssignment(
            @Valid @RequestBody AssignmentSubmissionRequestDto request) {
        return new ResponseEntity<>(examAssignmentService.submitAssignment(request), HttpStatus.CREATED);
    }
}
