package school_portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notice_types", uniqueConstraints = {@UniqueConstraint(columnNames = "notice_type_name")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_type_id")
    private Long noticeTypeId;

    @Column(name = "notice_type_name", nullable = false, length = 100)
    private String noticeTypeName;
}
