package com.example.CarrerLink_backend.controller;


import com.example.CarrerLink_backend.dto.AdminSaveRequestDTO;
import com.example.CarrerLink_backend.dto.request.*;
import com.example.CarrerLink_backend.dto.response.LoginResponseDTO;
import com.example.CarrerLink_backend.dto.response.RegisterResponseDTO;
import com.example.CarrerLink_backend.entity.RolesEntity;
import com.example.CarrerLink_backend.entity.UserEntity;
import com.example.CarrerLink_backend.service.impl.AuthService;
import com.example.CarrerLink_backend.utill.StandardResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;


    @GetMapping
    public List<UserEntity> getAllUsers(){
        return authService.getAllUsers();
    }

    @PostMapping
    public UserEntity createUser(@RequestBody RegisterRequestDTO userEntity){
        return authService.createUser(userEntity);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO){

        LoginResponseDTO res = authService.login(loginRequestDTO);
        if(res.getError()!=null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

//    @PostMapping("/register")
//    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterRequestDTO registerRequestDTO){
//
//        RegisterResponseDTO res = authService.register(registerRequestDTO);
//        if(res.getError()!=null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
//
//        return ResponseEntity.status(HttpStatus.OK).body(res);
//    }

    @PostMapping(value = "/register/company", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RegisterResponseDTO> registerCompany(
            @RequestPart("company") String companyJson,
            @RequestPart(value = "companyPic", required = false) MultipartFile companyPic,
            @RequestPart(value = "coverPic", required = false) MultipartFile coverPic) throws IOException, IllegalAccessException {

        ObjectMapper objectMapper = new ObjectMapper();
        CompanySaveRequestDTO companySaveRequestDTO;
        try {
            companySaveRequestDTO = objectMapper.readValue(companyJson, CompanySaveRequestDTO.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(new RegisterResponseDTO(null, "Invalid JSON format"));
        }

        RegisterResponseDTO res = authService.registerCompany(companySaveRequestDTO, companyPic, coverPic);
        if (res.getError() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }



    @PostMapping(value = "/register/student", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RegisterResponseDTO> registerStudent(
            @RequestPart("student") String studentJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IllegalAccessException, IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        StudentSaveRequestDTO studentSaveRequestDTO;
        try {
            studentSaveRequestDTO = objectMapper.readValue(studentJson, StudentSaveRequestDTO.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RegisterResponseDTO(null, "Invalid JSON format"));
        }

        RegisterResponseDTO res = authService.registerStudent(studentSaveRequestDTO, imageFile);
        if (res.getError() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }



    @PostMapping("/register/admin")
    public ResponseEntity<StandardResponse> registerAdmin(@RequestBody AdminSaveRequestDTO adminSaveRequestDTO) throws IllegalAccessException {
        RegisterResponseDTO res = authService.registerAdmin(adminSaveRequestDTO);
        if(res.getError()!=null) return ResponseEntity.badRequest().body(new StandardResponse(false, res.getError(), null));

        return ResponseEntity.ok(new StandardResponse(true,"successfully registered",res));
    }

    @PostMapping("CreateRoles")
    public ResponseEntity<RolesEntity> createRoles(@RequestBody RolesEntity rolesEntity){
        return ResponseEntity.ok(authService.createRoles(rolesEntity));
    }

    // Gửi OTP cho email khi quên mật khẩu
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        boolean sent = authService.sendOtpToEmail(email);
        if(sent) {
            return ResponseEntity.ok("OTP sent to your email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to send OTP");
        }
    }

    // Reset mật khẩu với OTP và mật khẩu mới
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequestDTO resetRequestDTO) {
        boolean result = authService.resetPassword(resetRequestDTO);
        if (!result) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("OTP không hợp lệ hoặc email không tồn tại.");
        }
        return ResponseEntity.ok("Đổi mật khẩu thành công.");
    }
}
