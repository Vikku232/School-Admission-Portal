package school_portal.dto.payment;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentGatewayLogResponseDto {
    private Long gatewayLogId;
    private Long paymentId;
    private String gatewayName;
    private String gatewayTransactionId;
    private String gatewayResponse;
    private String status;
    private LocalDateTime loggedAt;
}
