package com.school.school_portal.controller;

import com.school.school_portal.dto.LoginRequest;
import com.school.school_portal.dto.LoginResponse;
import com.school.school_portal.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        
        // TODO: In a real application, you would query the database here 
        // using AdminRepository, TeacherRepository, or StudentRepository
        // and compare the password hashes using PasswordEncoder.
        
        // For demonstration purposes, we are generating the token directly 
        // to show the JWT integration and connect the frontend login flow.
        
        if (request.getEmail().equals("error@test.com")) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // Mock User Data for demonstration
        String name = "Test " + request.getRole();
        
        // Generate Token containing the requested role
        String token = jwtUtil.generateToken(request.getEmail(), request.getRole());

        return ResponseEntity.ok(new LoginResponse(
                token,
                request.getRole(),
                name,
                request.getEmail()
        ));
    }
}
