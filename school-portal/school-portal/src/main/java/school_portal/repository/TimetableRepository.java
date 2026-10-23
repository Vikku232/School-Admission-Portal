package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Timetable;

import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByBatchBatchId(Long batchId);
    List<Timetable> findByTeacherTeacherId(Long teacherId);
}
