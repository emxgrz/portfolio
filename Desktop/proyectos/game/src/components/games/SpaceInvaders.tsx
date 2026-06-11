/**
 * Space Invaders Minigame Component
 * Portal 4 - Victory: Destroy all 24 enemies
 * Canvas: 300×400, 3x8 enemy formation, lives system, shooting mechanics
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { COLOR_PALETTE } from "../../types/game";

interface SpaceInvadersProps {
  onComplete: (score: number) => void;
  onExit?: () => void;
}

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "player" | "enemy";
  id?: number;
}

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const PLAYER_SPEED = 8;
const ENEMY_WIDTH = 25;
const ENEMY_HEIGHT = 20;
const BULLET_WIDTH = 2;
const BULLET_HEIGHT = 10;
const PLAYER_BULLET_SPEED = 7;
const ENEMY_BULLET_SPEED = 4;
const INITIAL_LIVES = 3;

export const SpaceInvaders: React.FC<SpaceInvadersProps> = ({
  onComplete,
  onExit,
}) => {
  const [player, setPlayer] = useState<Player>({
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - 40,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  });

  const [enemies, setEnemies] = useState<Enemy[]>(() => {
    const enemies: Enemy[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        enemies.push({
          id: row * 8 + col,
          x: col * 30 + 20,
          y: row * 30 + 20,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
        });
      }
    }
    return enemies;
  });

  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [enemyDirection, setEnemyDirection] = useState(1);
  const keysPressed = useRef<Record<string, boolean>>({});
  const bulletIdRef = useRef(0);
  const enemyBulletIdRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      if (e.key === " " || e.key.toLowerCase() === "w") {
        e.preventDefault();
        shootBullet();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const shootBullet = useCallback(() => {
    setBullets((prev) => [
      ...prev,
      {
        x: player.x + player.width / 2 - BULLET_WIDTH / 2,
        y: player.y - BULLET_HEIGHT,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        type: "player",
        id: bulletIdRef.current++,
      },
    ]);
  }, [player]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      // Move player
      setPlayer((prev) => {
        let newX = prev.x;

        if (keysPressed.current["arrowleft"] || keysPressed.current["a"]) {
          newX = Math.max(0, prev.x - PLAYER_SPEED);
        }
        if (keysPressed.current["arrowright"] || keysPressed.current["d"]) {
          newX = Math.min(CANVAS_WIDTH - prev.width, prev.x + PLAYER_SPEED);
        }

        return { ...prev, x: newX };
      });

      // Move and check player bullets
      setBullets((prev) => {
        let newBullets = prev.map((b) => ({
          ...b,
          y: b.y - PLAYER_BULLET_SPEED,
        }));
        newBullets = newBullets.filter((b) => b.y > 0);
        return newBullets;
      });

      // Move and check enemy bullets
      setEnemyBullets((prev) => {
        let newBullets = prev.map((b) => ({
          ...b,
          y: b.y + ENEMY_BULLET_SPEED,
        }));
        newBullets = newBullets.filter((b) => b.y < CANVAS_HEIGHT);
        return newBullets;
      });

      // Move enemies
      setEnemies((prev) => {
        let allEnemies = prev.map((e) => ({
          ...e,
          x: e.x + enemyDirection * 2,
        }));

        // Check if enemies reached edge
        const needsToDescend = allEnemies.some((e) => {
          return e.x <= 0 || e.x + e.width >= CANVAS_WIDTH;
        });

        if (needsToDescend) {
          setEnemyDirection((prev) => -prev);
          allEnemies = allEnemies.map((e) => ({
            ...e,
            y: e.y + 10,
          }));

          // Check if enemies reached bottom
          if (allEnemies.some((e) => e.y + e.height >= CANVAS_HEIGHT)) {
            setGameOver(true);
          }
        }

        return allEnemies;
      });

      // Enemy shooting
      if (Math.random() < 0.02 && enemies.length > 0) {
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        setEnemyBullets((prev) => [
          ...prev,
          {
            x: randomEnemy.x + randomEnemy.width / 2 - BULLET_WIDTH / 2,
            y: randomEnemy.y + randomEnemy.height,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT,
            type: "enemy",
            id: enemyBulletIdRef.current++,
          },
        ]);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver, enemies, enemyDirection]);

  // Collision detection
  useEffect(() => {
    // Player bullet vs enemies
    setBullets((prevBullets) => {
      let remainingBullets = prevBullets;
      let hitEnemies: number[] = [];

      remainingBullets.forEach((bullet) => {
        setEnemies((prevEnemies) => {
          const newEnemies = prevEnemies.filter((enemy) => {
            const collision =
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y;

            if (collision) {
              hitEnemies.push(bullet.id!);
              setScore((s) => s + 10);
              return false;
            }
            return true;
          });

          // Check victory
          if (newEnemies.length === 0) {
            setGameOver(true);
            // Bonus for last enemy
            setScore((s) => s + 40);
          }

          return newEnemies;
        });
      });

      return prevBullets.filter((b) => !hitEnemies.includes(b.id!));
    });

    // Enemy bullets vs player
    setEnemyBullets((prevBullets) => {
      let hitPlayer = false;
      const remainingBullets = prevBullets.filter((bullet) => {
        const collision =
          bullet.x > player.x &&
          bullet.x < player.x + player.width &&
          bullet.y > player.y &&
          bullet.y < player.y + player.height;

        if (collision) {
          hitPlayer = true;
          return false;
        }
        return true;
      });

      if (hitPlayer) {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
          }
          return newLives;
        });
      }

      return remainingBullets;
    });
  }, [player]);

  // Check game completion
  useEffect(() => {
    if (gameOver && enemies.length === 0) {
      onComplete(score);
    }
  }, [gameOver, enemies.length, score, onComplete]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const threshold = 30;

    if (Math.abs(deltaY) < threshold) {
      // Horizontal swipe = move
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          keysPressed.current["arrowright"] = true;
        } else {
          keysPressed.current["arrowleft"] = true;
        }
      }
    } else if (deltaY < -threshold) {
      // Upward swipe = shoot
      shootBullet();
    }

    touchStartRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touchStartRef.current) return;

    const deltaX = touch.clientX - touchStartRef.current.x;
    if (Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        keysPressed.current["arrowright"] = true;
        keysPressed.current["arrowleft"] = false;
      } else {
        keysPressed.current["arrowleft"] = true;
        keysPressed.current["arrowright"] = false;
      }
    }
  };

  const handleExit = () => {
    onExit?.();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
        backgroundColor: COLOR_PALETTE.deepBlack,
        color: COLOR_PALETTE.neonGreen,
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <h2 style={{ color: COLOR_PALETTE.neonRed, margin: 0 }}>
        SPACE INVADERS
      </h2>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        style={{
          position: "relative",
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          backgroundColor: COLOR_PALETTE.deepBlack,
          border: `2px solid ${COLOR_PALETTE.neonGreen}`,
          boxShadow: `0 0 20px ${COLOR_PALETTE.neonGreen}`,
          overflow: "hidden",
          touchAction: "none",
        }}
      >
        {/* Player */}
        <div
          style={{
            position: "absolute",
            left: `${player.x}px`,
            top: `${player.y}px`,
            width: `${player.width}px`,
            height: `${player.height}px`,
            backgroundColor: COLOR_PALETTE.neonGreen,
            boxShadow: `0 0 10px ${COLOR_PALETTE.neonGreen}`,
          }}
        />

        {/* Enemies */}
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            style={{
              position: "absolute",
              left: `${enemy.x}px`,
              top: `${enemy.y}px`,
              width: `${enemy.width}px`,
              height: `${enemy.height}px`,
              backgroundColor: COLOR_PALETTE.neonRed,
              boxShadow: `0 0 5px ${COLOR_PALETTE.neonRed}`,
            }}
          />
        ))}

        {/* Player bullets */}
        {bullets.map((bullet) => (
          <div
            key={`pb-${bullet.id}`}
            style={{
              position: "absolute",
              left: `${bullet.x}px`,
              top: `${bullet.y}px`,
              width: `${bullet.width}px`,
              height: `${bullet.height}px`,
              backgroundColor: COLOR_PALETTE.neonGreen,
              boxShadow: `0 0 3px ${COLOR_PALETTE.neonGreen}`,
            }}
          />
        ))}

        {/* Enemy bullets */}
        {enemyBullets.map((bullet) => (
          <div
            key={`eb-${bullet.id}`}
            style={{
              position: "absolute",
              left: `${bullet.x}px`,
              top: `${bullet.y}px`,
              width: `${bullet.width}px`,
              height: `${bullet.height}px`,
              backgroundColor: COLOR_PALETTE.neonRed,
              boxShadow: `0 0 3px ${COLOR_PALETTE.neonRed}`,
            }}
          />
        ))}

        {/* Game Over overlay */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLOR_PALETTE.neonRed,
              fontSize: "24px",
            }}
          >
            {enemies.length === 0 ? "VICTORY!" : "GAME OVER"}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ color: COLOR_PALETTE.neonBlue, marginBottom: "10px" }}>
          Score: {score} | Lives: {lives} | Enemies: {enemies.length} / 24
        </div>
        <div style={{ fontSize: "12px", color: COLOR_PALETTE.neonGreen }}>
          {enemies.length === 0 && gameOver
            ? "VICTORY!"
            : gameOver
              ? "GAME OVER"
              : "PLAYING..."}
        </div>
      </div>

      <div
        style={{
          fontSize: "10px",
          textAlign: "center",
          color: COLOR_PALETTE.neonBlue,
        }}
      >
        <div>ARROWS to move | SPACE or W to shoot</div>
        <div>Swipe/tap on screen</div>
      </div>

      <button
        onClick={handleExit}
        style={{
          padding: "10px 20px",
          backgroundColor: COLOR_PALETTE.neonRed,
          color: COLOR_PALETTE.deepBlack,
          border: "none",
          cursor: "pointer",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "12px",
        }}
      >
        EXIT
      </button>
    </div>
  );
};
