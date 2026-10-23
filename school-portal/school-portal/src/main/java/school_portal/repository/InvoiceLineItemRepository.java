package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.InvoiceLineItem;

import java.util.List;

public interface InvoiceLineItemRepository extends JpaRepository<InvoiceLineItem, Long> {
    List<InvoiceLineItem> findByInvoiceInvoiceId(Long invoiceId);
}
