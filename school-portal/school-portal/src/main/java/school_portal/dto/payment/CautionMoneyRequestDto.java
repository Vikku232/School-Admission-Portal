package school_portal.dto.payment;

import lombok.Data;
import java.math.BigDecimal;

import school_portal.enums.CautionMoneyStatus;

@Data
public class CautionMoneyRequestDto {
    private Long studentId;
    private BigDecimal amount;
    private CautionMoneyStatus status;
}
