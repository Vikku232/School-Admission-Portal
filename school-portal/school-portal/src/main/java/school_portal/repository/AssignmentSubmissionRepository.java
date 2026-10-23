package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.AssignmentSubmission;

import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    Optional<AssignmentSubmission> findByAssignmentAssignmentIdAndStudentStudentId(Long assignmentId, Long studentId);
    List<AssignmentSubmission> findByAssignmentAssignmentId(Long assignmentId);
    List<AssignmentSubmission> findByStudentStudentId(Long studentId);
}
