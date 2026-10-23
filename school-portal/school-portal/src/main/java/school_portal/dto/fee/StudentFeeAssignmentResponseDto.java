package school_portal.dto.fee;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class StudentFeeAssignmentResponseDto {
    private Long assignmentId;
    private Long studentId;
    private String studentName;
    private Long feeStructureId;
    private String feeTypeName;
    private Long assignedById;
    private LocalDateTime assignedAt;
}
