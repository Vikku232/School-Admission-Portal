package school_portal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import school_portal.dto.DashboardStatsDto;
import school_portal.repository.StudentRepository;
import school_portal.repository.TeacherRepository;
import school_portal.repository.PaymentRepository;
import school_portal.entity.Payment;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping({"/api/admin/dashboard", "/admin/dashboard"})
public class DashboardController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();

        // For now, we'll calculate basic metrics, you can expand these later 
        // to be based on date ranges (e.g. today's collection)
        double todayCollection = 0.0;
        double pendingFees = 0.0; // In a real system, you'd aggregate FeeInvoices minus Payments

        // Create a few mock recent payments if the database is empty, 
        // or fetch from the actual PaymentRepository if records exist
        List<DashboardStatsDto.PaymentSummaryDto> recentPayments = new ArrayList<>();
        
        // Example: If you have a findTop5ByOrderByPaymentDateDesc() method in PaymentRepository, 
        // you would use it here. For now we will return an empty list to prevent frontend crashes, 
        // ensuring the data shape matches the interface.
        
        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .todayCollection(todayCollection)
                .pendingFees(pendingFees)
                .recentPayments(recentPayments)
                .build();

        return ResponseEntity.ok(stats);
    }
}
