package co.pharma.service;

import co.pharma.dto.DashboardStats;
import co.pharma.model.Medicine;
import co.pharma.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class DashboardService {

    private final MedicineRepository medicineRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;

    private static final String[] FUN_FACTS = {
        "💡 Penicillin was discovered by accident in 1928 when Alexander Fleming left a petri dish open!",
        "💡 Paracetamol (Acetaminophen) was synthesized way back in 1877 by Harmon Northrop Morse.",
        "💡 The ancient Egyptians used moldy bread as an antibiotic on wounds over 3,500 years ago!",
        "💡 Honey has natural hydrogen peroxide and practically never spoils when stored sealed."
    };

    public DashboardService(MedicineRepository medicineRepository,
                            CustomerRepository customerRepository,
                            SupplierRepository supplierRepository,
                            OrderRepository orderRepository) {
        this.medicineRepository = medicineRepository;
        this.customerRepository = customerRepository;
        this.supplierRepository = supplierRepository;
        this.orderRepository = orderRepository;
    }

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        stats.setTotalMedicines(medicineRepository.count());
        stats.setActiveCustomers(customerRepository.count());
        stats.setTotalSuppliers(supplierRepository.count());
        stats.setTodayIncome(orderRepository.calculateTodayIncome(LocalDate.now()));
        stats.setTotalRevenue(orderRepository.calculateTotalRevenue());
        stats.setTotalOrders(orderRepository.count());

        // Low stock (< 30)
        stats.setLowStock(medicineRepository.findByQtyInStockLessThanOrderByQtyInStockAsc(30));

        // Expiring soon (within 60 days)
        stats.setExpiringSoon(medicineRepository.findExpiringSoon(LocalDate.now().plusDays(60)));

        // Daily trend
        List<Object[]> rawTrends = orderRepository.findDailySalesTrend();
        List<Map<String, Object>> trends = new ArrayList<>();
        for (Object[] row : rawTrends) {
            Map<String, Object> map = new HashMap<>();
            map.put("date", String.valueOf(row[0]));
            map.put("total", row[1]);
            trends.add(map);
        }
        stats.setSalesTrends(trends);

        stats.setFunFactOfDay(FUN_FACTS[new Random().nextInt(FUN_FACTS.length)]);

        return stats;
    }
}
