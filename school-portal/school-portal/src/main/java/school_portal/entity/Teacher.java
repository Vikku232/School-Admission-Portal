package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import school_portal.enums.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teachers",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "teacher_code"),
                @UniqueConstraint(columnNames = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(name = "teacher_code", nullable = false)
    private String teacherCode;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Gender gender = Gender.OTHER;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "subject")
    private String subject;

    @Column(name = "experience")
    private String experience;

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

    @Column(name = "govt_proof_url")
    private String govtProofUrl;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Builder.Default
    @Column(name = "is_first_login")
    private Boolean isFirstLogin = true;

    // Admin jisne teacher create kiya
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
        if (gender == null) {
            gender = Gender.OTHER;
        }
        if (isActive == null) {
            isActive = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @OneToMany(
            mappedBy = "teacher",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<TeacherEmergencyContact> emergencyContacts = new ArrayList<>();
}
