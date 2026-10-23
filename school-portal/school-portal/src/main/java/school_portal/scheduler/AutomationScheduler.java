package school_portal.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import school_portal.entity.*;
import school_portal.enums.AttendanceStatus;
import school_portal.enums.InvoiceStatus;
import school_portal.enums.StudentStatus;
import school_portal.repository.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AutomationScheduler {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final StudentAttendanceRepository studentAttendanceRepository;
    private final TeacherAttendanceRepository teacherAttendanceRepository;
    private final NoticeRepository noticeRepository;
    private final StudentFeeAssignmentRepository studentFeeAssignmentRepository;
    private final FeeInvoiceRepository feeInvoiceRepository;
    private final InvoiceLineItemRepository invoiceLineItemRepository;

    /**
     * Nightly Attendance Audit: Runs daily at 1:00 AM.
     * Checks previous day's attendance. Auto-marks ABSENT for missing clock-ins or HALF_DAY for insufficient hours.
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void checkNightlyAttendance() {
        LocalDate targetDate = LocalDate.now().minusDays(1);
        log.info("Starting nightly attendance audit for target date: {}", targetDate);

        // 1. Audit Students
        List<Student> students = studentRepository.findByStatus(StudentStatus.ACTIVE);
        for (Student student : students) {
            StudentAttendance attendance = studentAttendanceRepository
                    .findByStudentStudentIdAndDate(student.getStudentId(), targetDate)
                    .orElse(null);

            if (attendance == null) {
                // No clock-in record at all: mark ABSENT
                StudentAttendance abs = StudentAttendance.builder()
                        .student(student)
                        .date(targetDate)
                        .attendanceStatus(AttendanceStatus.ABSENT)
                        .build();
                studentAttendanceRepository.save(abs);
            } else {
                // Clock-in exists but no clock-out, or total hours worked is null
                if (attendance.getClockOut() == null || attendance.getTotalHoursWorked() == null) {
                    attendance.setAttendanceStatus(AttendanceStatus.ABSENT);
                    studentAttendanceRepository.save(attendance);
                } else if (attendance.getTotalHoursWorked().compareTo(BigDecimal.valueOf(4.0)) < 0) {
                    // Under 4 hours worked: HALF_DAY
                    attendance.setAttendanceStatus(AttendanceStatus.HALF_DAY);
                    studentAttendanceRepository.save(attendance);
                }
            }
        }

        // 2. Audit Teachers
        List<Teacher> teachers = teacherRepository.findByIsActiveTrue();
        for (Teacher teacher : teachers) {
            TeacherAttendance attendance = teacherAttendanceRepository
                    .findByTeacherTeacherIdAndDate(teacher.getTeacherId(), targetDate)
                    .orElse(null);

            if (attendance == null) {
                // No clock-in record at all: mark ABSENT
                TeacherAttendance abs = TeacherAttendance.builder()
                        .teacher(teacher)
                        .date(targetDate)
                        .attendanceStatus(AttendanceStatus.ABSENT)
                        .build();
                teacherAttendanceRepository.save(abs);
            } else {
                if (attendance.getClockOut() == null || attendance.getTotalHoursWorked() == null) {
                    attendance.setAttendanceStatus(AttendanceStatus.ABSENT);
                    teacherAttendanceRepository.save(attendance);
                } else if (attendance.getTotalHoursWorked().compareTo(BigDecimal.valueOf(4.0)) < 0) {
                    attendance.setAttendanceStatus(AttendanceStatus.HALF_DAY);
                    teacherAttendanceRepository.save(attendance);
                }
            }
        }

        log.info("Completed nightly attendance audit for: {}", targetDate);
    }

    /**
     * Holiday Synchronizer: Runs daily at 12:30 AM.
     * Scans today's notices for any HOLIDAY notice type and auto-marks holiday attendance records.
     */
    @Scheduled(cron = "0 30 0 * * ?")
    public void syncHolidayNotices() {
        LocalDate today = LocalDate.now();
        log.info("Checking for HOLIDAY notices for target date: {}", today);

        List<Notice> holidayNotices = noticeRepository
                .findByNoticeForDateAndNoticeTypeNoticeTypeName(today, "HOLIDAY");

        if (!holidayNotices.isEmpty()) {
            log.info("Holiday notice detected for today. Auto-populating HOLIDAY attendance logs.");

            // Mark Students
            List<Student> students = studentRepository.findByStatus(StudentStatus.ACTIVE);
            for (Student student : students) {
                StudentAttendance att = studentAttendanceRepository
                        .findByStudentStudentIdAndDate(student.getStudentId(), today)
                        .orElse(null);

                if (att == null) {
                    att = StudentAttendance.builder()
                            .student(student)
                            .date(today)
                            .attendanceStatus(AttendanceStatus.HOLIDAY)
                            .build();
                } else {
                    att.setAttendanceStatus(AttendanceStatus.HOLIDAY);
                }
                studentAttendanceRepository.save(att);
            }

            // Mark Teachers
            List<Teacher> teachers = teacherRepository.findByIsActiveTrue();
            for (Teacher teacher : teachers) {
                TeacherAttendance att = teacherAttendanceRepository
                        .findByTeacherTeacherIdAndDate(teacher.getTeacherId(), today)
                        .orElse(null);

                if (att == null) {
                    att = TeacherAttendance.builder()
                            .teacher(teacher)
                            .date(today)
                            .attendanceStatus(AttendanceStatus.HOLIDAY)
                            .build();
                } else {
                    att.setAttendanceStatus(AttendanceStatus.HOLIDAY);
                }
                teacherAttendanceRepository.save(att);
            }
        }
    }

    /**
     * Invoice Generation Cycle: Runs on the 1st of every month at 2:00 AM.
     * Automatically generates billing invoices from active fee assignments.
     */
    @Scheduled(cron = "0 0 2 1 * ?")
    public void autoGenerateInvoices() {
        LocalDate today = LocalDate.now();
        log.info("Starting monthly billing invoice generation cycle on: {}", today);

        List<Student> students = studentRepository.findByStatus(StudentStatus.ACTIVE);
        for (Student student : students) {
            List<StudentFeeAssignment> assignments = studentFeeAssignmentRepository
                    .findByStudentStudentId(student.getStudentId());

            if (assignments.isEmpty()) {
                continue;
            }

            BigDecimal totalAmount = BigDecimal.ZERO;
            for (StudentFeeAssignment assignment : assignments) {
                totalAmount = totalAmount.add(assignment.getFeeStructure().getAmount());
            }

            String invoiceNumber = "INV-" + student.getStudentCode() + "-" + today.getMonthValue() + today.getYear();

            if (feeInvoiceRepository.findByInvoiceNumber(invoiceNumber).isPresent()) {
                // Avoid double invoicing
                continue;
            }

            FeeInvoice invoice = FeeInvoice.builder()
                    .invoiceNumber(invoiceNumber)
                    .student(student)
                    .totalAmount(totalAmount)
                    .dueDate(today.plusDays(15)) // Net 15 terms
                    .status(InvoiceStatus.UNPAID)
                    .build();

            FeeInvoice savedInvoice = feeInvoiceRepository.save(invoice);

            // Save individual lines for tracking
            for (StudentFeeAssignment assignment : assignments) {
                InvoiceLineItem line = InvoiceLineItem.builder()
                        .invoice(savedInvoice)
                        .feeStructure(assignment.getFeeStructure())
                        .amount(assignment.getFeeStructure().getAmount())
                        .description("Recurring Fee: " + assignment.getFeeStructure().getFeeType().getFeeTypeName())
                        .build();
                invoiceLineItemRepository.save(line);
            }
        }

        log.info("Completed billing invoice generation cycle.");
    }

    /**
     * Overdue Invoices Flagging: Runs daily at 3:00 AM.
     * Identifies unpaid invoices that have crossed their due dates and updates them to OVERDUE.
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void flagOverdueInvoices() {
        LocalDate today = LocalDate.now();
        log.info("Checking for overdue invoices on target date: {}", today);

        List<FeeInvoice> unpaidInvoices = feeInvoiceRepository
                .findByStatusAndDueDateBefore(InvoiceStatus.UNPAID, today);

        for (FeeInvoice invoice : unpaidInvoices) {
            invoice.setStatus(InvoiceStatus.OVERDUE);
            feeInvoiceRepository.save(invoice);
            log.info("Flagged invoice #{} as OVERDUE", invoice.getInvoiceNumber());
        }

        log.info("Completed overdue invoice check.");
    }
}
