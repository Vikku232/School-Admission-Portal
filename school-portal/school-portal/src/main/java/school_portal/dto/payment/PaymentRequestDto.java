package school_portal.dto.payment;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import school_portal.enums.PaymentStatus;

@Data
public class PaymentRequestDto {
    private Long invoiceId;
    private Long studentId;
    private BigDecimal amountPaid;
    private Long paymentModeId;
    private String transactionReference;
    private Long collectedById;
    private PaymentStatus status;
    private Long approvedById;
    private String remarks;
}
