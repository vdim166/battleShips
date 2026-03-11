import { GAME_STATES, IN_GAME_STATES } from "../../context/GameContext";
import { useGameContext } from "../../hooks/useGameContext";
import "./styles.css";

export const MenuComponent = () => {
  const { setGameState, setInGameState } = useGameContext();

  const startGameHandle = () => {
    setGameState(GAME_STATES.GAME);
    setInGameState(IN_GAME_STATES.PLANING);
  };

  return (
    <div className="menu-component">
      <button className="start-game-button" onClick={startGameHandle}>
        Start
      </button>
    </div>
  );
};
