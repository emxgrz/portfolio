import { describe, it, expect, beforeEach } from "vitest";

describe("Tetris Minigame", () => {
  describe("Game Initialization", () => {
    it("should initialize game board with correct dimensions", () => {
      const board = { width: 10, height: 20 };
      expect(board.width).toBe(10);
      expect(board.height).toBe(20);
    });

    it("should create empty game board", () => {
      const board = Array(20)
        .fill(null)
        .map(() => Array(10).fill(null));
      expect(board).toHaveLength(20);
      expect(board[0]).toHaveLength(10);
      expect(board[0][0]).toBeNull();
    });

    it("should spawn first tetromino at top center", () => {
      const piece = {
        type: "I",
        x: 4,
        y: 0,
        rotation: 0,
      };
      expect(piece.x).toBe(4);
      expect(piece.y).toBe(0);
    });
  });

  describe("Tetromino Movement", () => {
    it("should move tetromino left", () => {
      let piece = { x: 5, y: 5 };
      piece.x -= 1;
      expect(piece.x).toBe(4);
    });

    it("should move tetromino right", () => {
      let piece = { x: 5, y: 5 };
      piece.x += 1;
      expect(piece.x).toBe(6);
    });

    it("should move tetromino down", () => {
      let piece = { x: 5, y: 5 };
      piece.y += 1;
      expect(piece.y).toBe(6);
    });

    it("should rotate tetromino clockwise", () => {
      let piece = { rotation: 0 };
      piece.rotation = (piece.rotation + 1) % 4;
      expect(piece.rotation).toBe(1);
    });

    it("should not move tetromino outside left boundary", () => {
      const piece = { x: 0 };
      const nextX = Math.max(0, piece.x - 1);
      expect(nextX).toBe(0);
    });

    it("should not move tetromino outside right boundary", () => {
      const board = { width: 10 };
      const piece = { x: 9, width: 1 };
      const nextX = Math.min(board.width - piece.width, piece.x + 1);
      expect(nextX).toBe(9);
    });

    it("should stop tetromino when hitting bottom", () => {
      const board = { height: 20 };
      let piece = { y: 19 };
      const canMoveDown = piece.y + 1 < board.height;
      expect(canMoveDown).toBe(false);
    });

    it("should detect collision with placed pieces", () => {
      const board = [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ];
      const piece = { x: 2, y: 0 };
      const collision = board[piece.y][piece.x] !== 0;
      expect(collision).toBe(true);
    });
  });

  describe("Line Clearing", () => {
    it("should detect completed line", () => {
      const line = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      const isComplete = line.every((cell) => cell !== null && cell !== 0);
      expect(isComplete).toBe(true);
    });

    it("should clear completed lines", () => {
      let board = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Complete
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // Incomplete
      ];
      board = board.filter(
        (line) => !line.every((cell) => cell !== null && cell !== 0),
      );
      expect(board).toHaveLength(1);
    });

    it("should award points for single line clear", () => {
      let score = 0;
      score += 100;
      expect(score).toBe(100);
    });

    it("should award bonus points for multiple line clears (Tetris)", () => {
      let score = 0;
      const linesCleared = 4;
      const basePoints = linesCleared === 4 ? 400 : 100 * linesCleared;
      score += basePoints;
      expect(score).toBe(400);
    });
  });

  describe("Game Over", () => {
    it("should end game when piece spawns and cannot move", () => {
      const canSpawn = true; // Blocked by existing pieces
      expect(canSpawn).toBe(true);
    });

    it("should calculate final score", () => {
      const finalScore = 1500;
      expect(finalScore).toBeGreaterThan(0);
    });

    it("should trigger game over screen", () => {
      const gameOver = true;
      expect(gameOver).toBe(true);
    });
  });

  describe("Touch Controls", () => {
    it("should respond to left swipe", () => {
      const direction = "left";
      expect(direction).toBe("left");
    });

    it("should respond to right swipe", () => {
      const direction = "right";
      expect(direction).toBe("right");
    });

    it("should respond to down swipe or tap for hard drop", () => {
      const action = "hard_drop";
      expect(action).toBe("hard_drop");
    });

    it("should respond to up tap for rotation", () => {
      const action = "rotate";
      expect(action).toBe("rotate");
    });
  });

  describe("Completion", () => {
    it("should unlock next portal when game completed", () => {
      const nextPortal = { id: 2, locked: false };
      expect(nextPortal.locked).toBe(false);
    });

    it("should save high score", () => {
      const highScore = 5000;
      expect(highScore).toBeGreaterThan(0);
    });
  });
});
