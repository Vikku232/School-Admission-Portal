package school_portal.dto.admin;

import lombok.Data;

@Data
public class AdminRequestDto {

    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;
}
