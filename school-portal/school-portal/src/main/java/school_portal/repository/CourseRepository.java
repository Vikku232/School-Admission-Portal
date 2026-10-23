package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Course;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    List<Course> findByGradeGradeId(Long gradeId);
}
