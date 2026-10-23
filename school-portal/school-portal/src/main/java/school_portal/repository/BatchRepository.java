package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Batch;

import java.util.List;
import java.util.Optional;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    Optional<Batch> findByBatchNameAndGradeGradeId(String batchName, Long gradeId);
    List<Batch> findByGradeGradeId(Long gradeId);
}
