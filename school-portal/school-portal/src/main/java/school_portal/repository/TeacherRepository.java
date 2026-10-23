package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Teacher;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Optional<Teacher> findByEmail(String email);

    Optional<Teacher> findByTeacherCode(String teacherCode);

    boolean existsByEmail(String email);

    boolean existsByTeacherCode(String teacherCode);

    java.util.List<Teacher> findByIsActiveTrue();
}
