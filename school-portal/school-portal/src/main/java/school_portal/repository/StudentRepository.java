package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Student;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    Optional<Student> findByStudentCode(String studentCode);

    boolean existsByEmail(String email);

    boolean existsByStudentCode(String studentCode);

    java.util.List<Student> findByStatus(school_portal.enums.StudentStatus status);
}
