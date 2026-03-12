import { type cellShipType } from "../components/PlaningGameComponent";
import { ROTATION_STATES } from "../components/types/ROTATION_STATES";
import { SHIP_TYPES } from "../components/types/SHIP_TYPES";
import { checkIfShipCanBePlaced } from "./checkIfShipCanBePlaced";
import { randomBetween } from "./randomBetween";

const ships = [
  SHIP_TYPES.FOUR,
  SHIP_TYPES.THREE,
  SHIP_TYPES.THREE,
  SHIP_TYPES.TWO,
  SHIP_TYPES.TWO,
  SHIP_TYPES.TWO,
  SHIP_TYPES.ONE,
  SHIP_TYPES.ONE,
  SHIP_TYPES.ONE,
  SHIP_TYPES.ONE,
];

export const generateRandomShips = () => {
  while (true) {
    let tries = 0;
    let shouldStartAgain = false;

    const localCells: (null | cellShipType)[][] = [
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
    ];
    for (let i = 0; i < ships.length; ++i) {
      while (true) {
        if (tries > 250) {
          shouldStartAgain = true;
          break;
        }

        const randRow = randomBetween(0, 10);
        const randCol = randomBetween(0, 10);
        const randRotation = randomBetween(0, 2);

        const rotation: keyof typeof ROTATION_STATES =
          randRotation === 0
            ? ROTATION_STATES.HORIZONTAL
            : ROTATION_STATES.VERTICAL;

        const status = checkIfShipCanBePlaced(
          randRow,
          randCol,
          ships[i],
          rotation,
          localCells,
        );

        tries += 1;
        if (status === null) continue;

        for (const [cellRow, cellCol] of status) {
          localCells[cellRow][cellCol] = {
            rotation,
            parts: status,
            shipType: ships[i],
          };
        }

        break;
      }
      if (shouldStartAgain) {
        break;
      }
    }

    if (shouldStartAgain === false) {
      return localCells;
    }
  }
};
