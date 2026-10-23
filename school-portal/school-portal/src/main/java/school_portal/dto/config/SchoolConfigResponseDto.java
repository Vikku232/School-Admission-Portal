package school_portal.dto.config;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SchoolConfigResponseDto {
    private Long schoolConfigId;
    private Long configId;
    private String configKey;
    private String configValue;
    private String academicYear;
    private Long updatedById;
    private LocalDateTime updatedAt;
}
