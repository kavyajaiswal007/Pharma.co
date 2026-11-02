package co.pharma.service;

import co.pharma.entity.Medicine;
import co.pharma.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    public List<Medicine> getAllMedicines(String search) {
        if (search != null && !search.trim().isEmpty()) {
            return medicineRepository.searchMedicines(search.trim());
        }
        return medicineRepository.findAllByOrderByIdDesc();
    }

    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }

    public Medicine saveMedicine(Medicine medicine) {
        if (medicine.getCategory() == null || medicine.getCategory().isEmpty()) {
            medicine.setCategory("General Healthcare");
        }
        if (medicine.getFunTag() == null || medicine.getFunTag().isEmpty()) {
            medicine.setFunTag("Essential 💊");
        }
        return medicineRepository.save(medicine);
    }

    public Medicine updateMedicine(Long id, Medicine updated) {
        return medicineRepository.findById(id).map(m -> {
            m.setMedName(updated.getMedName());
            m.setBrand(updated.getBrand());
            m.setQtyInStock(updated.getQtyInStock());
            m.setUnitPrice(updated.getUnitPrice());
            m.setExpDate(updated.getExpDate());
            if (updated.getCategory() != null) m.setCategory(updated.getCategory());
            if (updated.getFunTag() != null) m.setFunTag(updated.getFunTag());
            return medicineRepository.save(m);
        }).orElseThrow(() -> new RuntimeException("Medicine not found: " + id));
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    public List<Medicine> getLowStockMedicines(int threshold) {
        return medicineRepository.findByQtyInStockLessThanOrderByQtyInStockAsc(threshold);
    }

    public List<Medicine> getExpiringMedicines(int daysAhead) {
        return medicineRepository.findExpiringSoon(LocalDate.now().plusDays(daysAhead));
    }
}
