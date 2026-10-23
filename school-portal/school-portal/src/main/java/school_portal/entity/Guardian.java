package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import school_portal.enums.Relation;

@Entity
@Table(name = "guardians")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Guardian {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guardian_id")
    private Long guardianId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "guardian_name", nullable = false, length = 100)
    private String guardianName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Relation relation;

    @Column(length = 100)
    private String occupation;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(name = "is_primary_contact", nullable = false)
    @Builder.Default
    private Boolean isPrimaryContact = false;
}
