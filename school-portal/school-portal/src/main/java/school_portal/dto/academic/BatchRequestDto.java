package school_portal.dto.academic;

import lombok.Data;

@Data
public class BatchRequestDto {
    private Long gradeId;
    private String batchName;
    private Integer capacity;
    private Long createdById;
}
