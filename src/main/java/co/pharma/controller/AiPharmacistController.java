package co.pharma.controller;

import co.pharma.dto.AiTipResponse;
import co.pharma.service.AiPharmacistService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiPharmacistController {

    private final AiPharmacistService aiPharmacistService;

    public AiPharmacistController(AiPharmacistService aiPharmacistService) {
        this.aiPharmacistService = aiPharmacistService;
    }

    @GetMapping("/consult")
    public AiTipResponse consult(@RequestParam(required = false, defaultValue = "") String query) {
        return aiPharmacistService.consult(query);
    }
}
