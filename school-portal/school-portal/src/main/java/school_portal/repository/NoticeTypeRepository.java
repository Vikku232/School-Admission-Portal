package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.NoticeType;

import java.util.Optional;

public interface NoticeTypeRepository extends JpaRepository<NoticeType, Long> {
    Optional<NoticeType> findByNoticeTypeName(String noticeTypeName);
}
