package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import school_portal.enums.CautionMoneyStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "caution_money")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CautionMoney {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "caution_id")
    private Long cautionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CautionMoneyStatus status;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;

    @PrePersist
    public void prePersist() {
        if (this.collectedAt == null) {
            this.collectedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = CautionMoneyStatus.COLLECTED;
        }
    }
}
