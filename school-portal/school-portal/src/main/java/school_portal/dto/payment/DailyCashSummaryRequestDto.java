package school_portal.dto.payment;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DailyCashSummaryRequestDto {
    private LocalDate summaryDate;
    private BigDecimal totalCollected;
    private BigDecimal totalRefunded;
    private Long enteredById;
}
