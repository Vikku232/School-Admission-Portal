package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import school_portal.enums.AttendanceStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
    name = "teacher_attendance",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"teacher_id", "date"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Long attendanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "clock_in")
    private LocalTime clockIn;

    @Column(name = "clock_out")
    private LocalTime clockOut;

    @Column(name = "total_hours_worked", precision = 5, scale = 2)
    private BigDecimal totalHoursWorked;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", nullable = false, length = 30)
    private AttendanceStatus attendanceStatus;

    @Column(name = "is_regularized", nullable = false)
    @Builder.Default
    private Boolean isRegularized = false;

    @Column(name = "regularization_reason", columnDefinition = "TEXT")
    private String regularizationReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regularized_by")
    private Admin regularizedBy;
}
