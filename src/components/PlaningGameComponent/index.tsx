import { useState } from "react";
import "./styles.css";

export const SHIP_TYPES = {
  ONE: "ONE",
  TWO: "TWO",
  THREE: "THREE",
  FOUR: "FOUR",
} as const;

export const PlaningGameComponent = () => {
  const [isGrabbing, setIsGrabbing] = useState<keyof typeof SHIP_TYPES | null>(
    null,
  );

  const [cells, setCells] = useState<(null | keyof typeof SHIP_TYPES)[][]>([
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

  const [isHoveringOn, setIsHoveringOn] = useState<null | string[]>(null);

  const [shipCounter, setShipCounter] = useState({
    [SHIP_TYPES.ONE]: 4,
    [SHIP_TYPES.TWO]: 3,
    [SHIP_TYPES.THREE]: 2,
    [SHIP_TYPES.FOUR]: 1,
  });

  const checkIfShipCanBePlaced = (
    rowIndex: number,
    cellIndex: number,
    shipType: keyof typeof SHIP_TYPES,
  ) => {
    if (shipType === SHIP_TYPES.ONE) {
      if (cells[rowIndex][cellIndex] === null) {
        if (cells?.[rowIndex + 1]?.[cellIndex]) return null;
        if (cells?.[rowIndex]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex]?.[cellIndex + 1]) return null;
        if (cells?.[rowIndex + 1]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex + 1]?.[cellIndex + 1]) return null;

        if (cells?.[rowIndex - 1]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex - 1]?.[cellIndex + 1]) return null;
        if (cells?.[rowIndex - 1]?.[cellIndex]) return null;

        return [[rowIndex, cellIndex]];
      }

      return null;
    }

    if (shipType === SHIP_TYPES.TWO) {
      if (cells[rowIndex][cellIndex] === null) {
        if (cells?.[rowIndex + 1]?.[cellIndex]) return null;
        if (cells?.[rowIndex]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex]?.[cellIndex + 1]) return null;
        if (cells?.[rowIndex + 1]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex + 1]?.[cellIndex + 1]) return null;

        if (cells?.[rowIndex - 1]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex - 1]?.[cellIndex + 1]) return null;
        if (cells?.[rowIndex - 1]?.[cellIndex]) return null;

        if (cellIndex - 1 >= 0 && cells[rowIndex][cellIndex - 1] === null) {
          if (cells?.[rowIndex]?.[cellIndex - 2]) return null;
          if (cells?.[rowIndex + 1]?.[cellIndex - 2]) return null;
          if (cells?.[rowIndex - 1]?.[cellIndex - 2]) return null;

          return [
            [rowIndex, cellIndex],
            [rowIndex, cellIndex - 1],
          ];
        }
      }

      return null;
    }

    if (shipType === SHIP_TYPES.THREE) {
      if (cells[rowIndex][cellIndex] === null) {
        if (cells?.[rowIndex + 1]?.[cellIndex]) return null;
        if (cells?.[rowIndex]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex]?.[cellIndex + 1]) return null;
        if (cells?.[rowIndex + 1]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex + 1]?.[cellIndex + 1]) return null;

        if (cells?.[rowIndex - 1]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex - 1]?.[cellIndex + 1]) return null;
        if (cells?.[rowIndex - 1]?.[cellIndex]) return null;
        if (cellIndex - 1 >= 0 && cells[rowIndex][cellIndex - 1] === null) {
          if (cells?.[rowIndex]?.[cellIndex - 2]) return null;
          if (cells?.[rowIndex + 1]?.[cellIndex - 2]) return null;
          if (cells?.[rowIndex - 1]?.[cellIndex - 2]) return null;
          if (cellIndex - 2 >= 0 && cells[rowIndex][cellIndex - 2] === null) {
            if (cells?.[rowIndex]?.[cellIndex - 3]) return null;
            if (cells?.[rowIndex + 1]?.[cellIndex - 3]) return null;
            if (cells?.[rowIndex - 1]?.[cellIndex - 3]) return null;
            return [
              [rowIndex, cellIndex],
              [rowIndex, cellIndex - 1],
              [rowIndex, cellIndex - 2],
            ];
          }
        }
      }

      return null;
    }

    if (shipType === SHIP_TYPES.FOUR) {
      if (cells[rowIndex][cellIndex] === null) {
        if (cells?.[rowIndex + 1]?.[cellIndex]) return null;
        if (cells?.[rowIndex]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex]?.[cellIndex + 1]) return null;
        if (cells?.[rowIndex + 1]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex + 1]?.[cellIndex + 1]) return null;

        if (cells?.[rowIndex - 1]?.[cellIndex - 1]) return null;
        if (cells?.[rowIndex - 1]?.[cellIndex + 1]) return null;
        if (cells?.[rowIndex - 1]?.[cellIndex]) return null;

        if (cellIndex - 1 >= 0 && cells[rowIndex][cellIndex - 1] === null) {
          if (cells?.[rowIndex]?.[cellIndex - 2]) return null;
          if (cells?.[rowIndex + 1]?.[cellIndex - 2]) return null;
          if (cells?.[rowIndex - 1]?.[cellIndex - 2]) return null;

          if (cellIndex - 2 >= 0 && cells[rowIndex][cellIndex - 2] === null) {
            if (cells?.[rowIndex]?.[cellIndex - 3]) return null;
            if (cells?.[rowIndex + 1]?.[cellIndex - 3]) return null;
            if (cells?.[rowIndex - 1]?.[cellIndex - 3]) return null;

            if (cellIndex - 3 >= 0 && cells[rowIndex][cellIndex - 3] === null) {
              if (cells?.[rowIndex]?.[cellIndex - 4]) return null;
              if (cells?.[rowIndex + 1]?.[cellIndex - 4]) return null;
              if (cells?.[rowIndex - 1]?.[cellIndex - 4]) return null;

              return [
                [rowIndex, cellIndex],
                [rowIndex, cellIndex - 1],
                [rowIndex, cellIndex - 2],
                [rowIndex, cellIndex - 3],
              ];
            }
          }
        }
      }

      return null;
    }

    return null;
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
                    key={`cell-${rowId}`}
                    className={`cell ${isHoveringOn?.includes(rowId) ? "isHovering" : ""} ${rowValue === SHIP_TYPES.ONE ? "shipOne" : ""} ${rowValue === SHIP_TYPES.TWO ? "shipTwo" : ""} ${rowValue === SHIP_TYPES.THREE ? "shipThree" : ""} ${rowValue === SHIP_TYPES.FOUR ? "shipFour" : ""}`}
                    onDragEnter={() => {
                      if (!isGrabbing) return;

                      const status = checkIfShipCanBePlaced(
                        rowIndex,
                        cellIndex,
                        isGrabbing,
                      );

                      if (status === null) return;

                      setIsHoveringOn(
                        status.map((cells) => `${cells[0]}-${cells[1]}`),
                      );
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
                      );

                      if (status === null) return;

                      const newState = [...cells];

                      for (const [rowIndex, cellIndex] of status) {
                        newState[rowIndex][cellIndex] = isGrabbing;
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
        <div>Rotation : </div>

        <div className="ship-planing-container">
          <div
            className="ship"
            draggable
            onDragStart={() => {
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
            onDragStart={() => {
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
            onDragStart={() => {
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
            onDragStart={() => {
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

        <div>
          <button>Start</button>
        </div>
      </div>
    </div>
  );
};
