package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Assignment;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByGradeGradeId(Long gradeId);
    List<Assignment> findByCourseCourseId(Long courseId);
    List<Assignment> findByTeacherTeacherId(Long teacherId);
}
