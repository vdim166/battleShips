import type { cellShipDetailsType } from "../components/PlayingGameComponent";
import type { ROTATION_STATES } from "../components/types/ROTATION_STATES";

type Decision = keyof typeof ROTATION_STATES | null;

export const calculateMove = (
  cells: (cellShipDetailsType & { decision: Decision })[][],
) => {
  const activeHits: { r: number; c: number }[] = [];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cell = cells[r][c];
      if (cell.showCell && cell.shipType !== undefined && !cell.isDead) {
        activeHits.push({ r, c });
      }
    }
  }

  if (activeHits.length > 0) {
    activeHits.sort(() => {
      return 0;
    });

    for (const hit of activeHits) {
      const { r, c } = hit;
      const currentDecision = cells[r][c].decision;

      if (currentDecision) {
        const deltas =
          currentDecision === "HORIZONTAL"
            ? [
                [0, 1],
                [0, -1],
              ]
            : [
                [1, 0],
                [-1, 0],
              ];

        for (const [dr, dc] of deltas) {
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < 10 &&
            nc >= 0 &&
            nc < 10 &&
            !cells[nr][nc].showCell
          ) {
            cells[nr][nc].decision = currentDecision;
            return { points: [nr, nc], cells };
          }
        }
      }

      if (activeHits.length === 1 || !currentDecision) {
        const axes: Decision[] = ["HORIZONTAL", "VERTICAL"];
        axes.sort(() => Math.random() - 0.5);

        for (const axis of axes) {
          const deltas =
            axis === "HORIZONTAL"
              ? [
                  [0, 1],
                  [0, -1],
                ]
              : [
                  [1, 0],
                  [-1, 0],
                ];

          for (const [dr, dc] of deltas) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < 10 &&
              nc >= 0 &&
              nc < 10 &&
              !cells[nr][nc].showCell
            ) {
              cells[nr][nc].decision = axis;
              return { points: [nr, nc], cells };
            }
          }
        }
      }
    }
  }

  const safeRandom = () => {
    let attempts = 0;
    while (attempts < 400) {
      const r = Math.floor(Math.random() * 10);
      const c = Math.floor(Math.random() * 10);
      if (!cells[r][c].showCell) {
        cells[r][c].decision = null;
        return [r, c] as [number, number];
      }
      attempts++;
    }

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!cells[r][c].showCell) {
          cells[r][c].decision = null;
          return [r, c] as [number, number];
        }
      }
    }

    return [0, 0] as [number, number];
  };

  return { points: safeRandom(), cells };
};
