package co.pharma.repository;

import co.pharma.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Query("SELECT c FROM Customer c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.contact) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY c.id DESC")
    List<Customer> searchCustomers(@Param("query") String query);

    List<Customer> findAllByOrderByIdDesc();
}
