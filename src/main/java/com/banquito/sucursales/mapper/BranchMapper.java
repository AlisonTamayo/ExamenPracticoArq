package com.banquito.sucursales.mapper;

import com.banquito.sucursales.dto.request.BranchCreateRequest;
import com.banquito.sucursales.dto.response.BranchResponse;
import com.banquito.sucursales.dto.response.HolidayResponse;
import com.banquito.sucursales.model.Branch;
import com.banquito.sucursales.model.BranchHoliday;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class BranchMapper {

    private BranchMapper() {}

    public static Branch toEntity(BranchCreateRequest request) {
        Branch branch = new Branch();
        branch.setEmailAddress(request.getEmailAddress());
        branch.setName(request.getName());
        branch.setPhoneNumber(request.getPhoneNumber());
        branch.setState("ACTIVE");
        branch.setCreationDate(Instant.now());
        branch.setLastModifiedDate(Instant.now());
        branch.setBranchHolidays(new ArrayList<>());
        return branch;
    }

    public static BranchResponse toResponse(Branch branch) {
        BranchResponse response = new BranchResponse();
        response.setId(branch.getId());
        response.setEmailAddress(branch.getEmailAddress());
        response.setName(branch.getName());
        response.setPhoneNumber(branch.getPhoneNumber());
        response.setState(branch.getState());
        response.setCreationDate(OffsetDateTime.from(branch.getCreationDate()));
        response.setLastModifiedDate(OffsetDateTime.from(branch.getLastModifiedDate()));

        List<BranchHoliday> holidays =
                branch.getBranchHolidays() != null
                        ? branch.getBranchHolidays()
                        : List.of();

        response.setBranchHolidays(
                holidays.stream()
                        .map(BranchMapper::toHolidayResponse)
                        .collect(Collectors.toList())
        );

        return response;
    }

    private static HolidayResponse toHolidayResponse(BranchHoliday holiday) {
        HolidayResponse response = new HolidayResponse();
        response.setDate(holiday.getDate());
        response.setName(holiday.getName());
        return response;
    }
}
