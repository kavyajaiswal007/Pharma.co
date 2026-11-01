package co.pharma.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String contact;

    @Column(length = 200)
    private String address;

    @Column(length = 50)
    private String loyaltyTier = "Bronze"; // Bronze, Silver, Gold, VIP

    public Customer() {}

    public Customer(String name, String contact, String address) {
        this.name = name;
        this.contact = contact;
        this.address = address;
        this.loyaltyTier = "Bronze";
    }

    public Customer(String name, String contact, String address, String loyaltyTier) {
        this.name = name;
        this.contact = contact;
        this.address = address;
        this.loyaltyTier = loyaltyTier;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLoyaltyTier() { return loyaltyTier; }
    public void setLoyaltyTier(String loyaltyTier) { this.loyaltyTier = loyaltyTier; }
}
