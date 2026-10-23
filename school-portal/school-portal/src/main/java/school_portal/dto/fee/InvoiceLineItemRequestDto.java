package school_portal.dto.fee;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class InvoiceLineItemRequestDto {
    private Long invoiceId;
    private Long feeStructureId;
    private BigDecimal amount;
    private String description;
}
