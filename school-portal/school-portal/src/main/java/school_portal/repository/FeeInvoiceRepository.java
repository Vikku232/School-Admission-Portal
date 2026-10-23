package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.FeeInvoice;

import java.util.List;
import java.util.Optional;

public interface FeeInvoiceRepository extends JpaRepository<FeeInvoice, Long> {
    Optional<FeeInvoice> findByInvoiceNumber(String invoiceNumber);
    List<FeeInvoice> findByStudentStudentId(Long studentId);
    List<FeeInvoice> findByStatusAndDueDateBefore(school_portal.enums.InvoiceStatus status, java.time.LocalDate date);
}
