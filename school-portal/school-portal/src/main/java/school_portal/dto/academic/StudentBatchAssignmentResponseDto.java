package school_portal.dto.academic;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class StudentBatchAssignmentResponseDto {
    private Long assignmentId;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private Long batchId;
    private String batchName;
    private String academicYear;
    private Boolean isCurrent;
    private Long assignedById;
    private LocalDateTime assignedAt;
}
