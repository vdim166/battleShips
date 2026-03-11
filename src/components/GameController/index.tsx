import { GAME_STATES } from "../../context/GameContext";
import { useGameContext } from "../../hooks/useGameContext";
import { GameComponent } from "../GameComponent";
import { MenuComponent } from "../MenuComponent";

export const GameController = () => {
  const { gameState } = useGameContext();

  if (gameState === GAME_STATES.MENU) {
    return <MenuComponent />;
  }

  if (gameState === GAME_STATES.GAME) {
    return <GameComponent />;
  }
};
