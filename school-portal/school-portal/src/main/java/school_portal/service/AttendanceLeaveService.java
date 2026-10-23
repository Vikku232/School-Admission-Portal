package school_portal.service;

import school_portal.dto.attendance.StudentAttendanceRequestDto;
import school_portal.dto.attendance.StudentAttendanceResponseDto;
import school_portal.dto.leave.StudentLeaveRequestRequestDto;
import school_portal.dto.leave.StudentLeaveRequestResponseDto;

public interface AttendanceLeaveService {
    StudentAttendanceResponseDto markStudentAttendance(StudentAttendanceRequestDto request);
    StudentLeaveRequestResponseDto applyStudentLeave(StudentLeaveRequestRequestDto request);
    StudentLeaveRequestResponseDto approveStudentLeave(Long leaveId, Long approvedById);
}
