package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.StudentDocument;

import java.util.List;

public interface StudentDocumentRepository extends JpaRepository<StudentDocument, Long> {
    List<StudentDocument> findByStudentStudentId(Long studentId);
}
