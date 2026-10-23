package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.ConfigMaster;

import java.util.Optional;

public interface ConfigMasterRepository extends JpaRepository<ConfigMaster, Long> {
    Optional<ConfigMaster> findByConfigKey(String configKey);
}
