package co.pharma.service;

import co.pharma.entity.AiTipResponse;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiPharmacistService {

    private final Map<String, AiTipResponse> knowledgeBase = new HashMap<>();

    public AiPharmacistService() {
        knowledgeBase.put("headache", new AiTipResponse(
                "Tension / Headache Relief Protocol",
                "Hydrate first with 500ml water. If persistent, Paracetamol 500mg or Ibuprofen after food can assist. Rest in dim lighting.",
                "💆‍♂️",
                "Avoid caffeine and screen glare for 30 minutes."
        ));

        knowledgeBase.put("vitamin", new AiTipResponse(
                "Smart Micronutrient Synergy",
                "Take Vitamin D3 with healthy fats (like milk or avocado) for max absorption. Pair Zinc with dinner, not on an empty stomach.",
                "🥑",
                "Do not exceed 100mg of elemental Zinc without clinical supervision."
        ));

        knowledgeBase.put("antibiotic", new AiTipResponse(
                "Antibiotic Stewardship Tip",
                "Always finish the entire prescribed course even if you feel 100% better! This prevents resistant superbugs.",
                "🛡️",
                "Space probiotic yogurt 2 hours apart from your antibiotic pill."
        ));

        knowledgeBase.put("sleep", new AiTipResponse(
                "Restorative Sleep & Recovery",
                "Magnesium Glycinate + Chamomile tea 45 mins before bedtime promotes GABA release and deep REM sleep.",
                "🌙",
                "Keep bedroom temperature cool (around 19-21°C) for optimal melatonin production."
        ));

        knowledgeBase.put("energy", new AiTipResponse(
                "Clean Sustained Energy Boost",
                "Vitamin B-Complex (Neurobion) supports mitochondrial ATP synthesis. Combine with CoQ10 for natural cellular energy without crashes.",
                "⚡",
                "Take B-vitamins in the morning as taking them late can cause vivid dreams or insomnia."
        ));
    }

    public AiTipResponse consult(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new AiTipResponse(
                    "pharma.Co AI Wellness Tip",
                    "Hydration, 7-8 hours of sleep, and mindful breathing prevent 80% of common stress-induced fatigue!",
                    "✨",
                    "Always consult a registered physician for serious clinical symptoms."
            );
        }

        String lower = query.toLowerCase();
        for (Map.Entry<String, AiTipResponse> entry : knowledgeBase.entrySet()) {
            if (lower.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        return new AiTipResponse(
                "Personalized Health Note",
                "For query '" + query + "': Keep adequate hydration, verify dosage schedules, and take medication consistently at the same hour daily.",
                "💊",
                "Store medicines below 25°C away from direct sunlight."
        );
    }
}
