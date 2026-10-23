package school_portal.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import school_portal.entity.Admin;
import school_portal.repository.AdminRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String superAdminEmail = "soumya@gamil.com"; // using exact email provided

        if (!adminRepository.existsByEmail(superAdminEmail)) {
            Admin superAdmin = Admin.builder()
                    .name("Soumya (Super Admin)")
                    .email(superAdminEmail)
                    .passwordHash(passwordEncoder.encode("12345678"))
                    .role("SUPER_ADMIN")
                    .isActive(true)
                    .build();

            adminRepository.save(superAdmin);
            System.out.println("=========================================================");
            System.out.println("SUPER ADMIN ACCOUNT CREATED SUCCESSFULLY!");
            System.out.println("Email: " + superAdminEmail);
            System.out.println("Password: 12345678");
            System.out.println("=========================================================");
        }
    }
}
