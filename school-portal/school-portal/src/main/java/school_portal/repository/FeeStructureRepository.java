package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.FeeStructure;

import java.util.List;
import java.util.Optional;

public interface FeeStructureRepository extends JpaRepository<FeeStructure, Long> {
    Optional<FeeStructure> findByFeeTypeFeeTypeIdAndAcademicYear(Long feeTypeId, String academicYear);
    List<FeeStructure> findByAcademicYear(String academicYear);
}
