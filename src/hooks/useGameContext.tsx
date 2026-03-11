import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export const useGameContext = () => {
  const value = useContext(GameContext);

  if (!value) throw new Error("Game context should initialized");

  return value;
};
