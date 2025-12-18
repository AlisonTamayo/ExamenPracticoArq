package com.banquito.sucursales.controller;

import com.banquito.sucursales.dto.request.*;
import com.banquito.sucursales.mapper.BranchMapper;
import com.banquito.sucursales.service.BranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/sucursales/v1")
@RequiredArgsConstructor
@Tag(name = "Sucursales BanQuito")
public class BranchController {

    private final BranchService service;

    @GetMapping
    @Operation(summary = "Obtener todas las sucursales")
    public List<?> findAll() {
        return service.findAll()
                .stream()
                .map(BranchMapper::toResponse)
                .toList();
    }


    @PostMapping
    @Operation(summary = "Crear una sucursal sin feriados")
    public Object create(@Valid @RequestBody BranchCreateRequest request) {
        return BranchMapper.toResponse(service.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener sucursal por ID")
    public Object findById(@PathVariable String id) {
        return BranchMapper.toResponse(service.findById(id));
    }

    @PatchMapping("/{id}/telefono")
    @Operation(summary = "Modificar el número de teléfono de la sucursal")
    public Object updatePhone(@PathVariable String id,
                              @Valid @RequestBody BranchUpdateRequest request) {
        return BranchMapper.toResponse(service.updatePhone(id, request));
    }

    @PostMapping("/{id}/feriados")
    @Operation(summary = "Crear feriado para una sucursal")
    public Object addHoliday(@PathVariable String id,
                             @Valid @RequestBody HolidayRequest request) {
        return BranchMapper.toResponse(service.addHoliday(id, request));
    }

    @DeleteMapping("/{id}/feriados/{date}")
    @Operation(summary = "Eliminar feriado de una sucursal")
    public Object removeHoliday(@PathVariable String id,
                                @PathVariable LocalDate date) {
        return BranchMapper.toResponse(service.removeHoliday(id, date));
    }

    @GetMapping("/{id}/feriados")
    @Operation(summary = "Obtener todos los feriados de una sucursal")
    public List<?> getHolidays(@PathVariable String id) {
        return service.findById(id).getBranchHolidays();
    }


    @GetMapping("/{id}/feriados/verificar")
    @Operation(summary = "Verificar si una fecha es feriado en la sucursal")
    public boolean isHoliday(@PathVariable String id,
                             @RequestParam LocalDate date) {
        return service.isHoliday(id, date);
    }
}
