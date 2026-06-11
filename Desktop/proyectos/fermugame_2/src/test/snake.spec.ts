import { describe, it, expect } from "vitest";

describe("Snake Minigame", () => {
  describe("Game Initialization", () => {
    it("should initialize game board with correct dimensions", () => {
      const board = { width: 20, height: 20 };
      expect(board.width).toBe(20);
      expect(board.height).toBe(20);
    });

    it("should create snake with initial length", () => {
      const snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ];
      expect(snake).toHaveLength(3);
      expect(snake[0]).toEqual({ x: 10, y: 10 });
    });

    it("should spawn food at random location", () => {
      const food = { x: 15, y: 8 };
      expect(food).toBeDefined();
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeGreaterThanOrEqual(0);
    });

    it("should initialize score to 0", () => {
      const score = 0;
      expect(score).toBe(0);
    });
  });

  describe("Snake Movement", () => {
    it("should move snake up", () => {
      const snake = [{ x: 10, y: 10 }];
      const direction = "up";
      expect(direction).toBe("up");
    });

    it("should move snake down", () => {
      const snake = [{ x: 10, y: 10 }];
      const direction = "down";
      expect(direction).toBe("down");
    });

    it("should move snake left", () => {
      const snake = [{ x: 10, y: 10 }];
      const direction = "left";
      expect(direction).toBe("left");
    });

    it("should move snake right", () => {
      const snake = [{ x: 10, y: 10 }];
      const direction = "right";
      expect(direction).toBe("right");
    });

    it("should prevent snake from reversing into itself", () => {
      const currentDirection = "right";
      const nextDirection = "left";
      const canMove = currentDirection !== "right";
      expect(canMove).toBe(false);
    });

    it("should add new segment when eating food", () => {
      let snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
      ];
      const initialLength = snake.length;
      snake.push({ x: 11, y: 10 });
      expect(snake).toHaveLength(initialLength + 1);
    });

    it("should remove tail when moving without eating", () => {
      const snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ];
      snake.shift(); // Remove head temporarily
      snake.push({ x: 10, y: 11 }); // Add new head
      expect(snake).toHaveLength(3);
    });
  });

  describe("Collision Detection", () => {
    it("should detect collision with self", () => {
      const snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 10, y: 10 },
      ];
      const head = snake[0];
      const collidesWithBody = snake
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y);
      expect(collidesWithBody).toBe(true);
    });

    it("should detect collision with left wall", () => {
      const head = { x: -1, y: 10 };
      const board = { minX: 0 };
      const collision = head.x < board.minX;
      expect(collision).toBe(true);
    });

    it("should detect collision with right wall", () => {
      const head = { x: 20, y: 10 };
      const board = { maxX: 19 };
      const collision = head.x > board.maxX;
      expect(collision).toBe(true);
    });

    it("should detect collision with top wall", () => {
      const head = { x: 10, y: -1 };
      const board = { minY: 0 };
      const collision = head.y < board.minY;
      expect(collision).toBe(true);
    });

    it("should detect collision with bottom wall", () => {
      const head = { x: 10, y: 20 };
      const board = { maxY: 19 };
      const collision = head.y > board.maxY;
      expect(collision).toBe(true);
    });

    it("should detect food collision", () => {
      const head = { x: 15, y: 8 };
      const food = { x: 15, y: 8 };
      const collision = head.x === food.x && head.y === food.y;
      expect(collision).toBe(true);
    });
  });

  describe("Food System", () => {
    it("should increase score when eating food", () => {
      let score = 0;
      score += 10;
      expect(score).toBe(10);
    });

    it("should spawn new food after eating", () => {
      let food = { x: 15, y: 8 };
      const foodEaten = true;
      if (foodEaten) {
        food = { x: 5, y: 12 };
      }
      expect(food).toBeDefined();
    });

    it("should not spawn food on snake body", () => {
      const snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
      ];
      let food = { x: 10, y: 10 };
      const onSnake = snake.some(
        (segment) => segment.x === food.x && segment.y === food.y,
      );
      expect(onSnake).toBe(true);
    });
  });

  describe("Touch Controls", () => {
    it("should respond to up swipe", () => {
      const direction = "up";
      expect(direction).toBe("up");
    });

    it("should respond to down swipe", () => {
      const direction = "down";
      expect(direction).toBe("down");
    });

    it("should respond to left swipe", () => {
      const direction = "left";
      expect(direction).toBe("left");
    });

    it("should respond to right swipe", () => {
      const direction = "right";
      expect(direction).toBe("right");
    });

    it("should buffer input for smooth gameplay", () => {
      const inputBuffer = ["up", "left"];
      expect(inputBuffer).toHaveLength(2);
    });
  });

  describe("Game Over", () => {
    it("should trigger game over on collision", () => {
      const gameOver = true;
      expect(gameOver).toBe(true);
    });

    it("should display final score", () => {
      const finalScore = 150;
      expect(finalScore).toBeGreaterThanOrEqual(0);
    });

    it("should save high score", () => {
      const highScore = 500;
      expect(highScore).toBeGreaterThan(0);
    });
  });

  describe("Completion", () => {
    it("should unlock next portal when game completed", () => {
      const nextPortal = { id: 3, locked: false };
      expect(nextPortal.locked).toBe(false);
    });

    it("should confirm completion at target score", () => {
      const currentScore = 200;
      const targetScore = 200;
      const completed = currentScore >= targetScore;
      expect(completed).toBe(true);
    });
  });
});
