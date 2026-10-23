package school_portal.dto.academic;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CourseResponseDto {
    private Long courseId;
    private Long gradeId;
    private String gradeName;
    private String courseName;
    private String courseCode;
    private Integer credits;
    private Long createdById;
    private LocalDateTime createdAt;
}
