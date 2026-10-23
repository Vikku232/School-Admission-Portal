package school_portal.dto.config;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConfigMasterResponseDto {
    private Long configId;
    private String configKey;
    private String description;
}
