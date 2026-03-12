import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { useGameContext } from "../../hooks/useGameContext";
import { IN_GAME_STATES } from "../../context/GameContext";
import { checkIfShipCanBePlaced } from "../../utils/checkIfShipCanBePlaced";
import { generateRandomShips } from "../../utils/generateRandomShips";
import { SHIP_TYPES } from "../types/SHIP_TYPES";
import { ROTATION_STATES } from "../types/ROTATION_STATES";

export type cellShipType = {
  shipType: keyof typeof SHIP_TYPES;
  rotation: keyof typeof ROTATION_STATES;
  parts: [number, number][];
};

export const PlaningGameComponent = () => {
  const [isGrabbing, setIsGrabbing] = useState<keyof typeof SHIP_TYPES | null>(
    null,
  );

  const { setInGameState, setGameCells } = useGameContext();

  const [cells, setCells] = useState<(null | cellShipType)[][]>([
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ]);

  const dragGhostRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    dragGhostRef.current = img;
  }, []);

  const [isHoveringOn, setIsHoveringOn] = useState<null | string[]>(null);

  const [rotation, setRotation] = useState<keyof typeof ROTATION_STATES>(
    ROTATION_STATES.HORIZONTAL,
  );

  const [shipCounter, setShipCounter] = useState({
    [SHIP_TYPES.ONE]: 4,
    [SHIP_TYPES.TWO]: 3,
    [SHIP_TYPES.THREE]: 2,
    [SHIP_TYPES.FOUR]: 1,
  });

  const changeRotationHandle = () => {
    if (rotation === ROTATION_STATES.HORIZONTAL) {
      setRotation(ROTATION_STATES.VERTICAL);
    }
    if (rotation === ROTATION_STATES.VERTICAL) {
      setRotation(ROTATION_STATES.HORIZONTAL);
    }
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        changeRotationHandle();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("mousedown", handleMouseDown, { capture: true });
    document.addEventListener("contextmenu", handleContextMenu, {
      capture: true,
    });

    return () => {
      document.removeEventListener("mousedown", handleMouseDown, {
        capture: true,
      });
      document.removeEventListener("contextmenu", handleContextMenu, {
        capture: true,
      });
    };
  }, [rotation]);

  const isAllShipPlaced = () => {
    return Object.keys(shipCounter).every((key) => {
      if (shipCounter[key as keyof typeof SHIP_TYPES] === 0) return true;

      return false;
    });
  };

  const startGameHandle = () => {
    setGameCells(cells);
    setInGameState(IN_GAME_STATES.PLAYING);
  };

  const randomHandle = () => {
    const ships = generateRandomShips();

    setCells(ships);

    setShipCounter({
      FOUR: 0,
      ONE: 0,
      THREE: 0,
      TWO: 0,
    });
  };

  return (
    <div className="planing-game-container">
      <div className="planing-game-grid">
        {cells.map((rows, rowIndex) => {
          return (
            <div className="planing-game-row" key={`row-${rowIndex}`}>
              {rows.map((rowValue, cellIndex) => {
                const rowId = `${rowIndex}-${cellIndex}`;

                return (
                  <div
                    draggable={cells[rowIndex][cellIndex] !== null}
                    key={`cell-${rowId}`}
                    className={`cell ${isHoveringOn?.includes(rowId) ? "isHovering" : ""} ${rowValue?.shipType === SHIP_TYPES.ONE ? "shipOne" : ""} ${rowValue?.shipType === SHIP_TYPES.TWO ? "shipTwo" : ""} ${rowValue?.shipType === SHIP_TYPES.THREE ? "shipThree" : ""} ${rowValue?.shipType === SHIP_TYPES.FOUR ? "shipFour" : ""}`}
                    onDragEnter={() => {
                      if (!isGrabbing) return;

                      const status = checkIfShipCanBePlaced(
                        rowIndex,
                        cellIndex,
                        isGrabbing,
                        rotation,
                        cells,
                      );

                      if (status === null) return;

                      setIsHoveringOn(
                        status.map((cells) => `${cells[0]}-${cells[1]}`),
                      );
                    }}
                    onDragStart={(e) => {
                      if (dragGhostRef.current) {
                        e.dataTransfer.setDragImage(dragGhostRef.current, 0, 0);
                      }

                      if (cells[rowIndex][cellIndex] === null) return;

                      setIsGrabbing(cells[rowIndex][cellIndex].shipType);
                      const newState = [...cells];

                      const shipCounterCopy = { ...shipCounter };

                      shipCounterCopy[cells[rowIndex][cellIndex].shipType] += 1;

                      setShipCounter(shipCounterCopy);

                      cells[rowIndex][cellIndex].parts.forEach(([row, col]) => {
                        newState[row][col] = null;
                      });

                      setCells(newState);
                    }}
                    onDragEnd={() => {
                      setIsGrabbing(null);
                      setIsHoveringOn(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();

                      if (rowValue !== null) return;
                      if (!isGrabbing) return;
                      if (shipCounter[isGrabbing] === 0) return;

                      const status = checkIfShipCanBePlaced(
                        rowIndex,
                        cellIndex,
                        isGrabbing,
                        rotation,
                        cells,
                      );

                      if (status === null) return;

                      const newState = [...cells];

                      for (const [rowIndex, cellIndex] of status) {
                        newState[rowIndex][cellIndex] = {
                          shipType: isGrabbing,
                          rotation,
                          parts: status,
                        };
                      }

                      setCells(newState);

                      const shipCounterCopy = { ...shipCounter };

                      shipCounterCopy[isGrabbing] -= 1;

                      setShipCounter(shipCounterCopy);
                    }}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="planing-ships">
        <div className="planing-rotation-container">
          Rotation : <p onClick={changeRotationHandle}>{rotation}</p>
        </div>

        <div className="ship-planing-container">
          <div
            className="ship"
            draggable
            onDragStart={(e) => {
              if (dragGhostRef.current) {
                e.dataTransfer.setDragImage(dragGhostRef.current, 0, 0);
              }
              setIsGrabbing(SHIP_TYPES.FOUR);
            }}
            onDragEnd={() => {
              setIsGrabbing(null);
              setIsHoveringOn(null);
            }}
          >
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell"></div>
          </div>
          <div className="ship-counter">- {shipCounter[SHIP_TYPES.FOUR]}</div>
        </div>

        <div className="ship-planing-container">
          <div
            className="ship"
            draggable
            onDragStart={(e) => {
              if (dragGhostRef.current) {
                e.dataTransfer.setDragImage(dragGhostRef.current, 0, 0);
              }
              setIsGrabbing(SHIP_TYPES.THREE);
            }}
            onDragEnd={() => {
              setIsGrabbing(null);
              setIsHoveringOn(null);
            }}
          >
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell"></div>
          </div>
          <div className="ship-counter">- {shipCounter[SHIP_TYPES.THREE]}</div>
        </div>
        <div className="ship-planing-container">
          <div
            className="ship"
            draggable
            onDragStart={(e) => {
              if (dragGhostRef.current) {
                e.dataTransfer.setDragImage(dragGhostRef.current, 0, 0);
              }
              setIsGrabbing(SHIP_TYPES.TWO);
            }}
            onDragEnd={() => {
              setIsGrabbing(null);
              setIsHoveringOn(null);
            }}
          >
            <div className="cell"></div>
            <div className="cell"></div>
          </div>
          <div className="ship-counter">- {shipCounter[SHIP_TYPES.TWO]}</div>
        </div>
        <div className="ship-planing-container">
          <div
            className="ship"
            draggable
            onDragStart={(e) => {
              if (dragGhostRef.current) {
                e.dataTransfer.setDragImage(dragGhostRef.current, 0, 0);
              }
              setIsGrabbing(SHIP_TYPES.ONE);
            }}
            onDragEnd={() => {
              setIsGrabbing(null);
              setIsHoveringOn(null);
            }}
          >
            <div className="cell"></div>
          </div>
          <div className="ship-counter">- {shipCounter[SHIP_TYPES.ONE]}</div>
        </div>

        <div className="planning-end-button-container">
          <button onClick={randomHandle}>Random</button>
          <button
            className="planning-end-button"
            disabled={!isAllShipPlaced()}
            onClick={startGameHandle}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};
