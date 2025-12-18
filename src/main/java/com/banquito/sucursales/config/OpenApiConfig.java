package com.banquito.sucursales.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI sucursalesOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Sucursales - BanQuito")
                        .description("Microservicio para la gestión de sucursales y feriados")
                        .version("v1"));
    }
}
