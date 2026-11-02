package co.pharma.repository;

import co.pharma.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    @Query("SELECT s FROM Supplier s WHERE LOWER(s.supplierName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.contactNum) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY s.id DESC")
    List<Supplier> searchSuppliers(@Param("query") String query);

    List<Supplier> findAllByOrderByIdDesc();
}
