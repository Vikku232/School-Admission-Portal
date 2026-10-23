package school_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import school_portal.entity.CautionMoney;

import java.util.List;

public interface CautionMoneyRepository extends JpaRepository<CautionMoney, Long> {
    List<CautionMoney> findByStudentStudentId(Long studentId);
}
