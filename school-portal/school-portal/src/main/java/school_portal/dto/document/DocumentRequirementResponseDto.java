package school_portal.dto.document;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DocumentRequirementResponseDto {
    private Long requirementId;
    private String documentName;
    private String description;
    private Boolean isMandatory;
    private Long createdById;
    private LocalDateTime createdAt;
}
