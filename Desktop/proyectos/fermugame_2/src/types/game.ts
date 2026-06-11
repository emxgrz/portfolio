/**
 * Game State Types
 * Central type definitions for the entire game
 */

export interface PortalState {
  id: number;
  completed: boolean;
  score: number;
  timestamp: string | null;
  locked: boolean;

  // Portal-specific fields
  pellets_eaten?: number; // Pac-Man
  enemies_destroyed?: number; // Space Invaders
  pieces_placed?: number; // Puzzle
  qr_generated?: boolean; // Puzzle
  best_score?: number;
  attempts?: number;
}

export interface GameStatistics {
  total_score: number;
  completion_percentage: number;
  total_playtime_ms: number;
  last_session_duration?: number;
  session_start?: string;
}

export interface GameSaveData {
  session_id: string;
  created_at: string;
  last_saved: string;
  version: number;
  portals: Record<number, PortalState>;
  stats: GameStatistics;
}

export interface SessionMetadata {
  session_id: string;
  started_at: string;
  last_accessed: string;
  version: number;
}

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface PortalLocation {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  minigame: string;
}

export interface MainWorldState {
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  portals: PortalLocation[];
}

// Constants
export const PORTAL_TARGETS = {
  1: 5000, // Tetris
  2: 200, // Snake
  3: 240, // Pac-Man (pellets)
  4: 24, // Space Invaders (enemies)
  5: -1, // Puzzle (completion-based, not score-based)
} as const;

export const PORTAL_NAMES = {
  1: "Tetris",
  2: "Snake",
  3: "Pac-Man",
  4: "Space Invaders",
  5: "Puzzle",
} as const;

export const MINIGAME_NAMES = {
  1: "tetris",
  2: "snake",
  3: "pacman",
  4: "space_invaders",
  5: "puzzle",
} as const;

// Color palette from Visual Style Spec
export const COLOR_PALETTE = {
  deepBlack: "#0a0e27",
  darkGray: "#1a1f3a",
  neonRed: "#ff006e",
  neonBlue: "#00d9ff",
  electricPurple: "#8338ec",
  neonGreen: "#3a86ff",
  accentYellow: "#ffbe0b",
  white: "#ffffff",
  black: "#000000",
} as const;

// Persistence constants
export const STORAGE_KEYS = {
  save: "fermugame-save",
  session: "fermugame-session",
} as const;

export const SCHEMA_VERSION = 1;

// Main World constants
export const MAIN_WORLD = {
  width: 320,
  height: 180,
  gridSize: 16,
} as const;

// Protagonist constants
export const PROTAGONIST = {
  width: 16,
  height: 16,
  startX: 10,
  startY: 10,
  speed: 1,
} as const;
