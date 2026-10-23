package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.StudentFeeAssignment;

import java.util.List;

public interface StudentFeeAssignmentRepository extends JpaRepository<StudentFeeAssignment, Long> {
    List<StudentFeeAssignment> findByStudentStudentId(Long studentId);
}
