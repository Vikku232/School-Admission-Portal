package school_portal.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Pure Java standard PDF-1.4 generator for official school fee receipts.
 * Produces crisp, compliant, standalone PDF documents with zero external dependencies.
 */
public class PdfReceiptGenerator {

    /**
     * Generate an official A4 fee receipt PDF as a byte array.
     */
    public static byte[] generateReceiptPdf(
            String receiptNo,
            String studentName,
            String studentId,
            double amount,
            String paymentMethod,
            String referenceNo,
            String feeType,
            String dateStr
    ) {
        if (receiptNo == null || receiptNo.isEmpty()) receiptNo = "REC-2027-PAID";
        if (studentName == null || studentName.isEmpty()) studentName = "Student Candidate";
        if (studentId == null || studentId.isEmpty()) studentId = "RIPS-2027-PORTAL";
        if (paymentMethod == null || paymentMethod.isEmpty()) paymentMethod = "Razorpay Verified";
        if (referenceNo == null || referenceNo.isEmpty()) referenceNo = "pay_rzp_portal";
        if (feeType == null || feeType.isEmpty()) feeType = "Senior Secondary Quarterly Composite Tuition & Lab Fee";
        if (dateStr == null || dateStr.isEmpty()) {
            dateStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy"));
        }

        String amountFormatted = String.format("Rs. %,.2f", amount);

        StringBuilder cs = new StringBuilder();

        // 1. Top Header Banner (Royal Navy Blue: #1E3A8A)
        cs.append("0.118 0.227 0.541 rg\n");
        cs.append("36 710 523 90 re f\n");

        // Gold Accent Stripe (#F5C518)
        cs.append("0.961 0.773 0.094 rg\n");
        cs.append("36 706 523 4 re f\n");

        // School Name Header
        cs.append("1 1 1 rg\n");
        cs.append("BT\n/F2 18 Tf\n120 765 Td\n(").append(escape("ROYAL INTERNATIONAL PUBLIC SCHOOL")).append(") Tj\nET\n");

        // Subheader Gold
        cs.append("0.961 0.773 0.094 rg\n");
        cs.append("BT\n/F2 11 Tf\n170 745 Td\n(").append(escape("OFFICIAL FEE PAYMENT RECEIPT")).append(") Tj\nET\n");

        // Subtitle White/Blue
        cs.append("0.85 0.9 0.98 rg\n");
        cs.append("BT\n/F1 9 Tf\n150 728 Td\n(").append(escape("Senior Secondary Wing • CBSE Affiliation No. 1930284")).append(") Tj\nET\n");

        // 2. Verification Ribbon Banner (Soft Emerald)
        cs.append("0.92 0.98 0.95 rg\n");
        cs.append("36 675 523 22 re f\n");
        cs.append("0.02 0.6 0.35 RG\n0.8 w\n36 675 523 22 re S\n");
        cs.append("0.02 0.45 0.25 rg\n");
        cs.append("BT\n/F2 9 Tf\n115 682 Td\n(").append(escape("★ PAYMENT REALIZED & DIGITALLY VERIFIED VIA RAZORPAY GATEWAY ★")).append(") Tj\nET\n");

        // 3. Receipt Metadata Box
        cs.append("0.97 0.98 0.99 rg\n");
        cs.append("36 560 523 105 re f\n");
        cs.append("0.8 0.85 0.9 RG\n1 w\n36 560 523 105 re S\n");

        // Row 1: Receipt Number & Date
        cs.append("0.35 0.4 0.45 rg\nBT\n/F2 9 Tf\n50 645 Td\n(RECEIPT VOUCHER NO: ) Tj\nET\n");
        cs.append("0.118 0.227 0.541 rg\nBT\n/F2 10 Tf\n165 645 Td\n(").append(escape(receiptNo)).append(") Tj\nET\n");

        cs.append("0.35 0.4 0.45 rg\nBT\n/F2 9 Tf\n340 645 Td\n(TRANSACTION DATE: ) Tj\nET\n");
        cs.append("0.1 0.1 0.1 rg\nBT\n/F1 9 Tf\n445 645 Td\n(").append(escape(dateStr)).append(") Tj\nET\n");

        // Row 2: Student Name & Admission ID
        cs.append("0.35 0.4 0.45 rg\nBT\n/F2 9 Tf\n50 618 Td\n(STUDENT / CANDIDATE: ) Tj\nET\n");
        cs.append("0.1 0.1 0.1 rg\nBT\n/F2 9 Tf\n165 618 Td\n(").append(escape(studentName)).append(") Tj\nET\n");

        cs.append("0.35 0.4 0.45 rg\nBT\n/F2 9 Tf\n340 618 Td\n(ADMISSION / ID NO: ) Tj\nET\n");
        cs.append("0.1 0.1 0.1 rg\nBT\n/F2 9 Tf\n445 618 Td\n(").append(escape(studentId)).append(") Tj\nET\n");

        // Row 3: Payment Method & Razorpay Ref
        cs.append("0.35 0.4 0.45 rg\nBT\n/F2 9 Tf\n50 591 Td\n(PAYMENT METHOD: ) Tj\nET\n");
        cs.append("0.4 0.15 0.65 rg\nBT\n/F2 9 Tf\n165 591 Td\n(").append(escape(paymentMethod)).append(") Tj\nET\n");

        cs.append("0.35 0.4 0.45 rg\nBT\n/F2 9 Tf\n340 591 Td\n(RAZORPAY REF ID: ) Tj\nET\n");
        cs.append("0.05 0.4 0.7 rg\nBT\n/F1 9 Tf\n445 591 Td\n(").append(escape(referenceNo)).append(") Tj\nET\n");

        // Row 4: Class / Batch
        cs.append("0.35 0.4 0.45 rg\nBT\n/F2 9 Tf\n50 570 Td\n(ACADEMIC SESSION: ) Tj\nET\n");
        cs.append("0.1 0.1 0.1 rg\nBT\n/F1 9 Tf\n165 570 Td\n(").append(escape("2027–2028 (Class 11 / 12 Senior Secondary)")).append(") Tj\nET\n");

        // 4. Fee Breakdown Table Header
        cs.append("0.118 0.227 0.541 rg\n");
        cs.append("36 515 523 25 re f\n");
        cs.append("1 1 1 rg\n");
        cs.append("BT\n/F2 9 Tf\n50 523 Td\n(").append(escape("FEE HEAD DESCRIPTION / COMPONENT")).append(") Tj\nET\n");
        cs.append("BT\n/F2 9 Tf\n450 523 Td\n(").append(escape("AMOUNT (INR)")).append(") Tj\nET\n");

        // Fee Breakdown Item Row
        cs.append("0.99 0.99 1.0 rg\n");
        cs.append("36 470 523 45 re f\n");
        cs.append("0.8 0.85 0.9 RG\n1 w\n36 470 523 45 re S\n");

        cs.append("0.1 0.15 0.2 rg\n");
        cs.append("BT\n/F1 9 Tf\n50 492 Td\n(").append(escape(feeType)).append(") Tj\nET\n");
        cs.append("0.4 0.45 0.5 rg\n");
        cs.append("BT\n/F3 8 Tf\n50 480 Td\n(").append(escape("Includes Quarterly Tuition, STEM Labs, Digital Learning Portal & Sports Composite")).append(") Tj\nET\n");

        cs.append("0.05 0.1 0.2 rg\n");
        cs.append("BT\n/F2 11 Tf\n450 488 Td\n(").append(escape(amountFormatted)).append(") Tj\nET\n");

        // Total Paid Row
        cs.append("0.92 0.98 0.95 rg\n");
        cs.append("36 430 523 40 re f\n");
        cs.append("0.02 0.6 0.35 RG\n1.5 w\n36 430 523 40 re S\n");

        cs.append("0.02 0.45 0.25 rg\n");
        cs.append("BT\n/F2 11 Tf\n50 445 Td\n(").append(escape("TOTAL AMOUNT RECEIVED (PAID IN FULL):")).append(") Tj\nET\n");
        cs.append("BT\n/F2 13 Tf\n440 445 Td\n(").append(escape(amountFormatted)).append(") Tj\nET\n");

        // 5. Official Seal / Stamp (Emerald dashed border)
        cs.append("0.95 0.99 0.96 rg\n");
        cs.append("36 350 240 55 re f\n");
        cs.append("0.02 0.6 0.35 RG\n1.5 w\n[3 3] 0 d\n");
        cs.append("36 350 240 55 re S\n[] 0 d\n");

        cs.append("0.02 0.5 0.3 rg\n");
        cs.append("BT\n/F2 9 Tf\n48 385 Td\n(").append(escape("★ FEE REALIZED & VERIFIED ★")).append(") Tj\nET\n");
        cs.append("BT\n/F1 8 Tf\n48 372 Td\n(").append(escape("BURSAR DIVISION • RIPS SENIOR WING")).append(") Tj\nET\n");
        cs.append("0.4 0.5 0.4 rg\n");
        cs.append("BT\n/F1 7 Tf\n48 359 Td\n(Audit Stamp Ref: RIPS-BURSAR-").append(escape(receiptNo)).append(") Tj\nET\n");

        // 6. Signatory
        cs.append("0.2 0.2 0.25 rg\n");
        cs.append("BT\n/F2 10 Tf\n390 380 Td\n(").append(escape("Chief Accounts Officer")).append(") Tj\nET\n");
        cs.append("0.4 0.4 0.45 rg\n");
        cs.append("BT\n/F1 8 Tf\n390 367 Td\n(").append(escape("Authorized Signatory, Bursar Office")).append(") Tj\nET\n");
        cs.append("BT\n/F1 8 Tf\n390 355 Td\n(").append(escape("Royal International Public School")).append(") Tj\nET\n");

        // 7. Divider Line
        cs.append("0.85 0.88 0.9 RG\n0.8 w\n36 325 523 0 m 559 325 l S\n");

        // 8. Footer Notes
        cs.append("0.45 0.5 0.55 rg\n");
        cs.append("BT\n/F1 8 Tf\n120 305 Td\n(").append(escape("This is an official computer-generated receipt voucher. No physical signature is required.")).append(") Tj\nET\n");
        cs.append("BT\n/F1 8 Tf\n145 292 Td\n(").append(escape("For bursar support or billing clarifications, email: dgarmy.vikash@gmail.com")).append(") Tj\nET\n");
        cs.append("BT\n/F1 7 Tf\n185 280 Td\n(").append(escape("© Royal International Public School. All rights reserved.")).append(") Tj\nET\n");

        return buildPdf(cs.toString());
    }

