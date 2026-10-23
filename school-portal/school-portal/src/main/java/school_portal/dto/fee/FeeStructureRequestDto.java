package school_portal.dto.fee;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FeeStructureRequestDto {
    private Long feeTypeId;
    private String academicYear;
    private BigDecimal amount;
    private Boolean isMandatory;
    private Boolean isActive;
    private Long createdById;
}
