package school_portal.dto.fee;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeeTypeResponseDto {
    private Long feeTypeId;
    private String feeTypeName;
    private String description;
}
