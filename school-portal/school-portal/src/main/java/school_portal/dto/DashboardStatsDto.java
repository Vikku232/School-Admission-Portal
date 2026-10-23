package school_portal.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardStatsDto {
    private long totalStudents;
    private long totalTeachers;
    private double todayCollection;
    private double pendingFees;
    private List<PaymentSummaryDto> recentPayments;

    @Data
    @Builder
    public static class PaymentSummaryDto {
        private String id;
        private String studentName;
        private double amount;
        private String date;
        private String status;
    }
}