    private static String escape(String s) {
        if (s == null) return "";
        // Sanitize any characters outside standard printable ASCII / WinAnsi
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '\\') {
                sb.append("\\\\");
            } else if (c == '(') {
                sb.append("\\(");
            } else if (c == ')') {
                sb.append("\\)");
            } else if (c == '₹') {
                sb.append("Rs. ");
            } else if (c >= 32 && c <= 126) {
                sb.append(c);
            } else {
                sb.append(' ');
            }
        }
        return sb.toString();
    }

    private static byte[] buildPdf(String contentStream) {
        try {
            byte[] contentBytes = contentStream.getBytes(StandardCharsets.ISO_8859_1);
            int streamLen = contentBytes.length;

            List<byte[]> objects = new ArrayList<>();

            // 1 0 obj: Catalog
            objects.add("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1));

            // 2 0 obj: Pages
            objects.add("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1));

            // 3 0 obj: Page (A4 MediaBox: 595.28 x 841.89)
            String pageObj = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> >>\nendobj\n";
            objects.add(pageObj.getBytes(StandardCharsets.ISO_8859_1));

            // 4 0 obj: Contents Stream
            ByteArrayOutputStream streamObj = new ByteArrayOutputStream();
            streamObj.write(String.format("4 0 obj\n<< /Length %d >>\nstream\n", streamLen).getBytes(StandardCharsets.ISO_8859_1));
            streamObj.write(contentBytes);
            streamObj.write("\nendstream\nendobj\n".getBytes(StandardCharsets.ISO_8859_1));
            objects.add(streamObj.toByteArray());

            // 5 0 obj: Font F1 (Helvetica)
            objects.add("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1));

            // 6 0 obj: Font F2 (Helvetica-Bold)
            objects.add("6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1));

            // 7 0 obj: Font F3 (Helvetica-Oblique)
            objects.add("7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1));

            // Assemble PDF
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            out.write("%PDF-1.4\n".getBytes(StandardCharsets.ISO_8859_1));
            out.write(new byte[]{ '%', (byte) 0xE2, (byte) 0xE3, (byte) 0xCF, (byte) 0xD3, '\n' });

            List<Integer> offsets = new ArrayList<>();
            offsets.add(0); // 0th object is free

            for (byte[] obj : objects) {
                offsets.add(out.size());
                out.write(obj);
            }

            int xrefOffset = out.size();
            int totalObjs = objects.size() + 1;

            out.write(String.format("xref\n0 %d\n0000000000 65535 f \n", totalObjs).getBytes(StandardCharsets.ISO_8859_1));
            for (int i = 1; i < offsets.size(); i++) {
                out.write(String.format("%010d 00000 n \n", offsets.get(i)).getBytes(StandardCharsets.ISO_8859_1));
            }

            out.write(String.format("trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n", totalObjs, xrefOffset).getBytes(StandardCharsets.ISO_8859_1));

            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error assembling PDF", e);
        }
    }
}
