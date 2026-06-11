/**
 * Tetris Minigame Component
 * Portal 1 - Victory at 5000 points
 * Board: 10x20 grid, 7 tetrominós, rotation, line clearing
 * Scoring: 100 (1 line) | 300 (2 lines) | 500 (3 lines) | 400 (4 lines/Tetris)
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { COLOR_PALETTE } from "../../types/game";

type Tetromino = {
  x: number;
  y: number;
  shape: number[][];
  type: number;
};

interface TetrisProps {
  onComplete: (score: number) => void;
  onExit?: () => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 16;
const VICTORY_SCORE = 5000;
const GAME_SPEED = 500; // ms per drop

// All 7 tetrominós (simpler shape format)
const TETROMINOES = [
  // I
  [[1, 1, 1, 1]],
  // O
  [
    [1, 1],
    [1, 1],
  ],
  // T
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  // Z
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  // J
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  // L
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
];

const TETROMINO_COLORS = [
  COLOR_PALETTE.neonBlue, // I
  COLOR_PALETTE.accentYellow, // O
  COLOR_PALETTE.electricPurple, // T
  COLOR_PALETTE.neonGreen, // S
  COLOR_PALETTE.neonRed, // Z
  COLOR_PALETTE.neonBlue, // J
  "#ffaa00", // L - Orange
];

function createNewPiece(): Tetromino {
  const type = Math.floor(Math.random() * TETROMINOES.length);
  return {
    x: Math.floor(BOARD_WIDTH / 2) - 2,
    y: 0,
    shape: TETROMINOES[type],
    type,
  };
}

export const Tetris: React.FC<TetrisProps> = ({ onComplete, onExit }) => {
  const [board, setBoard] = useState<number[][]>(() =>
    Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(0)),
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentPiece, setCurrentPiece] = useState<Tetromino>(() =>
    createNewPiece(),
  );
  const [nextPiece, setNextPiece] = useState<Tetromino>(() => createNewPiece());
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Rotate shape 90 degrees clockwise
  const rotateShape = useCallback((shape: number[][]): number[][] => {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated: number[][] = [];

    for (let j = 0; j < cols; j++) {
      const newRow: number[] = [];
      for (let i = rows - 1; i >= 0; i--) {
        newRow.push(shape[i][j]);
      }
      rotated.push(newRow);
    }

    return rotated;
  }, []);

  // Check if piece can move to position
  const canMove = useCallback(
    (
      piece: Tetromino,
      dx: number,
      dy: number,
      checkBoard: number[][],
    ): boolean => {
      const newX = piece.x + dx;
      const newY = piece.y + dy;

      for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
          if (piece.shape[row][col]) {
            const boardX = newX + col;
            const boardY = newY + row;

            if (
              boardX < 0 ||
              boardX >= BOARD_WIDTH ||
              boardY >= BOARD_HEIGHT ||
              (boardY >= 0 && checkBoard[boardY]?.[boardX] !== 0)
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [],
  );

  // Place piece on board and return cleared lines
  const placePiece = useCallback(
    (piece: Tetromino, checkBoard: number[][]): [number[][], number] => {
      const newBoard = checkBoard.map((row) => [...row]);

      // Mark pieces on board with their type (1-7)
      for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
          if (piece.shape[row][col]) {
            const boardY = piece.y + row;
            const boardX = piece.x + col;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              newBoard[boardY][boardX] = piece.type + 1;
            }
          }
        }
      }

      // Clear full lines
      let linesCleared = 0;
      for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
        if (newBoard[row].every((cell) => cell !== 0)) {
          newBoard.splice(row, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(0));
          linesCleared++;
          row++; // Check this row again
        }
      }

      return [newBoard, linesCleared];
    },
    [],
  );

  // Calculate score based on lines cleared
  const getLineScore = (lines: number): number => {
    switch (lines) {
      case 1:
        return 100;
      case 2:
        return 300;
      case 3:
        return 500;
      case 4:
        return 400; // Tetris bonus
      default:
        return 0;
    }
  };

  // Handle piece movement
  const moveLeft = useCallback(() => {
    setCurrentPiece((piece) => {
      return canMove(piece, -1, 0, board)
        ? { ...piece, x: piece.x - 1 }
        : piece;
    });
  }, [board, canMove]);

  const moveRight = useCallback(() => {
    setCurrentPiece((piece) => {
      return canMove(piece, 1, 0, board) ? { ...piece, x: piece.x + 1 } : piece;
    });
  }, [board, canMove]);

  const hardDrop = useCallback(() => {
    setCurrentPiece((piece) => {
      let newPiece = { ...piece };
      while (canMove(newPiece, 0, 1, board)) {
        newPiece.y += 1;
      }
      return newPiece;
    });
  }, [board, canMove]);

  const rotatePiece = useCallback(() => {
    setCurrentPiece((piece) => {
      const rotated = rotateShape(piece.shape);
      const testPiece = { ...piece, shape: rotated };
      return canMove(testPiece, 0, 0, board) ? testPiece : piece;
    });
  }, [board, canMove, rotateShape]);

  // Game loop
  useEffect(() => {
    if (gameOver || gameWon) return;

    gameLoopRef.current = setInterval(() => {
      setCurrentPiece((piece) => {
        if (canMove(piece, 0, 1, board)) {
          return { ...piece, y: piece.y + 1 };
        } else {
          // Place piece
          const [newBoard, lines] = placePiece(piece, board);
          setBoard(newBoard);

          const points = getLineScore(lines);
          setScore((s) => {
            const newScore = s + points;
            if (newScore >= VICTORY_SCORE && !gameWon) {
              setGameWon(true);
            }
            return newScore;
          });

          // Spawn next piece
          const newPiece = nextPiece;
          setNextPiece(createNewPiece());

          // Check game over (piece can't spawn)
          if (!canMove(newPiece, 0, 0, newBoard)) {
            setGameOver(true);
            return piece;
          }

          return newPiece;
        }
      });
    }, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver, gameWon, board, canMove, placePiece, nextPiece]);

  // Victory check
  useEffect(() => {
    if (score >= VICTORY_SCORE && !gameWon) {
      setGameWon(true);
      setGameOver(true);
    }
  }, [score, gameWon]);

  // Keyboard controls
  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "arrowleft" || key === "a") {
        e.preventDefault();
        moveLeft();
      } else if (key === "arrowright" || key === "d") {
        e.preventDefault();
        moveRight();
      } else if (key === "arrowdown" || key === "s") {
        e.preventDefault();
        hardDrop();
      } else if (key === " ") {
        e.preventDefault();
        rotatePiece();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, moveLeft, moveRight, hardDrop, rotatePiece]);

  // Touch controls
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || gameOver) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - touchStartRef.current.x;
      const deltaY = endY - touchStartRef.current.y;

      const threshold = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX < -threshold) moveLeft();
        else if (deltaX > threshold) moveRight();
      } else {
        // Vertical swipe
        if (deltaY > threshold) hardDrop();
        else if (deltaY < -threshold) rotatePiece();
      }

      touchStartRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameOver, moveLeft, moveRight, hardDrop, rotatePiece]);

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
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <h2 style={{ color: COLOR_PALETTE.neonRed, margin: 0, fontSize: "28px" }}>
        TETRIS
      </h2>

      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
        {/* Main game board */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${BLOCK_SIZE}px)`,
            gap: "1px",
            backgroundColor: COLOR_PALETTE.darkGray || "#1a1f3a",
            border: `3px solid ${COLOR_PALETTE.neonBlue}`,
            boxShadow: `0 0 20px ${COLOR_PALETTE.neonBlue}`,
            padding: "2px",
          }}
        >
          {board.map((row, y) =>
            row.map((cell, x) => {
              // Check if current piece occupies this cell
              const isPiece =
                currentPiece &&
                x >= currentPiece.x &&
                x < currentPiece.x + currentPiece.shape[0].length &&
                y >= currentPiece.y &&
                y < currentPiece.y + currentPiece.shape.length &&
                currentPiece.shape[y - currentPiece.y]?.[x - currentPiece.x] ===
                  1;

              const cellType = isPiece ? currentPiece.type : cell - 1;
              const backgroundColor =
                isPiece || cell !== 0
                  ? TETROMINO_COLORS[cellType] || COLOR_PALETTE.neonGreen
                  : COLOR_PALETTE.deepBlack;

              return (
                <div
                  key={`${x}-${y}`}
                  style={{
                    width: `${BLOCK_SIZE}px`,
                    height: `${BLOCK_SIZE}px`,
                    backgroundColor,
                    border: `1px solid ${
                      isPiece || cell !== 0
                        ? COLOR_PALETTE.neonGreen
                        : COLOR_PALETTE.darkGray
                    }`,
                  }}
                />
              );
            }),
          )}
        </div>

        {/* Side panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            color: COLOR_PALETTE.neonBlue,
            fontSize: "14px",
          }}
        >
          {/* Score */}
          <div
            style={{
              border: `2px solid ${COLOR_PALETTE.neonBlue}`,
              padding: "10px",
              textAlign: "center",
              backgroundColor: COLOR_PALETTE.deepBlack,
            }}
          >
            <div style={{ marginBottom: "5px" }}>SCORE</div>
            <div
              style={{ fontSize: "20px", color: COLOR_PALETTE.accentYellow }}
            >
              {score}
            </div>
            <div style={{ marginTop: "10px", fontSize: "10px" }}>
              Goal: {VICTORY_SCORE}
            </div>
          </div>

          {/* Next piece preview */}
          <div
            style={{
              border: `2px solid ${COLOR_PALETTE.neonBlue}`,
              padding: "10px",
              textAlign: "center",
              backgroundColor: COLOR_PALETTE.deepBlack,
            }}
          >
            <div style={{ marginBottom: "10px" }}>NEXT</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 20px)",
                gap: "2px",
              }}
            >
              {Array(16)
                .fill(0)
                .map((_, i) => {
                  const x = i % 4;
                  const y = Math.floor(i / 4);
                  const hasBlock =
                    y < nextPiece.shape.length &&
                    x < nextPiece.shape[y].length &&
                    nextPiece.shape[y][x] === 1;
                  return (
                    <div
                      key={i}
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: hasBlock
                          ? TETROMINO_COLORS[nextPiece.type]
                          : COLOR_PALETTE.deepBlack,
                        border: `1px solid ${COLOR_PALETTE.neonBlue}`,
                      }}
                    />
                  );
                })}
            </div>
          </div>

          {/* Status */}
          <div
            style={{
              textAlign: "center",
              padding: "10px",
              border: `2px solid ${COLOR_PALETTE.neonGreen}`,
              backgroundColor: COLOR_PALETTE.deepBlack,
              color: gameWon
                ? COLOR_PALETTE.accentYellow
                : gameOver
                  ? COLOR_PALETTE.neonRed
                  : COLOR_PALETTE.neonGreen,
              fontSize: "12px",
            }}
          >
            {gameWon ? "🎉 VICTORY! 🎉" : gameOver ? "GAME OVER" : "PLAYING..."}
          </div>
        </div>
      </div>

      {/* Controls info */}
      <div
        style={{
          fontSize: "11px",
          textAlign: "center",
          color: COLOR_PALETTE.neonBlue,
          marginTop: "10px",
        }}
      >
        <div>⬅️ ➡️ MOVE | ⬇️ DROP | SPACE ROTATE</div>
        <div style={{ marginTop: "5px", fontSize: "10px" }}>
          or SWIPE on mobile
        </div>
      </div>

      {/* Exit button */}
      <button
        onClick={() => {
          if (gameLoopRef.current) clearInterval(gameLoopRef.current);
          if (gameWon) onComplete(score);
          onExit?.();
        }}
        disabled={!gameOver}
        style={{
          padding: "12px 24px",
          backgroundColor: gameOver
            ? COLOR_PALETTE.neonRed
            : COLOR_PALETTE.darkGray,
          color: COLOR_PALETTE.deepBlack,
          border: "none",
          cursor: gameOver ? "pointer" : "not-allowed",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "12px",
          opacity: gameOver ? 1 : 0.5,
          transition: "all 0.2s",
        }}
      >
        {gameWon ? "NEXT PORTAL ✓" : "EXIT"}
      </button>
    </div>
  );
};
