package com.banquito.sucursales.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class HolidayResponse {

    private LocalDate date;
    private String name;
}
