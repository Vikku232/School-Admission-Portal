package school_portal.dto.leave;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.LeaveStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TeacherLeaveRequestResponseDto {
    private Long leaveId;
    private Long teacherId;
    private String teacherName;
    private LocalDate leaveDate;
    private String reason;
    private LeaveStatus status;
    private Long approvedById;
    private LocalDateTime approvedAt;
    private LocalDateTime appliedAt;
}
