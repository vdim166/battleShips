import { createContext } from "react";
import type { cellShipType } from "../components/PlaningGameComponent";

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

  gameCells: (null | cellShipType)[][] | null;
  setGameCells: React.Dispatch<
    React.SetStateAction<(null | cellShipType)[][] | null>
  >;
};

const init: GameContextType = {
  gameState: GAME_STATES.MENU,
  setGameState: () => {},

  inGameState: IN_GAME_STATES.PLANING,
  setInGameState: () => {},

  gameCells: null,
  setGameCells: () => {},
};

export const GameContext = createContext<GameContextType>(init);
