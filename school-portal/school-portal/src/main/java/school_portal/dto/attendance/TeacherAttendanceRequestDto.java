package school_portal.dto.attendance;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import school_portal.enums.AttendanceStatus;

@Data
public class TeacherAttendanceRequestDto {
    private Long teacherId;
    private LocalDate date;
    private LocalTime clockIn;
    private LocalTime clockOut;
    private BigDecimal totalHoursWorked;
    private AttendanceStatus attendanceStatus;
    private Boolean isRegularized;
    private String regularizationReason;
    private Long regularizedById;
}
