/**
 * Protagonist Component
 * Main character in the pharmacy
 * 16x16 pixel sprite: boy with square glasses and black hair
 */

import React from "react";
import { COLOR_PALETTE } from "../types/game";

interface ProtagonistProps {
  x: number;
  y: number;
}

export const Protagonist: React.FC<ProtagonistProps> = ({ x, y }) => {
  // Calculate pixel position (each grid unit is 16px)
  const pixelX = x * 16;
  const pixelY = y * 16;

  return (
    <div
      style={{
        position: "absolute",
        left: `${pixelX}px`,
        top: `${pixelY}px`,
        width: "16px",
        height: "16px",
        imageRendering: "pixelated",
        imageRendering: "crisp-edges",
        transition: "left 0.1s, top 0.1s",
      }}
    >
      {/* Simple pixel art boy */}
      <svg width='16' height='16' viewBox='0 0 16 16'>
        {/* Hair (black) */}
        <rect x='3' y='1' width='10' height='4' fill={COLOR_PALETTE.black} />

        {/* Face (flesh tone) */}
        <rect x='4' y='5' width='8' height='5' fill='#ffdbac' />

        {/* Left eye */}
        <rect x='5' y='6' width='1' height='2' fill={COLOR_PALETTE.black} />
        {/* Left eye glass */}
        <rect
          x='4'
          y='5'
          width='3'
          height='3'
          fill='none'
          stroke={COLOR_PALETTE.black}
          strokeWidth='0.5'
        />

        {/* Right eye */}
        <rect x='10' y='6' width='1' height='2' fill={COLOR_PALETTE.black} />
        {/* Right eye glass */}
        <rect
          x='9'
          y='5'
          width='3'
          height='3'
          fill='none'
          stroke={COLOR_PALETTE.black}
          strokeWidth='0.5'
        />

        {/* Mouth */}
        <line
          x1='6'
          y1='11'
          x2='10'
          y2='11'
          stroke={COLOR_PALETTE.black}
          strokeWidth='0.5'
        />

        {/* Shirt (neon blue) */}
        <rect
          x='3'
          y='10'
          width='10'
          height='6'
          fill={COLOR_PALETTE.neonBlue}
        />

        {/* Arms */}
        <rect x='1' y='11' width='2' height='4' fill='#ffdbac' />
        <rect x='13' y='11' width='2' height='4' fill='#ffdbac' />

        {/* Legs (black pants) */}
        <rect x='5' y='16' width='2' height='1' fill={COLOR_PALETTE.black} />
        <rect x='9' y='16' width='2' height='1' fill={COLOR_PALETTE.black} />
      </svg>
    </div>
  );
};
