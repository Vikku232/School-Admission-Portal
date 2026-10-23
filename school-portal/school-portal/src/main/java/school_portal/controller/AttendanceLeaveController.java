package school_portal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.attendance.StudentAttendanceRequestDto;
import school_portal.dto.attendance.StudentAttendanceResponseDto;
import school_portal.dto.leave.StudentLeaveRequestRequestDto;
import school_portal.dto.leave.StudentLeaveRequestResponseDto;
import school_portal.service.AttendanceLeaveService;

@RestController
@RequestMapping("/api/attendance-leaves")
@RequiredArgsConstructor
public class AttendanceLeaveController {

    private final AttendanceLeaveService attendanceLeaveService;

    @PostMapping("/attendance")
    public ResponseEntity<StudentAttendanceResponseDto> markStudentAttendance(
            @Valid @RequestBody StudentAttendanceRequestDto request) {
        return new ResponseEntity<>(attendanceLeaveService.markStudentAttendance(request), HttpStatus.OK);
    }

    @PostMapping("/leaves")
    public ResponseEntity<StudentLeaveRequestResponseDto> applyStudentLeave(
            @Valid @RequestBody StudentLeaveRequestRequestDto request) {
        return new ResponseEntity<>(attendanceLeaveService.applyStudentLeave(request), HttpStatus.CREATED);
    }

    @PutMapping("/leaves/{id}/approve")
    public ResponseEntity<StudentLeaveRequestResponseDto> approveStudentLeave(
            @PathVariable Long id, @RequestParam Long approvedById) {
        return ResponseEntity.ok(attendanceLeaveService.approveStudentLeave(id, approvedById));
    }
}
