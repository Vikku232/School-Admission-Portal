package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.SchoolConfig;

import java.util.List;
import java.util.Optional;

public interface SchoolConfigRepository extends JpaRepository<SchoolConfig, Long> {
    List<SchoolConfig> findByAcademicYear(String academicYear);
    Optional<SchoolConfig> findByConfigConfigKeyAndAcademicYear(String configKey, String academicYear);
}
