package com.squadup.repository;

import com.squadup.entity.UserGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserGameRepository extends JpaRepository<UserGame, Long> {
    Optional<UserGame> findByUserIdAndGameId(Long userId, Long gameId);
}
