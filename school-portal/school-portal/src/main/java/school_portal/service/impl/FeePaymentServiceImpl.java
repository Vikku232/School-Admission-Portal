package school_portal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import school_portal.dto.fee.*;
import school_portal.dto.payment.PaymentRequestDto;
import school_portal.dto.payment.PaymentResponseDto;
import school_portal.entity.*;
import school_portal.enums.InvoiceStatus;
import school_portal.enums.PaymentStatus;
import school_portal.exception.BadRequestException;
import school_portal.exception.ResourceNotFoundException;
import school_portal.repository.*;
import school_portal.service.FeePaymentService;

@Service
@RequiredArgsConstructor
@Transactional
public class FeePaymentServiceImpl implements FeePaymentService {

    private final FeeTypeRepository feeTypeRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final FeeStructureAuditRepository feeStructureAuditRepository;
    private final StudentFeeAssignmentRepository studentFeeAssignmentRepository;
    private final FeeInvoiceRepository feeInvoiceRepository;
    private final InvoiceLineItemRepository invoiceLineItemRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentModeRepository paymentModeRepository;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;

    @Override
    public FeeTypeResponseDto createFeeType(FeeTypeRequestDto request) {
        if (feeTypeRepository.findByFeeTypeName(request.getFeeTypeName()).isPresent()) {
            throw new BadRequestException("Fee type already exists");
        }

        FeeType feeType = FeeType.builder()
                .feeTypeName(request.getFeeTypeName())
                .description(request.getDescription())
                .build();

        FeeType saved = feeTypeRepository.save(feeType);

        return FeeTypeResponseDto.builder()
                .feeTypeId(saved.getFeeTypeId())
                .feeTypeName(saved.getFeeTypeName())
                .description(saved.getDescription())
                .build();
    }

