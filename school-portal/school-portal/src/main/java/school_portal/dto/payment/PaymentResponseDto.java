package school_portal.dto.payment;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponseDto {
    private Long paymentId;
    private Long invoiceId;
    private String invoiceNumber;
    private Long studentId;
    private String studentName;
    private BigDecimal amountPaid;
    private Long paymentModeId;
    private String paymentModeName;
    private LocalDateTime paymentDate;
    private String transactionReference;
    private Long collectedById;
    private PaymentStatus status;
    private Long approvedById;
    private LocalDateTime approvedAt;
    private String remarks;
    private LocalDateTime createdAt;
}
