package com.squadup.controller;

import com.squadup.dto.PostResponse;
import com.squadup.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador de Posts / Publicaciones.
 * Vistas: "Mis Guardados" (GET saved, GET own), toggle guardar, eliminar.
 *
 * GET  /api/posts/saved          → Publicaciones guardadas por el usuario
 * GET  /api/posts/mine           → Publicaciones propias del usuario
 * POST /api/posts/{id}/save      → Guardar / quitar de guardados (toggle)
 * DELETE /api/posts/{id}         → Eliminar publicación propia (soft-delete)
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final com.squadup.repository.UserRepository userRepo;

    /** GET /api/posts/saved → Vista "Guardados" — Tab "Publicaciones guardadas" */
    @GetMapping("/saved")
    public ResponseEntity<List<PostResponse>> getSaved(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(postService.getSavedPosts(resolveUserId(principal)));
    }

    /** GET /api/posts/mine → Vista "Guardados" — Tab "Mis publicaciones" */
    @GetMapping("/mine")
    public ResponseEntity<List<PostResponse>> getMine(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(postService.getMyPosts(resolveUserId(principal)));
    }

    /**
     * POST /api/posts/{id}/save → Toggle guardar/quitar.
     * Devuelve { "saved": true/false } indicando el nuevo estado.
     */
    @PostMapping("/{id}/save")
    public ResponseEntity<Map<String, Boolean>> toggleSave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        boolean saved = postService.toggleSave(id, resolveUserId(principal));
        return ResponseEntity.ok(Map.of("saved", saved));
    }

    /** DELETE /api/posts/{id} → Eliminar publicación propia */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        postService.deletePost(id, resolveUserId(principal));
        return ResponseEntity.noContent().build();
    }

    private Long resolveUserId(UserDetails principal) {
        return userRepo.findByEmail(principal.getUsername()).orElseThrow().getId();
    }
}
