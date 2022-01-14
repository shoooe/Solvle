import * as _ from "lodash";

export type Evaluation = "absent" | "present" | "correct";

export type Cell = { letter: string; evaluation: Evaluation };
export type Attempt = {
  cells: Cell[];
};

export const getAttempts = (): Attempt[] => {
  const rowNodes =
    document
      ?.querySelector("game-app")
      ?.shadowRoot?.querySelectorAll("game-theme-manager #game game-row") ?? [];
  if (rowNodes === undefined) throw Error("Can't parse rows");
  const rows = Array.from(rowNodes).map((row) => {
    const tileNodes = row.shadowRoot?.querySelectorAll("game-tile");
    if (tileNodes === undefined) throw Error("Can't parse tiles");
    const tiles = Array.from(tileNodes).map((node) => {
      const letter = node.getAttribute("letter");
      const evaluation = node.getAttribute("evaluation");
      return { letter, evaluation };
    });
    return tiles;
  });
  return (
    rows
      .filter(
        (row) =>
          !row.some((cell) => _.isNil(cell.letter) || _.isNil(cell.evaluation))
      )
      // We can cast to `Cell` because we are asserting that letter and evaluation
      // can never be nullable.
      .map((row) => ({ cells: row as Cell[] }))
  );
};
