package co.pharma.controller;

import co.pharma.entity.LoginRequest;
import co.pharma.entity.User;
import co.pharma.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> userOpt = userService.authenticate(req.getUsername(), req.getPassword());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "user", Map.of(
                            "id", user.getId(),
                            "username", user.getUsername(),
                            "email", user.getEmail(),
                            "role", user.getRole()
                    )
            ));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "error", "Invalid credentials"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");

        if (email == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and newPassword required"));
        }

        boolean reset = userService.resetPassword(email, newPassword);
        if (reset) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Password updated successfully"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "User with this email not found"));
    }
}
