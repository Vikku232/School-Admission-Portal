package school_portal.dto.communication;

import lombok.Data;

import school_portal.enums.EmailStatus;

@Data
public class EmailLogRequestDto {
    private Long studentId;
    private String subject;
    private String body;
    private EmailStatus status;
    private Long sentById;
}
