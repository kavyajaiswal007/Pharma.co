package co.pharma.repository;

import co.pharma.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByIdDesc();

    @Query("SELECT COALESCE(SUM(o.total), 0.0) FROM Order o WHERE o.orderDate = :today")
    Double calculateTodayIncome(@Param("today") LocalDate today);

    @Query("SELECT COALESCE(SUM(o.total), 0.0) FROM Order o")
    Double calculateTotalRevenue();

    @Query("SELECT o.orderDate as date, SUM(o.total) as total FROM Order o GROUP BY o.orderDate ORDER BY o.orderDate ASC")
    List<Object[]> findDailySalesTrend();
}
