package co.pharma.service;

import co.pharma.dto.SupplyRequest;
import co.pharma.model.Medicine;
import co.pharma.model.Supplier;
import co.pharma.model.SupplyRecord;
import co.pharma.repository.MedicineRepository;
import co.pharma.repository.SupplierRepository;
import co.pharma.repository.SupplyRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SupplyService {

    private final SupplyRecordRepository supplyRecordRepository;
    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;

    public SupplyService(SupplyRecordRepository supplyRecordRepository,
                         SupplierRepository supplierRepository,
                         MedicineRepository medicineRepository) {
        this.supplyRecordRepository = supplyRecordRepository;
        this.supplierRepository = supplierRepository;
        this.medicineRepository = medicineRepository;
    }

    public List<SupplyRecord> getAllSupplyRecords() {
        return supplyRecordRepository.findAllByOrderByIdDesc();
    }

    @Transactional
    public SupplyRecord recordSupply(SupplyRequest req) {
        Supplier supplier = supplierRepository.findById(req.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + req.getSupplierId()));

        Medicine medicine = medicineRepository.findById(req.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found: " + req.getMedicineId()));

        LocalDate date = req.getDate() != null ? req.getDate() : LocalDate.now();
        double totalCost = req.getQty() * req.getUnitCost();

        SupplyRecord record = new SupplyRecord(supplier, medicine, date, req.getQty(), req.getUnitCost(), totalCost);
        SupplyRecord saved = supplyRecordRepository.save(record);

        // Automatically update medicine inventory stock
        medicine.setQtyInStock(medicine.getQtyInStock() + req.getQty());
        medicineRepository.save(medicine);

        return saved;
    }

    public void deleteSupplyRecord(Long id) {
        supplyRecordRepository.deleteById(id);
    }
}
