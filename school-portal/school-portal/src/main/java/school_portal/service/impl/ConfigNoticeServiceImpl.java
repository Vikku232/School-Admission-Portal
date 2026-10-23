package school_portal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import school_portal.dto.config.ConfigMasterRequestDto;
import school_portal.dto.config.ConfigMasterResponseDto;
import school_portal.dto.notice.NoticeRequestDto;
import school_portal.dto.notice.NoticeResponseDto;
import school_portal.dto.notice.NoticeTypeRequestDto;
import school_portal.dto.notice.NoticeTypeResponseDto;
import school_portal.entity.*;
import school_portal.exception.BadRequestException;
import school_portal.exception.ResourceNotFoundException;
import school_portal.repository.*;
import school_portal.service.ConfigNoticeService;

@Service
@RequiredArgsConstructor
@Transactional
public class ConfigNoticeServiceImpl implements ConfigNoticeService {

    private final ConfigMasterRepository configMasterRepository;
    private final NoticeTypeRepository noticeTypeRepository;
    private final NoticeRepository noticeRepository;
    private final GradeRepository gradeRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public ConfigMasterResponseDto createConfigMaster(ConfigMasterRequestDto request) {
        if (configMasterRepository.findByConfigKey(request.getConfigKey()).isPresent()) {
            throw new BadRequestException("Config key already exists");
        }

        ConfigMaster configMaster = ConfigMaster.builder()
                .configKey(request.getConfigKey())
                .description(request.getDescription())
                .build();

        ConfigMaster saved = configMasterRepository.save(configMaster);

        return ConfigMasterResponseDto.builder()
                .configId(saved.getConfigId())
                .configKey(saved.getConfigKey())
                .description(saved.getDescription())
                .build();
    }

    @Override
    public NoticeTypeResponseDto createNoticeType(NoticeTypeRequestDto request) {
        if (noticeTypeRepository.findByNoticeTypeName(request.getNoticeTypeName()).isPresent()) {
            throw new BadRequestException("Notice type already exists");
        }

        NoticeType noticeType = NoticeType.builder()
                .noticeTypeName(request.getNoticeTypeName())
                .build();

        NoticeType saved = noticeTypeRepository.save(noticeType);

        return NoticeTypeResponseDto.builder()
                .noticeTypeId(saved.getNoticeTypeId())
                .noticeTypeName(saved.getNoticeTypeName())
                .build();
    }

    @Override
    public NoticeResponseDto createNotice(NoticeRequestDto request) {
        NoticeType noticeType = noticeTypeRepository.findById(request.getNoticeTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Notice type not found"));

        Grade grade = null;
        if (request.getGradeId() != null) {
            grade = gradeRepository.findById(request.getGradeId()).orElse(null);
        }

        Teacher teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId()).orElse(null);
        }

        Notice notice = Notice.builder()
                .noticeType(noticeType)
                .grade(grade)
                .teacher(teacher)
                .title(request.getTitle())
                .content(request.getContent())
                .attachmentUrl(request.getAttachmentUrl())
                .noticeForDate(request.getNoticeForDate())
                .build();

        Notice saved = noticeRepository.save(notice);

        return NoticeResponseDto.builder()
                .noticeId(saved.getNoticeId())
                .noticeTypeId(noticeType.getNoticeTypeId())
                .noticeTypeName(noticeType.getNoticeTypeName())
                .gradeId(grade != null ? grade.getGradeId() : null)
                .gradeName(grade != null ? grade.getGradeName() : null)
                .teacherId(teacher != null ? teacher.getTeacherId() : null)
                .teacherName(teacher != null ? teacher.getFirstName() + " " + teacher.getLastName() : null)
                .title(saved.getTitle())
                .content(saved.getContent())
                .attachmentUrl(saved.getAttachmentUrl())
                .noticeForDate(saved.getNoticeForDate())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}
