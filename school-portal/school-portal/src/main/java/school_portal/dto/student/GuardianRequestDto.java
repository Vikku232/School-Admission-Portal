package school_portal.dto.student;

import lombok.Data;
import school_portal.enums.Relation;

@Data
public class GuardianRequestDto {
    private Long studentId;
    private String guardianName;
    private Relation relation;
    private String occupation;
    private String phone;
    private String email;
    private Boolean isPrimaryContact;
}
