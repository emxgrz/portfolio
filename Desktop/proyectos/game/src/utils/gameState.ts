/**
 * Game State Manager
 * Handles all game state logic including persistence
 */

import {
  GameSaveData,
  SessionMetadata,
  PortalState,
  STORAGE_KEYS,
  SCHEMA_VERSION,
  PORTAL_TARGETS,
} from "../types/game";

export class GameStateManager {
  private saveKey = STORAGE_KEYS.save;
  private sessionKey = STORAGE_KEYS.session;

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Create initial game state
   */
  createInitialState(): GameSaveData {
    const now = new Date().toISOString();
    return {
      session_id: this.generateUUID(),
      created_at: now,
      last_saved: now,
      version: SCHEMA_VERSION,
      portals: {
        1: {
          id: 1,
          completed: false,
          score: 0,
          timestamp: null,
          locked: false,
        },
        2: {
          id: 2,
          completed: false,
          score: 0,
          timestamp: null,
          locked: true,
        },
        3: {
          id: 3,
          completed: false,
          score: 0,
          timestamp: null,
          locked: true,
          pellets_eaten: 0,
        },
        4: {
          id: 4,
          completed: false,
          score: 0,
          timestamp: null,
          locked: true,
          enemies_destroyed: 0,
        },
        5: {
          id: 5,
          completed: false,
          score: 0,
          timestamp: null,
          locked: true,
          pieces_placed: 0,
          qr_generated: false,
        },
      },
      stats: {
        total_score: 0,
        completion_percentage: 0,
        total_playtime_ms: 0,
      },
    };
  }

  /**
   * Create session metadata
   */
  createSessionMetadata(session_id: string): SessionMetadata {
    const now = new Date().toISOString();
    return {
      session_id,
      started_at: now,
      last_accessed: now,
      version: SCHEMA_VERSION,
    };
  }

  /**
   * Save game state to localStorage
   */
  save(state: GameSaveData): boolean {
    try {
      state.last_saved = new Date().toISOString();
      const json = JSON.stringify(state);
      localStorage.setItem(this.saveKey, json);
      return true;
    } catch (error) {
      console.error("Failed to save game state:", error);
      return false;
    }
  }

  /**
   * Load game state from localStorage
   */
  load(): GameSaveData {
    try {
      const saved = localStorage.getItem(this.saveKey);
      if (!saved) {
        return this.createInitialState();
      }

      const state = JSON.parse(saved) as GameSaveData;

      // Validate schema version
      if (state.version !== SCHEMA_VERSION) {
        console.warn("Incompatible save version, creating new save");
        return this.createInitialState();
      }

      return state;
    } catch (error) {
      console.error("Failed to load game state:", error);
      return this.createInitialState();
    }
  }

  /**
   * Save session metadata
   */
  saveSession(metadata: SessionMetadata): boolean {
    try {
      const json = JSON.stringify(metadata);
      localStorage.setItem(this.sessionKey, json);
      return true;
    } catch (error) {
      console.error("Failed to save session metadata:", error);
      return false;
    }
  }

  /**
   * Load session metadata
   */
  loadSession(): SessionMetadata | null {
    try {
      const saved = localStorage.getItem(this.sessionKey);
      if (!saved) {
        return null;
      }
      return JSON.parse(saved) as SessionMetadata;
    } catch (error) {
      console.error("Failed to load session metadata:", error);
      return null;
    }
  }

  /**
   * Update portal completion status
   */
  completePortal(
    state: GameSaveData,
    portalId: number,
    score: number,
  ): GameSaveData {
    const now = new Date().toISOString();

    if (!state.portals[portalId]) {
      return state;
    }

    // Mark as completed
    state.portals[portalId].completed = true;
    state.portals[portalId].score = score;
    state.portals[portalId].timestamp = now;

    // Unlock next portal if applicable
    if (portalId < 5) {
      state.portals[portalId + 1].locked = false;
    }

    // Update statistics
    this.updateStatistics(state);

    return state;
  }

