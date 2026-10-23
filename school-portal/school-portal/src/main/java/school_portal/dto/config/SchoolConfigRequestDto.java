package school_portal.dto.config;

import lombok.Data;

@Data
public class SchoolConfigRequestDto {
    private Long configId;
    private String configValue;
    private String academicYear;
    private Long updatedById;
}
