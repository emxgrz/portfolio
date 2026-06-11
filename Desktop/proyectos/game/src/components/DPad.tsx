/**
 * D-Pad Control Component
 * Virtual touch controls for mobile/desktop
 */

import React, { useCallback } from "react";
import { COLOR_PALETTE } from "../types/game";

interface DPadProps {
  onMove: (direction: "up" | "down" | "left" | "right") => void;
}

export const DPad: React.FC<DPadProps> = ({ onMove }) => {
  const handleMouseDown = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      onMove(direction);
    },
    [onMove],
  );

  const handleTouchStart = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      onMove(direction);
    },
    [onMove],
  );

  const buttonStyle = {
    width: "44px",
    height: "44px",
    border: `2px solid ${COLOR_PALETTE.neonGreen}`,
    backgroundColor: COLOR_PALETTE.deepBlack,
    color: COLOR_PALETTE.neonGreen,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
    userSelect: "none" as const,
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: COLOR_PALETTE.neonGreen,
    color: COLOR_PALETTE.deepBlack,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "10px",
        backgroundColor: COLOR_PALETTE.deepBlack,
        border: `2px solid ${COLOR_PALETTE.neonGreen}`,
        borderRadius: "4px",
        width: "fit-content",
      }}
    >
      {/* Up */}
      <button
        style={buttonStyle}
        onMouseDown={() => handleMouseDown("up")}
        onTouchStart={() => handleTouchStart("up")}
        onTouchEnd={(e) => e.preventDefault()}
        aria-label='Move Up'
      >
        ↑
      </button>

      {/* Left, Center, Right */}
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          style={buttonStyle}
          onMouseDown={() => handleMouseDown("left")}
          onTouchStart={() => handleTouchStart("left")}
          onTouchEnd={(e) => e.preventDefault()}
          aria-label='Move Left'
        >
          ←
        </button>
        <button
          style={{
            ...buttonStyle,
            opacity: 0.3,
            cursor: "default",
          }}
          disabled
          aria-label='Center'
        >
          ◆
        </button>
        <button
          style={buttonStyle}
          onMouseDown={() => handleMouseDown("right")}
          onTouchStart={() => handleTouchStart("right")}
          onTouchEnd={(e) => e.preventDefault()}
          aria-label='Move Right'
        >
          →
        </button>
      </div>

      {/* Down */}
      <button
        style={buttonStyle}
        onMouseDown={() => handleMouseDown("down")}
        onTouchStart={() => handleTouchStart("down")}
        onTouchEnd={(e) => e.preventDefault()}
        aria-label='Move Down'
      >
        ↓
      </button>
    </div>
  );
};
