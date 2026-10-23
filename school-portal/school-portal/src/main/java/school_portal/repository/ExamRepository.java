package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Exam;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByGradeGradeId(Long gradeId);
    List<Exam> findByCourseCourseId(Long courseId);
    List<Exam> findByTeacherTeacherId(Long teacherId);
}
