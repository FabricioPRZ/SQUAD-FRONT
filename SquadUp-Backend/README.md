# SquadUp Backend — Java Spring Boot + PostgreSQL

## Stack Tecnológico
- **Java 21** + **Spring Boot 3.2**
- **PostgreSQL** con tipos nativos: `TEXT[]`, `JSONB`, índices `GIN`
- **JWT** (jjwt 0.12) + **OAuth2** (Google & Discord)
- **WebSocket STOMP** para chat en tiempo real y notificaciones push

---

## Arquitectura de Carpetas

```
BackendWeb/
├── pom.xml                              # Dependencias Maven
├── squadup.sql                          # Script SQL completo PostgreSQL
├── .env.example                         # Variables de entorno de referencia
└── src/main/
    ├── resources/
    │   └── application.properties       # Configuración BD, JWT, OAuth2, WS
    └── java/com/squadup/
        ├── SquadUpApplication.java      # Clase principal @SpringBootApplication
        │
        ├── config/
        │   ├── SecurityConfig.java      # Spring Security + BCrypt + OAuth2
        │   └── WebSocketConfig.java     # STOMP broker /topic + /user
        │
        ├── security/
        │   ├── JwtUtil.java             # Generar / validar tokens JWT
        │   ├── JwtAuthFilter.java       # Filtro por request — extrae Bearer token
        │   └── UserDetailsServiceImpl.java  # Carga usuario por email
        │
        ├── entity/                      # Entidades JPA → tablas PostgreSQL
        │   ├── User.java                → users
        │   ├── OAuthAccount.java        → oauth_accounts
        │   ├── Game.java                → games
        │   ├── UserGame.java            → user_games
        │   ├── Lobby.java               → lobbies  (ARRAY + JSONB)
        │   ├── LobbyMember.java         → lobby_members
        │   ├── LobbyJoinRequest.java    → lobby_join_requests
        │   ├── Post.java                → posts  (soft-delete)
        │   ├── PostMedia.java           → post_media
        │   ├── SavedPost.java           → saved_posts
        │   ├── Message.java             → messages  (lobby + DM)
        │   ├── Notification.java        → notifications (JSONB payload)
        │   └── enums/
        │       ├── UserStatus.java
        │       ├── OAuthProvider.java
        │       ├── LobbyType.java
        │       ├── LobbyPrivacy.java
        │       ├── MemberRole.java
        │       ├── JoinRequestStatus.java
        │       ├── MessageType.java
        │       ├── MessageStatus.java
        │       └── NotificationType.java
        │
        ├── repository/                  # Interfaces JPA (Spring Data)
        │   ├── UserRepository.java
        │   ├── OAuthAccountRepository.java
        │   ├── GameRepository.java
        │   ├── LobbyRepository.java
        │   ├── LobbyMemberRepository.java
        │   ├── LobbyJoinRequestRepository.java
        │   ├── PostRepository.java
        │   ├── SavedPostRepository.java
        │   ├── MessageRepository.java
        │   └── NotificationRepository.java
        │
        ├── dto/                         # Transferencia de datos (request/response)
        │   ├── RegisterRequest.java     # Vista "Crear Cuenta"
        │   ├── LoginRequest.java        # Vista "Iniciar Sesión"
        │   ├── AuthResponse.java        # Token JWT + datos usuario
        │   ├── LobbyRequest.java        # Vista "Crear / Editar Lobby"
        │   ├── LobbyResponse.java       # Vista "Mis Lobbys"
        │   ├── PostResponse.java        # Chat del lobby + Mis Guardados
        │   └── NotificationResponse.java # Panel campana 🔔 + WS push
        │
        ├── service/
        │   ├── AuthService.java         # Registro, login, JWT
        │   ├── LobbyService.java        # CRUD lobbies + join/leave/review
        │   └── NotificationService.java # Persistir + push WS en tiempo real
        │
        ├── controller/
        │   ├── AuthController.java      # POST /api/auth/register|login
        │   ├── LobbyController.java     # REST CRUD lobbies + join/leave
        │   ├── NotificationController.java # GET notificaciones + badge
        │   └── ChatWebSocketController.java # WS /app/lobby/{id}/send + DM
        │
        └── exception/
            ├── GlobalExceptionHandler.java  # @RestControllerAdvice → JSON errors
            ├── ResourceNotFoundException.java  # 404
            ├── BadRequestException.java        # 400
            └── ForbiddenException.java         # 403
```

---

## Endpoints REST

| Método | Ruta | Vista |
|--------|------|-------|
| POST | `/api/auth/register` | Crear Cuenta |
| POST | `/api/auth/login` | Iniciar Sesión |
| GET | `/api/lobbies/my` | Mis Lobbys — Tab "Mis Lobbys" |
| GET | `/api/lobbies/joined` | Mis Lobbys — Tab "Unido" |
| POST | `/api/lobbies` | Crear Lobby |
| PUT | `/api/lobbies/{id}` | Editar Lobby |
| DELETE | `/api/lobbies/{id}` | Eliminar Lobby |
| POST | `/api/lobbies/{id}/join` | Solicitar unirse |
| POST | `/api/lobbies/{id}/leave` | Abandonar Lobby |
| PATCH | `/api/lobbies/requests/{id}?accept=true` | Revisar solicitud ✔ ✘ |
| GET | `/api/notifications` | Panel de notificaciones |
| GET | `/api/notifications/unread-count` | Badge campana 🔔 |
| PATCH | `/api/notifications/read-all` | Marcar todas leídas |

## Canales WebSocket (STOMP)

| Destino | Descripción |
|---------|-------------|
| `/app/lobby/{id}/send` | Enviar mensaje al chat del lobby |
| `/topic/lobby/{id}` | Recibir mensajes del lobby |
| `/app/dm/{userId}/send` | Enviar DM privado |
| `/user/{id}/queue/dm` | Recibir DM privado |
| `/user/{id}/queue/notify` | Recibir notificación push |

---

## Cómo ejecutar

```bash
# 1. Crear la base de datos PostgreSQL
psql -U postgres -f squadup.sql

# 2. Copiar variables de entorno
copy .env.example .env
# Editar .env con tus credenciales

# 3. Ejecutar Spring Boot
mvn spring-boot:run
```

El servidor arranca en `http://localhost:8080`
