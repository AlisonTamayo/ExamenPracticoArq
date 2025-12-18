package com.banquito.sucursales.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BranchCreateRequest {

    @NotBlank
    @Email
    private String emailAddress;

    @NotBlank
    private String name;

    @NotBlank
    private String phoneNumber;
}