  /**
   * Update portal score (doesn't mark as completed)
   */
  updatePortalScore(
    state: GameSaveData,
    portalId: number,
    score: number,
  ): GameSaveData {
    if (state.portals[portalId]) {
      state.portals[portalId].score = score;
      this.updateStatistics(state);
    }
    return state;
  }

  /**
   * Update portal minigame-specific data
   */
  updatePortalData(
    state: GameSaveData,
    portalId: number,
    data: Partial<PortalState>,
  ): GameSaveData {
    if (state.portals[portalId]) {
      state.portals[portalId] = {
        ...state.portals[portalId],
        ...data,
      };
      this.updateStatistics(state);
    }
    return state;
  }

  /**
   * Update game statistics
   */
  private updateStatistics(state: GameSaveData): void {
    // Calculate total score
    state.stats.total_score = Object.values(state.portals).reduce(
      (sum, portal) => sum + (portal.score || 0),
      0,
    );

    // Calculate completion percentage
    const completedCount = Object.values(state.portals).filter(
      (p) => p.completed,
    ).length;
    state.stats.completion_percentage = (completedCount / 5) * 100;

    // Update playtime
    if (state.stats.session_start) {
      const elapsed =
        new Date().getTime() - new Date(state.stats.session_start).getTime();
      state.stats.total_playtime_ms = elapsed;
    }
  }

  /**
   * Check if player can access portal
   */
  canAccessPortal(state: GameSaveData, portalId: number): boolean {
    const portal = state.portals[portalId];
    if (!portal) return false;
    return !portal.locked;
  }

  /**
   * Check if portal is completed
   */
  isPortalCompleted(state: GameSaveData, portalId: number): boolean {
    const portal = state.portals[portalId];
    if (!portal) return false;
    return portal.completed;
  }

  /**
   * Get completion status for a portal
   */
  getPortalStatus(state: GameSaveData, portalId: number) {
    const portal = state.portals[portalId];
    if (!portal) return null;

    const target = PORTAL_TARGETS[portalId as 1 | 2 | 3 | 4 | 5];
    let isComplete = false;

    switch (portalId) {
      case 1: // Tetris
      case 2: // Snake
      case 4: // Space Invaders
        isComplete = portal.score >= target;
        break;
      case 3: // Pac-Man
        isComplete = portal.pellets_eaten === target;
        break;
      case 5: // Puzzle
        isComplete = portal.completed && portal.qr_generated;
        break;
    }

    return {
      locked: portal.locked,
      completed: portal.completed || isComplete,
      score: portal.score,
      target,
      progress: this.getPortalProgress(state, portalId),
    };
  }

  /**
   * Get progress percentage for a portal
   */
  getPortalProgress(state: GameSaveData, portalId: number): number {
    const portal = state.portals[portalId];
    if (!portal) return 0;

    const target = PORTAL_TARGETS[portalId as 1 | 2 | 3 | 4 | 5];

    switch (portalId) {
      case 1: // Tetris
      case 2: // Snake
      case 4: // Space Invaders
        return Math.min((portal.score / target) * 100, 100);
      case 3: // Pac-Man
        return Math.min(((portal.pellets_eaten || 0) / target) * 100, 100);
      case 5: // Puzzle
        return Math.min(((portal.pieces_placed || 0) / 16) * 100, 100);
      default:
        return 0;
    }
  }

  /**
   * Clear all data (for testing/reset)
   */
  clear(): void {
    try {
      localStorage.removeItem(this.saveKey);
      localStorage.removeItem(this.sessionKey);
    } catch (error) {
      console.error("Failed to clear game data:", error);
    }
  }

  /**
   * Get full game state summary
   */
  getSummary(state: GameSaveData) {
    return {
      session_id: state.session_id,
      version: state.version,
      created_at: state.created_at,
      last_saved: state.last_saved,
      total_score: state.stats.total_score,
      completion_percentage: state.stats.completion_percentage,
      portals_completed: Object.values(state.portals).filter((p) => p.completed)
        .length,
      total_portals: 5,
    };
  }
}

// Export singleton instance
export const gameStateManager = new GameStateManager();
