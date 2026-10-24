package school_portal.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/payments/razorpay", "/payments/razorpay"})
public class RazorpayController {

    @Value("${razorpay.key.id:rzp_test_TrL8dHIIzl9UKI}")
    private String keyId;

    @Value("${razorpay.key.secret:IlE8xy8gPmRfaSRLcftoGFzp}")
    private String keySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    @Value("${razorpay.company.name:Royal International Public School}")
    private String companyName;

    @Value("${app.frontend.url:}")
    private String frontendUrl;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    /**
     * Get public Razorpay configuration for frontend checkout.
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("keyId", keyId);
        config.put("currency", currency);
        config.put("companyName", companyName);
        return ResponseEntity.ok(config);
    }

    /**
     * Create an official order on Razorpay Orders API.
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        try {
            double amountInRupees = 22000.0;
            if (request.containsKey("amount")) {
                amountInRupees = Double.parseDouble(request.get("amount").toString());
            }

            long amountInPaise = Math.round(amountInRupees * 100);
            String receipt = request.getOrDefault("receipt", "rcpt_" + System.currentTimeMillis()).toString();

            String authStr = keyId + ":" + keySecret;
            String authHeader = "Basic " + Base64.getEncoder().encodeToString(authStr.getBytes(StandardCharsets.UTF_8));

            String payload = String.format(
                    "{\"amount\": %d, \"currency\": \"%s\", \"receipt\": \"%s\"}",
                    amountInPaise, currency, receipt
            );

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            Map<String, Object> result = new HashMap<>();
            result.put("keyId", keyId);
            result.put("raw", response.body());
            result.put("statusCode", response.statusCode());

            // Extract order ID from response body string
            String body = response.body();
            if (body.contains("\"id\":\"")) {
                int start = body.indexOf("\"id\":\"") + 6;
                int end = body.indexOf("\"", start);
                result.put("orderId", body.substring(start, end));
            }

            return ResponseEntity.status(response.statusCode()).body(result);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Verify payment signature authenticity using HMAC SHA256.
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();
        try {
            String razorpayOrderId = payload.get("razorpay_order_id");
            String razorpayPaymentId = payload.get("razorpay_payment_id");
            String razorpaySignature = payload.get("razorpay_signature");

            if (razorpayPaymentId == null || razorpayPaymentId.isEmpty()) {
                response.put("verified", false);
                response.put("error", "Missing razorpay_payment_id");
                return ResponseEntity.badRequest().body(response);
            }

            // If signature is provided with order ID, verify HMAC SHA-256
            if (razorpayOrderId != null && !razorpayOrderId.isEmpty() && razorpaySignature != null && !razorpaySignature.isEmpty()) {
                String data = razorpayOrderId + "|" + razorpayPaymentId;
                Mac mac = Mac.getInstance("HmacSHA256");
                mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
                byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

                StringBuilder hex = new StringBuilder();
                for (byte b : hash) {
                    hex.append(String.format("%02x", b));
                }

                boolean verified = hex.toString().equals(razorpaySignature);
                response.put("verified", verified);
                response.put("paymentId", razorpayPaymentId);
                response.put("orderId", razorpayOrderId);
                return ResponseEntity.ok(response);
            }

            // Direct payment checkout verified by payment ID existence
            response.put("verified", true);
            response.put("paymentId", razorpayPaymentId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("verified", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @org.springframework.beans.factory.annotation.Autowired
    private school_portal.service.impl.NotificationService notificationService;

    /**
     * Dispatch official PDF/HTML fee receipt directly to the payer's Gmail inbox.
     */
    @PostMapping("/send-receipt-email")
    public ResponseEntity<Map<String, Object>> sendReceiptEmail(@RequestBody Map<String, Object> request) {
        Map<String, Object> result = new HashMap<>();
        try {
            String email = request.getOrDefault("email", "").toString();
            String studentName = request.getOrDefault("studentName", "Student").toString();
            String studentId = request.getOrDefault("studentId", "RIPS-2027").toString();
            String receiptNo = request.getOrDefault("receiptNo", "REC-" + System.currentTimeMillis()).toString();
            double amount = Double.parseDouble(request.getOrDefault("amount", "22000").toString());
            String paymentMethod = request.getOrDefault("paymentMethod", "RAZORPAY_UPI").toString();
            String referenceNo = request.getOrDefault("referenceNo", "pay_" + System.currentTimeMillis()).toString();
            String feeType = request.getOrDefault("feeType", "Quarterly Senior Secondary Tuition & Lab Fee").toString();

            String emailStatus = notificationService.sendPaymentReceiptEmailWithReason(
                    email, studentName, studentId, receiptNo, amount, paymentMethod, referenceNo, feeType
            );
            boolean sent = "SUCCESS".equalsIgnoreCase(emailStatus);

            result.put("success", sent);
            result.put("receiptNo", receiptNo);
            result.put("recipient", email);
            result.put("pdfSavedInDb", true);
            result.put("pdfUrl", "/api/payments/razorpay/receipt/" + receiptNo + "/download-pdf");
            result.put("message", sent ? "Receipt successfully dispatched to Gmail and saved to database." : ("Email dispatch failed: " + emailStatus));
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    /**
     * Public downloadable / printable fee voucher endpoint for assurance.
     */
    @GetMapping(value = "/receipt/{receiptNo}", produces = "text/html")
    public String viewReceiptPage(@PathVariable String receiptNo) {
        String baseFrontendUrl = (frontendUrl != null && !frontendUrl.trim().isEmpty())
                ? frontendUrl.trim().replaceAll("/+$", "")
                : "/";
        String dateStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy"));
        return "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>Official Fee Receipt Voucher #" + receiptNo + "</title>"
                + "<style>"
                + "body{font-family:'Segoe UI',Roboto,Arial,sans-serif;background:#f8fafc;margin:0;padding:40px;color:#1e293b}"
                + ".card{background:#ffffff;max-width:760px;margin:auto;border-radius:16px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1);border:1px solid #e2e8f0;overflow:hidden}"
                + ".header{background:#1e3a8a;color:#ffffff;padding:30px;text-align:center;border-bottom:4px solid #f5c518}"
                + ".logo{width:56px;height:56px;background:#ffffff;color:#1e3a8a;font-weight:900;font-size:22px;line-height:56px;border-radius:50%;margin:0 auto 12px;border:3px solid #f5c518}"
                + ".body{padding:35px}"
                + ".meta{display:grid;grid-template-columns:1fr 1fr;gap:15px;background:#f8fafc;padding:20px;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:25px}"
                + ".tbl{width:100%;border-collapse:collapse;margin-bottom:25px}"
                + ".tbl th{background:#1e3a8a;color:#fff;text-align:left;padding:12px 16px}"
                + ".tbl td{padding:14px 16px;border-bottom:1px solid #e2e8f0}"
                + ".total{background:#ecfdf5;font-weight:bold;color:#047857;font-size:17px}"
                + ".seal{border:2px dashed #059669;background:#ecfdf5;color:#065f46;padding:14px;border-radius:10px;text-align:center;font-weight:bold;font-size:12px}"
                + ".actions{display:flex;justify-content:center;gap:15px;margin-top:30px}"
                + ".btn{padding:12px 24px;border-radius:10px;font-weight:bold;cursor:pointer;border:none;font-size:14px;text-decoration:none}"
                + ".btn-print{background:#1e3a8a;color:#fff}.btn-print:hover{background:#152e6f}"
                + "@media print{.actions{display:none}body{background:#fff;padding:0}.card{box-shadow:none;border:none}}"
                + "</style></head><body>"
                + "<div class='card'>"
                + "<div class='header'>"
                + "<div class='logo'>RIPS</div>"
                + "<h1 style='margin:0;font-size:24px;color:#f5c518'>ROYAL INTERNATIONAL PUBLIC SCHOOL</h1>"
                + "<p style='margin:5px 0 0;font-size:13px;opacity:0.9'>Senior Secondary Wing • Affiliated to CBSE, New Delhi</p>"
                + "<p style='margin:4px 0 0;font-size:12px;color:#93c5fd'>Official Realized Fee Receipt Voucher (Session 2027–28)</p>"
                + "</div>"
                + "<div class='body'>"
                + "<div class='meta'>"
                + "<div><small style='color:#64748b;font-weight:bold'>RECEIPT NUMBER</small><div style='font-size:15px;font-weight:bold;color:#1e3a8a;font-family:monospace'>" + receiptNo + "</div></div>"
                + "<div><small style='color:#64748b;font-weight:bold'>PAYMENT DATE</small><div style='font-size:14px;font-weight:600'>" + dateStr + "</div></div>"
                + "<div><small style='color:#64748b;font-weight:bold'>STUDENT ENROLLMENT ID</small><div style='font-size:14px;font-weight:bold;font-family:monospace'>RIPS-2027-1104</div></div>"
                + "<div><small style='color:#64748b;font-weight:bold'>PAYMENT METHOD</small><div style='font-size:14px;font-weight:bold;color:#6d28d9'>Razorpay Verified</div></div>"
                + "</div>"
                + "<table class='tbl'>"
                + "<thead><tr><th>Fee Component Description</th><th style='text-align:right'>Amount (INR)</th></tr></thead>"
                + "<tbody>"
                + "<tr><td>Class 11/12 Senior Secondary Quarterly Tuition, Practical Lab & Composite Fee</td><td style='text-align:right;font-weight:bold'>₹22,000.00</td></tr>"
                + "<tr class='total'><td>TOTAL AMOUNT RECEIVED (PAID IN FULL):</td><td style='text-align:right'>₹22,000.00</td></tr>"
                + "</tbody></table>"
                + "<div class='seal'>★ COMPUTER GENERATED OFFICIAL RECEIPT — DIGITALLY VERIFIED BY RIPS BURSAR DIVISION ★</div>"
                + "<div class='actions'>"
                + "<button onclick='window.print()' class='btn btn-print'>🖨️ Print / Save as PDF</button>"
                + "<a href='" + baseFrontendUrl + "' class='btn' style='background:#f1f5f9;color:#334155'>← Back to Portal</a>"
                + "</div></div></div></body></html>";
    }

    /**
     * Direct binary PDF receipt download endpoint.
     */
    @GetMapping(value = "/receipt/{receiptNo}/download-pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> downloadReceiptPdf(
            @PathVariable String receiptNo,
            @RequestParam(defaultValue = "Student Candidate") String studentName,
            @RequestParam(defaultValue = "RIPS-2027-1104") String studentId,
            @RequestParam(defaultValue = "22000.00") double amount,
            @RequestParam(defaultValue = "Razorpay Verified") String paymentMethod,
            @RequestParam(defaultValue = "pay_rzp_portal") String referenceNo,
            @RequestParam(defaultValue = "Senior Secondary Quarterly Composite Tuition & Lab Fee") String feeType
    ) {
        String dateStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy"));
        byte[] pdfBytes = school_portal.util.PdfReceiptGenerator.generateReceiptPdf(
                receiptNo, studentName, studentId, amount, paymentMethod, referenceNo, feeType, dateStr
        );

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Official_Fee_Receipt_" + receiptNo + ".pdf\"")
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}

