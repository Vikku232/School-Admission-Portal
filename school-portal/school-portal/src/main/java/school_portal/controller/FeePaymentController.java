package school_portal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.fee.*;
import school_portal.dto.payment.PaymentRequestDto;
import school_portal.dto.payment.PaymentResponseDto;
import school_portal.service.FeePaymentService;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeePaymentController {

    private final FeePaymentService feePaymentService;

    @PostMapping("/types")
    public ResponseEntity<FeeTypeResponseDto> createFeeType(@Valid @RequestBody FeeTypeRequestDto request) {
        return new ResponseEntity<>(feePaymentService.createFeeType(request), HttpStatus.CREATED);
    }

    @PostMapping("/structures")
    public ResponseEntity<FeeStructureResponseDto> createFeeStructure(@Valid @RequestBody FeeStructureRequestDto request) {
        return new ResponseEntity<>(feePaymentService.createFeeStructure(request), HttpStatus.CREATED);
    }

    @PostMapping("/assignments")
    public ResponseEntity<StudentFeeAssignmentResponseDto> assignFeeToStudent(
            @Valid @RequestBody StudentFeeAssignmentRequestDto request) {
        return new ResponseEntity<>(feePaymentService.assignFeeToStudent(request), HttpStatus.CREATED);
    }

    @PostMapping("/invoices")
    public ResponseEntity<FeeInvoiceResponseDto> generateInvoice(@Valid @RequestBody FeeInvoiceRequestDto request) {
        return new ResponseEntity<>(feePaymentService.generateInvoice(request), HttpStatus.CREATED);
    }

    @PostMapping("/payments")
    public ResponseEntity<PaymentResponseDto> processPayment(@Valid @RequestBody PaymentRequestDto request) {
        return new ResponseEntity<>(feePaymentService.processPayment(request), HttpStatus.CREATED);
    }

    @PutMapping("/structures/{id}/amount")
    public ResponseEntity<FeeStructureResponseDto> updateFeeStructureAmount(
            @PathVariable Long id,
            @RequestParam java.math.BigDecimal amount,
            @RequestParam Long adminId,
            @RequestParam String reason) {
        return ResponseEntity.ok(feePaymentService.updateFeeStructureAmount(id, amount, adminId, reason));
    }
}
