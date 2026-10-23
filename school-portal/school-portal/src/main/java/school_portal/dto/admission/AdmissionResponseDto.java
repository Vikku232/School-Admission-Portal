package school_portal.dto.admission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionResponseDto {
    private boolean success;
    private String applicationNumber;
    private String status;
    private String studentName;
    private String streamApplying;
    private String emailSentTo;
    private String phone;
    private String message;
    private String confirmationSlipUrl;
    private LocalDateTime submissionDate;
}
