package school_portal.dto.leave;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.LeaveStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class StudentLeaveRequestResponseDto {
    private Long leaveId;
    private Long studentId;
    private String studentName;
    private LocalDate leaveDate;
    private String reason;
    private LeaveStatus status;
    private Long approvedById;
    private LocalDateTime approvedAt;
    private LocalDateTime appliedAt;
}
