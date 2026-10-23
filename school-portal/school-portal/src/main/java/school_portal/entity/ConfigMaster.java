package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "config_master", uniqueConstraints = {@UniqueConstraint(columnNames = "config_key")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfigMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "config_id")
    private Long configId;

    @Column(name = "config_key", nullable = false, length = 100)
    private String configKey;

    @Column(columnDefinition = "TEXT")
    private String description;
}
