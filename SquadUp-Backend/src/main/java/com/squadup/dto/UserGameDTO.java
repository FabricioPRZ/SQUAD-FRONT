package com.squadup.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserGameDTO {
    private Long id;
    private Long gameId;
    private String gameName;
    private String gameCoverUrl;
    private String rank;
    private String rankLabel;
    private Integer hoursPlayed;
    private Boolean isMain;
}
