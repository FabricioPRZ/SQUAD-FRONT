package com.squadup.service;

import com.squadup.dto.PostResponse;
import com.squadup.entity.Post;
import com.squadup.entity.SavedPost;
import com.squadup.exception.ForbiddenException;
import com.squadup.exception.ResourceNotFoundException;
import com.squadup.repository.PostRepository;
import com.squadup.repository.SavedPostRepository;
import com.squadup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Lógica de negocio de Posts:
 * - Vista "Mis Guardados" → guardados propios y publicaciones hechas por el usuario
 * - Guardar / quitar publicación
 * - Eliminar publicación (solo el autor)
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepo;
    private final SavedPostRepository savedPostRepo;
    private final UserRepository userRepo;

    // ────────────────────────── Queries ──────────────────────────

    /** Posts guardados por el usuario (guardados de otros y propios guardados) */
    @Transactional(readOnly = true)
    public List<PostResponse> getSavedPosts(Long userId) {
        return postRepo.findSavedByUserId(userId).stream()
                .map(p -> toResponse(p, userId))
                .toList();
    }

    /** Posts propios del usuario */
    @Transactional(readOnly = true)
    public List<PostResponse> getMyPosts(Long userId) {
        return postRepo.findActiveByAuthorId(userId).stream()
                .map(p -> toResponse(p, userId))
                .toList();
    }

    // ────────────────────────── Commands ──────────────────────────

    /**
     * Guardar o quitar de guardados (toggle).
     * Si ya está guardado lo quita; si no, lo guarda.
     */
    @Transactional
    public boolean toggleSave(Long postId, Long userId) {
        if (savedPostRepo.existsByUserIdAndPostId(userId, postId)) {
            savedPostRepo.deleteByUserIdAndPostId(userId, postId);
            return false; // quitado
        } else {
            Post post = postRepo.findById(postId)
                    .orElseThrow(() -> new ResourceNotFoundException("Publicación no encontrada"));
            com.squadup.entity.User user = userRepo.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            savedPostRepo.save(SavedPost.builder().post(post).user(user).build());
            return true; // guardado
        }
    }

    /**
     * Eliminar publicación (soft-delete).
     * Solo el autor puede eliminar su propio post.
     */
    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Publicación no encontrada"));
        if (!post.getAuthor().getId().equals(userId)) {
            throw new ForbiddenException("Solo el autor puede eliminar esta publicación");
        }
        post.setDeletedAt(java.time.OffsetDateTime.now());
        postRepo.save(post);
    }

    // ────────────────────────── Mapper ──────────────────────────

    private PostResponse toResponse(Post p, Long currentUserId) {
        boolean saved = savedPostRepo.existsByUserIdAndPostId(currentUserId, p.getId());

        List<PostResponse.MediaItem> media = p.getMedia().stream()
                .map(m -> PostResponse.MediaItem.builder()
                        .url(m.getUrl())
                        .mediaType(m.getMediaType())
                        .filename(m.getFilename())
                        .build())
                .toList();

        return PostResponse.builder()
                .id(p.getId())
                .content(p.getContent())
                .pinned(Boolean.TRUE.equals(p.getIsPinned()))
                .requiresApproval(Boolean.TRUE.equals(p.getRequiresApproval()))
                .savedByCurrentUser(saved)
                .authorUsername(p.getAuthor().getUsername())
                .authorAvatarUrl(p.getAuthor().getAvatarUrl())
                .media(media)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
