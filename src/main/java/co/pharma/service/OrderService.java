package co.pharma.service;

import co.pharma.dto.CartItemRequest;
import co.pharma.dto.OrderRequest;
import co.pharma.model.*;
import co.pharma.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MedicineRepository medicineRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    private static final String[] FUN_HEALTH_TIPS = {
        "Remember to drink at least 8 glasses of water today! 💧",
        "Take a 15-minute sunshine stroll to recharge your Vitamin D ☀️",
        "A daily smile releases endorphins—the best natural medicine! 😊",
        "Don't skip breakfast; your brain runs on healthy glucose! 🥑",
        "7 to 8 hours of deep sleep is nature's top immune booster 🌙",
        "Pair iron supplements with vitamin C for 3x better absorption! 🍊"
    };

    public OrderService(OrderRepository orderRepository,
                        MedicineRepository medicineRepository,
                        CustomerRepository customerRepository,
                        UserRepository userRepository,
                        PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.medicineRepository = medicineRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByIdDesc();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public Order placeOrder(OrderRequest req) {
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart cannot be empty");
        }

        Customer customer = null;
        if (req.getCustomerId() != null) {
            customer = customerRepository.findById(req.getCustomerId()).orElse(null);
        }

        User user = null;
        if (req.getUserId() != null) {
            user = userRepository.findById(req.getUserId()).orElse(null);
        }

        // Calculate subtotal and validate stocks
        double subTotal = 0.0;
        for (CartItemRequest itemReq : req.getItems()) {
            Medicine med = medicineRepository.findById(itemReq.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found: " + itemReq.getMedicineId()));

            if (med.getQtyInStock() < itemReq.getQty()) {
                throw new RuntimeException("Insufficient stock for " + med.getMedName() + ". Available: " + med.getQtyInStock());
            }

            subTotal += med.getUnitPrice() * itemReq.getQty();
        }

        // Apply fun coupon codes
        double discount = 0.0;
        String code = req.getCouponCode() != null ? req.getCouponCode().trim().toUpperCase() : "";
        if ("MAGICPILL".equals(code)) {
            discount = subTotal * 0.15; // 15% off
        } else if ("STUDENTREVIVE".equals(code)) {
            discount = subTotal * 0.10; // 10% off
        } else if ("HAPPYPILL".equals(code)) {
            discount = Math.min(100.0, subTotal); // Flat Rs. 100 off
        } else if ("IMMUNITYBOOST".equals(code)) {
            discount = subTotal * 0.20; // 20% off
        }

        double finalTotal = Math.max(0.0, subTotal - discount);
        String randomTip = FUN_HEALTH_TIPS[new Random().nextInt(FUN_HEALTH_TIPS.length)];

        Order order = new Order(
                customer,
                user,
                subTotal,
                discount,
                finalTotal,
                code.isEmpty() ? null : code,
                randomTip,
                LocalDate.now(),
                LocalTime.now()
        );

        // Add items & update stock
        for (CartItemRequest itemReq : req.getItems()) {
            Medicine med = medicineRepository.findById(itemReq.getMedicineId()).get();
            double lineTotal = med.getUnitPrice() * itemReq.getQty();

            OrderItem orderItem = new OrderItem(med, itemReq.getQty(), med.getUnitPrice(), lineTotal);
            order.addItem(orderItem);

            // Deduct stock
            med.setQtyInStock(med.getQtyInStock() - itemReq.getQty());
            medicineRepository.save(med);
        }

        Order savedOrder = orderRepository.save(order);

        // Record Payment
        double cashReceived = req.getCashReceived() != null ? req.getCashReceived() : finalTotal;
        double balanceChange = Math.max(0.0, cashReceived - finalTotal);
        String paymentMethod = req.getPaymentMethod() != null ? req.getPaymentMethod() : "Cash";

        Payment payment = new Payment(savedOrder, finalTotal, cashReceived, balanceChange, paymentMethod, LocalDateTime.now());
        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        return savedOrder;
    }
}
