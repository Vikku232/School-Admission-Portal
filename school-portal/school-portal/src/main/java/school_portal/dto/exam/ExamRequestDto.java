package school_portal.dto.exam;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExamRequestDto {
    private Long gradeId;
    private Long courseId;
    private Long teacherId;
    private String examName;
    private LocalDate examDate;
    private Integer maxMarks;
}
