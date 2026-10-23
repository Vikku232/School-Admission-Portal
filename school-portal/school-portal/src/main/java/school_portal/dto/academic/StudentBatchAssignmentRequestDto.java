package school_portal.dto.academic;

import lombok.Data;

@Data
public class StudentBatchAssignmentRequestDto {
    private Long studentId;
    private Long batchId;
    private String academicYear;
    private Boolean isCurrent;
    private Long assignedById;
}
