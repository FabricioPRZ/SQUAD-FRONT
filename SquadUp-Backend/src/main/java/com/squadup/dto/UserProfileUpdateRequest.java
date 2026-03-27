package com.squadup.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    @Size(max = 120, message = "El nombre es muy largo")
    private String fullName;

    @Size(max = 255)
    private String avatarUrl;
}
