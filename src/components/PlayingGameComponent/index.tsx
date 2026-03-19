import { useEffect, useState } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { generateRandomShips } from "../../utils/generateRandomShips";
import { SHIP_TYPES } from "../types/SHIP_TYPES";
import "./styles.css";
import { Cross } from "../../svgs/Cross";
import type { ROTATION_STATES } from "../types/ROTATION_STATES";
import { Bomb } from "../../svgs/Bomb";
import {
  getShipCells,
  getShipLength,
  getSurroundingCells,
} from "../../utils/checkIfShipCanBePlaced";
import { calculateMove } from "../../utils/calculateMove";
import { GAME_STATES } from "../../context/GameContext";

const TURN_STATES = { YOU: "YOU", ENEMY: "ENEMY" } as const;

export type cellShipDetailsType = {
  showCell: boolean;
  isDead?: boolean;

  shipType?: keyof typeof SHIP_TYPES;
  parts?: [number, number][];
  rotation?: keyof typeof ROTATION_STATES;
};

type rotationDecisionType = {
  decision: keyof typeof ROTATION_STATES | null;
};

const GAME_OVER_STATES = {
  YOU_WON: "YOU_WON",
  ENEMY_WON: "ENEMY_WON",
} as const;

export const PlayingGameComponent = () => {
  const { gameCells, setGameState } = useGameContext();

  const [playerCells, setPlayerCells] = useState<
    (cellShipDetailsType & rotationDecisionType)[][] | null
  >(null);

  useEffect(() => {
    if (!gameCells) return;

    const newCells: (cellShipDetailsType & rotationDecisionType)[][] = [];

    for (let i = 0; i < gameCells.length; ++i) {
      newCells[i] = [];
      for (let j = 0; j < gameCells[i].length; ++j) {
        if (gameCells[i][j] === null) {
          newCells[i].push({
            showCell: false,
            decision: null,
          });
        } else {
          newCells[i].push({
            shipType: gameCells[i][j]!.shipType,
            isDead: false,
            showCell: false,
            parts: gameCells[i][j]!.parts,
            rotation: gameCells[i][j]!.rotation,
            decision: null,
          });
        }
      }
    }

    setPlayerCells(newCells);
  }, [gameCells]);

  const [turn, setTurn] = useState<keyof typeof TURN_STATES>(TURN_STATES.YOU);

  const [enemyCells, setEnemyCells] = useState<cellShipDetailsType[][]>([]);

  const [isCreatingEnemyCells, setIsCreatingEnemyCells] = useState(true);

  const [isHovering, setIsHovering] = useState<string | null>(null);

  const [isGameOver, setIsGameOver] = useState<
    keyof typeof GAME_OVER_STATES | null
  >(null);

  const [destroyedEnemyShips, setDestroyedEnemyShips] = useState({
    [SHIP_TYPES.FOUR]: 1,
    [SHIP_TYPES.THREE]: 2,
    [SHIP_TYPES.TWO]: 3,
    [SHIP_TYPES.ONE]: 4,
  });

  const [destroyedPlayerShips, setDestroyedPlayerShips] = useState({
    [SHIP_TYPES.FOUR]: 1,
    [SHIP_TYPES.THREE]: 2,
    [SHIP_TYPES.TWO]: 3,
    [SHIP_TYPES.ONE]: 4,
  });

  const checkGameOver = () => {
    let youWon = true;
    const keys = [
      SHIP_TYPES.FOUR,
      SHIP_TYPES.THREE,
      SHIP_TYPES.TWO,
      SHIP_TYPES.ONE,
    ];

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i] as keyof typeof SHIP_TYPES;

      if (destroyedEnemyShips[key] !== 0) {
        youWon = false;
        break;
      }
    }

    if (youWon) {
      setIsGameOver(GAME_OVER_STATES.YOU_WON);
      return;
    }

    let enemyWon = true;

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i] as keyof typeof SHIP_TYPES;

      if (destroyedPlayerShips[key] !== 0) {
        enemyWon = false;
        break;
      }
    }

    if (enemyWon) {
      setIsGameOver(GAME_OVER_STATES.ENEMY_WON);
      return;
    }
  };

  useEffect(() => {
    checkGameOver();
  }, [destroyedEnemyShips, destroyedPlayerShips]);

  useEffect(() => {
    const createEnemyCells = () => {
      const ships = generateRandomShips();

      const newCells: cellShipDetailsType[][] = [];

      for (let i = 0; i < ships.length; ++i) {
        newCells[i] = [];
        for (let j = 0; j < ships[i].length; ++j) {
          if (ships[i][j] === null) {
            newCells[i].push({
              showCell: false,
            });
          } else {
            newCells[i].push({
              shipType: ships[i][j]!.shipType,
              isDead: false,
              showCell: false,
              parts: ships[i][j]!.parts,
              rotation: ships[i][j]!.rotation,
            });
          }
        }
      }
      setEnemyCells(newCells);
      setIsCreatingEnemyCells(false);
    };

    createEnemyCells();
  }, []);

  useEffect(() => {
    if (isGameOver !== null) return;

    if (!playerCells) return;
    if (turn !== TURN_STATES.ENEMY) return;

    const enemyStrikeHandle = () => {
      const { points, cells } = calculateMove(playerCells);

      const [row, cell] = points;

      const newCells = [...cells];

      newCells[row][cell].showCell = true;

      if (newCells[row][cell].shipType) {
        const deadStatus = checkIfShipDestroyed(row, cell, newCells);

        if (
          deadStatus &&
          newCells[row][cell].parts &&
          newCells[row][cell].rotation
        ) {
          for (let i = 0; i < newCells[row][cell].parts.length; ++i) {
            const [rowIndex, cellIndex] = newCells[row][cell].parts[i];

            newCells[rowIndex][cellIndex].isDead = true;
          }
          const shipLength = getShipLength(newCells[row][cell].shipType);
          const parts = newCells[row][cell].parts!;

          const shipCells = getShipCells(
            parts[0][0],
            parts[0][1],
            shipLength,
            newCells[row][cell].rotation,
          );

          const surroundingCells = getSurroundingCells(shipCells, newCells);

          for (const cellId of surroundingCells) {
            const [row, col] = cellId.split(",").map(Number);

            newCells[row][col].showCell = true;
          }

          const shipType = newCells[row][cell].shipType;
          setDestroyedPlayerShips((prev) => {
            const newState = { ...prev };

            newState[shipType] -= 1;

            return newState;
          });
        }

        setPlayerCells(newCells);

        return;
      } else {
        setPlayerCells(newCells);
      }

      setTurn(TURN_STATES.YOU);
    };

    enemyStrikeHandle();
  }, [turn, playerCells, isGameOver]);

  if (isCreatingEnemyCells) {
    return <div>Creating enemy grid</div>;
  }

  if (!playerCells) return;

  const checkIfShipDestroyed = (
    rowIndex: number,
    cellIndex: number,
    cells: cellShipDetailsType[][],
  ) => {
    if (!cells[rowIndex][cellIndex]) return false;
    if (!cells[rowIndex][cellIndex].parts) return false;

    let result = true;

    for (const [row, cell] of cells[rowIndex][cellIndex].parts) {
      if (cells[row][cell].showCell === false) {
        return false;
      }
    }

    return result;
  };

  const handleStrike = (row: number, cell: number) => {
    if (isGameOver !== null) return;
    if (turn !== TURN_STATES.YOU) return;
    if (enemyCells[row][cell].showCell === true) return;

    const newCells = [...enemyCells];

    newCells[row][cell].showCell = true;

    if (newCells[row][cell].shipType) {
      const deadStatus = checkIfShipDestroyed(row, cell, newCells);

      if (
        deadStatus &&
        newCells[row][cell].parts &&
        newCells[row][cell].rotation
      ) {
        for (let i = 0; i < newCells[row][cell].parts.length; ++i) {
          const [rowIndex, cellIndex] = newCells[row][cell].parts[i];

          newCells[rowIndex][cellIndex].isDead = true;
        }
        const shipLength = getShipLength(newCells[row][cell].shipType);

        const parts = newCells[row][cell].parts!;

        const shipCells = getShipCells(
          parts[0][0],
          parts[0][1],
          shipLength,
          newCells[row][cell].rotation,
        );

        const surroundingCells = getSurroundingCells(shipCells, newCells);

        for (const cellId of surroundingCells) {
          const [row, col] = cellId.split(",").map(Number);

          newCells[row][col].showCell = true;
        }

        const shipType = newCells[row][cell].shipType;

        setDestroyedEnemyShips((prev) => {
          const newState = { ...prev };

          newState[shipType] -= 1;

          return newState;
        });
      }

      setEnemyCells(newCells);

      return;
    } else {
      setEnemyCells(newCells);
    }

    setTurn(TURN_STATES.ENEMY);
  };

  const goMenuHandle = () => {
    setGameState(GAME_STATES.MENU);
  };

  return (
    <div className="game-component">
      {isGameOver !== null && (
        <div className="game-end-container">
          <h3>
            GAME OVER .
            {isGameOver === GAME_OVER_STATES.YOU_WON ? "YOU WON" : "ENEMY WON"}
          </h3>

          <button onClick={goMenuHandle}>Menu</button>
        </div>
      )}

      <div>
        <div className="turn-container">Turn: {turn}</div>
        <div className="game-container">
          <div className="planing-game-grid">
            {playerCells.map((rows, rowIndex) => {
              return (
                <div className="planing-game-row" key={`row-${rowIndex}`}>
                  {rows.map((rowValue, cellIndex) => {
                    const rowId = `${rowIndex}-${cellIndex}`;

                    return (
                      <div
                        key={`cell-${rowId}`}
                        className={`cell ${rowValue?.shipType === SHIP_TYPES.ONE ? "shipOne" : ""} ${rowValue?.shipType === SHIP_TYPES.TWO ? "shipTwo" : ""} ${rowValue?.shipType === SHIP_TYPES.THREE ? "shipThree" : ""} ${rowValue?.shipType === SHIP_TYPES.FOUR ? "shipFour" : ""}`}
                      >
                        {!rowValue.isDead &&
                          rowValue.showCell &&
                          rowValue.shipType && (
                            <span className="destroyed-container destroyed-cross">
                              <Cross />
                            </span>
                          )}

                        {rowValue.isDead && rowValue.shipType && (
                          <span className="destroyed-container dead-cross">
                            <Cross />
                          </span>
                        )}

                        {rowValue.showCell && !rowValue.shipType && (
                          <span className="destroyed-container">
                            <Bomb />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div>
            {enemyCells.map((rows, rowIndex) => {
              return (
                <div className="planing-game-row" key={`row-${rowIndex}`}>
                  {rows.map((rowValue, cellIndex) => {
                    const rowId = `${rowIndex}-${cellIndex}`;

                    return (
                      <div
                        key={`cell-${rowId}`}
                        className={`cell playing-cell`}
                        onMouseEnter={() => {
                          setIsHovering(rowId);
                        }}
                        onMouseLeave={() => {
                          setIsHovering(null);
                        }}
                        onClick={() => handleStrike(rowIndex, cellIndex)}
                      >
                        {!rowValue.showCell && rowId === isHovering && (
                          <Cross />
                        )}

                        {!rowValue.isDead &&
                          rowValue.showCell &&
                          rowValue.shipType && (
                            <span className="destroyed-container destroyed-cross">
                              <Cross />
                            </span>
                          )}

                        {rowValue.isDead && rowValue.shipType && (
                          <span className="destroyed-container dead-cross">
                            <Cross />
                          </span>
                        )}

                        {rowValue.showCell && !rowValue.shipType && (
                          <span className="destroyed-container">
                            <Bomb />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
