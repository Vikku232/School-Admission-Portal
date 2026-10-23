package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import school_portal.enums.DocumentVerificationStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Long documentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requirement_id", nullable = false)
    private DocumentRequirement requirement;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", length = 30)
    private DocumentVerificationStatus verificationStatus;

    @Column(name = "uploaded_by")
    private Long uploadedBy;

    @PrePersist
    public void prePersist() {
        this.uploadDate = LocalDateTime.now();
        if (this.verificationStatus == null) {
            this.verificationStatus = DocumentVerificationStatus.PENDING;
        }
    }
}
