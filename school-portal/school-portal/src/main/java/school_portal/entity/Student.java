package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import school_portal.enums.Gender;
import school_portal.enums.StudentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students", uniqueConstraints = {@UniqueConstraint(columnNames = "student_code"), @UniqueConstraint(columnNames = "email")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "student_code", nullable = false, length = 50)
    private String studentCode;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "grade")
    private String grade;

    @Column(name = "section")
    private String section;

    @Column(name = "stream")
    private String stream;

    @Column(name = "roll_no")
    private String rollNo;

    @Column(name = "fees_status")
    private String feesStatus;

    @Column(name = "attendance")
    private String attendance;

    @Column(name = "permanent_address", columnDefinition = "TEXT")
    private String permanentAddress;

    @Column(name = "current_address", columnDefinition = "TEXT")
    private String currentAddress;

    private String city;

    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @Enumerated(EnumType.STRING)
    private StudentStatus status;

    @Column(name = "scholarship_type")
    private String scholarshipType;

    @Column(name = "scholarship_reason", columnDefinition = "TEXT")
    private String scholarshipReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Admin createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = StudentStatus.ACTIVE;
        }
        if (gender == null) {
            gender = Gender.OTHER;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StudentEmergencyContact> emergencyContacts = new ArrayList<>();
}
