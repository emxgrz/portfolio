/**
 * Portal Component
 * Displays individual portals with locked/unlocked state
 * Each portal leads to a different minigame
 */

import React from "react";
import { COLOR_PALETTE, PORTAL_NAMES } from "../types/game";

interface PortalProps {
  id: number;
  x: number;
  y: number;
  locked: boolean;
  completed: boolean;
  score: number;
  target: number;
  onInteract?: () => void;
}

export const Portal: React.FC<PortalProps> = ({
  id,
  x,
  y,
  locked,
  completed,
  score,
  target,
  onInteract,
}) => {
  const pixelX = x * 16;
  const pixelY = y * 16;

  // Determine portal color based on state
  let frameColor = COLOR_PALETTE.neonBlue;
  if (locked) {
    frameColor = COLOR_PALETTE.deepBlack; // Dark when locked
  } else if (completed) {
    frameColor = COLOR_PALETTE.neonGreen; // Green when completed
  }

  const portalName = PORTAL_NAMES[id as keyof typeof PORTAL_NAMES] || "Portal";

  // Portal icons based on minigame type
  const portalIcons: Record<number, string> = {
    1: "■", // Tetris - square
    2: "◉", // Snake - circle
    3: "●", // Pac-Man - filled circle
    4: "★", // Space Invaders - star
    5: "◆", // Puzzle - diamond
  };

  const icon = portalIcons[id] || "?";

  return (
    <div
      style={{
        position: "absolute",
        left: `${pixelX}px`,
        top: `${pixelY}px`,
        width: "48px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: locked ? "not-allowed" : "pointer",
        opacity: locked ? 0.5 : 1,
      }}
      onClick={!locked ? onInteract : undefined}
      role='button'
      tabIndex={locked ? -1 : 0}
      aria-label={`${portalName} Portal - ${locked ? "Locked" : "Unlocked"}`}
    >
      {/* Portal frame */}
      <div
        style={{
          width: "40px",
          height: "40px",
          border: `3px solid ${frameColor}`,
          backgroundColor: COLOR_PALETTE.deepBlack,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 0 10px ${frameColor}`,
        }}
      >
        {/* Lock overlay for locked portals */}
        {locked && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <span
              style={{
                color: COLOR_PALETTE.neonRed,
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              🔒
            </span>
          </div>
        )}

        {/* Portal icon */}
        <span
          style={{
            color: frameColor,
            fontSize: "24px",
            fontWeight: "bold",
            textShadow: `0 0 8px ${frameColor}`,
          }}
        >
          {icon}
        </span>
      </div>

      {/* Portal label and progress */}
      {!locked && (
        <div
          style={{
            marginTop: "4px",
            textAlign: "center",
            fontSize: "8px",
            color: COLOR_PALETTE.neonBlue,
          }}
        >
          <div style={{ fontWeight: "bold" }}>{portalName}</div>
          {!completed && target > 0 && (
            <div style={{ fontSize: "6px", color: COLOR_PALETTE.neonGreen }}>
              {score}/{target}
            </div>
          )}
          {completed && (
            <div style={{ color: COLOR_PALETTE.neonGreen }}>✓ DONE</div>
          )}
        </div>
      )}
    </div>
  );
};
