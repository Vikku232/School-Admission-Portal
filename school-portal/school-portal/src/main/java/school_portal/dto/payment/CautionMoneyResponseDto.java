package school_portal.dto.payment;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.CautionMoneyStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CautionMoneyResponseDto {
    private Long cautionId;
    private Long studentId;
    private String studentName;
    private BigDecimal amount;
    private CautionMoneyStatus status;
    private LocalDateTime collectedAt;
    private LocalDateTime refundedAt;
}
