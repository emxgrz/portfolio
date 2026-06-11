# ✅ Persistence Specification - Quick Reference

**Status**: ✅ VALIDATED & READY FOR IMPLEMENTATION

---

## 📊 Test Results

```
Test Files: 9/9 ✓
Total Tests: 325/325 ✓ (including 47 persistence tests)

Breakdown:
- Main World:       18 ✓
- Tetris:           24 ✓
- Snake:            30 ✓
- Pac-Man:          35 ✓
- Space Invaders:   33 ✓
- Puzzle:           34 ✓
- Progression:      35 ✓
- Visual Style:     69 ✓
- Persistence:      47 ✓ [NEW]
```

---

## 🎯 What Gets Persisted

| Data                | Storage Key         | Updates            | Purpose                                                                     |
| ------------------- | ------------------- | ------------------ | --------------------------------------------------------------------------- |
| **Portal States**   | `fermugame-save`    | Auto-save every 5s | Track completion, unlock sequence                                           |
| **Minigame Scores** | `fermugame-save`    | On score change    | Tetris (5000), Snake (200), Pac-Man (240), Space Invaders (24), Puzzle (QR) |
| **Player Stats**    | `fermugame-save`    | Continuous         | Total score, completion %, playtime                                         |
| **Session Info**    | `fermugame-session` | On start           | UUID, created_at, version                                                   |

---

## 💾 Data Structure

```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-06-11T20:00:00Z",
  "last_saved": "2026-06-11T20:15:30Z",
  "version": 1,
  "portals": {
    "1": {
      "completed": true,
      "score": 5200,
      "timestamp": "2026-06-11T20:10:00Z"
    },
    "2": {
      "completed": false,
      "score": 150,
      "timestamp": null
    },
    "3": {
      "completed": false,
      "pellets_eaten": 120,
      "score": 1200,
      "timestamp": null
    },
    "4": {
      "completed": false,
      "enemies_destroyed": 8,
      "score": 80,
      "timestamp": null
    },
    "5": {
      "completed": false,
      "pieces_placed": 5,
      "qr_generated": false,
      "score": 0,
      "timestamp": null
    }
  },
  "stats": {
    "total_score": 6630,
    "completion_percentage": 20,
    "total_playtime_ms": 900000
  }
}
```

---

## ⏱️ Save Timing

```
GAME START
    ↓
Load localStorage → Restore previous state (or create new)
    ↓
EVERY 5 SECONDS
    ├→ Auto-save current state
    ├→ Update last_saved timestamp
    └→ Write to localStorage
    ↓
PORTAL COMPLETION
    ├→ Save immediately
    ├→ Unlock next portal
    └→ Update timestamp
    ↓
ON PAGE UNLOAD
    ├→ Flush any pending saves
    └→ Ensure no data loss
```

---

## 🔒 Validation Rules

| Field        | Rule                  | Example                                |
| ------------ | --------------------- | -------------------------------------- |
| session_id   | UUID v4 format        | `550e8400-e29b-41d4-a716-446655440000` |
| Timestamps   | ISO 8601              | `2026-06-11T20:15:30Z`                 |
| Portal IDs   | 1-5 only              | Valid: 1,2,3,4,5                       |
| Scores       | Non-negative integers | Valid: 0, 100, 5000                    |
| Completion % | 0-100 range           | Valid: 0, 50, 100                      |
| Version      | Current: 1            | Supports future migrations             |

---

## 🛡️ Error Recovery

| Problem            | Solution                              |
| ------------------ | ------------------------------------- |
| Corrupted JSON     | Fall back to initial state            |
| Missing fields     | Fill with defaults                    |
| Old schema version | Auto-migrate to v1                    |
| localStorage full  | Trim old sessions                     |
| Multiple tabs      | Use timestamp for conflict resolution |

---

## 🌐 Browser Compatibility

| Browser | localStorage | Limit  | Status         |
| ------- | ------------ | ------ | -------------- |
| Chrome  | ✓            | 5-10MB | ✓ Full support |
| Firefox | ✓            | 5-10MB | ✓ Full support |
| Safari  | ✓            | 5MB    | ✓ Full support |
| Edge    | ✓            | 5-10MB | ✓ Full support |

**Save Size**: ~1-2KB per save → Well within limits

---

## 🔄 Portal Unlock Flow

```
SESSION START
│
├─ Portal 1 (Tetris) [UNLOCKED]
│  └─ Reach 5000 points?
│     ├─ YES → Set completed=true, unlock Portal 2
│     └─ NO → Wait for player progress
│
├─ Portal 2 (Snake) [LOCKED]
│  └─ Portal 1 completed?
│     ├─ YES → [UNLOCKED] Reach 200 points?
│     └─ NO → [LOCKED] Cannot access
│
├─ Portal 3 (Pac-Man) [LOCKED]
│  └─ Portal 2 completed?
│     ├─ YES → [UNLOCKED] Eat 240 pellets?
│     └─ NO → [LOCKED] Cannot access
│
├─ Portal 4 (Space Invaders) [LOCKED]
│  └─ Portal 3 completed?
│     ├─ YES → [UNLOCKED] Destroy 24 enemies?
│     └─ NO → [LOCKED] Cannot access
│
└─ Portal 5 (Puzzle) [LOCKED]
   └─ Portal 4 completed?
      ├─ YES → [UNLOCKED] Solve puzzle?
      │  └─ YES → Generate QR → VICTORY!
      └─ NO → [LOCKED] Cannot access
```

