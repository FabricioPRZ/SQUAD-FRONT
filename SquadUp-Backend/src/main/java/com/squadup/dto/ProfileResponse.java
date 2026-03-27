package com.squadup.dto;

import lombok.Builder;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String username;
    private String fullName;
    private String avatarUrl;
    private OffsetDateTime joinedAt;
    private List<UserGameDTO> games;
}
