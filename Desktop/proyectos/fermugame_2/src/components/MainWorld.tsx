/**
 * Main World Component
 * The pharmacy map where the protagonist explores
 * Contains: farmacia environment, protagonist, 5 portals, D-pad controls
 */

import React, { useState, useCallback, useEffect } from "react";
import { useGame } from "../context/GameContext";
import {
  COLOR_PALETTE,
  MAIN_WORLD,
  PROTAGONIST,
  PortalState,
} from "../types/game";
import { Protagonist } from "./Protagonist";
import { Portal } from "./Portal";
import { DPad } from "./DPad";

// Portal positions in the farmacia (x, y in grid units)
const PORTAL_POSITIONS = [
  { x: 5, y: 2 }, // Portal 1 - Tetris
  { x: 15, y: 2 }, // Portal 2 - Snake
  { x: 10, y: 7 }, // Portal 3 - Pac-Man (center)
  { x: 2, y: 12 }, // Portal 4 - Space Invaders
  { x: 18, y: 12 }, // Portal 5 - Puzzle
];

interface MainWorldProps {
  onPortalInteract?: (portalId: number) => void;
}

export const MainWorld: React.FC<MainWorldProps> = ({ onPortalInteract }) => {
  const { gameState } = useGame();
  const [protagonistX, setProtagonistX] = useState(PROTAGONIST.startX);
  const [protagonistY, setProtagonistY] = useState(PROTAGONIST.startY);
  const [proximityPortal, setProximityPortal] = useState<number | null>(null);

  // Handle protagonist movement
  const moveProtagonist = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      setProtagonistX((x) => {
        let newX = x;
        if (direction === "left") newX = Math.max(0, x - PROTAGONIST.speed);
        if (direction === "right")
          newX = Math.min(MAIN_WORLD.width / 16 - 1, x + PROTAGONIST.speed);
        return newX;
      });

      setProtagonistY((y) => {
        let newY = y;
        if (direction === "up") newY = Math.max(0, y - PROTAGONIST.speed);
        if (direction === "down")
          newY = Math.min(MAIN_WORLD.height / 16 - 1, y + PROTAGONIST.speed);
        return newY;
      });
    },
    [],
  );

  // Check proximity to portals and trigger interaction if close
  useEffect(() => {
    if (!gameState) return;

    for (let i = 0; i < PORTAL_POSITIONS.length; i++) {
      const portal = PORTAL_POSITIONS[i];
      const distance = Math.sqrt(
        Math.pow(protagonistX - portal.x, 2) +
          Math.pow(protagonistY - portal.y, 2),
      );

      if (distance < 2) {
        // Proximity threshold
        const portalId = i + 1;
        setProximityPortal(portalId);

        // Auto-trigger interaction if portal is unlocked
        if (
          gameState.portals[portalId - 1] &&
          !gameState.portals[portalId - 1].locked
        ) {
          // Portal is accessible
        }
        break;
      } else {
        setProximityPortal(null);
      }
    }
  }, [protagonistX, protagonistY, gameState]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") {
        e.preventDefault();
        moveProtagonist("up");
      } else if (key === "arrowdown" || key === "s") {
        e.preventDefault();
        moveProtagonist("down");
      } else if (key === "arrowleft" || key === "a") {
        e.preventDefault();
        moveProtagonist("left");
      } else if (key === "arrowright" || key === "d") {
        e.preventDefault();
        moveProtagonist("right");
      }

      // Interact with portal on Enter or Space
      if ((key === "enter" || key === " ") && proximityPortal) {
        e.preventDefault();
        onPortalInteract?.(proximityPortal);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveProtagonist, proximityPortal, onPortalInteract]);

  if (!gameState) {
    return (
      <div style={{ padding: "20px", color: COLOR_PALETTE.neonGreen }}>
        Loading...
      </div>
    );
  }

  const gameWidth = MAIN_WORLD.width;
  const gameHeight = MAIN_WORLD.height;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        padding: "20px",
        backgroundColor: COLOR_PALETTE.deepBlack,
        minHeight: "100vh",
      }}
    >
      {/* Game world container */}
      <div
        style={{
          position: "relative",
          width: `${gameWidth}px`,
          height: `${gameHeight}px`,
          backgroundColor: COLOR_PALETTE.deepBlack,
          border: `2px solid ${COLOR_PALETTE.neonBlue}`,
          boxShadow: `0 0 20px ${COLOR_PALETTE.neonBlue}`,
          overflow: "hidden",
        }}
      >
        {/* Protagonist */}
        <Protagonist x={protagonistX} y={protagonistY} />

        {/* Portals */}
        {gameState.portals.map((portal: PortalState, index: number) => (
          <Portal
            key={portal.id}
            id={portal.id}
            x={PORTAL_POSITIONS[index].x}
            y={PORTAL_POSITIONS[index].y}
            locked={portal.locked}
            completed={portal.completed}
            score={portal.score}
            target={
              portal.id === 5
                ? -1 // Puzzle has no score target
                : [5000, 200, 240, 24][portal.id - 1] || 0
            }
            onInteract={() => {
              if (!portal.locked) {
                onPortalInteract?.(portal.id);
              }
            }}
          />
        ))}

        {/* Proximity indicator */}
        {proximityPortal && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: COLOR_PALETTE.neonGreen,
              color: COLOR_PALETTE.deepBlack,
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: "bold",
              animation: "blink 0.5s infinite",
            }}
          >
            PRESS ENTER TO ENTER
          </div>
        )}
      </div>

      {/* Controls section */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {/* D-Pad */}
        <DPad onMove={moveProtagonist} />

        {/* Status info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            color: COLOR_PALETTE.neonGreen,
            fontSize: "12px",
          }}
        >
          <div>
            Position: ({protagonistX}, {protagonistY})
          </div>
          <div>
            Portals:{" "}
            {gameState.portals.filter((p: PortalState) => p.completed).length}/5
          </div>
          <div>Score: {gameState.statistics.total_score}</div>
          <div>
            Progress: {Math.round(gameState.statistics.completion_percentage)}%
          </div>
        </div>
      </div>

      {/* Keyboard controls hint */}
      <div
        style={{
          textAlign: "center",
          color: COLOR_PALETTE.neonBlue,
          fontSize: "10px",
          marginTop: "10px",
        }}
      >
        <div>Use ARROW KEYS or WASD to move</div>
        <div>Press ENTER or SPACE near a portal to enter</div>
      </div>
    </div>
  );
};
