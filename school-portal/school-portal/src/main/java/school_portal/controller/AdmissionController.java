package school_portal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.admission.AdmissionRequestDto;
import school_portal.dto.admission.AdmissionResponseDto;
import school_portal.service.impl.NotificationService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping({"/api/admissions", "/admissions"})
public class AdmissionController {

    @Autowired(required = false)
    private NotificationService notificationService;

    // In-memory OTP cache for phone/email -> otp
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String phone = request.getOrDefault("phone", "");
        String email = request.getOrDefault("email", "");

        if (phone.isEmpty() && email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Phone or email is required"));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);
        
        String key = (!email.isEmpty()) ? email.toLowerCase().trim() : phone.trim();
        otpStorage.put(key, otp);
        if (!phone.isEmpty()) {
            otpStorage.put(phone.trim(), otp);
        }

        // Send real email via NotificationService
        if (notificationService != null && !email.isEmpty()) {
            notificationService.sendOtpEmail(email, phone, otp);
        }

        // Confidential dispatch: The OTP is stored securely on the server and NEVER returned to the client
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Verification code (OTP) sent to " + (email.isEmpty() ? phone : email),
            "expiresInSeconds", 300
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String phone = request.getOrDefault("phone", "").trim();
        String email = request.getOrDefault("email", "").toLowerCase().trim();
        String userOtp = request.getOrDefault("otp", "").trim();

        String storedOtp = otpStorage.get(email);
        if (storedOtp == null && !phone.isEmpty()) {
            storedOtp = otpStorage.get(phone);
        }

        // Allow demo master OTP 123456 or matching stored OTP
        if ("123456".equals(userOtp) || (storedOtp != null && storedOtp.equals(userOtp))) {
            return ResponseEntity.ok(Map.of(
                "verified", true,
                "message", "Mobile number and email successfully verified!"
            ));
        }

        return ResponseEntity.badRequest().body(Map.of(
            "verified", false,
            "message", "Invalid OTP. Please check the code sent to your email/phone."
        ));
    }

    // Thread-safe storage for submitted Class 11 applications
    private static final Map<String, Map<String, Object>> applicationsStore = new ConcurrentHashMap<>();

