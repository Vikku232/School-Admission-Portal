package school_portal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {
    private String id;
    private String name;
    private String grade;
    private String section;
    private String stream;
    private String rollNo;
    private String parentPhone;
    private String email;
    private String bloodGroup;
    private String status;
    private String feesStatus;
    private String attendance;
}
