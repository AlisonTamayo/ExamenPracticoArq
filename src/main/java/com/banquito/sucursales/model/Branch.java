package com.banquito.sucursales.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "branches")
@Data
public class Branch {

    @Id
    private String id;

    private String emailAddress;
    private String name;
    private String phoneNumber;
    private String state;

    private Instant creationDate;
    private Instant lastModifiedDate;

    private List<BranchHoliday> branchHolidays = new ArrayList<>();
}
