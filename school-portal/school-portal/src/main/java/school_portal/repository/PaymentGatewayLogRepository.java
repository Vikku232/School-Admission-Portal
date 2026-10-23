package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.PaymentGatewayLog;

import java.util.List;

public interface PaymentGatewayLogRepository extends JpaRepository<PaymentGatewayLog, Long> {
    List<PaymentGatewayLog> findByPaymentPaymentId(Long paymentId);
}
