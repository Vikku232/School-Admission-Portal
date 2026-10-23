package school_portal.dto.notice;

import lombok.Data;
import java.time.LocalDate;

@Data
public class NoticeRequestDto {
    private Long gradeId;
    private Long teacherId;
    private Long noticeTypeId;
    private String title;
    private String content;
    private String attachmentUrl;
    private LocalDate noticeForDate;
}
