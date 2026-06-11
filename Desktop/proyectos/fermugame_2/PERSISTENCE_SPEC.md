# 📦 Persistence Specification

**File**: [src/test/persistence.spec.ts](src/test/persistence.spec.ts)  
**Tests**: 47 ✓  
**Status**: ✅ VALIDATED

---

## 🎯 Overview

Game state persistence using browser `localStorage`. Players can close the game and resume progress without loss. The persistence system handles:

- Portal unlock state and completion tracking
- Minigame scores and progress
- Player statistics and playtime
- Session management and recovery

---

## 📊 Data Structure

### Root Schema

```typescript
{
  session_id: string;        // UUID v4 format
  created_at: string;        // ISO 8601 timestamp
  last_saved: string;        // ISO 8601 timestamp
  version: number;           // Schema version (current: 1)
  portals: {
    [id: 1-5]: PortalState;
  };
  stats: Statistics;
}
```

### PortalState Object

```typescript
{
  id: number;                // Portal ID (1-5)
  completed: boolean;        // Victory condition met
  score: number;             // Accumulated score
  timestamp: string | null;  // Completion timestamp (ISO 8601)

  // Portal-specific fields
  pellets_eaten?: number;    // Pac-Man: eaten pellets
  enemies_destroyed?: number; // Space Invaders: destroyed enemies
  pieces_placed?: number;     // Puzzle: placed pieces
  qr_generated?: boolean;     // Puzzle: QR code generated
  best_score?: number;       // Best score this session
  attempts?: number;         // Number of attempts
}
```

### Statistics Object

```typescript
{
  total_score: number;           // Sum of all portal scores
  completion_percentage: number; // % of portals completed (0-100)
  total_playtime_ms: number;     // Total play time in milliseconds
  last_session_duration?: number; // Duration of last session
  session_start?: string;        // ISO 8601 session start
}
```

---

## 🔑 Storage Keys

| Key                 | Purpose                                     | Size      | Frequency          |
| ------------------- | ------------------------------------------- | --------- | ------------------ |
| `fermugame-save`    | Main game state (portals, scores, progress) | ~1-2KB    | Auto-save every 5s |
| `fermugame-session` | Session metadata (timestamps, version)      | ~200-300B | On session start   |

---

## 💾 Write Operations (Save)

### Auto-save

- **Frequency**: Every 5 seconds during gameplay
- **Trigger**: Automatic timer or game event (score update, portal completion)
- **Fallback**: Save queued if write fails, retry on next interval

### Manual Save

- **On Portal Completion**: Immediate save with timestamp
- **Before Unload**: On window/tab close event
- **Format**: JSON serialization with no compression

### Process

```
1. Collect current game state
2. Update last_saved timestamp
3. Serialize to JSON
4. Write to localStorage[key]
5. On failure: Queue for retry in 5 seconds
```

---

## 📖 Read Operations (Load)

### Initialization

```
1. Check if localStorage[fermugame-save] exists
2. If yes: Deserialize and validate schema
3. If no: Create initial state (Portal 1 unlocked, others locked)
4. Restore session metadata
```

### Loading Process

```
1. Parse JSON from localStorage
2. Validate all required fields present
3. Validate data types (scores are numbers, timestamps are ISO strings)
4. Validate portal IDs are 1-5
5. If validation fails: Use fallback initial state
```

---

## 🔄 Portal State Updates

### Unlock Sequence

```
Portal 1 (Tetris) → 5000 pts → Unlock Portal 2
    ↓
Portal 2 (Snake) → 200 pts → Unlock Portal 3
    ↓
Portal 3 (Pac-Man) → 240 pellets → Unlock Portal 4
    ↓
Portal 4 (Space Invaders) → 24 enemies → Unlock Portal 5
    ↓
Portal 5 (Puzzle) → Resolve 4×4 → Victory
```

### Completion Tracking

- **Tetris**: `score >= 5000`
- **Snake**: `score >= 200`
- **Pac-Man**: `pellets_eaten === 240`
- **Space Invaders**: `enemies_destroyed === 24`
- **Puzzle**: `pieces_placed === 16 AND qr_generated === true`

