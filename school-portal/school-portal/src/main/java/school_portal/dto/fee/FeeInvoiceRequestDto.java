package school_portal.dto.fee;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

import school_portal.enums.InvoiceStatus;

@Data
public class FeeInvoiceRequestDto {
    private String invoiceNumber;
    private Long studentId;
    private BigDecimal totalAmount;
    private LocalDate dueDate;
    private InvoiceStatus status;
}
