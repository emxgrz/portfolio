/**
 * Snake Minigame Component
 * Portal 2 - Victory at 200 points (20 foods × 10 pts)
 * Board: 20x20 grid, food system, collision detection
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { COLOR_PALETTE } from "../../types/game";

interface SnakeProps {
  onComplete: (score: number) => void;
  onExit?: () => void;
}

const BOARD_SIZE = 20;
const BLOCK_SIZE = 16;
const FOOD_VALUE = 10;
const VICTORY_SCORE = 200;

type Direction = "up" | "down" | "left" | "right";

export const Snake: React.FC<SnakeProps> = ({ onComplete, onExit }) => {
  const [snake, setSnake] = useState<[number, number][]>([
    [10, 10],
    [9, 10],
    [8, 10],
  ]);
  const [direction, setDirection] = useState<Direction>("right");
  const [nextDirection, setNextDirection] = useState<Direction>("right");
  const [food, setFood] = useState<[number, number]>([15, 15]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [foodEaten, setFoodEaten] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Generate random food position
  const generateFood = useCallback(
    (currentSnake: [number, number][]): [number, number] => {
      let x, y, valid;
      do {
        x = Math.floor(Math.random() * BOARD_SIZE);
        y = Math.floor(Math.random() * BOARD_SIZE);
        valid = !currentSnake.some(([sx, sy]) => sx === x && sy === y);
      } while (!valid);
      return [x, y];
    },
    [],
  );

  // Game loop
  useEffect(() => {
    if (gameOver || score >= VICTORY_SCORE) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        setDirection(nextDirection);

        const head = prevSnake[0];
        let newHead: [number, number];

        switch (nextDirection) {
          case "up":
            newHead = [head[0], (head[1] - 1 + BOARD_SIZE) % BOARD_SIZE];
            break;
          case "down":
            newHead = [head[0], (head[1] + 1) % BOARD_SIZE];
            break;
          case "left":
            newHead = [(head[0] - 1 + BOARD_SIZE) % BOARD_SIZE, head[1]];
            break;
          case "right":
            newHead = [(head[0] + 1) % BOARD_SIZE, head[1]];
            break;
        }

        // Check collision with self
        if (prevSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
          setGameOver(true);
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore((s) => s + FOOD_VALUE);
          setFoodEaten((f) => f + 1);
          setFood(generateFood(newSnake));
        } else {
          newSnake = newSnake.slice(0, -1);
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameOver, score, food, generateFood]);

  // Check victory
  useEffect(() => {
    if (score >= VICTORY_SCORE) {
      setGameOver(true);
      onComplete(score);
    }
  }, [score, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          e.preventDefault();
          setNextDirection((d) => (d !== "down" ? "up" : d));
          break;
        case "arrowdown":
        case "s":
          e.preventDefault();
          setNextDirection((d) => (d !== "up" ? "down" : d));
          break;
        case "arrowleft":
        case "a":
          e.preventDefault();
          setNextDirection((d) => (d !== "right" ? "left" : d));
          break;
        case "arrowright":
        case "d":
          e.preventDefault();
          setNextDirection((d) => (d !== "left" ? "right" : d));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

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

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          setNextDirection((d) => (d !== "left" ? "right" : d));
        } else {
          setNextDirection((d) => (d !== "right" ? "left" : d));
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          setNextDirection((d) => (d !== "up" ? "down" : d));
        } else {
          setNextDirection((d) => (d !== "down" ? "up" : d));
        }
      }
    }

    touchStartRef.current = null;
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
      <h2 style={{ color: COLOR_PALETTE.neonRed, margin: 0 }}>SNAKE</h2>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${BLOCK_SIZE}px)`,
          gap: "0px",
          backgroundColor: COLOR_PALETTE.deepBlack,
          border: `2px solid ${COLOR_PALETTE.neonBlue}`,
          boxShadow: `0 0 20px ${COLOR_PALETTE.neonBlue}`,
          touchAction: "none",
        }}
      >
        {Array(BOARD_SIZE)
          .fill(null)
          .map((_, y) =>
            Array(BOARD_SIZE)
              .fill(null)
              .map((_, x) => {
                const isSnakeHead =
                  snake.length > 0 && snake[0][0] === x && snake[0][1] === y;
                const isSnakeBody = snake.some(
                  ([sx, sy]) => sx === x && sy === y,
                );
                const isFood = food[0] === x && food[1] === y;

                let color = COLOR_PALETTE.deepBlack;
                if (isFood) color = COLOR_PALETTE.neonRed;
                else if (isSnakeHead) color = COLOR_PALETTE.neonGreen;
                else if (isSnakeBody) color = COLOR_PALETTE.neonGreen;

                return (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      width: `${BLOCK_SIZE}px`,
                      height: `${BLOCK_SIZE}px`,
                      backgroundColor: color,
                      border: `1px solid ${COLOR_PALETTE.neonBlue}`,
                      opacity: isSnakeHead ? 1 : 0.8,
                    }}
                  />
                );
              }),
          )}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ color: COLOR_PALETTE.neonBlue, marginBottom: "10px" }}>
          Score: {score} / {VICTORY_SCORE} | Food: {foodEaten}
        </div>
        <div style={{ fontSize: "12px", color: COLOR_PALETTE.neonGreen }}>
          {score >= VICTORY_SCORE
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
        <div>WASD or ARROWS to move</div>
        <div>Swipe to move on touch</div>
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
