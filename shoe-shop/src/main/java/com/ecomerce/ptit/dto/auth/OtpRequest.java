package com.ecomerce.ptit.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpRequest {

    @Email
    private String email;
    @NotBlank
    private String oneTimePassword;
}
