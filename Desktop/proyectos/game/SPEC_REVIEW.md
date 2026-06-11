# FermuGame - Requisitos Clarificados (Spec Review)

## Decisiones de Completado de Minijuegos

### 🎮 Portal 1: Tetris

- **Condición de Victoria**: Alcanzar **5000 puntos**
- **Mecánica**: Juego infinito hasta alcanzar el objetivo
- **Puntuación**:
  - Línea simple: 100 puntos
  - Línea doble: 300 puntos
  - Línea triple: 500 puntos
  - Tetris (4 líneas): 400 puntos
- **Replay**: Infinito sin límite

### 🐍 Portal 2: Snake

- **Condición de Victoria**: Alcanzar **200 puntos**
- **Mecánica**: Comiendo 20 comidas (10 puntos × 20)
- **Puntuación**: 10 puntos por comida
- **Replay**: Infinito sin límite

### 👾 Portal 3: Pac-Man

- **Condición de Victoria**: Comerse **todos los pellets (240)**
- **Mecánica**: Nivel finito, debe comer el 100% de los pellets
- **Puntuación**:
  - Pellet regular: 10 puntos
  - Power-pellet: 50 puntos
  - Fantasma comido en power mode: 200-400 puntos
- **Replay**: Infinito sin límite

### 👽 Portal 4: Space Invaders

- **Condición de Victoria**: Destruir **todos los 24 enemigos del Nivel 1**
- **Mecánica**: Un nivel con 24 enemigos (3 filas × 8 columnas)
- **Puntuación**:
  - Enemigo destruido: 10 puntos
  - Último enemigo: +50 puntos bonus
- **Vidas**: 3 vidas
- **Replay**: Infinito sin límite

### 🧩 Portal 5: Image Puzzle

- **Condición de Victoria**: Resolver el puzzle (16 piezas 4×4 en posición correcta)
- **Secuencia Final**:
  1. Mostrar imagen reconstruida (celebración visual)
  2. Transición con fade
  3. Generar y mostrar QR code scaneable
  4. Opción para compartir/descargar QR
- **Replay**: Infinito sin límite

## Sistema de Desbloqueo de Portales

| Portal             | Estado Inicial  | Se Desbloquea Si    | Requisito                                |
| ------------------ | --------------- | ------------------- | ---------------------------------------- |
| 1 (Tetris)         | 🔓 Desbloqueado | N/A                 | Inicio del juego                         |
| 2 (Snake)          | 🔒 Bloqueado    | Portal 1 completado | 5000 puntos en Tetris                    |
| 3 (Pac-Man)        | 🔒 Bloqueado    | Portal 2 completado | 200 puntos en Snake                      |
| 4 (Space Invaders) | 🔒 Bloqueado    | Portal 3 completado | Todos los pellets en Pac-Man             |
| 5 (Puzzle)         | 🔒 Bloqueado    | Portal 4 completado | 24 enemigos destruidos en Space Invaders |

## QR Code Final

### Generación

- **Localización**: Portal 5, al completar el puzzle
- **Datos Codificados**:
  ```
  {
    "gameId": "fermugame",
    "timestamp": "2026-06-11T20:15:00Z",
    "sessionId": "<generated-uuid>"
  }
  ```
- **Formato**: QR-Code v10 (200-400px)
- **Colores**: Blanco (fondo) / Negro (foreground)
- **Marco**: Borde rojo neón (#ff006e) de 20px

### Interfaz

- Mostrar QR en pantalla de completado
- Opción: Screenshot del QR
- Opción: Compartir en redes (si disponible)
- El QR es escaneable directamente desde dispositivo

## Requisitos de Completado

**Para desbloquear el siguiente portal:**

- ✅ Alcanzar la puntuación/objetivo mínimo requerido
- ❌ Solo terminar/game over NO es suficiente
- ❌ No hay modo "fácil vs difícil"

**Ejemplo**: Snake requiere 200 puntos, no simplemente "jugar" - debe alcanzar exactamente 200 o más.

## Persistencia del Juego

### Guardado Automático

```javascript
{
  "session_id": "uuid",
  "portals": {
    "1": { "completed": true, "score": 5200, "timestamp": "..." },
    "2": { "completed": true, "score": 210, "timestamp": "..." },
    "3": { "completed": false, "score": 1850, "timestamp": "..." },
    "4": { "completed": false, "score": 0, "timestamp": null },
    "5": { "completed": false, "score": 0, "timestamp": null }
  },
  "stats": {
    "total_score": 11260,
    "completion_percentage": 40,
    "last_portal_visited": 3
  }
}
```

### Ubicación

- **Navegadores**: localStorage (`fermugame-save`)
- **Estrategia**: Auto-save cada 5 segundos durante gameplay
- **Recuperación**: Al recargar, restaura último estado conocido

## Ambigüedades Resueltas

| Aspecto                      | Resolución                      |
| ---------------------------- | ------------------------------- |
| Tetris - ¿Sin final?         | ✅ Objetivo de 5000 puntos      |
| Snake - ¿200 o 500?          | ✅ 200 puntos (20 comidas)      |
| Pac-Man - ¿Pellets o puntos? | ✅ Todos los pellets (100%)     |
| Space Invaders - ¿Waves?     | ✅ Nivel 1 finito (24 enemigos) |
| Puzzle - ¿Imagen o QR?       | ✅ Imagen → QR (secuencia)      |
| Completado - ¿Solo terminar? | ✅ Requiere target score        |
| Replay - ¿Limitado?          | ✅ Infinito                     |
| QR - ¿Datos?                 | ✅ gameId + timestamp mínimos   |

## Próximos Pasos

1. ✅ Actualizar specs con estas decisiones
2. ⏳ Ejecutar tests para validar coherencia
3. ⏳ Implementar lógica de completado
4. ⏳ Crear GameState manager (persistencia)
5. ⏳ Crear QR generator utility

---

**Fecha de Revisión**: 11 de junio de 2026
**Status**: Requisitos Clarificados ✅
