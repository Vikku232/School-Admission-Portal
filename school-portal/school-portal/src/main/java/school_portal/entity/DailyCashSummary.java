package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_cash_summary", uniqueConstraints = {@UniqueConstraint(columnNames = "summary_date")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyCashSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "summary_id")
    private Long summaryId;

    @Column(name = "summary_date", nullable = false)
    private LocalDate summaryDate;

    @Column(name = "total_collected", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCollected;

    @Column(name = "total_refunded", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalRefunded;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entered_by")
    private Admin enteredBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
