package school_portal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import school_portal.dto.academic.*;
import school_portal.entity.*;
import school_portal.enums.InvoiceStatus;
import school_portal.exception.DuePaymentException;
import school_portal.exception.BadRequestException;
import school_portal.exception.ResourceNotFoundException;
import school_portal.repository.*;
import school_portal.service.AcademicService;

@Service
@RequiredArgsConstructor
@Transactional
public class AcademicServiceImpl implements AcademicService {

    private final GradeRepository gradeRepository;
    private final CourseRepository courseRepository;
    private final BatchRepository batchRepository;
    private final StudentBatchAssignmentRepository studentBatchAssignmentRepository;
    private final TimetableRepository timetableRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AdminRepository adminRepository;
    private final FeeInvoiceRepository feeInvoiceRepository;

    @Override
    public GradeResponseDto createGrade(GradeRequestDto request) {
        if (gradeRepository.findByGradeNameAndAcademicYear(request.getGradeName(), request.getAcademicYear()).isPresent()) {
            throw new BadRequestException("Grade already exists for this academic year");
        }
        Admin admin = null;
        if (request.getCreatedById() != null) {
            admin = adminRepository.findById(request.getCreatedById())
                    .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        }

        Grade grade = Grade.builder()
                .gradeName(request.getGradeName())
                .academicYear(request.getAcademicYear())
                .createdBy(admin)
                .build();

        Grade saved = gradeRepository.save(grade);

        return GradeResponseDto.builder()
                .gradeId(saved.getGradeId())
                .gradeName(saved.getGradeName())
                .academicYear(saved.getAcademicYear())
                .createdById(admin != null ? admin.getAdminId() : null)
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public CourseResponseDto createCourse(CourseRequestDto request) {
        Grade grade = gradeRepository.findById(request.getGradeId())
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));

        if (courseRepository.findByCourseCode(request.getCourseCode()).isPresent()) {
            throw new BadRequestException("Course code already exists");
        }

        Admin admin = null;
        if (request.getCreatedById() != null) {
            admin = adminRepository.findById(request.getCreatedById()).orElse(null);
        }

        Course course = Course.builder()
                .grade(grade)
                .courseName(request.getCourseName())
                .courseCode(request.getCourseCode())
                .credits(request.getCredits())
                .createdBy(admin)
                .build();

        Course saved = courseRepository.save(course);

        return CourseResponseDto.builder()
                .courseId(saved.getCourseId())
                .gradeId(grade.getGradeId())
                .gradeName(grade.getGradeName())
                .courseName(saved.getCourseName())
                .courseCode(saved.getCourseCode())
                .credits(saved.getCredits())
                .createdById(admin != null ? admin.getAdminId() : null)
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public BatchResponseDto createBatch(BatchRequestDto request) {
        Grade grade = gradeRepository.findById(request.getGradeId())
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));

        if (batchRepository.findByBatchNameAndGradeGradeId(request.getBatchName(), request.getGradeId()).isPresent()) {
            throw new BadRequestException("Batch name already exists in this grade");
        }

        Admin admin = null;
        if (request.getCreatedById() != null) {
            admin = adminRepository.findById(request.getCreatedById()).orElse(null);
        }

        Batch batch = Batch.builder()
                .grade(grade)
                .batchName(request.getBatchName())
                .capacity(request.getCapacity())
                .createdBy(admin)
                .build();

        Batch saved = batchRepository.save(batch);

        return BatchResponseDto.builder()
                .batchId(saved.getBatchId())
                .gradeId(grade.getGradeId())
                .gradeName(grade.getGradeName())
                .batchName(saved.getBatchName())
                .capacity(saved.getCapacity())
                .createdById(admin != null ? admin.getAdminId() : null)
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public StudentBatchAssignmentResponseDto assignStudentToBatch(StudentBatchAssignmentRequestDto request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));

        Admin admin = null;
        if (request.getAssignedById() != null) {
            admin = adminRepository.findById(request.getAssignedById()).orElse(null);
        }

        // Check for overdue invoices (Rule 4)
        boolean hasOverdue = feeInvoiceRepository.findByStudentStudentId(student.getStudentId()).stream()
                .anyMatch(invoice -> invoice.getStatus() == InvoiceStatus.OVERDUE);
        if (hasOverdue) {
            throw new DuePaymentException("Clear existing dues before enrolling in a new class.");
        }

        // Deactivate existing assignments
        studentBatchAssignmentRepository.findByStudentStudentIdAndIsCurrentTrue(request.getStudentId())
                .ifPresent(assignment -> {
                    assignment.setIsCurrent(false);
                    studentBatchAssignmentRepository.save(assignment);
                });

        StudentBatchAssignment assignment = StudentBatchAssignment.builder()
                .student(student)
                .batch(batch)
                .academicYear(request.getAcademicYear())
                .isCurrent(request.getIsCurrent() != null ? request.getIsCurrent() : true)
                .assignedBy(admin)
                .build();

        StudentBatchAssignment saved = studentBatchAssignmentRepository.save(assignment);

        return StudentBatchAssignmentResponseDto.builder()
                .assignmentId(saved.getAssignmentId())
                .studentId(student.getStudentId())
                .studentCode(student.getStudentCode())
                .studentName(student.getFirstName() + " " + student.getLastName())
                .batchId(batch.getBatchId())
                .batchName(batch.getBatchName())
                .academicYear(saved.getAcademicYear())
                .isCurrent(saved.getIsCurrent())
                .assignedById(admin != null ? admin.getAdminId() : null)
                .assignedAt(saved.getAssignedAt())
                .build();
    }

    @Override
    public TimetableResponseDto createTimetable(TimetableRequestDto request) {
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Admin admin = null;
        if (request.getCreatedById() != null) {
            admin = adminRepository.findById(request.getCreatedById()).orElse(null);
        }

        Timetable timetable = Timetable.builder()
                .batch(batch)
                .course(course)
                .teacher(teacher)
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .roomNumber(request.getRoomNumber())
                .createdBy(admin)
                .build();

        Timetable saved = timetableRepository.save(timetable);

        return TimetableResponseDto.builder()
                .timetableId(saved.getTimetableId())
                .batchId(batch.getBatchId())
                .batchName(batch.getBatchName())
                .courseId(course.getCourseId())
                .courseName(course.getCourseName())
                .teacherId(teacher.getTeacherId())
                .teacherName(teacher.getFirstName() + " " + teacher.getLastName())
                .dayOfWeek(saved.getDayOfWeek())
                .startTime(saved.getStartTime())
                .endTime(saved.getEndTime())
                .roomNumber(saved.getRoomNumber())
                .createdById(admin != null ? admin.getAdminId() : null)
                .build();
    }
}
