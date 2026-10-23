package school_portal.dto.academic;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class BatchResponseDto {
    private Long batchId;
    private Long gradeId;
    private String gradeName;
    private String batchName;
    private Integer capacity;
    private Long createdById;
    private LocalDateTime createdAt;
}