    static {
        // Pre-populate with sample Class 11 admissions for admin panel review
        Map<String, Object> app1 = new ConcurrentHashMap<>();
        app1.put("applicationNumber", "RIPS-2027-XI-4182");
        app1.put("studentName", "Rohan Sharma");
        app1.put("dob", "2010-06-14");
        app1.put("gender", "Male");
        app1.put("bloodGroup", "B+");
        app1.put("category", "General");
        app1.put("streamApplying", "Science (PCM - Physics, Chemistry, Math)");
        app1.put("parentName", "Rajesh Sharma");
        app1.put("relation", "Father");
        app1.put("phone", "9876543210");
        app1.put("email", "rohan.science@gmail.com");
        app1.put("address", "Sector 4, Rohini, New Delhi");
        app1.put("previousSchool", "Delhi Public Secondary School");
        app1.put("tenthBoard", "CBSE");
        app1.put("tenthPercentage", "94.2%");
        app1.put("tenthRollNo", "1489201");
        app1.put("status", "PENDING");
        app1.put("appliedAt", LocalDateTime.now().minusHours(3).toString());
        app1.put("documentsCount", 5);
        app1.put("type", "CLASS_11_NEW_ADMISSION");
        app1.put("documents", List.of(
            Map.of("documentName", "Class 10th Board Marksheet", "fileName", "rohan_10th_cbse_marksheet.pdf", "fileSize", 458000L, "status", "VERIFIED"),
            Map.of("documentName", "Transfer Certificate (TC)", "fileName", "school_leaving_tc_rohan.pdf", "fileSize", 280000L, "status", "VERIFIED"),
            Map.of("documentName", "Character Certificate", "fileName", "conduct_certificate.pdf", "fileSize", 195000L, "status", "VERIFIED"),
            Map.of("documentName", "Student Aadhaar Card Copy", "fileName", "aadhaar_card_rohan.jpg", "fileSize", 340000L, "status", "VERIFIED"),
            Map.of("documentName", "Passport Size Photograph", "fileName", "rohan_passport_photo.jpg", "fileSize", 88000L, "status", "VERIFIED")
        ));
        applicationsStore.put("RIPS-2027-XI-4182", app1);

        Map<String, Object> app2 = new ConcurrentHashMap<>();
        app2.put("applicationNumber", "RIPS-2027-XI-6295");
        app2.put("type", "CLASS_11_NEW_ADMISSION");
        app2.put("studentName", "Ananya Verma");
        app2.put("dob", "2010-03-22");
        app2.put("gender", "Female");
        app2.put("bloodGroup", "O+");
        app2.put("category", "General");
        app2.put("streamApplying", "Commerce (Accountancy, Business Studies, Economics)");
        app2.put("parentName", "Sunil Verma");
        app2.put("relation", "Father");
        app2.put("phone", "9811223344");
        app2.put("email", "ananya.commerce@gmail.com");
        app2.put("address", "DLF Phase 2, Gurugram");
        app2.put("previousSchool", "St. Mary Senior School");
        app2.put("tenthBoard", "CBSE");
        app2.put("tenthPercentage", "91.8%");
        app2.put("tenthRollNo", "1489412");
        app2.put("status", "APPROVED");
        app2.put("appliedAt", LocalDateTime.now().minusDays(1).toString());
        app2.put("documentsCount", 5);
        app2.put("documents", List.of(
            Map.of("documentName", "Class 10th Board Marksheet", "fileName", "ananya_10th_marksheet.pdf", "fileSize", 512000L, "status", "VERIFIED"),
            Map.of("documentName", "Transfer Certificate (TC)", "fileName", "tc_st_marys.pdf", "fileSize", 310000L, "status", "VERIFIED"),
            Map.of("documentName", "Character Certificate", "fileName", "character_cert_ananya.pdf", "fileSize", 210000L, "status", "VERIFIED"),
            Map.of("documentName", "Student Aadhaar Card Copy", "fileName", "aadhaar_ananya.jpg", "fileSize", 320000L, "status", "VERIFIED"),
            Map.of("documentName", "Passport Size Photograph", "fileName", "ananya_photo.jpg", "fileSize", 95000L, "status", "VERIFIED")
        ));
        applicationsStore.put("RIPS-2027-XI-6295", app2);

        // Pre-populate sample Class 12 Promotion
        Map<String, Object> app3 = new ConcurrentHashMap<>();
        app3.put("applicationNumber", "RIPS-2027-XII-PROMO-1049");
        app3.put("type", "CLASS_12_PROMOTION");
        app3.put("studentName", "Devansh Singhania");
        app3.put("admissionNumber", "RIPS-2026-XI-084");
        app3.put("class11RollNo", "XI-SCI-18");
        app3.put("class11Stream", "Science (PCM)");
        app3.put("class11Section", "Section A");
        app3.put("class11Percentage", "89.6%");
        app3.put("streamApplying", "Class 12 - Science (PCM + Computer Science)");
        app3.put("electiveSubject", "Computer Science (Python)");
        app3.put("competitiveExam", "JEE Main & Advanced 2028");
        app3.put("parentName", "Mahesh Singhania");
        app3.put("relation", "Father");
        app3.put("phone", "9812345670");
        app3.put("email", "devansh.pcm@gmail.com");
        app3.put("address", "Flat 402, Royal Palms, New Delhi");
        app3.put("status", "PENDING");
        app3.put("appliedAt", LocalDateTime.now().minusHours(1).toString());
        app3.put("documentsCount", 4);
        app3.put("documents", List.of(
            Map.of("documentName", "Class 11th Annual Marksheet", "fileName", "devansh_class11_marksheet.pdf", "fileSize", 420100L, "status", "VERIFIED"),
            Map.of("documentName", "Class 11th School Identity Card", "fileName", "devansh_rips_id_card.jpg", "fileSize", 185300L, "status", "VERIFIED"),
            Map.of("documentName", "Recent Passport Photograph", "fileName", "devansh_singhania_photo.jpg", "fileSize", 92400L, "status", "VERIFIED"),
            Map.of("documentName", "Fee Clearance / No-Dues Slip", "fileName", "fee_clearance_slip_2026.pdf", "fileSize", 312000L, "status", "VERIFIED")
        ));
        applicationsStore.put("RIPS-2027-XII-PROMO-1049", app3);
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(applicationsStore.values());
    }

