package school_portal.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminResponseDto {

    private Long adminId;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean isActive;
}
