package school_portal.dto.academic;

import lombok.Data;

@Data
public class CourseRequestDto {
    private Long gradeId;
    private String courseName;
    private String courseCode;
    private Integer credits;
    private Long createdById;
}
