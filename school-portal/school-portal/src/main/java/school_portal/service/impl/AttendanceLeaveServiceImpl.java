package school_portal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import school_portal.dto.attendance.StudentAttendanceRequestDto;
import school_portal.dto.attendance.StudentAttendanceResponseDto;
import school_portal.dto.leave.StudentLeaveRequestRequestDto;
import school_portal.dto.leave.StudentLeaveRequestResponseDto;
import school_portal.entity.*;
import school_portal.enums.AttendanceStatus;
import school_portal.enums.LeaveStatus;
import school_portal.exception.ResourceNotFoundException;
import school_portal.repository.AdminRepository;
import school_portal.repository.StudentAttendanceRepository;
import school_portal.repository.StudentLeaveRequestRepository;
import school_portal.repository.StudentRepository;
import school_portal.service.AttendanceLeaveService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceLeaveServiceImpl implements AttendanceLeaveService {

    private final StudentAttendanceRepository studentAttendanceRepository;
    private final StudentLeaveRequestRepository studentLeaveRequestRepository;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;

    @Override
    public StudentAttendanceResponseDto markStudentAttendance(StudentAttendanceRequestDto request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        StudentAttendance attendance = studentAttendanceRepository
                .findByStudentStudentIdAndDate(request.getStudentId(), request.getDate())
                .orElse(null);

        if (attendance == null) {
            attendance = StudentAttendance.builder()
                    .student(student)
                    .date(request.getDate())
                    .clockIn(request.getClockIn())
                    .clockOut(request.getClockOut())
                    .totalHoursWorked(request.getTotalHoursWorked())
                    .attendanceStatus(request.getAttendanceStatus() != null ? request.getAttendanceStatus() : AttendanceStatus.PRESENT)
                    .build();
        } else {
            attendance.setClockIn(request.getClockIn());
            attendance.setClockOut(request.getClockOut());
            attendance.setTotalHoursWorked(request.getTotalHoursWorked());
            if (request.getAttendanceStatus() != null) {
                attendance.setAttendanceStatus(request.getAttendanceStatus());
            }
        }

        StudentAttendance saved = studentAttendanceRepository.save(attendance);

        return convertToAttendanceDto(saved);
    }

    @Override
    public StudentLeaveRequestResponseDto applyStudentLeave(StudentLeaveRequestRequestDto request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        StudentLeaveRequest leaveRequest = StudentLeaveRequest.builder()
                .student(student)
                .leaveDate(request.getLeaveDate())
                .reason(request.getReason())
                .status(request.getStatus() != null ? request.getStatus() : LeaveStatus.PENDING)
                .build();

        StudentLeaveRequest saved = studentLeaveRequestRepository.save(leaveRequest);

        return convertToLeaveDto(saved);
    }

    @Override
    public StudentLeaveRequestResponseDto approveStudentLeave(Long leaveId, Long approvedById) {
        StudentLeaveRequest leaveRequest = studentLeaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        Admin admin = adminRepository.findById(approvedById)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovedBy(admin);
        leaveRequest.setApprovedAt(LocalDateTime.now());

        StudentLeaveRequest saved = studentLeaveRequestRepository.save(leaveRequest);

        return convertToLeaveDto(saved);
    }

    private StudentAttendanceResponseDto convertToAttendanceDto(StudentAttendance attendance) {
        return StudentAttendanceResponseDto.builder()
                .attendanceId(attendance.getAttendanceId())
                .studentId(attendance.getStudent().getStudentId())
                .studentName(attendance.getStudent().getFirstName() + " " + attendance.getStudent().getLastName())
                .date(attendance.getDate())
                .clockIn(attendance.getClockIn())
                .clockOut(attendance.getClockOut())
                .totalHoursWorked(attendance.getTotalHoursWorked())
                .attendanceStatus(attendance.getAttendanceStatus())
                .isRegularized(attendance.getIsRegularized())
                .regularizationReason(attendance.getRegularizationReason())
                .regularizedById(attendance.getRegularizedBy() != null ? attendance.getRegularizedBy().getAdminId() : null)
                .build();
    }

    private StudentLeaveRequestResponseDto convertToLeaveDto(StudentLeaveRequest request) {
        return StudentLeaveRequestResponseDto.builder()
                .leaveId(request.getLeaveId())
                .studentId(request.getStudent().getStudentId())
                .studentName(request.getStudent().getFirstName() + " " + request.getStudent().getLastName())
                .leaveDate(request.getLeaveDate())
                .reason(request.getReason())
                .status(request.getStatus())
                .approvedById(request.getApprovedBy() != null ? request.getApprovedBy().getAdminId() : null)
                .approvedAt(request.getApprovedAt())
                .appliedAt(request.getAppliedAt())
                .build();
    }
}
