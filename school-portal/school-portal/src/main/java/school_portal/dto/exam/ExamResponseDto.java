package school_portal.dto.exam;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ExamResponseDto {
    private Long examId;
    private Long gradeId;
    private String gradeName;
    private Long courseId;
    private String courseName;
    private Long teacherId;
    private String teacherName;
    private String examName;
    private LocalDate examDate;
    private Integer maxMarks;
    private LocalDateTime createdAt;
}