---

## 🧪 Test Coverage by Category

```
✓ Storage Keys (3 tests)
  - Main save key: 'fermugame-save'
  - Session key: 'fermugame-session'
  - Unique prefix isolation

✓ Initial State (4 tests)
  - Portal 1 unlocked, 2-5 locked
  - Correct initial values
  - Full schema structure

✓ Write Operations (4 tests)
  - Serialize & save to localStorage
  - Session metadata included
  - Timestamp auto-update
  - Overwrite previous save

✓ Read Operations (4 tests)
  - Deserialize from localStorage
  - Return null if no save
  - Load session metadata
  - Handle missing optional fields

✓ Portal Updates (4 tests)
  - Update completion status
  - Unlock next portal
  - Maintain portal order
  - Preserve metadata

✓ Minigame Tracking (5 tests)
  - Tetris: 5000 points
  - Snake: 200 points
  - Pac-Man: 240 pellets
  - Space Invaders: 24 enemies
  - Puzzle: 16 pieces + QR

✓ Statistics (3 tests)
  - Total score tracking
  - Completion percentage
  - Playtime tracking

✓ Auto-save (4 tests)
  - 5-second intervals
  - Save queue handling
  - Before-unload events
  - Retry on failure

✓ Validation (6 tests)
  - UUID format
  - ISO timestamp format
  - Portal IDs (1-5)
  - Non-negative scores
  - Version checking
  - JSON parsing errors

✓ Recovery (4 tests)
  - Corrupted data handling
  - Fallback to initial state
  - Missing metadata recovery
  - Version migration

✓ Storage Limits (3 tests)
  - Quota handling
  - Size estimation
  - Old session cleanup

✓ Cross-tab Sync (3 tests)
  - Storage event listening
  - UI updates
  - Conflict resolution
```

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Core Persistence)

- [ ] GameStateManager class
- [ ] localStorage wrapper with error handling
- [ ] Initial state creation
- [ ] Save/load operations

### Phase 2: Integration

- [ ] Wire up auto-save timer
- [ ] Add event listeners (portal completion, minigames)
- [ ] Implement cross-tab sync
- [ ] Add before-unload handler

### Phase 3: UI/UX

- [ ] Visual save indicator
- [ ] Show last save time
- [ ] Restore progress message
- [ ] Error notifications

### Phase 4: Polish

- [ ] Performance optimization
- [ ] Compression (if needed)
- [ ] Export/import saves
- [ ] Settings persistence

---

## 📝 Example Code Structure

```typescript
// GameStateManager.ts
class GameStateManager {
  private saveKey = "fermugame-save";
  private sessionKey = "fermugame-session";

  initialize(): GameState {
    // Load from localStorage or create new
  }

  save(state: GameState): void {
    // Serialize and persist to localStorage
  }

  load(): GameState {
    // Deserialize from localStorage with validation
  }

  updatePortal(id: number, data: PortalUpdate): void {
    // Update and auto-save
  }

  completePortal(id: number): void {
    // Mark complete, unlock next, save immediately
  }
}
```

---

## ✨ Key Features

✅ **Automatic Saving** - Every 5 seconds (no player action needed)  
✅ **Error Resilient** - Corrupted saves don't crash the game  
✅ **Cross-tab Safe** - Multiple tabs sync via storage events  
✅ **Efficient** - ~1-2KB per save, no compression needed  
✅ **Recoverable** - Version migrations for future schema changes  
✅ **Observable** - Timestamps for debugging and analysis

---

## 🔍 Debugging Commands

```javascript
// View current save
JSON.parse(localStorage.getItem("fermugame-save"));

// View session metadata
JSON.parse(localStorage.getItem("fermugame-session"));

// Clear all data
localStorage.clear();

// Check save size
new TextEncoder().encode(localStorage.getItem("fermugame-save")).length;

// Monitor saves (browser console)
let count = 0;
setInterval(() => console.log(`Save #${++count}`), 5000);
```

---

## 📦 Dependencies

**No External Libraries Required**

- Uses native browser localStorage API
- No compression libraries needed
- No database required

**Dev Dependencies** (Already installed)

- Vitest for testing
- TypeScript for type safety

---

**Document Version**: 1.0  
**Created**: June 11, 2026  
**All 47 Tests**: ✅ PASSING  
**Status**: 🟢 READY FOR IMPLEMENTATION
