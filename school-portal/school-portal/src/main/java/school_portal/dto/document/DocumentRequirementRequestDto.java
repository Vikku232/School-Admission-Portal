package school_portal.dto.document;

import lombok.Data;

@Data
public class DocumentRequirementRequestDto {
    private String documentName;
    private String description;
    private Boolean isMandatory;
    private Long createdById;
}
