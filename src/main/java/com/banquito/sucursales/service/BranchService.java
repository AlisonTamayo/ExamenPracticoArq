package com.banquito.sucursales.service;

import com.banquito.sucursales.dto.request.BranchCreateRequest;
import com.banquito.sucursales.dto.request.BranchUpdateRequest;
import com.banquito.sucursales.dto.request.HolidayRequest;
import com.banquito.sucursales.exception.BadRequestException;
import com.banquito.sucursales.exception.NotFoundException;
import com.banquito.sucursales.mapper.BranchMapper;
import com.banquito.sucursales.model.Branch;
import com.banquito.sucursales.model.BranchHoliday;
import com.banquito.sucursales.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.util.List;
import java.time.Instant;


@Slf4j
@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository repository;

    public List<Branch> findAll() {
        log.info("Obteniendo todas las sucursales");
        return repository.findAll();
    }

    public Branch create(BranchCreateRequest request) {
        log.info("Creando sucursal {}", request.getName());
        return repository.save(BranchMapper.toEntity(request));
    }

    public Branch findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Sucursal no encontrada"));
    }

    public Branch updatePhone(String id, BranchUpdateRequest request) {
        Branch branch = findById(id);
        branch.setPhoneNumber(request.getPhoneNumber());
        branch.setLastModifiedDate(Instant.now());
        return repository.save(branch);
    }

    public Branch addHoliday(String id, HolidayRequest request) {
        Branch branch = findById(id);

        boolean exists = branch.getBranchHolidays()
                .stream()
                .anyMatch(h -> h.getDate().equals(request.getDate()));

        if (exists) {
            throw new BadRequestException("El feriado ya existe");
        }

        BranchHoliday holiday = new BranchHoliday();
        holiday.setDate(request.getDate());
        holiday.setName(request.getName());
        branch.getBranchHolidays().add(holiday);

        return repository.save(branch);
    }

    public Branch removeHoliday(String id, LocalDate date) {
        Branch branch = findById(id);
        branch.getBranchHolidays()
                .removeIf(h -> h.getDate().equals(date));
        return repository.save(branch);
    }

    public boolean isHoliday(String id, LocalDate date) {
        Branch branch = findById(id);
        return branch.getBranchHolidays()
                .stream()
                .anyMatch(h -> h.getDate().equals(date));
    }
}
