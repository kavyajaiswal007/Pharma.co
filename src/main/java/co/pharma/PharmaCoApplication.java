package co.pharma;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PharmaCoApplication {

    public static void main(String[] args) {
        SpringApplication.run(PharmaCoApplication.class, args);
        System.out.println("✨ pharma.Co server is up and rolling on http://localhost:8080 ✨");
    }
}
