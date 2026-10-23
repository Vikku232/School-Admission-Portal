package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Guardian;

import java.util.List;

public interface GuardianRepository extends JpaRepository<Guardian, Long> {
    List<Guardian> findByStudentStudentId(Long studentId);
}
