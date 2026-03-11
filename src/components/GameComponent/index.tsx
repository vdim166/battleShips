import { IN_GAME_STATES } from "../../context/GameContext";
import { useGameContext } from "../../hooks/useGameContext";
import { PlaningGameComponent } from "../PlaningGameComponent";
import { PlayingGameComponent } from "../PlayingGameComponent";

export const GameComponent = () => {
  const { inGameState } = useGameContext();

  if (inGameState === IN_GAME_STATES.PLANING) {
    return <PlaningGameComponent />;
  }

  if (inGameState === IN_GAME_STATES.PLAYING) {
    return <PlayingGameComponent />;
  }
};
