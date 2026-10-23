package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.StudentBatchAssignment;

import java.util.List;
import java.util.Optional;

public interface StudentBatchAssignmentRepository extends JpaRepository<StudentBatchAssignment, Long> {
    List<StudentBatchAssignment> findByStudentStudentId(Long studentId);
    Optional<StudentBatchAssignment> findByStudentStudentIdAndIsCurrentTrue(Long studentId);
}
