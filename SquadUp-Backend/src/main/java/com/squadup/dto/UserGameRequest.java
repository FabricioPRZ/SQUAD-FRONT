package com.squadup.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserGameRequest {
    @NotNull(message = "El id del juego es obligatorio")
    private Long gameId;
    
    private String rank;
    private String rankLabel;
    private Integer hoursPlayed;
    private Boolean isMain;
}
