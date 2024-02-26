import { CellCoords, GameCell, GameField } from "../types";
import { checkNearCells } from "./game";

export const getCellStatus = (
  cell: GameCell,
  field: GameField,
  coords: CellCoords
): GameCell => {
  switch (cell) {
    case "miss":
    case "empty":
      return "miss";
    case "killed":
    case "shot":
      return "shot";
    case "small":
      return "killed";
    case "medium":
    case "large":
    case "huge":
      return checkNearCells(cell, field, coords);
  }
};
