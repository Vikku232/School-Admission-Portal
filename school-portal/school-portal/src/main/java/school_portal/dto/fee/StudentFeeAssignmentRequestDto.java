package school_portal.dto.fee;

import lombok.Data;

@Data
public class StudentFeeAssignmentRequestDto {
    private Long studentId;
    private Long feeStructureId;
    private Long assignedById;
}
