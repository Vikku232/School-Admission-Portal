package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.TeacherEmergencyContact;

import java.util.List;

public interface TeacherEmergencyContactRepository extends JpaRepository<TeacherEmergencyContact, Long> {

    List<TeacherEmergencyContact> findByTeacherTeacherId(Long teacherId);
}
