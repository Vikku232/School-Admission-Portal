package school_portal.dto.academic;

import lombok.Data;

@Data
public class GradeRequestDto {
    private String gradeName;
    private String academicYear;
    private Long createdById;
}
