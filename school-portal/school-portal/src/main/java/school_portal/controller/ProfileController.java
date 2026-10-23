package school_portal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import school_portal.dto.student.GuardianRequestDto;
import school_portal.dto.student.GuardianResponseDto;
import school_portal.dto.student.StudentRequestDto;
import school_portal.dto.student.StudentResponseDto;
import school_portal.service.ProfileService;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/students")
    public ResponseEntity<StudentResponseDto> registerStudent(@Valid @RequestBody StudentRequestDto request) {
        return new ResponseEntity<>(profileService.registerStudent(request), HttpStatus.CREATED);
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentResponseDto> getStudentProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getStudentProfile(id));
    }

    @PostMapping("/guardians")
    public ResponseEntity<GuardianResponseDto> addGuardian(@Valid @RequestBody GuardianRequestDto request) {
        return new ResponseEntity<>(profileService.addGuardian(request), HttpStatus.CREATED);
    }
}
