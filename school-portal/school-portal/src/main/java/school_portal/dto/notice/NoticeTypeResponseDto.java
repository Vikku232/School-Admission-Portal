package school_portal.dto.notice;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoticeTypeResponseDto {
    private Long noticeTypeId;
    private String noticeTypeName;
}
