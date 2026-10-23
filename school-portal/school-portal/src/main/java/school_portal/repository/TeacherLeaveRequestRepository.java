package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.TeacherLeaveRequest;

import java.util.List;

public interface TeacherLeaveRequestRepository extends JpaRepository<TeacherLeaveRequest, Long> {
    List<TeacherLeaveRequest> findByTeacherTeacherId(Long teacherId);
}
