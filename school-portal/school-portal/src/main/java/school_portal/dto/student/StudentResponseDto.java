package school_portal.dto.student;

import lombok.Builder;
import lombok.Data;
import school_portal.enums.StudentStatus;

@Data
@Builder
public class StudentResponseDto {

    private Long studentId;
    private String studentCode;
    private String firstName;
    private String lastName;
    private String email;
    private StudentStatus status;
}
