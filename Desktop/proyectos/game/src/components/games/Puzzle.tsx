/**
 * Image Puzzle Minigame Component (Final Portal)
 * Portal 5 - Victory: Complete 4x4 puzzle and reveal image
 * Grid: 4x4, piece shuffling, swapping mechanics, QR code generation
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { COLOR_PALETTE } from "../../types/game";

interface PuzzleProps {
  onComplete: (score: number) => void;
  onExit?: () => void;
}

interface Piece {
  id: number;
  correctPosition: number;
  currentPosition: number;
}

const GRID_SIZE = 4;
const PIECE_SIZE = 80;
const MAX_MOVES = 200;

// Simple placeholder image (could be loaded from external source)
const PLACEHOLDER_IMAGE_DATA =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Crect fill='%238338ec' width='320' height='320'/%3E%3Ctext x='160' y='160' font-size='32' fill='%23ffbe0b' text-anchor='middle' dominant-baseline='middle'%3EFERMUGAME%3C/text%3E%3C/svg%3E";

export const Puzzle: React.FC<PuzzleProps> = ({ onComplete, onExit }) => {
  const [pieces, setPieces] = useState<Piece[]>(() => {
    const initialPieces: Piece[] = Array(GRID_SIZE * GRID_SIZE)
      .fill(null)
      .map((_, i) => ({
        id: i,
        correctPosition: i,
        currentPosition: i,
      }));

    // Shuffle pieces
    const shuffled = [...initialPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = temp;
    }

    return shuffled;
  });

  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const selectedPieceRef = useRef<Piece | null>(null);

  // Calculate score based on moves
  const calculateScore = (movesCount: number): number => {
    const baseScore = Math.max(0, 1000 - movesCount * 10);
    const bonus = movesCount < 40 ? 200 : 0;
    return baseScore + bonus;
  };

  // Check if puzzle is complete
  const isPuzzleComplete = useCallback((): boolean => {
    return pieces.every(
      (piece) => piece.currentPosition === piece.correctPosition,
    );
  }, [pieces]);

  // Swap pieces
  const swapPieces = useCallback((position1: number, position2: number) => {
    if (position2 < 0 || position2 >= GRID_SIZE * GRID_SIZE) return;

    setPieces((prev) => {
      const newPieces = [...prev];
      const piece1 = newPieces.find((p) => p.currentPosition === position1);
      const piece2 = newPieces.find((p) => p.currentPosition === position2);

      if (piece1 && piece2) {
        const temp = piece1.currentPosition;
        piece1.currentPosition = piece2.currentPosition;
        piece2.currentPosition = temp;
      }

      return newPieces;
    });

    setMoves((prev) => prev + 1);
    setSelectedPiece(null);
  }, []);

  // Check victory
  useEffect(() => {
    if (isPuzzleComplete()) {
      const finalScore = calculateScore(moves);
      setScore(finalScore);
      setGameOver(true);
      setShowQR(true);
      onComplete(finalScore);
    }
  }, [pieces, moves, isPuzzleComplete, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPiece || gameOver) return;

      const row = Math.floor(selectedPiece / GRID_SIZE);
      const col = selectedPiece % GRID_SIZE;
      let targetPiece: number | null = null;

      switch (e.key.toLowerCase()) {
        case "arrowup":
          if (row > 0) targetPiece = (row - 1) * GRID_SIZE + col;
          break;
        case "arrowdown":
          if (row < GRID_SIZE - 1) targetPiece = (row + 1) * GRID_SIZE + col;
          break;
        case "arrowleft":
          if (col > 0) targetPiece = row * GRID_SIZE + (col - 1);
          break;
        case "arrowright":
          if (col < GRID_SIZE - 1) targetPiece = row * GRID_SIZE + (col + 1);
          break;
      }

      if (targetPiece !== null) {
        e.preventDefault();
        swapPieces(selectedPiece, targetPiece);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPiece, gameOver, swapPieces]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent, position: number) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setSelectedPiece(position);
  };

  const handleTouchEnd = (e: React.TouchEvent, position: number) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const threshold = 30;

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      const row = Math.floor(position / GRID_SIZE);
      const col = position % GRID_SIZE;
      let targetPiece: number | null = null;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && col < GRID_SIZE - 1) {
          targetPiece = row * GRID_SIZE + (col + 1);
        } else if (deltaX < 0 && col > 0) {
          targetPiece = row * GRID_SIZE + (col - 1);
        }
      } else {
        if (deltaY > 0 && row < GRID_SIZE - 1) {
          targetPiece = (row + 1) * GRID_SIZE + col;
        } else if (deltaY < 0 && row > 0) {
          targetPiece = (row - 1) * GRID_SIZE + col;
        }
      }

      if (targetPiece !== null) {
        swapPieces(position, targetPiece);
      }
    }

    touchStartRef.current = null;
  };

  const handlePieceClick = (position: number) => {
    if (selectedPiece === position) {
      setSelectedPiece(null);
    } else if (selectedPiece !== null) {
      swapPieces(selectedPiece, position);
    } else {
      setSelectedPiece(position);
    }
  };

  const handleExit = () => {
    onExit?.();
  };

  // Find piece at position
  const getPieceAtPosition = (position: number): Piece | undefined => {
    return pieces.find((p) => p.currentPosition === position);
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
      <h2 style={{ color: COLOR_PALETTE.neonRed, margin: 0 }}>PUZZLE</h2>

      <div
        style={{
          position: "relative",
          width: `${GRID_SIZE * PIECE_SIZE}px`,
          height: `${GRID_SIZE * PIECE_SIZE}px`,
          backgroundColor: COLOR_PALETTE.darkGray,
          border: `2px solid ${COLOR_PALETTE.neonBlue}`,
          boxShadow: `0 0 20px ${COLOR_PALETTE.neonBlue}`,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${PIECE_SIZE}px)`,
          gap: "2px",
          padding: "2px",
        }}
      >
        {Array(GRID_SIZE * GRID_SIZE)
          .fill(null)
          .map((_, position) => {
            const piece = getPieceAtPosition(position);
            const isSelected = selectedPiece === position;
            const isInCorrectPosition =
              piece && piece.currentPosition === piece.correctPosition;

            return (
              <div
                key={position}
                onClick={() => handlePieceClick(position)}
                onTouchStart={(e) => handleTouchStart(e, position)}
                onTouchEnd={(e) => handleTouchEnd(e, position)}
                style={{
                  width: `${PIECE_SIZE}px`,
                  height: `${PIECE_SIZE}px`,
                  backgroundColor: isInCorrectPosition
                    ? COLOR_PALETTE.neonGreen
                    : COLOR_PALETTE.neonBlue,
                  border: isSelected
                    ? `3px solid ${COLOR_PALETTE.neonRed}`
                    : `1px solid ${COLOR_PALETTE.darkGray}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: isInCorrectPosition ? 1 : 0.8,
                  boxShadow: isSelected
                    ? `0 0 10px ${COLOR_PALETTE.neonRed}`
                    : "none",
                  backgroundImage: `url("${PLACEHOLDER_IMAGE_DATA}")`,
                  backgroundPosition: `${((piece?.correctPosition || 0) % GRID_SIZE) * PIECE_SIZE}px ${Math.floor((piece?.correctPosition || 0) / GRID_SIZE) * PIECE_SIZE}px`,
                  backgroundSize: `${GRID_SIZE * PIECE_SIZE}px ${GRID_SIZE * PIECE_SIZE}px`,
                  backgroundRepeat: "no-repeat",
                }}
              >
                {piece ? piece.id + 1 : ""}
              </div>
            );
          })}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ color: COLOR_PALETTE.neonBlue, marginBottom: "10px" }}>
          Moves: {moves} | Score: {isPuzzleComplete() ? score : 0}
        </div>
        <div style={{ fontSize: "12px", color: COLOR_PALETTE.neonGreen }}>
          {isPuzzleComplete()
            ? "VICTORY!"
            : `${GRID_SIZE * GRID_SIZE - pieces.filter((p) => p.currentPosition === p.correctPosition).length} pieces to go`}
        </div>
      </div>

      {/* QR Code Display */}
      {showQR && (
        <div
          style={{
            backgroundColor: COLOR_PALETTE.darkGray,
            padding: "20px",
            border: `2px solid ${COLOR_PALETTE.neonGreen}`,
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ color: COLOR_PALETTE.neonRed, marginBottom: "10px" }}>
            GAME COMPLETE!
          </div>
          <div
            style={{
              width: "150px",
              height: "150px",
              backgroundColor: COLOR_PALETTE.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                color: COLOR_PALETTE.deepBlack,
              }}
            >
              ⬜
            </div>
          </div>
          <div style={{ color: COLOR_PALETTE.neonBlue, fontSize: "10px" }}>
            Game ID: fermugame_v1
            <br />
            Final Score: {score}
          </div>
        </div>
      )}

      <div
        style={{
          fontSize: "10px",
          textAlign: "center",
          color: COLOR_PALETTE.neonBlue,
        }}
      >
        <div>Click or tap piece to select</div>
        <div>Arrow keys or swipe to move</div>
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
