package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fee_types", uniqueConstraints = {@UniqueConstraint(columnNames = "fee_type_name")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fee_type_id")
    private Long feeTypeId;

    @Column(name = "fee_type_name", nullable = false, length = 100)
    private String feeTypeName;

    @Column(columnDefinition = "TEXT")
    private String description;
}
