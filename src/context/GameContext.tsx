import { createContext } from "react";

export const GAME_STATES = { MENU: "MENU", GAME: "GAME" } as const;

export const IN_GAME_STATES = {
  PLANING: "PLANING",
  PLAYING: "PLAYING",
} as const;

export type GameContextType = {
  gameState: keyof typeof GAME_STATES;
  setGameState: React.Dispatch<React.SetStateAction<keyof typeof GAME_STATES>>;

  inGameState: keyof typeof IN_GAME_STATES;

  setInGameState: React.Dispatch<
    React.SetStateAction<keyof typeof IN_GAME_STATES>
  >;
};

const init: GameContextType = {
  gameState: GAME_STATES.MENU,
  setGameState: () => {},

  inGameState: IN_GAME_STATES.PLANING,
  setInGameState: () => {},
};

export const GameContext = createContext<GameContextType>(init);
