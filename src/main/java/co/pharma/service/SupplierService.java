package co.pharma.service;

import co.pharma.model.Supplier;
import co.pharma.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getAllSuppliers(String search) {
        if (search != null && !search.trim().isEmpty()) {
            return supplierRepository.searchSuppliers(search.trim());
        }
        return supplierRepository.findAllByOrderByIdDesc();
    }

    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    public Supplier saveSupplier(Supplier supplier) {
        if (supplier.getReliabilityRating() == null) {
            supplier.setReliabilityRating("5.0 ★");
        }
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier updated) {
        return supplierRepository.findById(id).map(s -> {
            s.setSupplierName(updated.getSupplierName());
            s.setEmail(updated.getEmail());
            s.setContactNum(updated.getContactNum());
            if (updated.getReliabilityRating() != null) s.setReliabilityRating(updated.getReliabilityRating());
            return supplierRepository.save(s);
        }).orElseThrow(() -> new RuntimeException("Supplier not found: " + id));
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}
