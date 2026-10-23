package school_portal.dto.fee;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class InvoiceLineItemResponseDto {
    private Long lineItemId;
    private Long invoiceId;
    private Long feeStructureId;
    private String feeTypeName;
    private BigDecimal amount;
    private String description;
}
