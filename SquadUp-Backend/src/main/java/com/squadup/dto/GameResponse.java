package com.squadup.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GameResponse {
    private Long id;
    private String name;
    private String genre;
    private String coverUrl;
    private String description;
}
