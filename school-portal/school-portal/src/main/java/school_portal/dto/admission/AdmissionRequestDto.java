package school_portal.dto.admission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionRequestDto {
    private String studentName;
    private String gender;
    private String dateOfBirth;
    private String bloodGroup;
    private String category;
    
    private String parentName;
    private String relation;
    private String parentOccupation;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    
    private String tenthBoard;
    private String tenthSchool;
    private String tenthRollNumber;
    private String tenthPassingYear;
    private String tenthPercentage;
    
    private String streamApplying;
    private String electiveSubject;
    private String competitiveExam;
    private String additionalNotes;

    private List<UploadedDocDto> documents;

    public String getDob() {
        return dateOfBirth != null ? dateOfBirth : "";
    }

    public void setDob(String dob) {
        this.dateOfBirth = dob;
    }

    public String getPreviousSchool() {
        return tenthSchool != null ? tenthSchool : "";
    }

    public void setPreviousSchool(String previousSchool) {
        this.tenthSchool = previousSchool;
    }

    public String getTenthRollNo() {
        return tenthRollNumber != null ? tenthRollNumber : "";
    }

    public void setTenthRollNo(String tenthRollNo) {
        this.tenthRollNumber = tenthRollNo;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UploadedDocDto {
        private String documentName;
        private String fileName;
        private Long fileSize;
        private String fileUrl;
        private String status;
    }
}
