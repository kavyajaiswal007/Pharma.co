package co.pharma.controller;

import co.pharma.entity.SupplyRequest;
import co.pharma.entity.SupplyRecord;
import co.pharma.service.SupplyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplies")
@CrossOrigin(origins = "*")
public class SupplyController {

    private final SupplyService supplyService;

    public SupplyController(SupplyService supplyService) {
        this.supplyService = supplyService;
    }

    @GetMapping
    public List<SupplyRecord> getAll() {
        return supplyService.getAllSupplyRecords();
    }

    @PostMapping
    public SupplyRecord recordSupply(@RequestBody SupplyRequest req) {
        return supplyService.recordSupply(req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        supplyService.deleteSupplyRecord(id);
        return ResponseEntity.ok().build();
    }
}
