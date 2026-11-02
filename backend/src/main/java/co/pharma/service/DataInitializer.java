package co.pharma.service;

import co.pharma.entity.*;
import co.pharma.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;
    private final SupplyRecordRepository supplyRecordRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public DataInitializer(UserRepository userRepository,
                           CustomerRepository customerRepository,
                           SupplierRepository supplierRepository,
                           MedicineRepository medicineRepository,
                           SupplyRecordRepository supplyRecordRepository,
                           OrderRepository orderRepository,
                           PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.supplierRepository = supplierRepository;
        this.medicineRepository = medicineRepository;
        this.supplyRecordRepository = supplyRecordRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        System.out.println("🌱 Initializing pharma.Co database with sample catalog & records...");

        // 1. Seed Users
        User admin = userRepository.save(new User("admin", "admin@pharmaco.com", "123", "admin"));
        User isuru = userRepository.save(new User("isuru", "isuru@pharmaco.com", "456", "employee"));

        // 2. Seed Customers
        Customer c1 = customerRepository.save(new Customer("Kamal Perera", "0771234567", "Colombo 07", "Gold VIP"));
        Customer c2 = customerRepository.save(new Customer("Nimali Fernando", "0719876543", "Negombo", "Silver"));
        Customer c3 = customerRepository.save(new Customer("Saman Jayasinghe", "0754567890", "Kandy", "Bronze"));
        Customer c4 = customerRepository.save(new Customer("Dilani Weerasinghe", "0763456789", "Galle", "Gold VIP"));
        Customer c5 = customerRepository.save(new Customer("Nuwan Senanayake", "0702345678", "Kurunegala", "Silver"));
        Customer c6 = customerRepository.save(new Customer("Tharindu Silva", "0726789012", "Matara", "Bronze"));
        Customer c7 = customerRepository.save(new Customer("Ishara Madushani", "0771122334", "Rathnapura", "Bronze"));
        Customer c8 = customerRepository.save(new Customer("Chathura Bandara", "0712233445", "Badulla", "Silver"));

        // 3. Seed Suppliers
        Supplier s1 = supplierRepository.save(new Supplier("Lanka Pharma Distributors", "info@lankapharma.lk", "0772345678", "4.9 ★"));
        Supplier s2 = supplierRepository.save(new Supplier("SPMC Medical Supplies", "sales@spmc.lk", "0772789456", "4.8 ★"));
        Supplier s3 = supplierRepository.save(new Supplier("State Pharmaceuticals Corp", "contact@spc.lk", "0772698745", "5.0 ★"));
        Supplier s4 = supplierRepository.save(new Supplier("HealthGuard Global", "healthguard@gmail.com", "0773456789", "4.7 ★"));
        Supplier s5 = supplierRepository.save(new Supplier("MediCare Bio-Tech", "medicare@yahoo.com", "0776345890", "4.9 ★"));

        // 4. Seed Medicines
        Medicine m1 = medicineRepository.save(new Medicine("Paracetamol 500mg", "Panadol", 500, 25.00, LocalDate.now().plusMonths(18), "Pain Relief", "Fast Action ⚡"));
        Medicine m2 = medicineRepository.save(new Medicine("Amoxicillin 500mg", "Amoxil", 300, 60.00, LocalDate.now().plusMonths(12), "Antibiotics", "Doctor's Choice 🛡️"));
        Medicine m3 = medicineRepository.save(new Medicine("Cetirizine 10mg", "Cetzine", 400, 35.00, LocalDate.now().plusMonths(15), "Allergy", "Non-Drowsy 🌿"));
        Medicine m4 = medicineRepository.save(new Medicine("Omeprazole 20mg", "Losec", 50, 80.00, LocalDate.now().plusDays(25), "Digestive Health", "Acid Shield 🛡️"));
        Medicine m5 = medicineRepository.save(new Medicine("Esomeprazole 20mg", "Nexium", 120, 95.00, LocalDate.now().plusMonths(14), "Digestive Health", "Premium Care ✨"));
        Medicine m6 = medicineRepository.save(new Medicine("Vitamin C 500mg", "Redoxon", 250, 80.00, LocalDate.now().plusMonths(8), "Immunity Boosters", "Bestseller 🌟"));
        Medicine m7 = medicineRepository.save(new Medicine("Metformin 500mg", "Glycomet", 200, 55.00, LocalDate.now().plusMonths(16), "Metabolic Health", "Daily Balance ⚖️"));
        Medicine m8 = medicineRepository.save(new Medicine("Vitamin B Complex", "Neurobion", 14, 95.00, LocalDate.now().plusDays(15), "Brain & Focus", "Low Stock Alert ⚠️"));
        Medicine m9 = medicineRepository.save(new Medicine("Zinc 50mg", "Zincolife", 19, 65.00, LocalDate.now().plusDays(18), "Immunity Boosters", "Low Stock Alert ⚠️"));
        Medicine m10 = medicineRepository.save(new Medicine("Vitamin D3 1000IU", "Osteo D", 220, 120.00, LocalDate.now().plusMonths(20), "Bone Health", "Sunshine Pill ☀️"));
        Medicine m11 = medicineRepository.save(new Medicine("Glow Skin Collagen", "Vitaglow", 100, 250.00, LocalDate.now().plusMonths(11), "Beauty & Glow", "Youth Elixir 💖"));
        Medicine m12 = medicineRepository.save(new Medicine("Hair & Nail Biotin Plus", "Biotin Pro", 130, 275.00, LocalDate.now().plusMonths(16), "Beauty & Glow", "Trending 🔥"));

        // 5. Seed Supply Records
        supplyRecordRepository.save(new SupplyRecord(s1, m1, LocalDate.now().minusDays(10), 200, 18.00, 3600.00));
        supplyRecordRepository.save(new SupplyRecord(s1, m2, LocalDate.now().minusDays(8), 300, 42.00, 12600.00));
        supplyRecordRepository.save(new SupplyRecord(s2, m6, LocalDate.now().minusDays(5), 250, 55.00, 13750.00));
        supplyRecordRepository.save(new SupplyRecord(s3, m8, LocalDate.now().minusDays(2), 14, 65.00, 910.00));

        // 6. Seed Sample Orders with Items & Payments
        seedSampleOrder(c1, admin, List.of(new Object[]{m1, 4, 25.00}, new Object[]{m6, 2, 80.00}), "MAGICPILL", 39.00, 221.00, LocalDate.now().minusDays(4));
        seedSampleOrder(c2, isuru, List.of(new Object[]{m2, 2, 60.00}, new Object[]{m3, 3, 35.00}), null, 0.0, 225.00, LocalDate.now().minusDays(3));
        seedSampleOrder(c3, admin, List.of(new Object[]{m11, 2, 250.00}, new Object[]{m12, 1, 275.00}), "STUDENTREVIVE", 77.50, 697.50, LocalDate.now().minusDays(2));
        seedSampleOrder(c4, isuru, List.of(new Object[]{m10, 3, 120.00}, new Object[]{m6, 1, 80.00}), null, 0.0, 440.00, LocalDate.now().minusDays(1));
        seedSampleOrder(c5, admin, List.of(new Object[]{m5, 2, 95.00}, new Object[]{m1, 2, 25.00}), null, 0.0, 240.00, LocalDate.now());

        System.out.println("✅ pharma.Co data initialization completed successfully!");
    }

    private void seedSampleOrder(Customer customer, User user, List<Object[]> itemsData, String coupon, double discount, double finalTotal, LocalDate date) {
        double subtotal = 0.0;
        for (Object[] item : itemsData) {
            subtotal += ((Double) item[2]) * ((Integer) item[1]);
        }

        Order order = new Order(
                customer,
                user,
                subtotal,
                discount,
                finalTotal,
                coupon,
                "Stay radiant & healthy! Drink plenty of water today 💧",
                date,
                LocalTime.now()
        );

        for (Object[] item : itemsData) {
            Medicine med = (Medicine) item[0];
            int qty = (Integer) item[1];
            double price = (Double) item[2];
            order.addItem(new OrderItem(med, qty, price, qty * price));
        }

        Order saved = orderRepository.save(order);

        Payment payment = new Payment(saved, finalTotal, finalTotal + 50.0, 50.0, "Cash", LocalDateTime.of(date, LocalTime.now()));
        paymentRepository.save(payment);
        saved.setPayment(payment);
    }
}
