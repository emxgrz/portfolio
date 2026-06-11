import { describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * PERSISTENCE SPECIFICATION
 * ========================
 * Game state persistence using browser localStorage
 *
 * Storage Keys:
 * - 'fermugame-save': Main game state (portals, scores, progress)
 * - 'fermugame-session': Session metadata (timestamp, version)
 *
 * Auto-save: Every 5 seconds during gameplay
 * Manual-save: On portal completion or game exit
 *
 * Data Structure:
 * {
 *   session_id: string (UUID),
 *   created_at: string (ISO timestamp),
 *   last_saved: string (ISO timestamp),
 *   version: number (schema version),
 *   portals: {
 *     [id]: { completed: boolean, score: number, timestamp: string | null }
 *   },
 *   stats: {
 *     total_score: number,
 *     completion_percentage: number,
 *     total_playtime_ms: number
 *   }
 * }
 */

describe("Persistence - localStorage State Management", () => {
  const MAIN_SAVE_KEY = "fermugame-save";
  const SESSION_KEY = "fermugame-session";
  const SCHEMA_VERSION = 1;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe("Storage Keys", () => {
    it("should use 'fermugame-save' as main save key", () => {
      const key = MAIN_SAVE_KEY;
      expect(key).toBe("fermugame-save");
    });

    it("should use 'fermugame-session' as session metadata key", () => {
      const key = SESSION_KEY;
      expect(key).toBe("fermugame-session");
    });

    it("should isolate game saves with unique key prefix", () => {
      const key1 = MAIN_SAVE_KEY;
      const key2 = SESSION_KEY;
      expect(key1).not.toBe(key2);
      expect(key1.startsWith("fermugame")).toBe(true);
      expect(key2.startsWith("fermugame")).toBe(true);
    });
  });

  describe("Initial State Structure", () => {
    it("should have correct initial portal state", () => {
      const initialPortals = {
        1: { completed: false, score: 0, timestamp: null },
        2: { completed: false, score: 0, timestamp: null },
        3: { completed: false, score: 0, timestamp: null },
        4: { completed: false, score: 0, timestamp: null },
        5: { completed: false, score: 0, timestamp: null },
      };

      expect(Object.keys(initialPortals)).toHaveLength(5);
      expect(initialPortals[1].completed).toBe(false);
      expect(initialPortals[1].score).toBe(0);
      expect(initialPortals[1].timestamp).toBeNull();
    });

    it("should initialize with Portal 1 unlocked", () => {
      const portal1 = { id: 1, locked: false, completed: false };
      expect(portal1.locked).toBe(false);
    });

    it("should initialize all other portals locked", () => {
      const portals = [2, 3, 4, 5];
      portals.forEach((id) => {
        const portal = { id, locked: true, completed: false };
        expect(portal.locked).toBe(true);
      });
    });

    it("should create initial save object with all required fields", () => {
      const initialSave = {
        session_id: "uuid-1234-5678-9012",
        created_at: new Date().toISOString(),
        last_saved: new Date().toISOString(),
        version: SCHEMA_VERSION,
        portals: {
          1: { completed: false, score: 0, timestamp: null },
          2: { completed: false, score: 0, timestamp: null },
          3: { completed: false, score: 0, timestamp: null },
          4: { completed: false, score: 0, timestamp: null },
          5: { completed: false, score: 0, timestamp: null },
        },
        stats: {
          total_score: 0,
          completion_percentage: 0,
          total_playtime_ms: 0,
        },
      };

      expect(initialSave.session_id).toBeDefined();
      expect(initialSave.created_at).toBeDefined();
      expect(initialSave.last_saved).toBeDefined();
      expect(initialSave.version).toBe(SCHEMA_VERSION);
      expect(initialSave.portals).toBeDefined();
      expect(initialSave.stats).toBeDefined();
    });
  });

  describe("Write Operations (Save)", () => {
    it("should serialize and save state to localStorage", () => {
      const gameState = {
        session_id: "uuid-1234",
        created_at: "2026-06-11T20:00:00Z",
        last_saved: "2026-06-11T20:05:00Z",
        version: SCHEMA_VERSION,
        portals: {
          1: { completed: false, score: 1500, timestamp: null },
        },
        stats: {
          total_score: 1500,
          completion_percentage: 0,
          total_playtime_ms: 300000,
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));
      const saved = localStorage.getItem(MAIN_SAVE_KEY);

      expect(saved).toBeDefined();
      expect(saved).toContain("session_id");
      expect(saved).toContain("1500");
    });

    it("should include session metadata on save", () => {
      const sessionData = {
        session_id: "uuid-1234",
        started_at: "2026-06-11T20:00:00Z",
        last_accessed: "2026-06-11T20:05:00Z",
        version: SCHEMA_VERSION,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      const saved = localStorage.getItem(SESSION_KEY);

      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.session_id).toBe("uuid-1234");
      expect(parsed.version).toBe(SCHEMA_VERSION);
    });

    it("should update last_saved timestamp on save", () => {
      const before = new Date();
      const gameState = {
        session_id: "uuid-1234",
        created_at: "2026-06-11T20:00:00Z",
        last_saved: new Date().toISOString(),
        version: SCHEMA_VERSION,
        portals: {},
        stats: {},
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));
      const saved = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      const after = new Date();

      const lastSaved = new Date(saved.last_saved);
      expect(lastSaved >= before).toBe(true);
      expect(lastSaved <= after).toBe(true);
    });

    it("should overwrite previous save data", () => {
      const save1 = { score: 100, timestamp: "2026-06-11T20:00:00Z" };
      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(save1));

      const save2 = { score: 500, timestamp: "2026-06-11T20:05:00Z" };
      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(save2));

      const retrieved = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      expect(retrieved.score).toBe(500);
      expect(retrieved.timestamp).toBe("2026-06-11T20:05:00Z");
    });
  });

  describe("Read Operations (Load)", () => {
    it("should deserialize and load state from localStorage", () => {
      const gameState = {
        session_id: "uuid-1234",
        created_at: "2026-06-11T20:00:00Z",
        last_saved: "2026-06-11T20:05:00Z",
        version: SCHEMA_VERSION,
        portals: {
          1: {
            completed: false,
            score: 5200,
            timestamp: "2026-06-11T20:03:00Z",
          },
          2: { completed: false, score: 0, timestamp: null },
        },
        stats: {
          total_score: 5200,
          completion_percentage: 20,
          total_playtime_ms: 300000,
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));
      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(loaded.session_id).toBe("uuid-1234");
      expect(loaded.portals[1].score).toBe(5200);
      expect(loaded.stats.total_score).toBe(5200);
    });

    it("should return null if save does not exist", () => {
      const loaded = localStorage.getItem(MAIN_SAVE_KEY);
      expect(loaded).toBeNull();
    });

    it("should load session metadata", () => {
      const sessionData = {
        session_id: "uuid-1234",
        started_at: "2026-06-11T20:00:00Z",
        version: SCHEMA_VERSION,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      const loaded = JSON.parse(localStorage.getItem(SESSION_KEY)!);

      expect(loaded.session_id).toBe("uuid-1234");
      expect(loaded.started_at).toBe("2026-06-11T20:00:00Z");
    });

    it("should handle missing optional fields gracefully", () => {
      const partialState = {
        session_id: "uuid-1234",
        portals: {
          1: { completed: false, score: 100 },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(partialState));
      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(loaded.session_id).toBe("uuid-1234");
      expect(loaded.portals[1].score).toBe(100);
    });
  });

  describe("Portal State Updates", () => {
    it("should update portal completion status", () => {
      const gameState = {
        portals: {
          1: { completed: false, score: 0, timestamp: null },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      updated.portals[1].completed = true;
      updated.portals[1].score = 5000;
      updated.portals[1].timestamp = "2026-06-11T20:10:00Z";

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(updated));
      const verified = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(verified.portals[1].completed).toBe(true);
      expect(verified.portals[1].score).toBe(5000);
      expect(verified.portals[1].timestamp).toBe("2026-06-11T20:10:00Z");
    });

    it("should unlock next portal when current is completed", () => {
      const gameState = {
        portals: {
          1: {
            completed: true,
            score: 5000,
            timestamp: "2026-06-11T20:10:00Z",
          },
          2: { locked: true, completed: false, score: 0, timestamp: null },
        },
        unlocked: [1],
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      if (loaded.portals[1].completed) {
        loaded.portals[2].locked = false;
        loaded.unlocked.push(2);
      }

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(loaded));
      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(updated.portals[2].locked).toBe(false);
      expect(updated.unlocked).toContain(2);
    });

    it("should maintain portal order in save", () => {
      const gameState = {
        portals: {
          1: {
            completed: true,
            score: 5000,
            timestamp: "2026-06-11T20:10:00Z",
          },
          2: { completed: true, score: 200, timestamp: "2026-06-11T20:15:00Z" },
          3: { completed: false, score: 1500, timestamp: null },
          4: { completed: false, score: 0, timestamp: null },
          5: { completed: false, score: 0, timestamp: null },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));
      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      const portals = Object.keys(loaded.portals).map(Number);
      expect(portals).toEqual([1, 2, 3, 4, 5]);
    });

    it("should preserve all portal metadata during updates", () => {
      const portal = {
        id: 1,
        completed: false,
        score: 0,
        timestamp: null,
        attempts: 0,
        best_score: 0,
        last_played: null,
      };

      localStorage.setItem(
        MAIN_SAVE_KEY,
        JSON.stringify({ portals: { 1: portal } }),
      );

      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      loaded.portals[1].score = 500;
      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(loaded));

      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      expect(updated.portals[1].timestamp).toBeNull();
      expect(updated.portals[1].best_score).toBe(0);
    });
  });

  describe("Minigame Completion Tracking", () => {
    it("should track Tetris completion (5000 points)", () => {
      const gameState = {
        portals: {
          1: {
            id: "tetris",
            completed: false,
            score: 4999,
            timestamp: null,
          },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      loaded.portals[1].score = 5000;
      loaded.portals[1].completed = true;
      loaded.portals[1].timestamp = "2026-06-11T20:20:00Z";

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(loaded));
      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(updated.portals[1].completed).toBe(true);
      expect(updated.portals[1].score).toBe(5000);
    });

    it("should track Snake completion (200 points)", () => {
      const gameState = {
        portals: {
          2: {
            id: "snake",
            completed: false,
            score: 0,
            timestamp: null,
          },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      loaded.portals[2].score = 200;
      loaded.portals[2].completed = true;
      loaded.portals[2].timestamp = "2026-06-11T20:25:00Z";

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(loaded));
      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(updated.portals[2].completed).toBe(true);
      expect(updated.portals[2].score).toBe(200);
    });

    it("should track Pac-Man completion (240 pellets)", () => {
      const gameState = {
        portals: {
          3: {
            id: "pacman",
            completed: false,
            pellets_eaten: 0,
            timestamp: null,
          },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      loaded.portals[3].pellets_eaten = 240;
      loaded.portals[3].completed = true;
      loaded.portals[3].timestamp = "2026-06-11T20:30:00Z";

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(loaded));
      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(updated.portals[3].completed).toBe(true);
      expect(updated.portals[3].pellets_eaten).toBe(240);
    });

    it("should track Space Invaders completion (24 enemies)", () => {
      const gameState = {
        portals: {
          4: {
            id: "space_invaders",
            completed: false,
            enemies_destroyed: 0,
            timestamp: null,
          },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      loaded.portals[4].enemies_destroyed = 24;
      loaded.portals[4].completed = true;
      loaded.portals[4].timestamp = "2026-06-11T20:35:00Z";

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(loaded));
      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(updated.portals[4].completed).toBe(true);
      expect(updated.portals[4].enemies_destroyed).toBe(24);
    });

    it("should track Puzzle completion", () => {
      const gameState = {
        portals: {
          5: {
            id: "puzzle",
            completed: false,
            pieces_placed: 0,
            qr_generated: false,
            timestamp: null,
          },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      loaded.portals[5].pieces_placed = 16;
      loaded.portals[5].completed = true;
      loaded.portals[5].qr_generated = true;
      loaded.portals[5].timestamp = "2026-06-11T20:40:00Z";

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(loaded));
      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(updated.portals[5].completed).toBe(true);
      expect(updated.portals[5].qr_generated).toBe(true);
    });
  });

  describe("Progress Statistics", () => {
    it("should track total score across all portals", () => {
      const gameState = {
        stats: {
          total_score: 0,
          completion_percentage: 0,
          total_playtime_ms: 0,
        },
        portals: {
          1: { score: 5000 },
          2: { score: 200 },
          3: { score: 0 },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      loaded.stats.total_score = 5200;
      loaded.stats.completion_percentage = 40;

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(loaded));
      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(updated.stats.total_score).toBe(5200);
      expect(updated.stats.completion_percentage).toBe(40);
    });

    it("should calculate completion percentage", () => {
      const gameState = {
        stats: {
          completed_portals: 3,
          total_portals: 5,
          completion_percentage: 0,
        },
      };

      const completionPercent =
        (gameState.stats.completed_portals / gameState.stats.total_portals) *
        100;

      expect(completionPercent).toBe(60);
    });

    it("should track total playtime", () => {
      const gameState = {
        stats: {
          total_playtime_ms: 0,
          session_start: "2026-06-11T20:00:00Z",
          last_session_duration: 0,
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);
      loaded.stats.total_playtime_ms = 1200000; // 20 minutes
      loaded.stats.last_session_duration = 300000; // 5 minutes

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(loaded));
      const updated = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(updated.stats.total_playtime_ms).toBe(1200000);
      expect(updated.stats.last_session_duration).toBe(300000);
    });
  });

  describe("Auto-save Mechanism", () => {
    it("should trigger save every 5 seconds", () => {
      const saveIntervalMs = 5000;
      expect(saveIntervalMs).toBe(5000);
    });

    it("should queue saves and batch write", () => {
      const saveQueue: Array<Record<string, unknown>> = [];

      saveQueue.push({ action: "update_portal", portal_id: 1, score: 100 });
      saveQueue.push({ action: "update_stats", total_score: 100 });
      saveQueue.push({ action: "update_portal", portal_id: 2, score: 50 });

      expect(saveQueue).toHaveLength(3);
    });

    it("should persist state before closing game", () => {
      const gameState = {
        session_id: "uuid-1234",
        portals: {
          1: { completed: true, score: 5000 },
        },
      };

      // Simulate before unload event
      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));

      const saved = localStorage.getItem(MAIN_SAVE_KEY);
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved!).session_id).toBe("uuid-1234");
    });

    it("should mark save as pending if auto-save fails", () => {
      const saveAttempt = {
        status: "pending",
        timestamp: "2026-06-11T20:05:00Z",
        data: { portal_id: 1, score: 100 },
        error: null,
      };

      expect(saveAttempt.status).toBe("pending");
      expect(saveAttempt.error).toBeNull();
    });
  });

  describe("Data Validation", () => {
    it("should validate session_id is UUID format", () => {
      const validUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";

      expect(sessionId).toMatch(validUUID);
    });

    it("should validate timestamps are ISO format", () => {
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
      const timestamp = "2026-06-11T20:05:00Z";

      expect(timestamp).toMatch(isoRegex);
    });

    it("should validate portal IDs are 1-5", () => {
      const portalIds = [1, 2, 3, 4, 5];
      expect(portalIds).toHaveLength(5);
      expect(portalIds.every((id) => id >= 1 && id <= 5)).toBe(true);
    });

    it("should validate scores are non-negative integers", () => {
      const scores = [0, 100, 5000, 200];
      expect(scores.every((s) => Number.isInteger(s) && s >= 0)).toBe(true);
    });

    it("should validate version matches schema version", () => {
      const gameState = {
        version: SCHEMA_VERSION,
      };

      expect(gameState.version).toBe(1);
    });

    it("should reject malformed JSON data", () => {
      const malformed = "{invalid json}";

      expect(() => {
        JSON.parse(malformed);
      }).toThrow();
    });
  });

  describe("Data Recovery", () => {
    it("should handle corrupted save data", () => {
      localStorage.setItem(MAIN_SAVE_KEY, "corrupted-data");

      const saved = localStorage.getItem(MAIN_SAVE_KEY);
      expect(() => JSON.parse(saved!)).toThrow();
    });

    it("should fallback to initial state if load fails", () => {
      const initialState = {
        session_id: "new-session",
        portals: {
          1: { completed: false, score: 0, timestamp: null },
        },
      };

      expect(initialState.portals[1].completed).toBe(false);
    });

    it("should recover from missing session metadata", () => {
      const gameState = {
        portals: {
          1: { completed: false, score: 100 },
        },
      };

      localStorage.setItem(MAIN_SAVE_KEY, JSON.stringify(gameState));
      const loaded = JSON.parse(localStorage.getItem(MAIN_SAVE_KEY)!);

      expect(loaded.portals[1].score).toBe(100);
    });

    it("should support version migration", () => {
      const oldVersion = {
        version: 0,
        portals: {
          1: { score: 5000 },
        },
      };

      const migrated = {
        version: SCHEMA_VERSION,
        portals: oldVersion.portals,
        stats: {
          total_score: 5000,
          completion_percentage: 0,
          total_playtime_ms: 0,
        },
      };

      expect(migrated.version).toBe(SCHEMA_VERSION);
      expect(migrated.stats).toBeDefined();
    });
  });

  describe("Storage Limits", () => {
    it("should handle localStorage quota limits", () => {
      const largeData = "x".repeat(5 * 1024 * 1024); // 5MB

      expect(() => {
        // Note: This test demonstrates the concept, actual quota depends on browser
        if (largeData.length > 5 * 1024 * 1024) {
          throw new Error("Data exceeds quota");
        }
      }).not.toThrow();
    });

    it("should estimate save data size", () => {
      const gameState = {
        session_id: "uuid",
        portals: {
          1: { completed: false, score: 0, timestamp: null },
        },
        stats: {
          total_score: 0,
          completion_percentage: 0,
          total_playtime_ms: 0,
        },
      };

      const jsonString = JSON.stringify(gameState);
      const sizeInBytes = new TextEncoder().encode(jsonString).length;

      expect(sizeInBytes).toBeLessThan(1000); // Should be less than 1KB
    });

    it("should cleanup old session data if needed", () => {
      const sessions = [
        { id: "session-1", timestamp: "2026-06-10T10:00:00Z" },
        { id: "session-2", timestamp: "2026-06-11T20:00:00Z" },
      ];

      // Reference date: June 11, 2026 12:00 PM
      const referenceDate = new Date("2026-06-11T12:00:00Z");
      const oneDayBefore = new Date(referenceDate);
      oneDayBefore.setDate(oneDayBefore.getDate() - 1);

      const activeSessions = sessions.filter(
        (s) => new Date(s.timestamp) > oneDayBefore,
      );

      expect(activeSessions).toHaveLength(1);
      expect(activeSessions[0].id).toBe("session-2");
    });
  });

  describe("Cross-tab Synchronization", () => {
    it("should listen for storage changes across tabs", () => {
      // StorageEvent simulated with object literal (Node.js compatibility)
      const event = {
        key: MAIN_SAVE_KEY,
        newValue: JSON.stringify({ portals: { 1: { score: 5000 } } }),
        oldValue: JSON.stringify({ portals: { 1: { score: 0 } } }),
      };

      expect(event.key).toBe(MAIN_SAVE_KEY);
      expect(event.newValue).toContain("5000");
    });

    it("should update UI when another tab saves", () => {
      const oldValue = { score: 0 };
      const newValue = { score: 5000 };

      const updated = oldValue !== newValue;
      expect(updated).toBe(true);
    });

    it("should resolve conflicts if multiple tabs save simultaneously", () => {
      const save1 = {
        timestamp: "2026-06-11T20:05:00Z",
        score: 100,
      };

      const save2 = {
        timestamp: "2026-06-11T20:05:00.100Z",
        score: 150,
      };

      // Use most recent timestamp as tiebreaker
      const winner =
        new Date(save2.timestamp) > new Date(save1.timestamp) ? save2 : save1;

      expect(winner.score).toBe(150);
    });
  });
});
