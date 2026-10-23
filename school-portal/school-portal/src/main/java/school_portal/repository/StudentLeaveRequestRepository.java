package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.StudentLeaveRequest;

import java.util.List;

public interface StudentLeaveRequestRepository extends JpaRepository<StudentLeaveRequest, Long> {
    List<StudentLeaveRequest> findByStudentStudentId(Long studentId);
}
