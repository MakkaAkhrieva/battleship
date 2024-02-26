import { GAME } from "../constants";
import {
  AdjacentCell,
  CellCoords,
  GameField,
  ShipType,
  WebSocketWithId,
} from "../types";

import { getAdjacentCells } from "./game";
import { getSurroundingPoints } from "./getSurroundingPoints";

export const notifyHitShipCell = (
  field: GameField,
  cellCoords: CellCoords,
  shipType: ShipType,
  currentPlayerId: number,
  ...connections: WebSocketWithId[]
) => {
  const neighbors: AdjacentCell[] = [];
  const adjacentCells = getAdjacentCells(field, cellCoords, "", true);

  if (shipType === "small") {
    neighbors.push(...getSurroundingPoints([cellCoords], field, cellCoords));
  } else {
    const { x, y } = cellCoords;
    const killedCells: AdjacentCell[] = [{ status: field[y][x], x, y }];

    const adjacentKilledCells = adjacentCells.filter(
      (cell) => cell.status === "killed"
    );
    killedCells.push(...adjacentKilledCells);

    if (shipType === "large" || shipType === "huge") {
      if (adjacentKilledCells.length < GAME.max_cell) {
        const adjacentKilledCell = adjacentKilledCells[0];
        const { x, y } = adjacentKilledCell;

        const adjacentKilledCellsForCell = getAdjacentCells(
          field,
          { x, y },
          "killed"
        );

        const indexOfCurrentCell = adjacentKilledCellsForCell.findIndex(
          (cell) => cell.x === cellCoords.x && cell.y === cellCoords.y
        );

        adjacentKilledCellsForCell.splice(indexOfCurrentCell, 1);

        killedCells.push(...adjacentKilledCellsForCell);

        if (shipType === "huge") {
          const { x, y } = adjacentKilledCellsForCell[0];

          const cellsWithLastKilledCell = getAdjacentCells(
            field,
            { x, y },
            "killed"
          );

          const indexOfCurrentCell = cellsWithLastKilledCell.findIndex(
            (cell) =>
              cell.x === adjacentKilledCell.x && cell.y === adjacentKilledCell.y
          );

          cellsWithLastKilledCell.splice(indexOfCurrentCell, 1);
          killedCells.push(...cellsWithLastKilledCell);
        }
      } else {
        if (shipType === "huge") {
          const cellWithLastKilledCell = adjacentKilledCells.filter((cell) =>
            getAdjacentCells(field, { x: cell.x, y: cell.y }, "killed")
          );

          const indexOfCurrentCell = cellWithLastKilledCell.findIndex(
            (cell) => cell.x === cellCoords.x && cell.y === cellCoords.y
          );

          cellWithLastKilledCell.splice(indexOfCurrentCell, 1);

          killedCells.push(...cellWithLastKilledCell);
        }
      }
    }

    neighbors.push(...getSurroundingPoints(killedCells, field, cellCoords));
  }

  neighbors.forEach((cell) => {
    const responseData = {
      type: "attack",
      data: JSON.stringify({
        position: {
          x: cell.x,
          y: cell.y,
        },
        currentPlayer: currentPlayerId,
        status: cell.status,
      }),
      id: 0,
    };

    connections.forEach((connection) => {
      connection.send(JSON.stringify(responseData));
    });
  });
};
