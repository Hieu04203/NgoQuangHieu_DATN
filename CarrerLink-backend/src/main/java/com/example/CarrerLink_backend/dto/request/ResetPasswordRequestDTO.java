package com.example.CarrerLink_backend.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequestDTO {
    private String email;
    private String otp;
    private String newPassword;
}
