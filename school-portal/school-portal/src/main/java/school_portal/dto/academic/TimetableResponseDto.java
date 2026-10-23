package school_portal.dto.academic;

import lombok.Builder;
import lombok.Data;
import java.time.LocalTime;

@Data
@Builder
public class TimetableResponseDto {
    private Long timetableId;
    private Long batchId;
    private String batchName;
    private Long courseId;
    private String courseName;
    private Long teacherId;
    private String teacherName;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomNumber;
    private Long createdById;
}
