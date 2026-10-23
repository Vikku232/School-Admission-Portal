package school_portal.dto.academic;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class GradeResponseDto {
    private Long gradeId;
    private String gradeName;
    private String academicYear;
    private Long createdById;
    private LocalDateTime createdAt;
}
