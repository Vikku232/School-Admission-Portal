package school_portal.service;

import school_portal.dto.fee.*;
import school_portal.dto.payment.PaymentRequestDto;
import school_portal.dto.payment.PaymentResponseDto;

public interface FeePaymentService {
    FeeTypeResponseDto createFeeType(FeeTypeRequestDto request);
    FeeStructureResponseDto createFeeStructure(FeeStructureRequestDto request);
    StudentFeeAssignmentResponseDto assignFeeToStudent(StudentFeeAssignmentRequestDto request);
    FeeInvoiceResponseDto generateInvoice(FeeInvoiceRequestDto request);
    PaymentResponseDto processPayment(PaymentRequestDto request);
    FeeStructureResponseDto updateFeeStructureAmount(Long feeStructureId, java.math.BigDecimal newAmount, Long adminId, String reason);
}
