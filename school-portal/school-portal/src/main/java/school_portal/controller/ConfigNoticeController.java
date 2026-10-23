package school_portal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.config.ConfigMasterRequestDto;
import school_portal.dto.config.ConfigMasterResponseDto;
import school_portal.dto.notice.NoticeRequestDto;
import school_portal.dto.notice.NoticeResponseDto;
import school_portal.dto.notice.NoticeTypeRequestDto;
import school_portal.dto.notice.NoticeTypeResponseDto;
import school_portal.service.ConfigNoticeService;

@RestController
@RequestMapping("/api/configs-notices")
@RequiredArgsConstructor
public class ConfigNoticeController {

    private final ConfigNoticeService configNoticeService;

    @PostMapping("/configs")
    public ResponseEntity<ConfigMasterResponseDto> createConfigMaster(@Valid @RequestBody ConfigMasterRequestDto request) {
        return new ResponseEntity<>(configNoticeService.createConfigMaster(request), HttpStatus.CREATED);
    }

    @PostMapping("/notice-types")
    public ResponseEntity<NoticeTypeResponseDto> createNoticeType(@Valid @RequestBody NoticeTypeRequestDto request) {
        return new ResponseEntity<>(configNoticeService.createNoticeType(request), HttpStatus.CREATED);
    }

    @PostMapping("/notices")
    public ResponseEntity<NoticeResponseDto> createNotice(@Valid @RequestBody NoticeRequestDto request) {
        return new ResponseEntity<>(configNoticeService.createNotice(request), HttpStatus.CREATED);
    }
}
