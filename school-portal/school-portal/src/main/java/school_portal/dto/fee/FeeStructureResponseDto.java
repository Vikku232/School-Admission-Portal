package school_portal.dto.fee;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class FeeStructureResponseDto {
    private Long feeStructureId;
    private Long feeTypeId;
    private String feeTypeName;
    private String academicYear;
    private BigDecimal amount;
    private Boolean isMandatory;
    private Boolean isActive;
    private Long createdById;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
