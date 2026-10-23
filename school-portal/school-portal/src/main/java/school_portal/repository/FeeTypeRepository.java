package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.FeeType;

import java.util.Optional;

public interface FeeTypeRepository extends JpaRepository<FeeType, Long> {
    Optional<FeeType> findByFeeTypeName(String feeTypeName);
}
