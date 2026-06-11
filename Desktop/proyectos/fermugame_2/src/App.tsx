import React, { Suspense, useState } from "react";
import { GameProvider, useGame } from "./context/GameContext";
import { COLOR_PALETTE } from "./types/game";
import { MainWorld } from "./components/MainWorld";
import { Tetris } from "./components/games/Tetris";
import { Snake } from "./components/games/Snake";
import { Pacman } from "./components/games/Pacman";
import { SpaceInvaders } from "./components/games/SpaceInvaders";
import { Puzzle } from "./components/games/Puzzle";

/**
 * Main Game Content
 */
function GameContent() {
  const { gameState, isLoading, completePortal } = useGame();
  const [currentPortal, setCurrentPortal] = useState<number | null>(null);

  const handlePortalInteract = (portalId: number) => {
    setCurrentPortal(portalId);
  };

  const handleGameComplete = (portalId: number, score: number) => {
    // Mark portal as completed and unlock next
    completePortal(portalId, score);
    setCurrentPortal(null);
  };

  const handleGameExit = () => {
    setCurrentPortal(null);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: COLOR_PALETTE.deepBlack,
          color: COLOR_PALETTE.neonGreen,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "16px",
        }}
      >
        <div>INITIALIZING...</div>
      </div>
    );
  }

  // Show minigame if portal is active
  if (currentPortal === 1) {
    return (
      <Tetris
        onComplete={(score) => handleGameComplete(1, score)}
        onExit={handleGameExit}
      />
    );
  }

  if (currentPortal === 2) {
    return (
      <Snake
        onComplete={(score) => handleGameComplete(2, score)}
        onExit={handleGameExit}
      />
    );
  }

  if (currentPortal === 3) {
    return (
      <Pacman
        onComplete={(score) => handleGameComplete(3, score)}
        onExit={handleGameExit}
      />
    );
  }

  if (currentPortal === 4) {
    return (
      <SpaceInvaders
        onComplete={(score) => handleGameComplete(4, score)}
        onExit={handleGameExit}
      />
    );
  }

  if (currentPortal === 5) {
    return (
      <Puzzle
        onComplete={(score) => handleGameComplete(5, score)}
        onExit={handleGameExit}
      />
    );
  }

  // Show Main World by default
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: COLOR_PALETTE.deepBlack,
        color: COLOR_PALETTE.neonGreen,
        fontFamily: "'Press Start 2P', monospace",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderBottom: `2px solid ${COLOR_PALETTE.neonGreen}`,
          zIndex: 100,
        }}
      >
        <h1
          style={{
            margin: "0 0 10px 0",
            fontSize: "24px",
            color: COLOR_PALETTE.neonRed,
          }}
        >
          FERMUGAME
        </h1>
        {gameState && (
          <p
            style={{
              margin: "0",
              fontSize: "12px",
              color: COLOR_PALETTE.neonBlue,
            }}
          >
            Completion:{" "}
            {Math.round(gameState.stats.completion_percentage).toFixed(0)}% |
            Score: {gameState.stats.total_score}
          </p>
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <MainWorld onPortalInteract={handlePortalInteract} />
      </div>
    </div>
  );
}

/**
 * Main App Component
 */
function App() {
  return (
    <GameProvider>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              backgroundColor: COLOR_PALETTE.deepBlack,
            }}
          />
        }
      >
        <GameContent />
      </Suspense>
    </GameProvider>
  );
}

export default App;
