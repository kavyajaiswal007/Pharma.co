package co.pharma.repository;

import co.pharma.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.medName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.category) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY m.id DESC")
    List<Medicine> searchMedicines(@Param("query") String query);

    List<Medicine> findAllByOrderByIdDesc();

    List<Medicine> findByQtyInStockLessThanOrderByQtyInStockAsc(int threshold);

    @Query("SELECT m FROM Medicine m WHERE m.expDate <= :targetDate ORDER BY m.expDate ASC")
    List<Medicine> findExpiringSoon(@Param("targetDate") LocalDate targetDate);
}
