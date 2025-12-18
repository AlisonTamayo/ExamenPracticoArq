package com.banquito.sucursales.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BranchUpdateRequest {

    @NotBlank
    private String phoneNumber;
}
