package co.pharma.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String medName;

    @Column(nullable = false, length = 100)
    private String brand;

    @Column(nullable = false)
    private Integer qtyInStock;

    @Column(nullable = false)
    private Double unitPrice;

    @Column(nullable = false)
    private LocalDate expDate;

    @Column(length = 100)
    private String category = "General Healthcare";

    @Column(length = 100)
    private String funTag = "Essential 💊";

    public Medicine() {}

    public Medicine(String medName, String brand, Integer qtyInStock, Double unitPrice, LocalDate expDate, String category, String funTag) {
        this.medName = medName;
        this.brand = brand;
        this.qtyInStock = qtyInStock;
        this.unitPrice = unitPrice;
        this.expDate = expDate;
        this.category = category;
        this.funTag = funTag;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMedName() { return medName; }
    public void setMedName(String medName) { this.medName = medName; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Integer getQtyInStock() { return qtyInStock; }
    public void setQtyInStock(Integer qtyInStock) { this.qtyInStock = qtyInStock; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public LocalDate getExpDate() { return expDate; }
    public void setExpDate(LocalDate expDate) { this.expDate = expDate; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getFunTag() { return funTag; }
    public void setFunTag(String funTag) { this.funTag = funTag; }
}
