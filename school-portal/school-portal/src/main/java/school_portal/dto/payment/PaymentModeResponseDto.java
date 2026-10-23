package school_portal.dto.payment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentModeResponseDto {
    private Long paymentModeId;
    private String modeName;
}
