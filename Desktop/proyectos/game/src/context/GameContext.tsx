/**
 * Game Context
 * Provides global game state to all components
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { GameSaveData, SessionMetadata } from "../types/game";
import { gameStateManager } from "../utils/gameState";

interface GameContextType {
  gameState: GameSaveData | null;
  session: SessionMetadata | null;
  isLoading: boolean;
  saveGame: (state: GameSaveData) => void;
  updatePortalScore: (portalId: number, score: number) => void;
  completePortal: (portalId: number, score: number) => void;
  updatePortalData: (portalId: number, data: any) => void;
  getCurrentGame: () => GameSaveData;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameSaveData | null>(null);
  const [session, setSession] = useState<SessionMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize game on mount
  useEffect(() => {
    const initializeGame = () => {
      try {
        // Load game state
        const savedState = gameStateManager.load();
        setGameState(savedState);

        // Load or create session
        let sessionData = gameStateManager.loadSession();
        if (!sessionData) {
          sessionData = gameStateManager.createSessionMetadata(
            savedState.session_id,
          );
          gameStateManager.saveSession(sessionData);
        }
        setSession(sessionData);

        // Update playtime on session start
        if (!savedState.stats.session_start) {
          savedState.stats.session_start = new Date().toISOString();
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize game:", error);
        setIsLoading(false);
      }
    };

    initializeGame();

    // Setup auto-save interval (5 seconds)
    const autoSaveInterval = setInterval(() => {
      setGameState((current) => {
        if (current) {
          gameStateManager.save(current);
        }
        return current;
      });
    }, 5000);

    // Setup before-unload handler
    const handleBeforeUnload = () => {
      setGameState((current) => {
        if (current) {
          gameStateManager.save(current);
        }
        return current;
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(autoSaveInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const saveGame = useCallback((state: GameSaveData) => {
    gameStateManager.save(state);
    setGameState(state);
  }, []);

  const updatePortalScore = useCallback((portalId: number, score: number) => {
    setGameState((current) => {
      if (!current) return current;
      const updated = gameStateManager.updatePortalScore(
        current,
        portalId,
        score,
      );
      gameStateManager.save(updated);
      return updated;
    });
  }, []);

  const completePortal = useCallback((portalId: number, score: number) => {
    setGameState((current) => {
      if (!current) return current;
      const updated = gameStateManager.completePortal(current, portalId, score);
      gameStateManager.save(updated);
      return updated;
    });
  }, []);

  const updatePortalData = useCallback((portalId: number, data: any) => {
    setGameState((current) => {
      if (!current) return current;
      const updated = gameStateManager.updatePortalData(
        current,
        portalId,
        data,
      );
      gameStateManager.save(updated);
      return updated;
    });
  }, []);

  const getCurrentGame = useCallback(() => {
    return gameState || gameStateManager.createInitialState();
  }, [gameState]);

  const value: GameContextType = {
    gameState,
    session,
    isLoading,
    saveGame,
    updatePortalScore,
    completePortal,
    updatePortalData,
    getCurrentGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};
