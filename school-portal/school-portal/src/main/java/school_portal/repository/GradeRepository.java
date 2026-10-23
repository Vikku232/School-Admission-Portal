package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Grade;

import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findByGradeNameAndAcademicYear(String gradeName, String academicYear);
}
