package school_portal.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import school_portal.dto.admission.AdmissionRequestDto;

@Slf4j
@Service
public class NotificationService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired(required = false)
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    /**
     * Send confidential 6-digit verification OTP to the user's Gmail and log SMS dispatch.
     */
    public boolean sendOtpEmail(String recipientEmail, String phone, String otp) {
        log.info(">> DISPATCHING CONFIDENTIAL OTP to Email: {} and Phone: {}", recipientEmail, phone);

        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            return false;
        }

        if (mailSender == null) {
            log.warn("JavaMailSender is not configured with active SMTP. Check application.properties for spring.mail configuration.");
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("dgarmy.vikash@gmail.com", "R.I.P.S. Senior Secondary Admissions");
            helper.setTo(recipientEmail);
            helper.setSubject("RIPS Senior Secondary Portal - Confidential Verification OTP: " + otp);
            
            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg; background-color: #f8fafc;'>"
                + "<div style='background-color: #1e3a8a; color: #ffffff; padding: 16px; text-align: center; border-radius: 8px;'>"
                + "<h2 style='margin: 0; color: #f5c518;'>R.I.P.S. SENIOR SECONDARY SCHOOL</h2>"
                + "<p style='margin: 4px 0 0 0; font-size: 13px;'>Affiliated to CBSE, New Delhi | Classes 11th & 12th</p>"
                + "</div>"
                + "<div style='background-color: #ffffff; padding: 24px; margin-top: 16px; border-radius: 8px; border: 1px solid #e2e8f0;'>"
                + "<h3 style='color: #1e293b; margin-top: 0;'>Your Confidential Verification Code (OTP)</h3>"
                + "<p style='color: #475569; font-size: 14px; line-height: 1.5;'>"
                + "You have requested verification for Class 11 Senior Secondary admission registration. Please use the 6-digit verification code below to authorize your application."
                + "</p>"
                + "<div style='text-align: center; margin: 24px 0;'>"
                + "<span style='display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e3a8a; background: #e0f2fe; padding: 12px 28px; border-radius: 8px; border: 2px dashed #0284c7;'>"
                + otp
                + "</span>"
                + "</div>"
                + "<p style='color: #64748b; font-size: 12px; margin-bottom: 0;'>"
                + "⚠️ This OTP is valid for 5 minutes. Never share this code with anyone. School staff will never ask for your OTP."
                + "</p>"
                + "</div>"
                + "<div style='text-align: center; margin-top: 16px; color: #94a3b8; font-size: 11px;'>"
                + "© 2027 R.I.P.S. Senior Secondary School. All rights reserved."
                + "</div>"
                + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Successfully sent OTP email to: {}", recipientEmail);
            return true;
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", recipientEmail, e.getMessage());
            return false;
        }
    }

    /**
     * Send final applied admission form details to the student's Gmail with confirmation message.
     */
    public boolean sendApplicationConfirmationEmail(AdmissionRequestDto application, String applicationNumber) {
        if (application.getEmail() == null || application.getEmail().trim().isEmpty()) {
            return false;
        }

        if (mailSender == null) {
            log.warn("JavaMailSender not available for confirmation email dispatch.");
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("dgarmy.vikash@gmail.com", "R.I.P.S. Senior Secondary Admissions");
            helper.setTo(application.getEmail());
            helper.setSubject("Application Successfully Submitted - Class 11th Admission (Ref: " + applicationNumber + ")");

            String html = "<div style='font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; border: 1px solid #cbd5e1; background-color: #f8fafc; border-radius: 8px;'>"
                + "<div style='background-color: #1e3a8a; color: white; padding: 18px; text-align: center; border-radius: 6px;'>"
                + "<h2 style='margin: 0; color: #f5c518;'>R.I.P.S. SENIOR SECONDARY SCHOOL</h2>"
                + "<p style='margin: 5px 0 0 0; font-size: 13px;'>Class 11 & 12 Senior Secondary Wing • Session 2027–28</p>"
                + "</div>"
                + "<div style='background-color: #ecfdf5; border: 1px solid #10b981; padding: 16px; margin: 16px 0; border-radius: 6px;'>"
                + "<h3 style='margin: 0; color: #065f46;'>Application Successfully Submitted!</h3>"
                + "<p style='margin: 6px 0 0 0; color: #047857; font-size: 13px;'>"
                + "Your Class 11th admission application has been registered successfully under Application Reference: <strong>" + applicationNumber + "</strong>."
                + "</p>"
                + "</div>"
                + "<table style='width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px;'>"
                + "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Applicant Name:</td><td style='padding: 8px; color: #0f172a;'>" + application.getStudentName() + "</td></tr>"
                + "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Stream Applied:</td><td style='padding: 8px; color: #0f172a; font-weight: bold;'>" + application.getStreamApplying() + "</td></tr>"
                + "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Parent / Guardian:</td><td style='padding: 8px; color: #0f172a;'>" + application.getParentName() + "</td></tr>"
                + "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Verified Mobile:</td><td style='padding: 8px; color: #0f172a;'>" + application.getPhone() + "</td></tr>"
                + "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 8px; font-weight: bold; color: #475569;'>Verified Gmail:</td><td style='padding: 8px; color: #0f172a;'>" + application.getEmail() + "</td></tr>"
                + "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 8px; font-weight: bold; color: #475569;'>10th Board Score:</td><td style='padding: 8px; color: #0f172a;'>" + application.getTenthPercentage() + "</td></tr>"
                + "</table>"
                + "<div style='margin-top: 20px; padding: 12px; background-color: #eff6ff; border-left: 4px solid #1e3a8a; font-size: 12px; color: #1e3a8a;'>"
                + "Please keep your Application Reference <strong>" + applicationNumber + "</strong> safe for upcoming stream counseling and document verification at the campus."
                + "</div>"
                + "</div>";

            helper.setText(html, true);
            mailSender.send(message);
            log.info("Successfully sent admission confirmation email to: {}", application.getEmail());
            return true;
        } catch (Exception e) {
            log.error("Failed to send admission confirmation email to {}: {}", application.getEmail(), e.getMessage());
            return false;
        }
    }

    /**
     * Send official Admission APPROVED notification email to the applicant.
     */
    public boolean sendAdmissionApprovalEmail(String studentName, String recipientEmail, String stream, String appNumber, String adminRemarks) {
        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            return false;
        }

        if (mailSender == null) {
            log.warn("JavaMailSender not available for approval email dispatch.");
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("dgarmy.vikash@gmail.com", "R.I.P.S. Senior Secondary Admissions");
            helper.setTo(recipientEmail);
            helper.setSubject("🎉 Congratulations! Your Class 11th Admission has been APPROVED - Ref: " + appNumber);

            String html = "<div style='font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; border: 1px solid #10b981; background-color: #f8fafc; border-radius: 12px;'>"
                + "<div style='background-color: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px;'>"
                + "<h2 style='margin: 0; color: #f5c518; letter-spacing: 1px;'>R.I.P.S. SENIOR SECONDARY SCHOOL</h2>"
                + "<p style='margin: 5px 0 0 0; font-size: 13px; color: #e2e8f0;'>CBSE Affiliation No. 1930284 • Classes 11th & 12th</p>"
                + "</div>"
                + "<div style='background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 22px;'>ADMISSION APPLICATION APPROVED!</h2>"
                + "<p style='margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;'>"
                + "Dear <strong>" + studentName + "</strong>, the school administration has officially reviewed and approved your application for <strong>" + stream + "</strong>."
                + "</p>"
                + "</div>"
                + "<div style='background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px;'>"
                + "<h4 style='margin-top: 0; color: #1e3a8a;'>Application Reference Summary:</h4>"
                + "<ul style='line-height: 1.8; color: #334155; padding-left: 20px;'>"
                + "<li><strong>Application ID:</strong> " + appNumber + "</li>"
                + "<li><strong>Allotted Stream:</strong> " + stream + "</li>"
                + "<li><strong>Admission Status:</strong> <span style='color: #059669; font-weight: bold;'>APPROVED / PROVISIONALLY ADMITTED</span></li>"
                + (adminRemarks != null && !adminRemarks.isEmpty() ? "<li><strong>Principal's Remarks:</strong> " + adminRemarks + "</li>" : "")
                + "</ul>"
                + "<div style='background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px; margin-top: 16px; font-size: 13px; color: #065f46;'>"
                + "<strong>Next Steps:</strong> Please visit the administrative block with your original Class 10th marksheet, Transfer Certificate, and tuition fee receipt within 7 working days to collect your Senior Identity Card."
                + "</div>"
                + "</div>"
                + "<div style='text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;'>"
                + "Office of Admissions & Records • R.I.P.S. Senior Secondary Wing"
                + "</div>"
                + "</div>";

            helper.setText(html, true);
            mailSender.send(message);
            log.info("Successfully sent ADMISSION APPROVAL email to: {}", recipientEmail);
            return true;
        } catch (Exception e) {
            log.error("Failed to send admission approval email to {}: {}", recipientEmail, e.getMessage());
            return false;
        }
    }

    /**
     * Send Admission REJECTED / REVIEW REQUIRED notification email.
     */
    public boolean sendAdmissionRejectionEmail(String studentName, String recipientEmail, String appNumber, String reason) {
        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            return false;
        }

        if (mailSender == null) return false;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("dgarmy.vikash@gmail.com", "R.I.P.S. Senior Secondary Admissions");
            helper.setTo(recipientEmail);
            helper.setSubject("Class 11th Admission Status Update - Ref: " + appNumber);

            String html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fecaca; background-color: #fffaf0; border-radius: 8px;'>"
                + "<h3 style='color: #991b1b; margin-top: 0;'>Application Status Update: Disapproved / Document Discrepancy</h3>"
                + "<p style='color: #451a03; font-size: 14px;'>Dear " + studentName + ",</p>"
                + "<p style='color: #451a03; font-size: 13px; line-height: 1.6;'>"
                + "Your Class 11th admission application (Ref: <strong>" + appNumber + "</strong>) could not be approved at this time."
                + "</p>"
                + "<div style='background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 12px; font-size: 13px; color: #991b1b;'>"
                + "<strong>Reason / Remarks:</strong> " + (reason != null ? reason : "Eligibility criteria or document verification mismatch.")
                + "</div>"
                + "<p style='color: #78350f; font-size: 12px; margin-top: 16px;'>"
                + "Please contact the Admissions Desk at <code>rips.admissions@gmail.com</code> for clarifications or re-verification."
                + "</p>"
                + "</div>";

            helper.setText(html, true);
            mailSender.send(message);
            log.info("Sent admission rejection email to: {}", recipientEmail);
            return true;
        } catch (Exception e) {
            log.error("Failed to send rejection email: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Send official Class 11 -> 12 PROMOTION APPROVAL email to existing school student.
     */
    public boolean sendClass12PromotionApprovalEmail(String studentName, String recipientEmail, String stream, String appNumber, String adminRemarks, String section) {
        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            return false;
        }

        if (mailSender == null) return false;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("dgarmy.vikash@gmail.com", "R.I.P.S. Senior Secondary Promotions Desk");
            helper.setTo(recipientEmail);
            helper.setSubject("🎉 Congratulations! Promoted to Class 12th (Session 2027–28) - Ref: " + appNumber);

            String html = "<div style='font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; border: 1px solid #10b981; background-color: #f8fafc; border-radius: 12px;'>"
                + "<div style='background-color: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px;'>"
                + "<h2 style='margin: 0; color: #f5c518; letter-spacing: 1px;'>R.I.P.S. SENIOR SECONDARY SCHOOL</h2>"
                + "<p style='margin: 5px 0 0 0; font-size: 13px; color: #e2e8f0;'>CBSE Affiliation No. 1930284 • Senior Secondary Wing</p>"
                + "</div>"
                + "<div style='background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 22px;'>CLASS 12TH PROMOTION CONFIRMED!</h2>"
                + "<p style='margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;'>"
                + "Dear <strong>" + studentName + "</strong>, on the basis of your Class 11th Annual Examination performance, your promotion to <strong>Class 12th (" + stream + ")</strong> has been officially approved by the Academic Council."
                + "</p>"
                + "</div>"
                + "<div style='background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px;'>"
                + "<h4 style='margin-top: 0; color: #1e3a8a;'>Class 12th Academic Allotment Summary:</h4>"
                + "<ul style='line-height: 1.8; color: #334155; padding-left: 20px;'>"
                + "<li><strong>Promotion Reference No:</strong> " + appNumber + "</li>"
                + "<li><strong>Promoted Grade:</strong> Class 12 (Session 2027–28)</li>"
                + "<li><strong>Allotted Stream:</strong> " + stream + "</li>"
                + "<li><strong>Allotted Section:</strong> " + (section != null && !section.isEmpty() ? section : "Section A (Senior Batch)") + "</li>"
                + "<li><strong>Promotion Status:</strong> <span style='color: #059669; font-weight: bold;'>PROMOTED & RE-ENROLLED</span></li>"
                + (adminRemarks != null && !adminRemarks.isEmpty() ? "<li><strong>Principal's Commendation:</strong> " + adminRemarks + "</li>" : "")
                + "</ul>"
                + "<div style='background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px; margin-top: 16px; font-size: 13px; color: #065f46;'>"
                + "<strong>Class 12th Commencement:</strong> Senior Secondary Classes for Session 2027–28 will commence on <strong>April 5, 2027</strong>. Please collect your Class 12th course pack and lab journals from the academic counter."
                + "</div>"
                + "</div>"
                + "<div style='text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;'>"
                + "Office of the Principal & Senior Secondary Academic Council • R.I.P.S."
                + "</div>"
                + "</div>";

            helper.setText(html, true);
            mailSender.send(message);
            log.info("Successfully sent CLASS 12 PROMOTION APPROVAL email to: {}", recipientEmail);
            return true;
        } catch (Exception e) {
            log.error("Failed to send class 12 promotion approval email to {}: {}", recipientEmail, e.getMessage());
            return false;
        }
    }

    /**
     * Send Official Razorpay Fee Payment Receipt to the Payer's Gmail with instant download button and printable voucher attachment.
     */
    public boolean sendPaymentReceiptEmail(String recipientEmail, String studentName, String studentId, 
                                          String receiptNo, double amount, String paymentMethod, 
                                          String referenceNo, String feeType) {
        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            log.warn("Cannot send receipt email: recipientEmail is empty.");
            return false;
        }

        if (mailSender == null) {
            log.warn("JavaMailSender is not configured. Email dispatch skipped.");
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("dgarmy.vikash@gmail.com", "R.I.P.S. Accounts & Finance Division");
            helper.setTo(recipientEmail.trim());
            helper.setSubject("🧾 Official Fee Receipt #" + receiptNo + " - Royal International Public School");

            String dateStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy"));
            String downloadUrl = "http://localhost:3000/receipt/" + receiptNo;
            String amountFormatted = String.format("₹%,.2f", amount);

            String htmlBody = "<div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; background-color: #f1f5f9; border-radius: 16px;'>"
                // Top Header
                + "<div style='background-color: #1e3a8a; color: #ffffff; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;'>"
                + "<div style='width: 48px; height: 48px; background: #ffffff; color: #1e3a8a; font-weight: 800; font-size: 18px; line-height: 48px; border-radius: 50%; margin: 0 auto 10px auto; border: 2px solid #f5c518;'>RIPS</div>"
                + "<h2 style='margin: 0; color: #f5c518; letter-spacing: 0.5px; font-size: 20px;'>ROYAL INTERNATIONAL PUBLIC SCHOOL</h2>"
                + "<p style='margin: 4px 0 0 0; font-size: 12px; color: #cbd5e1;'>Senior Secondary Wing • CBSE Affiliation No. 1930284</p>"
                + "<p style='margin: 2px 0 0 0; font-size: 11px; color: #94a3b8;'>Bursar & Accounts Division • Official Fee Realization Voucher</p>"
                + "</div>"

                // Success Box
                + "<div style='background: #ffffff; padding: 28px 24px; border: 1px solid #e2e8f0; border-top: none;'>"
                + "<div style='text-align: center; margin-bottom: 24px;'>"
                + "<div style='display: inline-block; background: #ecfdf5; border: 2px solid #10b981; color: #065f46; font-size: 13px; font-weight: bold; padding: 6px 18px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;'>"
                + "✓ Payment Verified & Receipt Confirmed"
                + "</div>"
                + "<h3 style='margin: 14px 0 4px 0; color: #0f172a; font-size: 18px;'>Thank You! Fee Payment Realized Successfully.</h3>"
                + "<p style='margin: 0; color: #64748b; font-size: 13px;'>Dear Parent / Student, this is your official digital fee receipt for your records.</p>"
                + "</div>"

                // Receipt Meta Cards
                + "<div style='background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;'>"
                + "<table style='width: 100%; border-collapse: collapse; font-size: 13px;'>"
                + "<tr>"
                + "<td style='padding: 6px 0; color: #64748b;'>Receipt Number:</td>"
                + "<td style='padding: 6px 0; text-align: right; font-weight: bold; font-family: monospace; color: #1e3a8a; font-size: 14px;'>" + receiptNo + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style='padding: 6px 0; color: #64748b;'>Student Name:</td>"
                + "<td style='padding: 6px 0; text-align: right; font-weight: bold; color: #0f172a;'>" + studentName + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style='padding: 6px 0; color: #64748b;'>Admission / Student ID:</td>"
                + "<td style='padding: 6px 0; text-align: right; font-family: monospace; font-weight: bold; color: #334155;'>" + studentId + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style='padding: 6px 0; color: #64748b;'>Payment Date:</td>"
                + "<td style='padding: 6px 0; text-align: right; color: #334155; font-weight: 500;'>" + dateStr + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style='padding: 6px 0; color: #64748b;'>Payment Channel:</td>"
                + "<td style='padding: 6px 0; text-align: right; font-weight: bold; color: #6d28d9;'>" + paymentMethod + " (Razorpay)</td>"
                + "</tr>"
                + "<tr>"
                + "<td style='padding: 6px 0; color: #64748b;'>Razorpay Reference ID:</td>"
                + "<td style='padding: 6px 0; text-align: right; font-family: monospace; color: #0284c7; font-weight: bold;'>" + referenceNo + "</td>"
                + "</tr>"
                + "</table>"
                + "</div>"

                // Breakdown Table
                + "<table style='width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;'>"
                + "<thead style='background: #1e3a8a; color: #ffffff;'>"
                + "<tr>"
                + "<th style='padding: 10px 14px; text-align: left; border-radius: 6px 0 0 0;'>Fee Description</th>"
                + "<th style='padding: 10px 14px; text-align: right; border-radius: 0 6px 0 0;'>Amount (INR)</th>"
                + "</tr>"
                + "</thead>"
                + "<tbody style='border: 1px solid #cbd5e1;'>"
                + "<tr>"
                + "<td style='padding: 12px 14px; color: #1e293b; font-weight: 500;'>" + (feeType != null ? feeType : "Senior Secondary Quarterly Composite Tuition Fee") + "</td>"
                + "<td style='padding: 12px 14px; text-align: right; font-family: monospace; font-weight: bold; color: #0f172a;'>" + amountFormatted + "</td>"
                + "</tr>"
                + "<tr style='background: #ecfdf5; border-top: 2px solid #059669;'>"
                + "<td style='padding: 12px 14px; font-weight: bold; color: #065f46; text-transform: uppercase;'>Total Paid in Full:</td>"
                + "<td style='padding: 12px 14px; text-align: right; font-family: monospace; font-weight: 900; font-size: 16px; color: #047857;'>" + amountFormatted + "</td>"
                + "</tr>"
                + "</tbody>"
                + "</table>"

                // Action Download Button
                + "<div style='text-align: center; margin: 30px 0 16px 0;'>"
                + "<a href='" + downloadUrl + "' target='_blank' style='display: inline-block; background-color: #1e3a8a; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 28px; border-radius: 10px; border: 2px solid #f5c518; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);'>"
                + "📥 View / Print Official Receipt Online"
                + "</a>"
                + "<p style='margin: 8px 0 0 0; color: #94a3b8; font-size: 11px;'>Or visit directly: <a href='" + downloadUrl + "' style='color: #0284c7;'>" + downloadUrl + "</a></p>"
                + "<div style='margin-top: 12px; display: inline-block; background: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 6px 16px; border-radius: 8px; font-size: 12px; font-weight: bold;'>"
                + "📎 Official Receipt PDF is attached below (Official_Fee_Receipt_" + receiptNo + ".pdf)"
                + "</div>"
                + "</div>"

                // Assurance Seal
                + "<div style='border: 2px dashed #cbd5e1; background: #fafaf9; border-radius: 10px; padding: 14px; text-align: center; margin-top: 20px;'>"
                + "<div style='color: #047857; font-weight: 800; font-size: 12px; letter-spacing: 1px;'>★ OFFICIAL BURSAR ASSURANCE & VERIFICATION ★</div>"
                + "<p style='margin: 4px 0 0 0; font-size: 11px; color: #64748b;'>This electronic receipt is computer generated and carries digitally verified stamp ID RIPS-ACC-" + receiptNo + ". No physical signature required.</p>"
                + "</div>"
                + "</div>"

                // Footer
                + "<div style='text-align: center; padding: 16px; color: #64748b; font-size: 11px;'>"
                + "<p style='margin: 0;'>Royal International Public School • Knowledge City • Support Desk: <a href='mailto:dgarmy.vikash@gmail.com' style='color: #1e3a8a;'>dgarmy.vikash@gmail.com</a></p>"
                + "<p style='margin: 4px 0 0 0; color: #94a3b8;'>© " + java.time.LocalDate.now().getYear() + " RIPS Senior Secondary School. All rights reserved.</p>"
                + "</div>"
                + "</div>";

            helper.setText(htmlBody, true);

            // Generate official PDF receipt document (pure PDF format, NOT HTML)
            byte[] pdfBytes = school_portal.util.PdfReceiptGenerator.generateReceiptPdf(
                    receiptNo, studentName, studentId, amount, paymentMethod, referenceNo, feeType, dateStr
            );

            // Save PDF Invoice to database (payments table)
            if (jdbcTemplate != null) {
                try {
                    String base64Pdf = "data:application/pdf;base64," + java.util.Base64.getEncoder().encodeToString(pdfBytes);
                    String pdfDownloadUrl = "/api/payments/razorpay/receipt/" + receiptNo + "/download-pdf";

                    int updated = jdbcTemplate.update(
                            "UPDATE payments SET invoice_pdf = ?, pdf_url = ? WHERE receipt_no = ? OR reference_no = ? OR razorpay_payment_id = ?",
                            base64Pdf, pdfDownloadUrl, receiptNo, referenceNo, referenceNo
                    );

                    if (updated > 0) {
                        log.info("Saved PDF invoice to database for receipt {}: {} row(s) updated in payments table", receiptNo, updated);
                    } else {
                        jdbcTemplate.update(
                                "INSERT INTO payments (id, receipt_no, student_id, student_name, grade, fee_type, amount, payment_method, reference_no, razorpay_payment_id, payer_email, date, status, invoice_pdf, pdf_url) " +
                                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, 'COMPLETED', ?, ?)",
                                "PAY-" + System.currentTimeMillis(), receiptNo, studentId, studentName, "Class 11 - Senior Secondary", feeType, amount, paymentMethod, referenceNo, referenceNo, recipientEmail, base64Pdf, pdfDownloadUrl
                        );
                        log.info("Inserted new payment record with PDF invoice into database for receipt {}", receiptNo);
                    }
                } catch (Exception dbEx) {
                    log.warn("Could not save PDF invoice to database: {}", dbEx.getMessage());
                }
            }

            helper.addAttachment("Official_Fee_Receipt_" + receiptNo + ".pdf",
                    new org.springframework.core.io.ByteArrayResource(pdfBytes), "application/pdf");

            mailSender.send(message);
            log.info("Successfully dispatched PAYMENT RECEIPT PDF email to: {}", recipientEmail);
            return true;
        } catch (Exception e) {
            log.error("Failed to send payment receipt email to {}: {}", recipientEmail, e.getMessage(), e);
            return false;
        }
    }
}

