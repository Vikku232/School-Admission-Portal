package school_portal.dto.fee;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.InvoiceStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class FeeInvoiceResponseDto {
    private Long invoiceId;
    private String invoiceNumber;
    private Long studentId;
    private String studentName;
    private BigDecimal totalAmount;
    private LocalDate dueDate;
    private InvoiceStatus status;
    private LocalDateTime createdAt;
}
