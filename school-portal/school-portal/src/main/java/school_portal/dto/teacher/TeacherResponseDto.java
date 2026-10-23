package school_portal.dto.teacher;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.Gender;

@Data
@Builder
public class TeacherResponseDto {

    private Long teacherId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Gender gender;
    private Boolean isActive;
}