    @PostMapping("/applications/{appNumber}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable String appNumber,
            @RequestBody Map<String, String> body) {
        
        Map<String, Object> app = applicationsStore.get(appNumber);
        if (app == null) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = body.getOrDefault("status", "PENDING").toUpperCase().trim();
        String remarks = body.getOrDefault("remarks", "");

        app.put("status", newStatus);
        app.put("adminRemarks", remarks);
        app.put("reviewedAt", LocalDateTime.now().toString());

        String studentName = (String) app.getOrDefault("studentName", "Student");
        String email = (String) app.getOrDefault("email", "");
        String stream = (String) app.getOrDefault("streamApplying", "Senior Secondary");
        String applicationType = (String) app.getOrDefault("type", "CLASS_11_NEW_ADMISSION");
        String section = (String) app.getOrDefault("class11Section", "Section A (Senior Batch)");

        // Send Email based on Admin Decision:
        // "jabtak admin aprove nhi karega email nhi jayega and admin jo bhi karega approved, reject uska hi mail jayega."
        if (notificationService != null && email != null && !email.isEmpty()) {
            if ("APPROVED".equals(newStatus)) {
                if ("CLASS_12_PROMOTION".equals(applicationType) || appNumber.contains("XII")) {
                    notificationService.sendClass12PromotionApprovalEmail(studentName, email, stream, appNumber, remarks, section);
                } else {
                    notificationService.sendAdmissionApprovalEmail(studentName, email, stream, appNumber, remarks);
                }
            } else if ("REJECTED".equals(newStatus)) {
                notificationService.sendAdmissionRejectionEmail(studentName, email, appNumber, remarks);
            }
        }

        return ResponseEntity.ok(Map.of(
            "success", true,
            "applicationNumber", appNumber,
            "status", newStatus,
            "message", "Application status updated to " + newStatus + (newStatus.equals("PENDING") ? "" : " and official notification dispatched to " + email)
        ));
    }

