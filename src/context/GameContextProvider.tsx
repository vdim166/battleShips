import { useState } from "react";
import {
  GAME_STATES,
  GameContext,
  IN_GAME_STATES,
  type GameContextType,
} from "./GameContext";

type GameContextProviderProps = {
  children: React.ReactNode;
};

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const [gameState, setGameState] = useState<keyof typeof GAME_STATES>(
    GAME_STATES.MENU,
  );

  const [inGameState, setInGameState] = useState<keyof typeof IN_GAME_STATES>(
    IN_GAME_STATES.PLANING,
  );

  const value: GameContextType = {
    gameState,
    setGameState,
    inGameState,
    setInGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
