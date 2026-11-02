package co.pharma.repository;

import co.pharma.entity.SupplyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplyRecordRepository extends JpaRepository<SupplyRecord, Long> {
    List<SupplyRecord> findAllByOrderByIdDesc();
}
