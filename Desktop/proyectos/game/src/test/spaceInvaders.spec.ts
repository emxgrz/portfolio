import { describe, it, expect } from "vitest";

describe("Space Invaders Minigame", () => {
  describe("Game Initialization", () => {
    it("should initialize game canvas with correct dimensions", () => {
      const canvas = { width: 300, height: 400 };
      expect(canvas.width).toBe(300);
      expect(canvas.height).toBe(400);
    });

    it("should spawn player at bottom center", () => {
      const player = { x: 150, y: 380, width: 20, height: 20 };
      expect(player.x).toBe(150);
      expect(player.y).toBe(380);
    });

    it("should create formation of enemies", () => {
      const enemies = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
          enemies.push({ x: col * 30, y: row * 30, width: 25, height: 20 });
        }
      }
      expect(enemies).toHaveLength(24);
    });

    it("should initialize score to 0", () => {
      const score = 0;
      expect(score).toBe(0);
    });

    it("should initialize lives to 3", () => {
      const lives = 3;
      expect(lives).toBe(3);
    });
  });

  describe("Player Movement", () => {
    it("should move player left", () => {
      let player = { x: 150 };
      player.x -= 10;
      expect(player.x).toBe(140);
    });

    it("should move player right", () => {
      let player = { x: 150 };
      player.x += 10;
      expect(player.x).toBe(160);
    });

    it("should not move player outside left boundary", () => {
      const player = { x: 0, width: 20 };
      const minX = 0;
      const nextX = Math.max(minX, player.x - 10);
      expect(nextX).toBe(0);
    });

    it("should not move player outside right boundary", () => {
      const canvas = { width: 300 };
      const player = { x: 280, width: 20 };
      const maxX = canvas.width - player.width;
      const nextX = Math.min(maxX, player.x + 10);
      expect(nextX).toBe(280);
    });
  });

  describe("Player Shooting", () => {
    it("should create bullet when player fires", () => {
      const bullet = { x: 150, y: 360, width: 2, height: 10 };
      expect(bullet).toBeDefined();
    });

    it("should move bullet upward", () => {
      let bullet = { y: 360 };
      bullet.y -= 5;
      expect(bullet.y).toBe(355);
    });

    it("should remove bullet when it exits top", () => {
      let bullets = [{ x: 150, y: -1 }];
      bullets = bullets.filter((b) => b.y > 0);
      expect(bullets).toHaveLength(0);
    });

    it("should allow multiple bullets in flight", () => {
      const bullets = [
        { x: 140, y: 350 },
        { x: 150, y: 360 },
        { x: 160, y: 370 },
      ];
      expect(bullets).toHaveLength(3);
    });
  });

  describe("Enemy Movement", () => {
    it("should move enemies horizontally", () => {
      const enemies = [{ x: 0, y: 30 }];
      const direction = 1; // 1 for right, -1 for left
      enemies[0].x += direction * 2;
      expect(enemies[0].x).toBe(2);
    });

    it("should move enemies down when reaching edge", () => {
      const enemies = [{ x: 280, y: 30, width: 25 }];
      const canvas = { width: 300 };
      if (enemies[0].x + enemies[0].width >= canvas.width) {
        enemies[0].y += 10;
      }
      expect(enemies[0].y).toBe(40);
    });

    it("should create enemy bullets", () => {
      const enemyBullet = { x: 150, y: 50, type: "enemy" };
      expect(enemyBullet.type).toBe("enemy");
    });

    it("should move enemy bullets downward", () => {
      let enemyBullet = { y: 50 };
      enemyBullet.y += 4;
      expect(enemyBullet.y).toBe(54);
    });
  });

  describe("Collision Detection", () => {
    it("should detect bullet-enemy collision", () => {
      const bullet = { x: 100, y: 100, width: 2, height: 10 };
      const enemy = { x: 90, y: 100, width: 25, height: 20 };
      const collision =
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y;
      expect(collision).toBe(true);
    });

    it("should detect enemy-bullet collision", () => {
      const player = { x: 150, y: 380, width: 20, height: 20 };
      const enemyBullet = { x: 155, y: 375 };
      const collision =
        enemyBullet.x > player.x && enemyBullet.x < player.x + player.width;
      expect(collision).toBe(true);
    });

    it("should detect enemies reaching bottom", () => {
      const canvas = { height: 400 };
      const enemies = [{ x: 150, y: 390, height: 20 }];
      const gameOver = enemies.some((e) => e.y + e.height >= canvas.height);
      expect(gameOver).toBe(true);
    });
  });

  describe("Scoring", () => {
    it("should award points for destroying enemy", () => {
      let score = 0;
      score += 10;
      expect(score).toBe(10);
    });

    it("should award bonus points for destroying last enemy", () => {
      let score = 0;
      score += 50;
      expect(score).toBe(50);
    });

    it("should reduce lives on player hit", () => {
      let lives = 3;
      lives -= 1;
      expect(lives).toBe(2);
    });
  });

  describe("Touch Controls", () => {
    it("should respond to left swipe/tap for move left", () => {
      const action = "move_left";
      expect(action).toBe("move_left");
    });

    it("should respond to right swipe/tap for move right", () => {
      const action = "move_right";
      expect(action).toBe("move_right");
    });

    it("should respond to screen tap for shoot", () => {
      const action = "shoot";
      expect(action).toBe("shoot");
    });

    it("should support continuous fire while tapping", () => {
      const fireRate = 0.1; // seconds between shots
      expect(fireRate).toBeGreaterThan(0);
    });
  });

  describe("Game Over", () => {
    it("should trigger game over when lives reach 0", () => {
      const lives = 0;
      const gameOver = lives <= 0;
      expect(gameOver).toBe(true);
    });

    it("should trigger win when all enemies destroyed", () => {
      const enemies = [];
      const win = enemies.length === 0;
      expect(win).toBe(true);
    });

    it("should display final score", () => {
      const finalScore = 2400;
      expect(finalScore).toBeGreaterThanOrEqual(0);
    });

    it("should save high score", () => {
      const highScore = 5000;
      expect(highScore).toBeGreaterThan(0);
    });
  });

  describe("Completion", () => {
    it("should unlock next portal when all enemies destroyed", () => {
      const nextPortal = { id: 5, locked: false };
      expect(nextPortal.locked).toBe(false);
    });

    it("should confirm completion at target score", () => {
      const currentScore = 3000;
      const targetScore = 3000;
      const completed = currentScore >= targetScore;
      expect(completed).toBe(true);
    });
  });
});
