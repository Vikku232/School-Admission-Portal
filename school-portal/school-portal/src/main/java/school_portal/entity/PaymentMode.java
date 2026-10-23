package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_modes", uniqueConstraints = {@UniqueConstraint(columnNames = "mode_name")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_mode_id")
    private Long paymentModeId;

    @Column(name = "mode_name", nullable = false, length = 50)
    private String modeName;
}
