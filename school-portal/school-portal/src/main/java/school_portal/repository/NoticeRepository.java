package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.Notice;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByGradeGradeId(Long gradeId);
    List<Notice> findByTeacherTeacherId(Long teacherId);
    List<Notice> findByNoticeTypeNoticeTypeId(Long noticeTypeId);
    List<Notice> findByNoticeForDateAndNoticeTypeNoticeTypeName(java.time.LocalDate noticeForDate, String noticeTypeName);
}
