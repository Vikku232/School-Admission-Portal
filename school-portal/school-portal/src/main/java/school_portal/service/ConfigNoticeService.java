package school_portal.service;

import school_portal.dto.config.ConfigMasterRequestDto;
import school_portal.dto.config.ConfigMasterResponseDto;
import school_portal.dto.notice.NoticeRequestDto;
import school_portal.dto.notice.NoticeResponseDto;
import school_portal.dto.notice.NoticeTypeRequestDto;
import school_portal.dto.notice.NoticeTypeResponseDto;

public interface ConfigNoticeService {
    ConfigMasterResponseDto createConfigMaster(ConfigMasterRequestDto request);
    NoticeTypeResponseDto createNoticeType(NoticeTypeRequestDto request);
    NoticeResponseDto createNotice(NoticeRequestDto request);
}
