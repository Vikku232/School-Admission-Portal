package school_portal.dto.payment;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class DailyCashSummaryResponseDto {
    private Long summaryId;
    private LocalDate summaryDate;
    private BigDecimal totalCollected;
    private BigDecimal totalRefunded;
    private Long enteredById;
    private LocalDateTime createdAt;
}
