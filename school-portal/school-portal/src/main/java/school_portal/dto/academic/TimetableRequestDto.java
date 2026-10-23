package school_portal.dto.academic;

import lombok.Data;
import java.time.LocalTime;

@Data
public class TimetableRequestDto {
    private Long batchId;
    private Long courseId;
    private Long teacherId;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomNumber;
    private Long createdById;
}
