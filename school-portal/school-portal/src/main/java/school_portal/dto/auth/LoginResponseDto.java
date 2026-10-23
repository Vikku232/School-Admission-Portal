package school_portal.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {

    private String token;
    private String role;
    private String email;
    private String name;
}
