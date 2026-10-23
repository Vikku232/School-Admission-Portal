package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.PaymentMode;

import java.util.Optional;

public interface PaymentModeRepository extends JpaRepository<PaymentMode, Long> {
    Optional<PaymentMode> findByModeName(String modeName);
}
