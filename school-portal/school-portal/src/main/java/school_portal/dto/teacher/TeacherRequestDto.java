package school_portal.dto.teacher;

import lombok.Data;
import school_portal.enums.Gender;

import java.time.LocalDate;

@Data
public class TeacherRequestDto {

    private String teacherCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String permanentAddress;
    private String currentAddress;
    private String city;
    private String state;
    private String postalCode;
    private String bloodGroup;
}
