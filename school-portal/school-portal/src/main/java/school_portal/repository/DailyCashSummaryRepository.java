package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.DailyCashSummary;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyCashSummaryRepository extends JpaRepository<DailyCashSummary, Long> {
    Optional<DailyCashSummary> findBySummaryDate(LocalDate summaryDate);
}
