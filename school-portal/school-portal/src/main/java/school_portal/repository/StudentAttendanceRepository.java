package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.StudentAttendance;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, Long> {
    Optional<StudentAttendance> findByStudentStudentIdAndDate(Long studentId, LocalDate date);
    List<StudentAttendance> findByStudentStudentId(Long studentId);
    List<StudentAttendance> findByDate(LocalDate date);
}