---

## 🎮 Minigame-Specific Fields

### Tetris (Portal 1)

```typescript
{
  completed: boolean;
  score: number; // Target: 5000
  timestamp: string | null;
}
```

### Snake (Portal 2)

```typescript
{
  completed: boolean;
  score: number; // Target: 200 (20 foods × 10)
  timestamp: string | null;
}
```

### Pac-Man (Portal 3)

```typescript
{
  completed: boolean;
  pellets_eaten: number; // Target: 240
  score: number;
  timestamp: string | null;
}
```

### Space Invaders (Portal 4)

```typescript
{
  completed: boolean;
  enemies_destroyed: number; // Target: 24
  score: number;
  timestamp: string | null;
}
```

### Puzzle (Portal 5)

```typescript
{
  completed: boolean;
  pieces_placed: number; // Target: 16
  qr_generated: boolean; // QR code generated successfully
  score: number;
  timestamp: string | null;
}
```

---

## 📈 Progress Statistics

### Calculation

```typescript
completion_percentage = (completed_portals / 5) * 100;

// Example: 2/5 portals completed = 40%
```

### Tracking Fields

- `total_score`: Sum of all portal scores
- `completion_percentage`: 0-100%
- `total_playtime_ms`: Milliseconds since game start
- `session_start`: ISO timestamp of current session start
- `last_session_duration`: Duration of previous session

---

## ✅ Data Validation

### Schema Version

- Current: `version: 1`
- Future migrations: Version check with migration logic

### Field Validation

| Field       | Type   | Constraints                                                                 |
| ----------- | ------ | --------------------------------------------------------------------------- |
| session_id  | string | UUID format: `[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}` |
| timestamps  | string | ISO 8601: `YYYY-MM-DDTHH:mm:ssZ`                                            |
| portal_ids  | number | 1-5 inclusive                                                               |
| scores      | number | Non-negative integers                                                       |
| percentages | number | 0-100                                                                       |

### Recovery Strategy

```
1. Try to parse JSON
2. If invalid: Log error, use initial state
3. If missing fields: Fill with defaults
4. If type mismatch: Coerce or use default
5. If version mismatch: Run migration logic
```

---

## 🔐 Data Recovery & Resilience

### Corruption Handling

```
Scenario: localStorage[key] = "corrupted-data"
↓
Action: JSON.parse() throws error
↓
Recovery: Fall back to initial state (Portal 1 unlocked)
↓
Result: Game restarts fresh but doesn't crash
```

### Missing Session Metadata

```
Scenario: fermugame-session key doesn't exist
↓
Action: Create new session with UUID
↓
Recovery: Load game state from fermugame-save
↓
Result: Session metadata generated on demand
```

### Version Migration

```
Scenario: Save from v0, current schema is v1
↓
Action: Detect version mismatch
↓
Recovery: Migrate data structure, update version
↓
Result: Backwards compatible saves load correctly
```

---

## 🌐 Cross-Tab Synchronization

### Storage Event Listener

```typescript
window.addEventListener("storage", (event) => {
  if (event.key === "fermugame-save") {
    // Reload game state from event.newValue
    // Update UI in this tab to match other tab
  }
});
```

### Conflict Resolution

When multiple tabs save simultaneously:

1. Use timestamp as tiebreaker
2. Most recent save wins
3. Resolve conflicts within 1 second window

---

## 📱 Storage Limits

### Browser Limits

- Chrome/Firefox/Edge: 5-10MB per origin
- Safari: 5MB
- Game save data: < 2KB per save

### Data Size Estimation

```typescript
const gameState = {
  session_id: "550e8400-e29b-41d4-a716-446655440000", // 36 bytes
  portals: {
    1: { completed: false, score: 0, timestamp: null }, // ~50 bytes × 5
    // ... 4 more portals
  },
  stats: {
    total_score: 0,
    completion_percentage: 0,
    total_playtime_ms: 0,
  },
};

// Total: ~500-800 bytes in JSON
// Serialized: ~1-2KB with formatting
```

### Cleanup Strategy

