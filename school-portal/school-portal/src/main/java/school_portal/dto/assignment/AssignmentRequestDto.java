package school_portal.dto.assignment;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AssignmentRequestDto {
    private Long gradeId;
    private Long courseId;
    private Long teacherId;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Integer maxMarks;
}
