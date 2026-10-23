package school_portal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.academic.*;
import school_portal.service.AcademicService;

@RestController
@RequestMapping("/api/academics")
@RequiredArgsConstructor
public class AcademicController {

    private final AcademicService academicService;

    @PostMapping("/grades")
    public ResponseEntity<GradeResponseDto> createGrade(@Valid @RequestBody GradeRequestDto request) {
        return new ResponseEntity<>(academicService.createGrade(request), HttpStatus.CREATED);
    }

    @PostMapping("/courses")
    public ResponseEntity<CourseResponseDto> createCourse(@Valid @RequestBody CourseRequestDto request) {
        return new ResponseEntity<>(academicService.createCourse(request), HttpStatus.CREATED);
    }

    @PostMapping("/batches")
    public ResponseEntity<BatchResponseDto> createBatch(@Valid @RequestBody BatchRequestDto request) {
        return new ResponseEntity<>(academicService.createBatch(request), HttpStatus.CREATED);
    }

    @PostMapping("/batch-assignments")
    public ResponseEntity<StudentBatchAssignmentResponseDto> assignStudentToBatch(
            @Valid @RequestBody StudentBatchAssignmentRequestDto request) {
        return new ResponseEntity<>(academicService.assignStudentToBatch(request), HttpStatus.CREATED);
    }

    @PostMapping("/timetables")
    public ResponseEntity<TimetableResponseDto> createTimetable(@Valid @RequestBody TimetableRequestDto request) {
        return new ResponseEntity<>(academicService.createTimetable(request), HttpStatus.CREATED);
    }
}
