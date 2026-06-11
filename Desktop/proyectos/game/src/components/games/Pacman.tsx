/**
 * Pac-Man Minigame Component (Come Cocos)
 * Portal 3 - Victory: Collect all 240 pellets
 * Board: 21x21 maze, 4 ghosts with AI, power-pellets, collision detection
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { COLOR_PALETTE } from "../../types/game";

interface PacmanProps {
  onComplete: (score: number) => void;
  onExit?: () => void;
}

interface Ghost {
  id: number;
  x: number;
  y: number;
  color: string;
  eaten: boolean;
}

interface PowerMode {
  active: boolean;
  frames: number;
}

const BOARD_SIZE = 21;
const BLOCK_SIZE = 16;
const PELLET_VALUE = 10;
const POWER_PELLET_VALUE = 50;
const POWER_DURATION = 300;

// Create simple maze (1 = wall, 0 = path)
const createMaze = (): number[][] => {
  const maze = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(0));

  // Add border walls
  for (let i = 0; i < BOARD_SIZE; i++) {
    maze[0][i] = 1;
    maze[BOARD_SIZE - 1][i] = 1;
    maze[i][0] = 1;
    maze[i][BOARD_SIZE - 1] = 1;
  }

  // Add some internal walls
  for (let i = 3; i < BOARD_SIZE - 3; i++) {
    if (i % 4 === 0) {
      maze[5][i] = 1;
      maze[15][i] = 1;
    }
  }

  for (let i = 3; i < BOARD_SIZE - 3; i++) {
    if (i % 5 === 0) {
      maze[i][5] = 1;
      maze[i][15] = 1;
    }
  }

  return maze;
};

// Create pellet grid (true = has pellet)
const createPellets = (maze: number[][]): boolean[][] => {
  const pellets = Array(BOARD_SIZE)
    .fill(null)
    .map((_, y) =>
      Array(BOARD_SIZE)
        .fill(null)
        .map((_, x) => maze[y][x] === 0),
    );

  // Clear some pellets near starting position
  pellets[10][10] = false;
  pellets[10][9] = false;
  pellets[10][11] = false;
  pellets[9][10] = false;
  pellets[11][10] = false;

  return pellets;
};

export const Pacman: React.FC<PacmanProps> = ({ onComplete, onExit }) => {
  const [maze, setMaze] = useState<number[][]>([]);
  const [pacman, setPacman] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState<string>("right");
  const [nextDirection, setNextDirection] = useState<string>("right");
  const [pellets, setPellets] = useState<boolean[][]>([]);
  const [powerPellets, setPowerPellets] = useState([
    { x: 1, y: 1 },
    { x: 19, y: 1 },
    { x: 1, y: 19 },
    { x: 19, y: 19 },
  ]);
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { id: 1, x: 9, y: 9, color: "red", eaten: false },
    { id: 2, x: 11, y: 9, color: "pink", eaten: false },
    { id: 3, x: 9, y: 11, color: "cyan", eaten: false },
    { id: 4, x: 11, y: 11, color: "orange", eaten: false },
  ]);
  const [score, setScore] = useState(0);
  const [pelletsEaten, setPelletsEaten] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [powerMode, setPowerMode] = useState<PowerMode>({
    active: false,
    frames: 0,
  });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize game
  useEffect(() => {
    const newMaze = createMaze();
    setMaze(newMaze);
    setPellets(createPellets(newMaze));
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver || pelletsEaten >= 240) return;
    if (maze.length === 0) return;

    const interval = setInterval(() => {
      // Update power mode
      setPowerMode((prev) => {
        if (!prev.active) return prev;
        const newFrames = prev.frames + 1;
        if (newFrames >= POWER_DURATION) {
          return { active: false, frames: 0 };
        }
        return { active: true, frames: newFrames };
      });

      // Move Pac-Man
      setPacman((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        switch (nextDirection) {
          case "up":
            newY = (prev.y - 1 + BOARD_SIZE) % BOARD_SIZE;
            break;
          case "down":
            newY = (prev.y + 1) % BOARD_SIZE;
            break;
          case "left":
            newX = (prev.x - 1 + BOARD_SIZE) % BOARD_SIZE;
            break;
          case "right":
            newX = (prev.x + 1) % BOARD_SIZE;
            break;
        }

        // Check wall collision
        if (maze[newY] && maze[newY][newX] === 1) {
          return prev;
        }

        setDirection(nextDirection);
        return { x: newX, y: newY };
      });

      // Move ghosts
      setGhosts((prevGhosts) =>
        prevGhosts.map((ghost) => {
          if (ghost.eaten && powerMode.active) {
            // Reset ghost after being eaten
            return {
              ...ghost,
              x: 9 + (ghost.id % 2) * 2,
              y: 9 + Math.floor(ghost.id / 2) * 2,
              eaten: false,
            };
          }

          // Simple AI: move in random valid direction
          const directions = ["up", "down", "left", "right"];
          let newX = ghost.x;
          let newY = ghost.y;
          let validMove = false;

          while (directions.length > 0 && !validMove) {
            const idx = Math.floor(Math.random() * directions.length);
            const dir = directions[idx];
            let testX = ghost.x;
            let testY = ghost.y;

            switch (dir) {
              case "up":
                testY = (ghost.y - 1 + BOARD_SIZE) % BOARD_SIZE;
                break;
              case "down":
                testY = (ghost.y + 1) % BOARD_SIZE;
                break;
              case "left":
                testX = (ghost.x - 1 + BOARD_SIZE) % BOARD_SIZE;
                break;
              case "right":
                testX = (ghost.x + 1) % BOARD_SIZE;
                break;
            }

            if (maze[testY] && maze[testY][testX] !== 1) {
              newX = testX;
              newY = testY;
              validMove = true;
            }

            directions.splice(idx, 1);
          }

          return { ...ghost, x: newX, y: newY };
        }),
      );
    }, 200);

    return () => clearInterval(interval);
  }, [gameOver, nextDirection, maze, powerMode.active, pelletsEaten]);

  // Check collisions
  useEffect(() => {
    if (maze.length === 0) return;

    // Check pellet collision
    if (pellets[pacman.y] && pellets[pacman.y][pacman.x]) {
      setPellets((prev) => {
        const newPellets = prev.map((row) => [...row]);
        newPellets[pacman.y][pacman.x] = false;
        return newPellets;
      });
      setScore((s) => s + PELLET_VALUE);
      setPelletsEaten((p) => p + 1);
    }

    // Check power pellet collision
    setPowerPellets((prev) => {
      const powerIdx = prev.findIndex(
        (p) => p.x === pacman.x && p.y === pacman.y,
      );
      if (powerIdx >= 0) {
        setScore((s) => s + POWER_PELLET_VALUE);
        setPowerMode({ active: true, frames: 0 });
        return prev.filter((_, idx) => idx !== powerIdx);
      }
      return prev;
    });

    // Check ghost collision
    ghosts.forEach((ghost) => {
      if (ghost.x === pacman.x && ghost.y === pacman.y) {
        if (powerMode.active) {
          // Eat ghost
          setScore((s) => s + 200 * Math.pow(2, ghost.id - 1));
          setGhosts((prev) =>
            prev.map((g) => (g.id === ghost.id ? { ...g, eaten: true } : g)),
          );
        } else {
          // Game over
          setGameOver(true);
        }
      }
    });
  }, [pacman, pellets, powerMode.active, ghosts]);

  // Check victory
  useEffect(() => {
    if (pelletsEaten >= 240) {
      setGameOver(true);
      onComplete(score);
    }
  }, [pelletsEaten, score, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          e.preventDefault();
          setNextDirection("up");
          break;
        case "arrowdown":
        case "s":
          e.preventDefault();
          setNextDirection("down");
          break;
        case "arrowleft":
        case "a":
          e.preventDefault();
          setNextDirection("left");
          break;
        case "arrowright":
        case "d":
          e.preventDefault();
          setNextDirection("right");
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
        setNextDirection(deltaX > 0 ? "right" : "left");
      } else {
        setNextDirection(deltaY > 0 ? "down" : "up");
      }
    }

    touchStartRef.current = null;
  };

  const handleExit = () => {
    onExit?.();
  };

  if (maze.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: COLOR_PALETTE.deepBlack,
          color: COLOR_PALETTE.neonGreen,
        }}
      >
        Loading...
      </div>
    );
  }

  const ghostColors: Record<string, string> = {
    red: COLOR_PALETTE.neonRed,
    pink: "#ff69b4",
    cyan: COLOR_PALETTE.neonBlue,
    orange: COLOR_PALETTE.accentYellow,
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
      <h2 style={{ color: COLOR_PALETTE.neonRed, margin: 0 }}>COME COCOS</h2>

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
                const isPacman = pacman.x === x && pacman.y === y;
                const isGhost = ghosts.some((g) => g.x === x && g.y === y);
                const ghostHere = ghosts.find((g) => g.x === x && g.y === y);
                const isWall = maze[y][x] === 1;
                const hasPellet = pellets[y] && pellets[y][x];
                const hasPowerPellet = powerPellets.some(
                  (p) => p.x === x && p.y === y,
                );

                let backgroundColor = COLOR_PALETTE.deepBlack;
                let borderColor = COLOR_PALETTE.neonBlue;
                let content = "";

                if (isWall) {
                  backgroundColor = COLOR_PALETTE.darkGray;
                  borderColor = COLOR_PALETTE.neonBlue;
                } else if (isPacman) {
                  backgroundColor = COLOR_PALETTE.accentYellow;
                  content = "●";
                } else if (isGhost) {
                  backgroundColor = ghostHere
                    ? ghostColors[ghostHere.color]
                    : COLOR_PALETTE.neonRed;
                  content = "◆";
                } else if (hasPowerPellet) {
                  backgroundColor = COLOR_PALETTE.neonRed;
                  content = "◉";
                } else if (hasPellet) {
                  content = "·";
                }

                return (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      width: `${BLOCK_SIZE}px`,
                      height: `${BLOCK_SIZE}px`,
                      backgroundColor,
                      border: `1px solid ${borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      color: COLOR_PALETTE.neonGreen,
                      opacity:
                        hasPellet || hasPowerPellet || isPacman || isGhost
                          ? 1
                          : 0.8,
                    }}
                  >
                    {content}
                  </div>
                );
              }),
          )}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ color: COLOR_PALETTE.neonBlue, marginBottom: "10px" }}>
          Score: {score} | Pellets: {pelletsEaten} / 240
          {powerMode.active && (
            <div style={{ color: COLOR_PALETTE.neonRed }}>
              POWER MODE! {Math.floor((POWER_DURATION - powerMode.frames) / 10)}
              s
            </div>
          )}
        </div>
        <div style={{ fontSize: "12px", color: COLOR_PALETTE.neonGreen }}>
          {pelletsEaten >= 240
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
