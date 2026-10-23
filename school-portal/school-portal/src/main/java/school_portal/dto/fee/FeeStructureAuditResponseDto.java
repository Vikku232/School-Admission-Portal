package school_portal.dto.fee;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class FeeStructureAuditResponseDto {
    private Long auditId;
    private Long feeStructureId;
    private BigDecimal oldAmount;
    private BigDecimal newAmount;
    private Long changedById;
    private LocalDateTime changedAt;
}
// Renaming to FeeStructureAuditResponseDto inside code content
