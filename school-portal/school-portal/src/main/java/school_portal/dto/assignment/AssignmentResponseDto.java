package school_portal.dto.assignment;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class AssignmentResponseDto {
    private Long assignmentId;
    private Long gradeId;
    private String gradeName;
    private Long courseId;
    private String courseName;
    private Long teacherId;
    private String teacherName;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Integer maxMarks;
    private LocalDateTime createdAt;
}
