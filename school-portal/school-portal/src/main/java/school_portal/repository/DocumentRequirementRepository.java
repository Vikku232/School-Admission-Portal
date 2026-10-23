package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.DocumentRequirement;

import java.util.Optional;

public interface DocumentRequirementRepository extends JpaRepository<DocumentRequirement, Long> {
    Optional<DocumentRequirement> findByDocumentName(String documentName);
}
