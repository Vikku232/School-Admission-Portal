package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.TeacherAttendance;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TeacherAttendanceRepository extends JpaRepository<TeacherAttendance, Long> {
    Optional<TeacherAttendance> findByTeacherTeacherIdAndDate(Long teacherId, LocalDate date);
    List<TeacherAttendance> findByTeacherTeacherId(Long teacherId);
    List<TeacherAttendance> findByDate(LocalDate date);
}
