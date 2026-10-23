package school_portal.dto.document;

import lombok.Data;

import school_portal.enums.DocumentVerificationStatus;

@Data
public class StudentDocumentRequestDto {
    private Long studentId;
    private Long requirementId;
    private String fileUrl;
    private DocumentVerificationStatus verificationStatus;
    private Long uploadedBy;
}
