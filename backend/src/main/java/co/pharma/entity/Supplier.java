package co.pharma.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String supplierName;

    @Column(length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String contactNum;

    @Column(length = 50)
    private String reliabilityRating = "5.0 ★";

    public Supplier() {}

    public Supplier(String supplierName, String email, String contactNum, String reliabilityRating) {
        this.supplierName = supplierName;
        this.email = email;
        this.contactNum = contactNum;
        this.reliabilityRating = reliabilityRating;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContactNum() { return contactNum; }
    public void setContactNum(String contactNum) { this.contactNum = contactNum; }

    public String getReliabilityRating() { return reliabilityRating; }
    public void setReliabilityRating(String reliabilityRating) { this.reliabilityRating = reliabilityRating; }
}
