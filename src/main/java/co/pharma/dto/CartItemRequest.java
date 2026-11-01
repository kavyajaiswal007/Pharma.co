package co.pharma.dto;

public class CartItemRequest {
    private Long medicineId;
    private Integer qty;

    public CartItemRequest() {}

    public CartItemRequest(Long medicineId, Integer qty) {
        this.medicineId = medicineId;
        this.qty = qty;
    }

    public Long getMedicineId() { return medicineId; }
    public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
}
