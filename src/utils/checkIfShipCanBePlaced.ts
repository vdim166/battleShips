import { type cellShipType } from "../components/PlaningGameComponent";
import type { cellShipDetailsType } from "../components/PlayingGameComponent";
import { ROTATION_STATES } from "../components/types/ROTATION_STATES";
import { SHIP_TYPES } from "../components/types/SHIP_TYPES";

export const checkIfShipCanBePlaced = (
  rowIndex: number,
  cellIndex: number,
  shipType: keyof typeof SHIP_TYPES,
  rotation: keyof typeof ROTATION_STATES,
  cells: (null | cellShipType)[][],
) => {
  const shipLength = getShipLength(shipType);

  if (cells[rowIndex][cellIndex] !== null) return null;

  const shipCells = getShipCells(rowIndex, cellIndex, shipLength, rotation);

  if (!isWithinBounds(shipCells, cells)) return null;

  if (!areCellsEmpty(shipCells, cells)) return null;

  if (!areSurroundingCellsEmpty(shipCells, cells)) return null;

  return shipCells;
};

export const getShipLength = (shipType: keyof typeof SHIP_TYPES) => {
  switch (shipType) {
    case SHIP_TYPES.ONE:
      return 1;
    case SHIP_TYPES.TWO:
      return 2;
    case SHIP_TYPES.THREE:
      return 3;
    case SHIP_TYPES.FOUR:
      return 4;
    default:
      return 0;
  }
};

export const getShipCells = (
  row: number,
  col: number,
  length: number,
  rotation: keyof typeof ROTATION_STATES,
) => {
  const cells: [number, number][] = [];

  for (let i = 0; i < length; i++) {
    switch (rotation) {
      case ROTATION_STATES.HORIZONTAL:
        cells.push([row, col - i]);
        break;
      case ROTATION_STATES.VERTICAL:
        cells.push([row + i, col]);
        break;
    }
  }

  return cells;
};

const isWithinBounds = (
  shipCells: [number, number][],
  cells: (null | cellShipType)[][],
) => {
  return shipCells.every(
    ([row, col]) =>
      row >= 0 && row < cells.length && col >= 0 && col < cells[0].length,
  );
};

const areCellsEmpty = (
  shipCells: [number, number][],
  cells: (null | cellShipType)[][],
) => {
  return shipCells.every(([row, col]) => cells[row][col] === null);
};

export const getSurroundingCells = (
  shipCells: [number, number][],
  cells: (null | cellShipDetailsType)[][],
) => {
  const cellsToCheck = new Set<string>();

  shipCells.forEach(([row, col]) => {
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const newRow = row + r;
        const newCol = col + c;

        if (
          newRow < 0 ||
          newRow >= cells.length ||
          newCol < 0 ||
          newCol >= cells[0].length
        ) {
          continue;
        }

        cellsToCheck.add(`${newRow},${newCol}`);
      }
    }
  });

  shipCells.forEach(([row, col]) => {
    cellsToCheck.delete(`${row},${col}`);
  });

  return Array.from(cellsToCheck);
};

const areSurroundingCellsEmpty = (
  shipCells: [number, number][],
  cells: (null | cellShipType)[][],
) => {
  const cellsToCheck = new Set<string>();

  shipCells.forEach(([row, col]) => {
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const newRow = row + r;
        const newCol = col + c;

        if (
          newRow < 0 ||
          newRow >= cells.length ||
          newCol < 0 ||
          newCol >= cells[0].length
        ) {
          continue;
        }

        cellsToCheck.add(`${newRow},${newCol}`);
      }
    }
  });

  shipCells.forEach(([row, col]) => {
    cellsToCheck.delete(`${row},${col}`);
  });

  return Array.from(cellsToCheck).every((cell) => {
    const [row, col] = cell.split(",").map(Number);
    return cells[row][col] === null;
  });
};
