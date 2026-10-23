package school_portal.dto.assignment;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AssignmentSubmissionResponseDto {
    private Long submissionId;
    private Long assignmentId;
    private String assignmentTitle;
    private Long studentId;
    private String studentName;
    private String submissionUrl;
    private LocalDateTime submittedAt;
    private Integer marksObtained;
    private String feedback;
}
