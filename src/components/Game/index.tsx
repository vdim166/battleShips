import { GameContextProvider } from "../../context/GameContextProvider";
import { GameController } from "../GameController";

export const Game = () => {
  return (
    <GameContextProvider>
      <GameController />
    </GameContextProvider>
  );
};
