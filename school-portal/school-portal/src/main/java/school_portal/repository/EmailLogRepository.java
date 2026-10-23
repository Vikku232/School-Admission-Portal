package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.EmailLog;

import java.util.List;

public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
    List<EmailLog> findByStudentStudentId(Long studentId);
}