    @Override
    public FeeStructureResponseDto createFeeStructure(FeeStructureRequestDto request) {
        FeeType feeType = feeTypeRepository.findById(request.getFeeTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee type not found"));

        if (feeStructureRepository.findByFeeTypeFeeTypeIdAndAcademicYear(
                request.getFeeTypeId(), request.getAcademicYear()).isPresent()) {
            throw new BadRequestException("Fee structure already exists for this fee type and academic year");
        }

        Admin admin = null;
        if (request.getCreatedById() != null) {
            admin = adminRepository.findById(request.getCreatedById()).orElse(null);
        }

        FeeStructure feeStructure = FeeStructure.builder()
                .feeType(feeType)
                .academicYear(request.getAcademicYear())
                .amount(request.getAmount())
                .isMandatory(request.getIsMandatory() != null ? request.getIsMandatory() : true)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .createdBy(admin)
                .build();

        FeeStructure saved = feeStructureRepository.save(feeStructure);

        return FeeStructureResponseDto.builder()
                .feeStructureId(saved.getFeeStructureId())
                .feeTypeId(feeType.getFeeTypeId())
                .feeTypeName(feeType.getFeeTypeName())
                .academicYear(saved.getAcademicYear())
                .amount(saved.getAmount())
                .isMandatory(saved.getIsMandatory())
                .isActive(saved.getIsActive())
                .createdById(admin != null ? admin.getAdminId() : null)
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }

    @Override
    public StudentFeeAssignmentResponseDto assignFeeToStudent(StudentFeeAssignmentRequestDto request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        FeeStructure feeStructure = feeStructureRepository.findById(request.getFeeStructureId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found"));

        Admin admin = null;
        if (request.getAssignedById() != null) {
            admin = adminRepository.findById(request.getAssignedById()).orElse(null);
        }

        StudentFeeAssignment assignment = StudentFeeAssignment.builder()
                .student(student)
                .feeStructure(feeStructure)
                .assignedBy(admin)
                .build();

        StudentFeeAssignment saved = studentFeeAssignmentRepository.save(assignment);

        return StudentFeeAssignmentResponseDto.builder()
                .assignmentId(saved.getAssignmentId())
                .studentId(student.getStudentId())
                .studentName(student.getFirstName() + " " + student.getLastName())
                .feeStructureId(feeStructure.getFeeStructureId())
                .feeTypeName(feeStructure.getFeeType().getFeeTypeName())
                .assignedById(admin != null ? admin.getAdminId() : null)
                .assignedAt(saved.getAssignedAt())
                .build();
    }

    @Override
    public FeeInvoiceResponseDto generateInvoice(FeeInvoiceRequestDto request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (feeInvoiceRepository.findByInvoiceNumber(request.getInvoiceNumber()).isPresent()) {
            throw new BadRequestException("Invoice number already exists");
        }

        FeeInvoice invoice = FeeInvoice.builder()
                .invoiceNumber(request.getInvoiceNumber())
                .student(student)
                .totalAmount(request.getTotalAmount())
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null ? request.getStatus() : InvoiceStatus.UNPAID)
                .build();

        FeeInvoice saved = feeInvoiceRepository.save(invoice);

        return FeeInvoiceResponseDto.builder()
                .invoiceId(saved.getInvoiceId())
                .invoiceNumber(saved.getInvoiceNumber())
                .studentId(student.getStudentId())
                .studentName(student.getFirstName() + " " + student.getLastName())
                .totalAmount(saved.getTotalAmount())
                .dueDate(saved.getDueDate())
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public PaymentResponseDto processPayment(PaymentRequestDto request) {
        FeeInvoice invoice = feeInvoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        PaymentMode mode = paymentModeRepository.findById(request.getPaymentModeId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment mode not found"));

        Admin admin = null;
        if (request.getCollectedById() != null) {
            admin = adminRepository.findById(request.getCollectedById()).orElse(null);
        }

        Payment payment = Payment.builder()
                .invoice(invoice)
                .student(student)
                .amountPaid(request.getAmountPaid())
                .paymentMode(mode)
                .status(request.getStatus() != null ? request.getStatus() : PaymentStatus.COMPLETED)
                .collectedBy(admin)
                .build();

        Payment saved = paymentRepository.save(payment);

        // Update invoice status if fully paid
        if (PaymentStatus.COMPLETED == saved.getStatus()) {
            invoice.setStatus(InvoiceStatus.PAID);
            feeInvoiceRepository.save(invoice);
        }

        return PaymentResponseDto.builder()
                .paymentId(saved.getPaymentId())
                .invoiceId(invoice.getInvoiceId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .studentId(student.getStudentId())
                .studentName(student.getFirstName() + " " + student.getLastName())
                .amountPaid(saved.getAmountPaid())
                .paymentModeId(mode.getPaymentModeId())
                .paymentModeName(mode.getModeName())
                .paymentDate(saved.getPaymentDate())
                .transactionReference(saved.getTransactionReference())
                .collectedById(admin != null ? admin.getAdminId() : null)
                .status(saved.getStatus())
                .remarks(saved.getRemarks())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public FeeStructureResponseDto updateFeeStructureAmount(Long feeStructureId, java.math.BigDecimal newAmount, Long adminId, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Reason is mandatory for fee structure modifications");
        }

        FeeStructure feeStructure = feeStructureRepository.findById(feeStructureId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found"));

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        java.math.BigDecimal oldAmount = feeStructure.getAmount();
        feeStructure.setAmount(newAmount);
        FeeStructure saved = feeStructureRepository.save(feeStructure);

        // Audit Logging (Rule 6)
        FeeStructureAudit audit = FeeStructureAudit.builder()
                .feeStructure(saved)
                .oldAmount(oldAmount)
                .newAmount(newAmount)
                .changedBy(admin)
                .reason(reason)
                .build();
        feeStructureAuditRepository.save(audit);

        return FeeStructureResponseDto.builder()
                .feeStructureId(saved.getFeeStructureId())
                .feeTypeId(saved.getFeeType().getFeeTypeId())
                .feeTypeName(saved.getFeeType().getFeeTypeName())
                .academicYear(saved.getAcademicYear())
                .amount(saved.getAmount())
                .isMandatory(saved.getIsMandatory())
                .isActive(saved.getIsActive())
                .createdById(saved.getCreatedBy() != null ? saved.getCreatedBy().getAdminId() : null)
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }
}
