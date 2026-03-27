package com.squadup.service;

import com.squadup.dto.*;
import com.squadup.entity.Game;
import com.squadup.entity.User;
import com.squadup.entity.UserGame;
import com.squadup.exception.BadRequestException;
import com.squadup.exception.ResourceNotFoundException;
import com.squadup.repository.GameRepository;
import com.squadup.repository.UserGameRepository;
import com.squadup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final GameRepository gameRepo;
    private final UserGameRepository userGameRepo;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return mapToProfileResponse(user);
    }
    
    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return mapToProfileResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, UserProfileUpdateRequest req) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getAvatarUrl() != null) user.setAvatarUrl(req.getAvatarUrl());

        return mapToProfileResponse(userRepo.save(user));
    }

    @Transactional
    public UserGameDTO addGameToProfile(Long userId, UserGameRequest req) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Game game = gameRepo.findById(req.getGameId())
                .orElseThrow(() -> new ResourceNotFoundException("Juego no encontrado"));

        if (userGameRepo.findByUserIdAndGameId(userId, game.getId()).isPresent()) {
            throw new BadRequestException("El juego ya está en tu biblioteca");
        }

        UserGame ug = UserGame.builder()
                .user(user)
                .game(game)
                .rank(req.getRank())
                .rankLabel(req.getRankLabel())
                .hoursPlayed(req.getHoursPlayed())
                .isMain(req.getIsMain() != null ? req.getIsMain() : false)
                .build();

        return mapToUserGameDTO(userGameRepo.save(ug));
    }

    @Transactional
    public void removeGameFromProfile(Long userId, Long userGameId) {
        UserGame ug = userGameRepo.findById(userGameId)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de juego no encontrado"));
        
        if (!ug.getUser().getId().equals(userId)) {
            throw new BadRequestException("No puedes eliminar un juego que no es tuyo");
        }

        userGameRepo.delete(ug);
    }

    private ProfileResponse mapToProfileResponse(User user) {
        List<UserGameDTO> games = user.getUserGames().stream()
                .map(this::mapToUserGameDTO)
                .collect(Collectors.toList());

        return ProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .joinedAt(user.getCreatedAt())
                .games(games)
                .build();
    }

    private UserGameDTO mapToUserGameDTO(UserGame ug) {
        return UserGameDTO.builder()
                .id(ug.getId())
                .gameId(ug.getGame().getId())
                .gameName(ug.getGame().getName())
                .gameCoverUrl(ug.getGame().getCoverUrl())
                .rank(ug.getRank())
                .rankLabel(ug.getRankLabel())
                .hoursPlayed(ug.getHoursPlayed())
                .isMain(ug.getIsMain())
                .build();
    }
}
