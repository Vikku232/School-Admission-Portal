package school_portal.dto.leave;

import lombok.Data;
import java.time.LocalDate;

import school_portal.enums.LeaveStatus;

@Data
public class StudentLeaveRequestRequestDto {
    private Long studentId;
    private LocalDate leaveDate;
    private String reason;
    private LeaveStatus status;
}
