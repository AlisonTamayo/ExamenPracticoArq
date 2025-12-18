package com.banquito.sucursales.dto.response;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class BranchResponse {

    private String id;
    private String emailAddress;
    private String name;
    private String phoneNumber;
    private String state;
    private OffsetDateTime creationDate;
    private OffsetDateTime lastModifiedDate;
    private List<HolidayResponse> branchHolidays;
}