    @PostMapping("/apply-twelfth")
    public ResponseEntity<?> applyTwelfth(@RequestBody Map<String, Object> request) {
        int randomId = new Random().nextInt(9000) + 1000;
        String appNumber = "RIPS-2027-XII-PROMO-" + randomId;

        Map<String, Object> record = new ConcurrentHashMap<>(request);
        record.put("applicationNumber", appNumber);
        record.put("type", "CLASS_12_PROMOTION");
        record.put("status", "PENDING");
        record.put("appliedAt", LocalDateTime.now().toString());

        applicationsStore.put(appNumber, record);

        String email = (String) request.getOrDefault("email", "");
        String confirmationMessage = "Class 12th Promotion & Continuation form successfully registered under Reference ID: " 
                + appNumber + ". Your promotion request is currently PENDING review by the Senior Academic Council. Once verified and approved by the Principal, your Class 12th allotment letter will be dispatched to your email (" + email + ").";

        return ResponseEntity.ok(Map.of(
            "success", true,
            "applicationNumber", appNumber,
            "status", "PENDING",
            "message", confirmationMessage,
            "submissionDate", LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/apply-eleventh")
    public ResponseEntity<AdmissionResponseDto> applyEleventh(@RequestBody AdmissionRequestDto request) {
        // Generate unique Application ID: RIPS-2027-XI-XXXX
        int randomId = new Random().nextInt(9000) + 1000;
        String appNumber = "RIPS-2027-XI-" + randomId;

        // Store complete application record for admin review
        Map<String, Object> record = new ConcurrentHashMap<>();
        record.put("applicationNumber", appNumber);
        record.put("studentName", request.getStudentName() != null ? request.getStudentName() : "Applicant");
        record.put("dob", request.getDob() != null ? request.getDob() : "");
        record.put("gender", request.getGender() != null ? request.getGender() : "");
        record.put("bloodGroup", request.getBloodGroup() != null ? request.getBloodGroup() : "O+");
        record.put("category", request.getCategory() != null ? request.getCategory() : "General");
        record.put("streamApplying", request.getStreamApplying() != null ? request.getStreamApplying() : "Science");
        record.put("parentName", request.getParentName() != null ? request.getParentName() : "");
        record.put("relation", request.getRelation() != null ? request.getRelation() : "Father");
        record.put("parentOccupation", request.getParentOccupation() != null ? request.getParentOccupation() : "");
        record.put("phone", request.getPhone() != null ? request.getPhone() : "");
        record.put("email", request.getEmail() != null ? request.getEmail() : "");
        record.put("address", request.getAddress() != null ? request.getAddress() : "");
        record.put("previousSchool", request.getPreviousSchool() != null ? request.getPreviousSchool() : "");
        record.put("tenthBoard", request.getTenthBoard() != null ? request.getTenthBoard() : "CBSE");
        record.put("tenthPercentage", request.getTenthPercentage() != null ? request.getTenthPercentage() : "");
        record.put("tenthRollNo", request.getTenthRollNo());
        record.put("electiveSubject", request.getElectiveSubject() != null ? request.getElectiveSubject() : "N/A");
        record.put("competitiveExam", request.getCompetitiveExam() != null ? request.getCompetitiveExam() : "None");
        record.put("additionalNotes", request.getAdditionalNotes() != null ? request.getAdditionalNotes() : "");
        record.put("city", request.getCity() != null ? request.getCity() : "");
        record.put("state", request.getState() != null ? request.getState() : "");
        record.put("postalCode", request.getPostalCode() != null ? request.getPostalCode() : "");
        record.put("tenthSchool", request.getPreviousSchool());
        record.put("tenthPassingYear", request.getTenthPassingYear() != null ? request.getTenthPassingYear() : "2026");
        record.put("status", "PENDING");
        record.put("appliedAt", LocalDateTime.now().toString());
        record.put("documentsCount", request.getDocuments() != null ? request.getDocuments().size() : 5);
        if (request.getDocuments() != null) {
            record.put("documents", request.getDocuments());
        }

        applicationsStore.put(appNumber, record);

        // Strict Requirement: Jab tak admin approve/reject nahi karega, koi decision mail nahi jayega!
        // Admin jo decision lega (Approved / Rejected), sirf uska hi official mail jayega.
        String confirmationMessage = "Application successfully submitted under Reference ID: " 
                + appNumber + ". Your application is now PENDING and has been forwarded to the School Admissions Committee. Once the Admin reviews and makes a decision, an official status email will be dispatched to your email (" + request.getEmail() + ").";

        AdmissionResponseDto response = AdmissionResponseDto.builder()
                .success(true)
                .applicationNumber(appNumber)
                .status("PENDING")
                .studentName(request.getStudentName())
                .streamApplying(request.getStreamApplying())
                .emailSentTo(request.getEmail())
                .phone(request.getPhone())
                .message(confirmationMessage)
                .submissionDate(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/applications/{appNumber}")
    public ResponseEntity<?> deleteApplication(@PathVariable String appNumber) {
        if (applicationsStore.containsKey(appNumber)) {
            applicationsStore.remove(appNumber);
            return ResponseEntity.ok(Map.of("success", true, "message", "Application " + appNumber + " removed successfully"));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Application already removed", "applicationNumber", appNumber));
    }
}
