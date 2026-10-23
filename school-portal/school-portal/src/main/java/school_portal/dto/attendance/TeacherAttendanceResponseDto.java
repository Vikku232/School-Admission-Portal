package school_portal.dto.attendance;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.AttendanceStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class TeacherAttendanceResponseDto {
    private Long attendanceId;
    private Long teacherId;
    private String teacherName;
    private LocalDate date;
    private LocalTime clockIn;
    private LocalTime clockOut;
    private BigDecimal totalHoursWorked;
    private AttendanceStatus attendanceStatus;
    private Boolean isRegularized;
    private String regularizationReason;
    private Long regularizedById;
}
