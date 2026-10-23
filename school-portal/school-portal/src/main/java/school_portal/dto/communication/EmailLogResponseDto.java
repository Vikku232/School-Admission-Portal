package school_portal.dto.communication;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.EmailStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class EmailLogResponseDto {
    private Long emailLogId;
    private Long studentId;
    private String studentName;
    private String subject;
    private String body;
    private EmailStatus status;
    private Long sentById;
    private LocalDateTime sentAt;
}