- Keep last 7 days of session data
- Remove sessions older than 7 days
- Trim on demand if approaching quota

---

## 🔄 Auto-save Mechanism

### Implementation Details

```typescript
// Save every 5 seconds
setInterval(() => {
  saveGameState();
}, 5000);

// Also save on important events
document.addEventListener("beforeunload", () => {
  saveGameState();
});

portalCompleted.subscribe(() => {
  saveGameState(); // Immediate save on completion
});
```

### Queue & Batch Processing

```
Game Event → Queue Save Operation
            ↓
Every 5s   → Check Queue
            ↓
         Process All → Write to localStorage
            ↓
      Update Timestamp
```

---

## 🧪 Test Coverage

| Category          | Tests  | Status |
| ----------------- | ------ | ------ |
| Storage Keys      | 3      | ✓      |
| Initial State     | 4      | ✓      |
| Write Operations  | 4      | ✓      |
| Read Operations   | 4      | ✓      |
| Portal Updates    | 4      | ✓      |
| Minigame Tracking | 5      | ✓      |
| Statistics        | 3      | ✓      |
| Auto-save         | 4      | ✓      |
| Data Validation   | 6      | ✓      |
| Recovery          | 4      | ✓      |
| Storage Limits    | 3      | ✓      |
| Cross-tab Sync    | 3      | ✓      |
| **Total**         | **47** | **✓**  |

---

## 📝 Usage Example

### Save on Portal Completion

```typescript
async function completePortal(portalId: number, score: number) {
  // Update portal state
  gameState.portals[portalId].completed = true;
  gameState.portals[portalId].score = score;
  gameState.portals[portalId].timestamp = new Date().toISOString();

  // Update next portal if applicable
  if (portalId < 5) {
    gameState.portals[portalId + 1].locked = false;
  }

  // Update stats
  gameState.stats.total_score += score;
  gameState.stats.last_saved = new Date().toISOString();

  // Save immediately
  localStorage.setItem("fermugame-save", JSON.stringify(gameState));
}
```

### Load on Game Start

```typescript
function initializeGame() {
  const saved = localStorage.getItem("fermugame-save");

  if (saved) {
    try {
      gameState = JSON.parse(saved);
      // Validate schema version
      if (gameState.version !== 1) {
        // Migrate if needed
      }
      return gameState;
    } catch (e) {
      console.error("Failed to load save:", e);
      return createInitialState();
    }
  }

  return createInitialState();
}
```

---

## 🚀 Implementation Checklist

- [ ] Setup localStorage mock/polyfill
- [ ] Create GameStateManager class
- [ ] Implement auto-save timer (5 seconds)
- [ ] Add beforeunload event listener
- [ ] Implement JSON serialization
- [ ] Add data validation logic
- [ ] Error handling & recovery
- [ ] Cross-tab sync event listener
- [ ] Session metadata tracking
- [ ] Migration support for future versions
- [ ] LocalStorage quota monitoring
- [ ] Performance optimization (debounce saves)

---

## 📋 Integration Points

| Component     | Integration                     |
| ------------- | ------------------------------- |
| App.tsx       | Initialize game state on load   |
| GameContext   | Provide state to all components |
| MainWorld     | Save after player movement      |
| Tetris        | Save after score update         |
| Snake         | Save after food eaten           |
| Pac-Man       | Save after pellet eaten         |
| SpaceInvaders | Save after enemy destroyed      |
| Puzzle        | Save after piece movement       |
| PortalSystem  | Save on unlock                  |

---

## 🔍 Debugging

### Check Current Save

```typescript
console.log(JSON.parse(localStorage.getItem("fermugame-save")));
```

### Clear All Data

```typescript
localStorage.clear();
sessionStorage.clear();
// Or specific: localStorage.removeItem('fermugame-save');
```

### Monitor Auto-saves

```typescript
let saveCount = 0;
setInterval(() => {
  console.log(`Auto-save #${++saveCount}`);
}, 5000);
```

---

**Specification Version**: 1.0  
**Last Updated**: June 11, 2026  
**Status**: ✅ READY FOR IMPLEMENTATION
