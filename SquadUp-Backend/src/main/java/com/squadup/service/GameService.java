package com.squadup.service;

import com.squadup.dto.GameRequest;
import com.squadup.dto.GameResponse;
import com.squadup.entity.Game;
import com.squadup.exception.BadRequestException;
import com.squadup.exception.ResourceNotFoundException;
import com.squadup.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepo;

    public List<GameResponse> getAll() {
        return gameRepo.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public GameResponse getById(Long id) {
        Game game = gameRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Juego no encontrado"));
        return mapToResponse(game);
    }

    public GameResponse create(GameRequest req) {
        if (gameRepo.findByNameIgnoreCase(req.getName()).isPresent()) {
            throw new BadRequestException("El juego ya existe");
        }

        Game game = Game.builder()
                .name(req.getName())
                .genre(req.getGenre())
                .coverUrl(req.getCoverUrl())
                .description(req.getDescription())
                .build();

        return mapToResponse(gameRepo.save(game));
    }

    public GameResponse update(Long id, GameRequest req) {
        Game game = gameRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Juego no encontrado"));

        game.setName(req.getName());
        game.setGenre(req.getGenre());
        game.setCoverUrl(req.getCoverUrl());
        game.setDescription(req.getDescription());

        return mapToResponse(gameRepo.save(game));
    }

    public void delete(Long id) {
        Game game = gameRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Juego no encontrado"));
        gameRepo.delete(game);
    }

    private GameResponse mapToResponse(Game game) {
        return GameResponse.builder()
                .id(game.getId())
                .name(game.getName())
                .genre(game.getGenre())
                .coverUrl(game.getCoverUrl())
                .description(game.getDescription())
                .build();
    }
}
