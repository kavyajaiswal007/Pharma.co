package co.pharma.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @Column(nullable = false)
    private Double amount;

    private Double cashReceived;
    private Double balanceChange;

    private LocalDateTime paymentDate;

    @Column(length = 50)
    private String paymentMethod = "Cash";

    public Payment() {}

    public Payment(Order order, Double amount, Double cashReceived, Double balanceChange, String paymentMethod, LocalDateTime paymentDate) {
        this.order = order;
        this.amount = amount;
        this.cashReceived = cashReceived;
        this.balanceChange = balanceChange;
        this.paymentMethod = paymentMethod;
        this.paymentDate = paymentDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getCashReceived() { return cashReceived; }
    public void setCashReceived(Double cashReceived) { this.cashReceived = cashReceived; }

    public Double getBalanceChange() { return balanceChange; }
    public void setBalanceChange(Double balanceChange) { this.balanceChange = balanceChange; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
