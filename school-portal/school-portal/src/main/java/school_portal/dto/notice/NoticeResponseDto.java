package school_portal.dto.notice;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class NoticeResponseDto {
    private Long noticeId;
    private Long gradeId;
    private String gradeName;
    private Long teacherId;
    private String teacherName;
    private Long noticeTypeId;
    private String noticeTypeName;
    private String title;
    private String content;
    private String attachmentUrl;
    private LocalDate noticeForDate;
    private LocalDateTime createdAt;
}
