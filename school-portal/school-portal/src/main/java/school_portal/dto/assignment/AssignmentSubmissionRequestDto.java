package school_portal.dto.assignment;

import lombok.Data;

@Data
public class AssignmentSubmissionRequestDto {
    private Long assignmentId;
    private Long studentId;
    private String submissionUrl;
    private Integer marksObtained;
    private String feedback;
}
