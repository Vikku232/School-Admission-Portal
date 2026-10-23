package school_portal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import school_portal.dto.assignment.AssignmentRequestDto;
import school_portal.dto.assignment.AssignmentResponseDto;
import school_portal.dto.assignment.AssignmentSubmissionRequestDto;
import school_portal.dto.assignment.AssignmentSubmissionResponseDto;
import school_portal.dto.exam.ExamRequestDto;
import school_portal.dto.exam.ExamResponseDto;
import school_portal.entity.*;
import school_portal.exception.BadRequestException;
import school_portal.exception.ResourceNotFoundException;
import school_portal.repository.*;
import school_portal.service.ExamAssignmentService;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamAssignmentServiceImpl implements ExamAssignmentService {

    private final ExamRepository examRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final GradeRepository gradeRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    @Override
    public ExamResponseDto createExam(ExamRequestDto request) {
        Grade grade = gradeRepository.findById(request.getGradeId())
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Exam exam = Exam.builder()
                .grade(grade)
                .course(course)
                .teacher(teacher)
                .examName(request.getExamName())
                .examDate(request.getExamDate())
                .maxMarks(request.getMaxMarks())
                .build();

        Exam saved = examRepository.save(exam);

        return ExamResponseDto.builder()
                .examId(saved.getExamId())
                .gradeId(grade.getGradeId())
                .gradeName(grade.getGradeName())
                .courseId(course.getCourseId())
                .courseName(course.getCourseName())
                .teacherId(teacher.getTeacherId())
                .teacherName(teacher.getFirstName() + " " + teacher.getLastName())
                .examName(saved.getExamName())
                .examDate(saved.getExamDate())
                .maxMarks(saved.getMaxMarks())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public AssignmentResponseDto createAssignment(AssignmentRequestDto request) {
        Grade grade = gradeRepository.findById(request.getGradeId())
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Assignment assignment = Assignment.builder()
                .grade(grade)
                .course(course)
                .teacher(teacher)
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .maxMarks(request.getMaxMarks())
                .build();

        Assignment saved = assignmentRepository.save(assignment);

        return AssignmentResponseDto.builder()
                .assignmentId(saved.getAssignmentId())
                .gradeId(grade.getGradeId())
                .gradeName(grade.getGradeName())
                .courseId(course.getCourseId())
                .courseName(course.getCourseName())
                .teacherId(teacher.getTeacherId())
                .teacherName(teacher.getFirstName() + " " + teacher.getLastName())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .dueDate(saved.getDueDate())
                .maxMarks(saved.getMaxMarks())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public AssignmentSubmissionResponseDto submitAssignment(AssignmentSubmissionRequestDto request) {
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (assignmentSubmissionRepository.findByAssignmentAssignmentIdAndStudentStudentId(
                request.getAssignmentId(), request.getStudentId()).isPresent()) {
            throw new BadRequestException("Student has already submitted this assignment");
        }

        AssignmentSubmission submission = AssignmentSubmission.builder()
                .assignment(assignment)
                .student(student)
                .submissionUrl(request.getSubmissionUrl())
                .marksObtained(request.getMarksObtained())
                .feedback(request.getFeedback())
                .build();

        AssignmentSubmission saved = assignmentSubmissionRepository.save(submission);

        return AssignmentSubmissionResponseDto.builder()
                .submissionId(saved.getSubmissionId())
                .assignmentId(assignment.getAssignmentId())
                .assignmentTitle(assignment.getTitle())
                .studentId(student.getStudentId())
                .studentName(student.getFirstName() + " " + student.getLastName())
                .submissionUrl(saved.getSubmissionUrl())
                .submittedAt(saved.getSubmittedAt())
                .marksObtained(saved.getMarksObtained())
                .feedback(saved.getFeedback())
                .build();
    }
}
