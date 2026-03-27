package com.squadup.controller;

import com.squadup.dto.ProfileResponse;
import com.squadup.dto.UserGameDTO;
import com.squadup.dto.UserGameRequest;
import com.squadup.dto.UserProfileUpdateRequest;
import com.squadup.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final com.squadup.repository.UserRepository userRepo;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userService.getMyProfile(resolveUserId(principal)));
    }

    @GetMapping("/{username}")
    public ResponseEntity<ProfileResponse> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getProfile(username));
    }

    @PatchMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            @Valid @RequestBody UserProfileUpdateRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userService.updateProfile(resolveUserId(principal), req));
    }

    @PostMapping("/me/games")
    public ResponseEntity<UserGameDTO> addGameToMyProfile(
            @Valid @RequestBody UserGameRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.addGameToProfile(resolveUserId(principal), req));
    }

    @DeleteMapping("/me/games/{userGameId}")
    public ResponseEntity<Void> removeGameFromMyProfile(
            @PathVariable Long userGameId,
            @AuthenticationPrincipal UserDetails principal) {
        userService.removeGameFromProfile(resolveUserId(principal), userGameId);
        return ResponseEntity.noContent().build();
    }

    private Long resolveUserId(UserDetails principal) {
        return userRepo.findByEmail(principal.getUsername()).orElseThrow().getId();
    }
}
