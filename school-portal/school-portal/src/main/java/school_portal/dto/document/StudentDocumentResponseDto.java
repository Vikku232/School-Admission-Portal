package school_portal.dto.document;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.DocumentVerificationStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class StudentDocumentResponseDto {
    private Long documentId;
    private Long studentId;
    private Long requirementId;
    private String requirementName;
    private String fileUrl;
    private LocalDateTime uploadDate;
    private DocumentVerificationStatus verificationStatus;
    private Long uploadedBy;
}
