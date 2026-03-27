package com.squadup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class GameRequest {

    @NotBlank(message = "El nombre del juego es obligatorio")
    @Size(max = 120)
    private String name;

    @NotBlank(message = "El género es obligatorio")
    @Size(max = 30)
    private String genre;

    private String coverUrl;

    private String description;
}
