package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.FeeStructureAudit;

import java.util.List;

public interface FeeStructureAuditRepository extends JpaRepository<FeeStructureAudit, Long> {
    List<FeeStructureAudit> findByFeeStructureFeeStructureId(Long feeStructureId);
}
