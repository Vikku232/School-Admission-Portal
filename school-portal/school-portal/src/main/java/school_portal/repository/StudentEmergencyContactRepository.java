package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.StudentEmergencyContact;

import java.util.List;

public interface StudentEmergencyContactRepository extends JpaRepository<StudentEmergencyContact, Long> {

    List<StudentEmergencyContact> findByStudentStudentId(Long studentId);
}
